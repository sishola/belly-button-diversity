const filePath = "././samples.json";

//Read samples data file
d3.json(filePath).then(function(data) {

    var dataset = data;

    var datasetNames = dataset.names;

    //Populate the dropdown
    var selectDropdown = d3.select("#selDataset");
    
    //Set default option
    selectDropdown.append("option")
    .attr("disabled",true)
    .attr("selected", true)
    .text("Select...");

    Object.entries(datasetNames).forEach(([key, value]) => {
        selectDropdown.append("option").attr("value", key).text(value);
    })


})



function optionChanged(selectedValue){
    
    d3.json(filePath).then(function(data) {

        var dataset = data;
        
        //Retrieve Metadata for selected individual
        var datasetMetdata = dataset.metadata[selectedValue]

        //Populate Demographic Info div
        var mergedMetadata = ""
        Object.entries(datasetMetdata).forEach(([key, value]) => {
            mergedMetadata +=  key + " : " + value + "<br>"
        })
        d3.select("#sample-metadata").html(mergedMetadata);


        //Retrieve Samples info for selected individual
        var datasetSamples = dataset.samples[selectedValue];

        var otuIDs = datasetSamples.otu_ids.slice(0,10).reverse();

        var sampleValues = datasetSamples.sample_values.slice(0,10).reverse();
        var otuLabels = datasetSamples.otu_labels.slice(0,10).reverse();


        //Add breaks to the list for ease of readability
        var modifiedOtuLabels = otuLabels.map(lbl => lbl.replace(/;/g, "<br>"));


        //Create bar chart
        //Prefix OTU ID with 'OTU'
        var otuIDsBar =  otuIDs.map((val, index) => 'OTU ' + val)
        var trace1 = {
            type: "bar",
            x: sampleValues,
            y: otuIDsBar,
            text: modifiedOtuLabels,
            orientation: 'h'
          };
      
          var data = [trace1];

          var layout = xaxis={'type': 'category'};

          Plotly.newPlot("bar", data, layout);



        //Create bubble chart
        var trace1 = {
            x: otuIDs,
            y: sampleValues,
            text: modifiedOtuLabels,
            mode: 'markers',
            marker: {
              color: otuIDs,//['rgb(93, 164, 214)', 'rgb(255, 144, 14)',  'rgb(44, 160, 101)', 'rgb(255, 65, 54)'],
              opacity: [1, 0.8, 0.6, 0.4],
              size: sampleValues
            }
          };
          
        var data = [trace1];
          
        var layout = {
            title: 'Marker Size and Color',
            showlegend: false,
            // height: 600,
            // width: 600
            xaxis: {
                dtick: 500
            },
        };
          
        Plotly.newPlot('bubble', data, layout);


        //Guage Chart

        //Replace NULL wash frequencies with 0
        var washFreq = datasetMetdata.wfreq === null ? 0 : datasetMetdata.wfreq
        

        // Trig to calc meter point
        var degrees = 180-(washFreq*19.5);
        var radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);

        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);

        var data = [{ type: 'category',
            x: [0], y:[0],
             marker: {size: 28, color:'850000'},
             showlegend: false,
             name: 'Washing Frequency',
             text: washFreq,
             hoverinfo: 'text+name'},
           { values: [1,1,1,1,1,1,1,1,1,9],
           rotation: 90,
           
           text: ["8-9", "7-8", "6-7", "5-6","4-5", "3-4", "2-3", "1-2", "0-1", ""],
           textinfo: 'text',
           textposition:'inside',      
           marker: {colors:["#84B589","#89BC8D",  "#8AC086","#B7CD8F", "#D5E599", "#E5E8B0", "#E9E6C9", "#F4F1E4", 
                            "#F8F3EC", "#FFFFFF"]},
           hoverinfo: 'label',
           hole: .5,
           type: 'pie',
           showlegend: false
         }];
         
         var layout = {
           shapes:[{
               type: 'path',
               path: path,
               fillcolor: '850000',
               line: {
                 color: '850000'
               }
             }],
           title: 'Belly Button Washing Frequency',
           height: 500,
           width: 600,
           xaxis: {type:'category',zeroline:false, showticklabels:false,
                      showgrid: false, range: [-1, 1]},
           yaxis: {type:'category',zeroline:false, showticklabels:false,
                      showgrid: false, range: [-1, 1]}
         };

        Plotly.newPlot("gauge", data, layout);



    })
}
  
