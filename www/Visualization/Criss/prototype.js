function VisFun(doc) {
var svg = d3.select("#svg2");
   svg.selectAll("*").remove();
var g = svg.append("g")
	.attr("transform", "translate(20,20)");	
var format = d3.format(",d");

var margin = 20
var diameter = +svg.attr("width");

svg.call(d3.zoom()
    .scaleExtent([1, 1000])
    .on("zoom", function() { g.attr("transform", d3.event.transform); }));

var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
	.padding(2);
	

d3.text(doc, function(error, life) {
  
	if (error) throw error;

	var root = d3.hierarchy(parseNewick(life), function(d) { return d.branchset; }) // constructs the root node
      .sum(function(d) { return d.branchset ? 0 : 1; })
      .sort(function(a, b) { return b.value - a.value; });

	var node = g.selectAll(".node")
		.data(pack(root).descendants())
		.enter().append("g")
		  .attr("class", function(d) { return d.children ? "node" : "leaf node"; })
		  .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
		  
			
	node.append("title")
      .text(function(d) { return d.data.name + "\n" + format(d.value); });

	node.append("circle")
      .attr("r", function(d) { return d.r; })
	

  //node.filter(function(d) { return !d.children; }).append("text")
      //.attr("dy", "0.3em")
      //.text(function(d) { return d.data.name.substring(0, d.r / 3); });
	  
});}
function parseNewick(a){for(var e=[],r={},s=a.split(/\s*(;|\(|\)|,|:)\s*/),t=0;t<s.length;t++){var n=s[t];switch(n){case"(":var c={};r.branchset=[c],e.push(r),r=c;break;case",":var c={};e[e.length-1].branchset.push(c),r=c;break;case")":r=e.pop();break;case":":break;default:var h=s[t-1];")"==h||"("==h||","==h?r.name=n:":"==h&&(r.length=parseFloat(n))}}return r}

