
// d3.json("samples.json").then(function(data) {
//     const info = data;
//   });

// info.map(i =>{
//     console.log(i.samples)
// }
    
//     )
// //console.log(info.samples) 

const filePath = "././samples.json";

//Read samples data file
d3.json(filePath).then(function(data) {

    var dataset = data;

    var datasetNames = dataset.names;

    //Populate the dropdown
    var selectDropdown = d3.select("#selDataset");
    Object.entries(datasetNames).forEach(([key, value]) => {
        selectDropdown.append("option").attr("value", key).text(value);
    })


})



function optionChanged(selectedValue){
    console.log(selectedValue);
    //console.log(dataset);
    // console.log(dataset.metadata[selectedValue])

    d3.json(filePath).then(function(data) {

        var dataset = data;
        
        //Retrieve Metadata for selected individual
        var datasetMetdata = dataset.metadata[selectedValue]

        //Populate Demographic Info div
        var mergedMetadata = ""
        Object.entries(datasetMetdata).forEach(([key, value]) => {
            mergedMetadata +=  key + " : " + value + "<br>"
        })
        d3.select("#sample-metadata").html(mergedMetadata)


        //Retrieve Samples info for selected individual
        var datasetSamples = dataset.samples[selectedValue]

        var otuIDs = datasetSamples.otu_ids.slice(0,10).reverse()

        var otuIDsBar =  otuIDs.map((val, index) =>{
            //otuIDs[index] = 'OTU ' + val
            return 'OTU ' + val;

        })
        var sampleValues = datasetSamples.sample_values.slice(0,10).reverse()
        var otuLabels = datasetSamples.otu_labels.slice(0,10).reverse()

        
        //Create bar chart
        var trace1 = {
            type: "bar",
            x: sampleValues,
            y: otuIDsBar,
            text: otuLabels,
            orientation: 'h'
          };
      
          var data = [trace1];

          var layout = xaxis={'type': 'category'}

          Plotly.newPlot("bar", data, layout);
    })
}
  
