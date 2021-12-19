// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// var svg = d3.select("svg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");


// add for future tooltip
var div = d3.select("#my_dataviz").append("div") 
  .attr("class", "tooltip")       
  .style("opacity", 0)
  .style("background-color", "#E9E9E9")
  .style("border", "solid")
  .style("border-width", "1px")
  .style("border-radius", "5px")
  .style("width", "150px")
  .style("height", "40px")
  .style("padding", "10px");


//Read the data
d3.csv("games_summary(n vs. year).csv", function(data) {

    // List of groups (here I have one group per column)
    var allGroup = ["PC", "PlayStation4", "Xbox360"]

    // Reformat the data: we need an array of arrays of {x, y} tuples
    var dataReady = allGroup.map( function(grpName) { // .map allows to do something for each element of the list
      return {
        name: grpName,
        values: data.map(function(d) {
          return {release_year: d.release_year, value: +d[grpName]};
        })
      };
    });
    // I strongly advise to have a look to dataReady with
    console.log(dataReady)

    // A color scale: one color for each group
    var myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    var groups = d3.map(data, function(d){return(d.release_year)}).keys()



    var x = d3.scaleBand()
      .domain(groups)
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .style("font", "20px time")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain( [0,350])
      .range([ height, 0 ]);
    svg.append("g")
      .style("font", "20px times")
      .call(d3.axisLeft(y));

    // Add the lines
    var line = d3.line()
      .x(function(d) { return x(+d.release_year) })
      .y(function(d) { return y(+d.value) })
    svg.selectAll("myLines")
      .data(dataReady)
      .enter()
      .append("path")
        .attr("class", function(d){ return d.name })
        .attr("d", function(d){ return line(d.values) } )
        .attr("stroke", function(d){ return myColor(d.name) })
        .style("stroke-width", 4)
        .style("fill", "none")



    // Add the points
    svg
      // First we need to enter in a group
      .selectAll("myDots")
      .data(dataReady)
      .enter()
        .append('g')
        .style("fill", function(d){ return myColor(d.name) })
        .attr("class", function(d){ return d.name })
      // Second we need to enter in the 'values' part of this group
      .selectAll("myPoints")
      .data(function(d){ return d.values })
      .enter()
      .append("circle")
        .attr("cx", function(d) { return x(d.release_year) } )
        .attr("cy", function(d) { return y(d.value) } )
        .attr("r", 5)
        .attr("stroke", "black")
        
        // starting from here (new) add for tooltip
        .on("mouseover", function(d){
          div.transition()
             .duration(200)
             .style("opacity", 1);

          div.html("Count: " + d.value + "<br>" +
            "Year:" + d.release_year) 
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY ) + "px")
              .style("font-size", "20px");

          d3.select(this)
            .style("stroke", "black")
            .style("stroke-width", "4px")
        })

        .on("mouseout", function(d) { 
          div.transition()
            .duration(500)
            .style("opacity", 0)
          d3.select(this)
            .style("stroke-width", "1px" )
        })



    // Add a label at the end of each line
    svg
      .selectAll("myLabels")
      .data(dataReady)
      .enter()
        .append('g')
        .append("text")
          .attr("class", function(d){ return d.name })
          .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; }) // keep only the last value of each time series
          .attr("transform", function(d) { return "translate(" + x(d.value.release_year) + "," + y(d.value.value) + ")"; }) // Put the text at the position of the last point
          .attr("x", 12) // shift the text a bit more right
          .text(function(d) { return d.name; })
          .style("fill", function(d){ return myColor(d.name) })
          .style("font-size", 15)

  var legend_dis = [0,180,340]


    // Add a legend (interactive)
    svg
      .selectAll("myLegend")
      .data(dataReady)
      .enter()
        .append('g')
        .append("text")
          // .attr('x', function(d,i){ return 20 + i*130})
          // changed func to be approx equal -distance
          // .attr('x', function(d,i){return 20 + i*(9*(8+5*i))}) 
          .attr('x', function(d,i){return width - legend_dis[i]})   
          .attr('y', 30)
          .text(function(d) { return d.name; })
          .style("fill", function(d){ return myColor(d.name) })
          .style("font-size", 20)
        .on("click", function(d){
          // is the element currently visible ?
          currentOpacity = d3.selectAll("." + d.name).style("opacity")
          // Change the opacity: from 0 to 1 or from 1 to 0
          d3.selectAll("." + d.name).transition().style("opacity", currentOpacity == 1 ? 0:1)

        })

    svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .attr("font-size", "20px")
      .text("Count")


    svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("x", width + 30)
      .attr("y", height + 20)
      .attr("dy", ".25em")
      .attr("font-size", "20px")
      .text("Year")

})


    svg.append("text")
      .attr("class", "Click me")
      .attr("text-anchor", "end")
      .attr("x", width - 190)
      .attr("y", 50)
      .attr("fill", "red")
      // .text("Click the Name!")
      .html("&#11014;"+ "CLICK IT!")
      .attr("font-size", "20px")

