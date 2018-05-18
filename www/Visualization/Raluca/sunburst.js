function SunburstFun(doc) {
    // Variables
        var width = 500,
            height = 500,
            radius = (Math.min(width, height) / 2) - 10;
        var formatNumber = d3.format(",d");
        var x = d3.scale.linear()
            .range([0, 2 * Math.PI]);
        var y = d3.scale.sqrt()
            .range([0, radius]);
        var color = d3.scale.category20c();

        //Data Structure
        var partition = d3.layout.partition()
            .value(function (d) { return d.size; });

        //Size arcs
        var arc = d3.svg.arc()
            .startAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x))); })
            .endAngle(function (d) { return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx))); })
            .innerRadius(function (d) { return Math.max(0, y(d.y)); })
            .outerRadius(function (d) { return Math.max(0, y(d.y + d.dy)); });

        //Create primary <svg> element
        var svg = d3.select("#svg1").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", "translate(" + width / 2 + "," + (height / 2) + ")");
        
        //Get the data from our JSON file
        d3.text(doc, function(
          error,
          root
        ) {
          if (error) throw error;

          //Put it all together
          svg
            .selectAll("path")
            .data(partition.nodes(root))
            .enter()
            .append("path")
            .attr("d", arc)
            .style("fill", function(d) {
              return color((d.children ? d : d.parent).name);
            })
            .on("click", click)
            .append("title")
            .text(function(d) {
              return d.name + "\n" + formatNumber(d.value);
            });
        });

        function click(d) {
            svg.transition()
                .duration(750)
                .tween("scale", function () {
                    var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
                        yd = d3.interpolate(y.domain(), [d.y, 1]),
                        yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
                    return function (t) { x.domain(xd(t)); y.domain(yd(t)).range(yr(t)); };
                })
                .selectAll("path")
                .attrTween("d", function (d) { return function () { return arc(d); }; });
        }

        d3.select(self.frameElement).style("height", height + "px");

    }
function parseNewick(a){for(var e=[],r={},s=a.split(/\s*(;|\(|\)|,|:)\s*/),t=0;t<s.length;t++){var n=s[t];switch(n){case"(":var c={};r.branchset=[c],e.push(r),r=c;break;case",":var c={};e[e.length-1].branchset.push(c),r=c;break;case")":r=e.pop();break;case":":break;default:var h=s[t-1];")"==h||"("==h||","==h?r.name=n:":"==h&&(r.length=parseFloat(n))}}return r}



    //./Visualization/Raluca/flare.json