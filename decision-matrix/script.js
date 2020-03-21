/* objects & arrays that store key information: criteria that influence the
decision, the candidates, and how each candidate fares in terms of score */
var criteria = [];
var candidates = [];

var tableHead = d3.select("#table-body")
  .append("tr")
  .attr("id", "table-head");

var candidateHead = d3.select("#table-head")
  .append("td")
  .text("candidate");

var diameter = 500;
var svg = d3.select("svg")
  .attr("width", diameter + 100)
  .attr("height", diameter + 50)
    .append("g")
      .style("transform", "translate(50px, 25px)");

// the buttons
var addCriteria = d3.select("#add-criteria");
var addCandidate = d3.select("#add-candidate");
var calc = d3.select("#calculate");

// the buttons' click events! this is the core of the matrix's functionality
addCriteria.on("click", updateTable);
addCandidate.on("click", updateTable);
calc.on("click", onCalculate);

// updates the table to display all current criteria and candidates
function updateTable() {
  updateCriteria();
  updateCandidates();
}

// adds a column to the table representing a factor influencing the decision
function updateCriteria() {
  var criterion = d3.select("#input-criteria").property("value");
  var weight = d3.select("#input-weight").property("value");
  if (criterion !== "" && newCriterion(criterion)) {
    if (+weight >= 1) {
      criteria.push({name: criterion, weight: +weight});
    } else if (weight === "") { // give default weight of 1
      criteria.push({name: criterion, weight: 1});
    } // note! criteria with non-positive weights cannot be added

    // adds the name of the criterion to the header of the table
    tableHead.selectAll("td.crit")
      .data(criteria)
      .enter()
      .append("td")
        .text(function(d) { return d.name; })
        .classed("crit", true);
  }

  // clears the input fields
  document.querySelector("#input-criteria").value = null;
  document.querySelector("#input-weight").value = null;
}

// determines if the given criterion is not already in the list of criteria
function newCriterion(criterion) {
  var ans = true;
  for (var i = 0; i < criteria.length; i++) {
    if (criteria[i].name === criterion) {
      ans = false;
    }
  }
  return ans;
}

// adds a row to the table representing a candidate
function updateCandidates() {

  // adds candidate to the array if not already present
  var candidate = d3.select("#input-candidate").property("value");
  if (candidate !== "" && !candidates.includes(candidate)) {
    candidates.push(candidate);
  }

  // makes the first cell in every row the candidate label
  d3.select("#table-body").selectAll("tr.can")
    .data(candidates)
    .enter()
    .append("tr")
    .attr("id", function(o) { return "row_" + o.replace(" ", "_"); })
    .classed("can", true)
      .append("td")
      .attr("id", function(o) { return "can_" + o.replace(" ", "_"); })
      .text(function(o) { return o; });

  // for each row representing a candidate, adds input fields for all criteria
  d3.selectAll(".can").selectAll("td.input")
    .data(criteria)
    .enter()
    .append("td")
    .classed("input", true)
      .append("input")
      .attr("id", function(t) { return "input_" + t.name.replace(" ", "_"); });

  // clears the input field
  document.querySelector("#input-candidate").value = null;
}

// important information for drawing the results
var data;
var bestCandidate;
var maxScore;

/* updates the data holding all the score information, then draws the chart
displaying the score breakdowns */
function onCalculate() {
    d3.selectAll("circle").remove();
    resetData();
    candidates.forEach(function(d) { createNode(d); });
    makeBubbleChart();
    getBestcandidate();
}

// clears data object and max score value
function resetData() {
  data = { name: "chart", children: [] };
  maxScore = -1;
}

// appends information about each candidate's scores to the data object
function createNode(n) {
  var c = data.children;
  var scores = [];
  var row = d3.select("#row_" + n.replace(" ", "_"));
  criteria.forEach(function(c) {
    score = row.select("#input_" + c.name.replace(" ", "_")).property("value");
    if (score !== "" && +score >= 0) {
      scores.push({name: c.name, weight: c.weight, score: +score});
    }
  });
  c.push({name: n, children: scores});
}

// objects representing data to be joined to bubbles on the chart
var root;
var nodes;

/* draws a bubble chart representing each candidate and how it scores for all
criteria */
function makeBubbleChart() {

  // bubbles will be colored according to how important the criteria are
  var maxWeight = d3.max(criteria, function(d) { return d.weight; });
  var colorScale = d3.scaleLinear()
    .domain([0, maxWeight])
    .range(["#F2E6E6", "#DD2525"]);

  // using pack determines the cx, cy, and r values of each bubble for us
  var packLayout = d3.pack()
    .size([diameter, diameter])
    .padding(5);

  root = d3.hierarchy(data);

  // size of bubble will be proportional to its weighted score
  root.sum(function(d) { return d.weight * d.score; })
    .sort(function(a, b) { return b.value - a.value; });

  packLayout(root);
  nodes = root.children;

  d3.select("g")
    .selectAll("circle")
    .data(root.descendants())
    .enter()
    .append("circle")
    .attr("id", function(d) { return d.data.name; })
    .classed("nonRoot", function(d) { return d.depth; })
    .attr("cx", function(d) { return d.x; })
    .attr("cy", function(d) { return d.y; })
    .attr("r", function(d) { return d.r; })
    .attr("fill", function(d) {
      if (d.depth > 1) {
        return colorScale(d.data.weight);
      } else if (d.depth == 1) {
        return "#DDDDDD";
      } else {
        return "#EEEEEE";
      }
    });

    // tooltip functionality - view weighted score on hover
    var tooltip = svg.append("text").style("opacity", "0");
    var circles = svg.selectAll("circle");

    circles.data(root.descendants())
    .on("mouseover", function(d) {
      var circle = d3.select(this);
      var r = +circle.attr("r");
      var x = +circle.attr("cx");
      var y = +circle.attr("cy") + r + 20;

      var label = function() {
        return d.depth ? `${circle.attr("id")} total: ${d.value}` : "";
      }

      // make tooltip visible under the selected bubble
      tooltip.text(label)
        .attr("x", x + "px")
        .attr("y", y + "px")
        .attr("text-anchor", "middle")
        .style("opacity", 1);

    }).on("mouseout", function() {
      tooltip.style("opacity", 0); // make tooltip disappear
    });
}

// determines the best candidate based on its total weighted score
function getBestcandidate() {
  nodes.forEach(function(d) {
    if (d.value > maxScore) {
      maxScore = d.value;
      bestcandidate = d.data.name;
    }
  });
  d3.select("#answer-container") // displays the results
    .html(`<p>Your best candidate is <span id="best-candidate">${bestcandidate}</span> with a total weighted score of <span id="max-score">${maxScore}</span>. Yay!`);
}
