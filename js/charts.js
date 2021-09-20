function init() {
  // Grab a reference to the dropdown select element. code given
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options. 12.4.3 this is part of the drop down menu. code given
  // Index. HTML file is down lodaed in 12.4.3
  //12.4.3 is bootstrap page w drop downs menu
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots. given
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}
// Initialize the dashboard. code given//////////////////
init();

//called in index.html found line 27
  function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected. code given
  buildMetadata(newSample);
  buildCharts(newSample);
  }

// Demographics Panel .given code//////////////////////////
  function buildMetadata(sample) {
    d3.json("samples.json").then((data) => {
      var metadata = data.metadata;
    // Filter the data for the object with the desired sample number. given 12.4.4
      var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
      var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
     var PANEL = d3.select("#sample-metadata");
    

    // Use `.html("") to clear any existing metadata. clear. given///////////////////
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(result).forEach(([key, value]) => {
        PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
      });

    });
  }
//Deliverable 1
// 1. Create the buildCharts function. same as 11.5.1.given
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file .code given.making API call
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var samples = data.samples;
    console.log(samples);
  
  // 4. Create a variable that filters the samples for the object with the desired sample number.
  //sample number / Sudeo code. for the challenge i dont have data code... rank of city, city, state, increase, population.. so use map() 12.2.2
    //In Step 4, create a variable that will hold an array that contains all the data from the new sample that is chosen from the dropdown menu. To retrieve the data from the new sample, 
    //filter the variable created in Step 3 for the sample id that matches the new sample id chosen from the dropdown menu and passed into the buildCharts() function as the argument.
    var desiredSampleNumber = samples.filter(sampleObj => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = desiredSampleNumber [0];
    

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values (sample values in line #3)..
    //otu_ids,@01:35:56 wk12 D1
    var otuIds = firstSample.otu_ids
    var otuIdsSliced = otuIds.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();
    //otu_labels,
    var otuLables = firstSample.otu_labels;
    var otuLablesSliced = otuLables.slice(0,10).reverse();
    //otu_values
    var sampleValues = firstSample.sample_values;
    var sampleValuesSliced = sampleValues.slice(0,10).reverse();


    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    //Chain the slice() method with the map() and reverse() functions to retrieve the top 10 otu_ids sorted in descending order.

    //var yticks = 

    // 8. Create the trace for the bar chart. In Step 8, create the trace object for the bar chart, 
    //where the x values are the sample_values and the hover text for the bars are the otu_labels in descending order.
    //When the dashboard is first opened in a browser, ID 940’s data should be displayed in the dashboard, and the bar chart has the following: (10 pt)
    //The top 10 sample_values are sorted in descending order
    //The top 10 sample_values as values

    var barData = [{
      x: sampleValuesSliced,
      y: otuIdsSliced,
      text: otuLablesSliced,
      type: "bar",
      orientation: 'h',
      marker: {
          color: 'rgb(158,202,225)',
          opacity: 0.8,}
    }];
    

    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title:"top 10 bar layout",
      titlefont: {"size": 25},
      xaxis: {title: "Sample_Values"},
    };

    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("plot", barData, barLayout);

    // 1. Create the trace for the BUBBLE CHART ////////////////////
    var bbbleChart = [{
      x: otuIds,
      y: sampleValues,
      text: otuLables,
      mode: "markers",
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: 'RdBu',
      }
    }];
    // 2. Create the layout for the bubble chart.
    var bbbleLayout = {
      title: "Bacteria Culture Samples",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "Sample Value"},
      titlefont: {"size": 25},
      hovermode: "closest",
      height: 500
    };
    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bbblChart, bbbleLayout);

     // step: 1-3initialize variables that hold arrays for the sample 
    //that is selected from the dropdown menu on the webpage
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    console.log(resultArray);

    var result = resultArray[0];
    console.log(result);

    //initialize variables and convert to a float
    var wFreq = result.wfreq
    var wFreqFloat = parseFloat(wFreq).toFixed(2)
    console.log(wFreqFloat)

    // 4. Create the trace for the GAUGE CHART //////////////////////////////////////
    var gaugeData = [{
      title: {text: "Scrubs per Week", font: {size: 18}},
      type: "indicator",
      mode: "gauge+number",
      value: wFreq,
      tickmode: 'linear',
      gauge: {
        axis: { range: [null, 10], dtick: 2, tick0: 0 },
        bar: { color: "red" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "darkgray",
        steps: [
          { range: [0, 2], color: "mintcream"},
          { range: [2, 4], color: "paleturquoise"},
          { range: [4, 6], color: "turquoise"},
          { range: [6, 8], color: "mediumturquoise" },
          { range: [8, 10], color: "teal" },
        ]},
        
    }];
    // 5. Create the layout for the gauge chart.
    var gaugeLayout = { 
      title: "Belly Button Washing Frequency",
      titlefont: {"size": 25}
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout)
    });
    }       


  

