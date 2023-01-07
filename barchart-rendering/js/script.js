var margin = {top: 20, right: 30, bottom: 30, left: 40};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var x = d3.scaleBand()
	.rangeRound([0, width])
	.paddingInner(0.1);

var y = d3.scaleLinear()
	.range([height, 0]);

var xAxis = d3.axisBottom(x);
var yAxis = d3.axisLeft(y).ticks(10, "%");

var chart = d3.select(".chart")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("data.tsv", toNumber, function(error, data) {
	x.domain(data.map(d => d.letter));
	y.domain([0, d3.max(data, d => d.frequency)]);

	chart.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)

	chart.append("g")
		.attr("class", "y axis")
		.call(yAxis);
		//.append("text")
		//.attr("transform", "rotate(-90)")
		//.attr("y", 6)
		//.attr("dy", ".71em")
		//.attr("text-anchor", "middle")
		//.text("Frequency");

	chart.selectAll(".bar")
		.data(data)
		.enter()
		.append("rect")
		.attr("x", d => x(d.letter))
		.attr("y", d => y(d.frequency))
		.attr("height", d => height - y(d.frequency))
		.attr("width", x.bandwidth());
});

function toNumber(d) {
	d.frequency = +d.frequency;
	return d;
}
