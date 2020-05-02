d3.json("./data/pie-chart.json", function(data) {

    // range of slider
    var data_length = Object.keys(data).length - 1;

    var radius
    setRadius();
    var margin = {
        top: 100,
        right: 100,
        bottom: 100,
        left: 175
    };
    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius / 3);

    var canvasWidth = radius * 2 + margin.left + margin.right,
        canvasHeight = radius * 2 + margin.top + margin.bottom;

    function setRadius() {
        var width = window.innerWidth;

        if (width < 520) { radius = width/6.5; }
        else if (width < 1024) { radius = width/5; }
        else { radius = 150; }
    }
    function resizeChart() {
        var width = window.innerWidth;
        setRadius()

        if (width < 520) {
            arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(radius / 5);
        } else {
            arc = d3.svg.arc()
                .outerRadius(radius)
                .innerRadius(radius / 3);
        }

        canvasWidth = radius * 2 + margin.left + margin.right;
        canvasHeight = radius * 2 + margin.top + margin.bottom;

        showValues();
        pieChart();
        showValues();
        updatePieChart();

        outerArc = d3.svg.arc()
            .innerRadius(radius + 50)
            .outerRadius(radius * .95);
        updateLabelLines();
    }
    window.addEventListener('resize', resizeChart);

    // color scheme
    var color = d3.scale.ordinal().range(["#F44336", "#FF9800", "#4CAF50", "#00BCD4",    "#2196F3", "#9C27B0", "#E91E63" ]);

    var pi = Math.PI; // 3.14

    // pie chart config
    var pie = d3.layout.pie()
        .value(function(d) {
            return d.value;
        })
        .sort(null);

    // initialize the sliders, events and pie chart
    init();

    function init() {
        // append slider to table
        rangebox = d3.select('#rangebox')

        rangebox.append('input')
            .attr('type', 'range')
            .attr('data-id', 'slider')
            .attr('class', 'range')
            .attr('step', 1)
            .attr('min', 0)
            .attr('max', data_length)
            .attr('value', 1)

        rangebox.append('div')
            .attr('class', 'range_value');

        showValues();
        pieChart();

        // slider event
        d3.selectAll('.range').on('input', function() {
            this.value = parseInt(this.value);
            if (this.value < 0) this.value = 0;
            else if (this.value > 100) this.value = 100;

            showValues();
            updatePieChart();

        });
    }

    // get JSON data
    function getData() {
        var cur_value
        d3.selectAll('#rangebox .range').each(function() {
            cur_value = this.value
        });
        return data[cur_value]['data'];
    }

    // show slider value
    function showValues() {
        d3.selectAll('#rangebox .range').each(function() {
            var perct = "Year: " + data[this.value]['amount'];
            d3.select('.range_value').html(perct);
        });
    }

    // draw pie chart
    function pieChart() {
        var json = getData();
        var canvaCenterX = (radius * 2 + margin.left + margin.right) / 2;
        var canvaCenterY = (radius * 2 + margin.top + margin.bottom) / 2;

        d3.select("#pie svg").remove();

        // svg canvas
        var svg = d3.select("#pie")
            .append("svg:svg")
            .attr("width", canvasWidth)
            .attr("height", canvasHeight)
            .append("svg:g")
            .attr("transform", "translate(" + canvasWidth / 2 + "," + canvasHeight / 2 + ")")

        // create the classes under the transform
        d3.select("g")
            .append("g")
            .attr("class", "slices");

        d3.select("g")
            .append("g")
            .attr("class", "labels");

        d3.select("g")
            .append("g")
            .attr("class", "lines");

        d3.select("g")
            .append("g")
            .attr("class", "legend");

        // group all ther paths into the slices class
        var arcpaths = svg.select(".slices").selectAll("path").data(pie(getData()))

        // render the slices
        arcpaths.enter()
            .append('svg:path')
            .attr("class", "slice")
            .attr("fill", function(d, i) {
                return color(i);
            })
            .attr("d", arc)
            .each(function(d) {
                this._current = d;
            })
            .append('title')
            .text(function(d, i) {
                return json[i].value + '%';
            });

        // group all ther paths into the slices class
        var arclabels = svg.select(".labels").selectAll("label").data(pie(getData()))

        // render the labels
        arclabels.enter()
            .append("svg:text")
            .attr("class", "label")
            .text(function(d, i) {
                if (json[i].value > 1) return json[i].label;
                else return null;
            })
            .attr("fill", function(d, i) {
                return color(i);
            });

        updateArcs();
        updateLabels();
        updateLabelLines();
    }

    // update pie chart
    function updatePieChart() {
        updateArcs();
        updateLabels();
        updateLabelLines();
    }

    // update the slices of the pie chart
    function updateArcs() {
        var json = getData();

        d3.selectAll("#pie path title")
            .text(function(d, i) {
                return json[i].value + '%';
            });

        d3.selectAll("#pie path")
            .data(pie(json))
            .transition()
            .duration(200)
            .attrTween('d', arcTween);
    }

    /* ------- TEXT LABELS -------*/
    // update the labels of the pie chart
    function updateLabels() {
        labelr = radius + 40 // radius for label anchor
        d3.selectAll("#pie text")
            .data(pie(getData()))
            .transition()
            .duration(0)
            .attr("transform", function(d) {
                var c = arc.centroid(d),
                    x = c[0],
                    y = c[1],
                    // pythagorean theorem for hypotenuse
                    h = Math.sqrt(x * x + y * y);
                return "translate(" + (x / h * labelr) + ',' + (y / h * labelr) + ")";
            })
            .attr("dy", ".35em")
            .attr("text-anchor", function(d) {
                return (d.endAngle + d.startAngle) / 2 > Math.PI ?
                    "end" : "start";
            })

            .text(function(d, i) {
                if (getData()[i].value > 0) return getData()[i].label + " (" + getData()[i].value + "%)";
                else return null;
            });
    }

    /* ------- SLICE TO TEXT POLYLINES -------*/
    var outerArc = d3.svg.arc()
        .innerRadius(radius + 50)
        .outerRadius(radius * .95);

    function midAngle(d) {
        return d.startAngle + (d.endAngle - d.startAngle) / 2;
    }

    function updateLabelLines() {
        var polyline = d3.select(".lines").selectAll("polyline").data(pie(getData()));

        polyline.enter()
            .append("polyline")

        polyline.transition()
            .duration(200)
            .attrTween("points", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = 0;
                    var pos = 0;
                    return [arc.centroid(d2), outerArc.centroid(d2)];
                };
            });

        polyline.exit()
            .remove();
    }

    // transition for the arcs
    function arcTween(a) {
        var i = d3.interpolate(this._current, a);
        this._current = i(0);
        return function(t) {
            return arc(i(t));
        };
    }
});