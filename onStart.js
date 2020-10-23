let loc = ["Rural 1", "Suburban 2", "Urban 3", "Downtown 4"];
let budget = ["$5", "$15", "$25", "$50"];

var randomLocation = loc[Math.floor(Math.random() * loc.length)];
var randomBudget = budget[Math.floor(Math.random() * budget.length)];

function onStart() {
  let sentence = `Your location is ${randomLocation} and your budget is ${randomBudget}`;

  document.getElementById("text").innerHTML = sentence;
}
