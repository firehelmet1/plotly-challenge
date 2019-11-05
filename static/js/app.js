function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
  
  var metadataUrl= `/metadata/${sample}`;
  d3.json(metadataUrl).then(function(sample) {
    var sampleMetadata = d3.select("#sample-metadata").html("")

  // Use `.html("") to clear any existing metadata
    sampleMetadata.html("")

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    Object.entries(sample).forEach(function([key, value]) {
       
      console.log(key)

      var row = sampleMetadata.append("p");
      row.text(`${key}:${value}`)
    
      // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

    if (key === 'WFREQ') {
      var data = [
          {
            domain: { x: [0, 1], y: [0, 1] },
            value: sample.WFREQ,
            title: { text: `Sample #${sample.sample}'s Belly Button Scrubs per week`},
            type: "indicator",
            mode: "gauge+number"
          }
          ];
        console.log(row)
        var layout = { width: 600, height: 500, margin: { t: 10, b: 0 } };
        Plotly.newPlot('gauge', data, layout);
      }
    })
  })

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

  var plotData = `/samples/${sample}`;

  d3.json(plotData).then(function(data){
    var x_axis = data.otu_ids;
    var y_axis = data.sample_values;
    var size = data.sample_values;
    var color = data.otu_ids;
    var label_text = data.otu_labels;

  
    // @TODO: Build a Bubble Chart using the sample data
    var bubblePlot= {
      x: x_axis,
      y: y_axis,
      text: label_text,
      mode: `markers`,
      marker: {
        size: size,
        color: color
      }
    };

    var data = [bubblePlot];
    var layout = {
     // title: {text: `Sample #${sample.sample}'s Belly Bacteria Relative Distribution`},
      xaxis: {title: "OTU"},
      title: "Belly Button Bacteria - Relative Distribution"
    };
    Plotly.newPlot("bubble", data, layout);
  });
    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

  d3.json(plotData).then(function(data){
    var hoverText = data.otu_labels.slice(0,15);
    var values = data.sample_values.slice(0,15);
    var labels = data.otu_ids.slice(0,15);

  var pieChart = [{
    hovertext: hoverText,
    title: "Belly Button Bacteria - % Distribution",
    labels: labels,
    values: values,
    type: "pie"
  }]
  Plotly.newPlot("pie", pieChart)
})
};

function init() {
  // Grab a reference to the dropdown select element
  console.log('Hello World');
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
