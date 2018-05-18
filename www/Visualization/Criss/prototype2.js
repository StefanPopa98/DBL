function VisFun(doc) {

var svg = d3.select("#svg2");
svg.selectAll("*").remove();
var diameter = +svg.attr("width");
var g = svg.append("g")
			.attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");	
var format = d3.format(",d");
var margin = 25;
var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
	.padding(1);
d3.text(doc, function(error, file) {
  
	if (error) throw error;
	var root = d3.hierarchy(parseNewick(file), function(d) { return d.branchset; }) 
      .sum(function(d) { return d.branchset ? 0 : 1; })
      .sort(function(a, b) { return d3.ascending(a.data.length, b.data.length); });
	var focus = root,
		view;
	  
	var circle = g.selectAll("circle")
		.data(pack(root).descendants())
		.enter().append("circle")
			.attr("class", function(d) { return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; })
			.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
			.on("click", function(d) { if (focus !== d) zoom(d), d3.event.stopPropagation(); });
			
	var node = g.selectAll("circle");
	
	node.append("title")
      .text(function(d) { return d.data.name + "\n" + format(d.value); });
	
	svg.on("click", function() { zoom(root); });
	
	zoomTo([root.x, root.y, root.r * 2 + margin]);
	
	function zoom(d) {
	
		focus = d;
		
		var transition = d3.transition()
			.duration(d3.eventaltKey ? 1000 : 500)
			.tween("zoom", function(d) {
				var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
				return function(e) { zoomTo(i(e)); };
				});
	}	
	
	function zoomTo(coord) {
		var di = diameter / coord[2]; 
		view = coord;
		node.attr("transform", function(d) {return "translate(" + (d.x - coord[0]) * di  + "," + (d.y - coord[1]) * di + ")"; });
		circle.attr("r", function(d) { return d.r * di; });
	}
	  
});}

function parseNewick(a) {
		for ( var e = [], r = {}, s = a.split(/\s*(;|\(|\)|,|:)\s*/), t = 0; t < s.length; t++ ) {
			var n = s[t];
			switch(n) {
				case"(":
					var c = {};
					r.branchset = [c], e.push(r), r = c;
					break;
				case",":
					var c = {};
					e[e.length-1].branchset.push(c), r = c;
					break;
				case")":
					r = e.pop();
					break;
				case":":
					break;
				default:
					var h = s[t-1];
					")" == h || "(" == h || "," == h ? r.name=n : ":" == h && (r.length = parseFloat(n))}}
					return r
	}