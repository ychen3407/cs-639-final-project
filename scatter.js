// var size = d3.select('#my_dataviz').node().getBoundingClientRect();
var Width = 1000;
var Height = 600;
// console.log(size)
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 30, left: 60},
      width = Width - margin.left - margin.right,
      height = Height - margin.top - margin.bottom;
        var my_legend = d3.select("#my_legend")

 d3.select("#my_dataviz")
  .append("p")
  .attr("class", "text")
  .text("Choose the range for User-Review (X axis)")
  .append("input") 
  .attr("type","number")
  .attr("id","buttonXlim")
  .attr("value","9")

 d3.select("#my_dataviz")
  .append("p")
  .attr("class", "text")
  .text("Choose the range for Meta-score (Y-axis)")
  .append("input")
  .attr("type","number")
  .attr("id","buttonYlim")
  .attr("value", "95")


 d3.select("#my_dataviz")
  .append("p")
  .attr("class", "text")
  .text("Choose the size for the dots: from 2 to 5")
  .append("input")
  .attr("type","range")
  .attr("name","circleSize")
  .attr("id","circleSize")
  .attr("value", "3")
  .attr("min","2")
  .attr("max","5")


  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    // append the svg object to the body of the page
  // var svg = d3.select("svg")
  //     .attr("width", width + margin.left + margin.right)
  //     .attr("height", height + margin.top + margin.bottom)
  //   .append("g")
  //     .attr("transform",
  //           "translate(" + margin.left + "," + margin.top + ")");
  
  //Read the data
  d3.csv("selected_games_1.csv", function(data) {
  
    // Add X axis
    var x = d3.scaleLinear()
      .domain([8, 9])
      .range([ 0, width ]);
    var xAxis = svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
  
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([80,95])
      .range([ height, 0]);
    var yAxis = svg.append("g")
      .call(d3.axisLeft(y));
  
    var color = d3.scaleOrdinal()
    .domain(["Xbox 360", "PlayStation 4", "PC" ])
    .range([ "#440154ff", "#21908dff", "#fde725ff"])

    var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  // A function that change this tooltip when the user hover a point.
  // Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
  }

  var mousemove = function(d) {
    tooltip
      .html("The exact value of<br>the Ground Living area is: " + d.summary)
      .style("left", (d3.mouse(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (d3.mouse(this)[1]) + "px")
  }

  // A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
  var mouseleave = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }

    // Add dots
    svg.append('g')
      .selectAll("dot")
      .data(data)
      .enter()
      .append("circle")
        .attr("cx", function (d) { return x(d.user_review); } )
        .attr("cy", function (d) { return y(d.meta_score); } )
        .attr("r", 3)
        .style("fill", function (d) { return color(d.platform) } )
        .style("opacity", 0.6)
      .on("mouseover", mouseover )
      .on("mousemove", mousemove )
      .on("mouseleave", mouseleave )

    svg
    .call( d3.brush()                 // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("start brush", updateChart_b) // Each time the brush selection changes, trigger the 'updateChart' function
    )

    var my_legend = d3.select("#my_legend")
    // Handmade legend
    my_legend.append("circle").attr("cx",100).attr("cy",50).attr("r", 6).style("fill", "#440154ff")
    my_legend.append("circle").attr("cx",100).attr("cy",80).attr("r", 6).style("fill", "#21908dff")
    my_legend.append("circle").attr("cx",100).attr("cy",110).attr("r", 6).style("fill", "#fde725ff")
    my_legend.append("text").attr("x", 120).attr("y", 50).text("PC").style("font-size", "15px").attr("alignment-baseline","middle")
    my_legend.append("text").attr("x", 120).attr("y", 80).text("Xbox 360").style("font-size", "15px").attr("alignment-baseline","middle")
    my_legend.append("text").attr("x", 120).attr("y", 110).text("PlayStation 4").style("font-size", "15px").attr("alignment-baseline","middle")
  
    function updateChart_b() {
    extent = d3.event.selection
    svg.selectAll("circle").classed("selected", function(d){ return isBrushed(extent, x(d.user_review), y(d.meta_score) ) } )
  }

  function isBrushed(brush_coords, cx, cy) {
       var x0 = brush_coords[0][0],
           x1 = brush_coords[1][0],
           y0 = brush_coords[0][1],
           y1 = brush_coords[1][1];
      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
  }

    // Listen to the slider?
    d3.select("#circleSize").on("change", function(d){
      selectedValue = this.value
      changeSize(selectedValue)
    })

    // Function that change size
    function changeSize(size) {
      svg.selectAll("circle")
         .data(data)
         .transition()
         .duration(1000)
         .attr( 'r',size)
    }
  
    // A function that update the plot for a given xlim value
    function updatePlot1() {
      // Get the value of the button
      xlim = this.value
      // Update X axis
      x.domain([8,xlim])
      xAxis.transition().duration(1000).call(d3.axisBottom(x))
  
      // Update chart
      svg.selectAll("circle")
         .data(data)
         .transition()
         .duration(1000)
         .attr("cx", function (d) { return x(d.user_review); } )
         .attr("cy", function (d) { return y(d.meta_score); } )
    }

    function updatePlot2() {
      // Get the value of the button
      ylim = this.value
      // Update X axis
      y.domain([80,ylim])
      yAxis.transition().duration(1000).call(d3.axisLeft(y))
      // Update chart
      svg.selectAll("circle")
         .data(data)
         .transition()
         .duration(1000)
         .attr("cx", function (d) { return x(d.user_review); } )
         .attr("cy", function (d) { return y(d.meta_score); } )
    }

    // Add an event listener to the button created in the html part
    d3.select("#buttonXlim").on("input", updatePlot1 )

    d3.select("#buttonYlim").on("input", updatePlot2 )

  })