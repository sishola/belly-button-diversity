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
    })
}
  
