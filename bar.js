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



// Parse the Data
d3.csv("games_summary (score vs. year) updated1.csv", function(data) {

  // List of subgroups = header of the csv files = soil condition here
  var subgroups = data.columns.slice(1)

  // List of groups = species here = value of the first column called group -> I show them on the X axis
  var groups = d3.map(data, function(d){return(d.release_year)}).keys()


  // Add X axis
  var x = d3.scaleBand()
      .domain(groups)
      .range([0, width])
      .padding([0.2])
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .style("font", "20px times")
    .call(d3.axisBottom(x).tickSize(0));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([0, 100])
    .range([ height, 0]);
  svg.append("g")
    .style("font", "20px times")
    .call(d3.axisLeft(y));

  // Another scale for subgroup position?
  var xSubgroup = d3.scaleBand()
    .domain(subgroups)
    .range([0, x.bandwidth()])
    .padding([0.05])


  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
    .domain(subgroups)
    .range(["#ca0020","#f4a582","#d5d5d5"])

  var tooltip = d3.select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "#E9E9E9")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("width", "250px")
    .style("height", "40px")


  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
    // .select("rect")
    // .style("fill","blue")
    .style("stroke", "black")
    .style("stroke-width", "3px")
  }

  var mousemove = function(d) {
    tooltip
      .html("Avg Score:" + d.value + "<br>" + "Subgroup:" +d.key)
      .style("font-size", "20px")
      .style("left", (d3.mouse(this)[0] + 70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }


  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
    .style("opacity", 1)
    .style("stroke", "none")
  }

  // Add y-label
  svg.append("text")
      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .attr("transform", "rotate(-90)")
      .attr("font-size", "20px")
      .text("Average Score")
  // Add x-label
  svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width + 10)
    .attr("y", height + 20)
    .attr("dx", ".75em")
    .attr("font-size", "20px")
    .text("Year")


  // Show the bars
  svg.append("g")
    .selectAll("g")
    // Enter in data = loop group per group
    .data(data)
    .enter()
    .append("g")
      .attr("transform", function(d) { return "translate(" + x(d.release_year) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return xSubgroup(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("fill", function(d) { return color(d.key); })
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)


  // Animation

  // svg.selectAll("rect")
  //   .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
  //   .enter().append("rect")
  //   .transition()
  //   .duration(800)
  //   .attr("y", function(d, i) {return y(d.value); })
  //   .attr("height", function(d, i) {return height - y(d.value);})
  //   .delay(function(d,i){return (i*100)})







  // Add legend
  var legend = svg.selectAll(".legend").append("rect")
    .attr("x", width - 18)
    .attr("width", 18)
    .attr("height", 18)
      .data(subgroups)
  .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d,i) {return "translate(0," + i * 20 + ")"; })
      .style("opacity","1");

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", function(d) { return color(d); });

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) {return d; });



})
