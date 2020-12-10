
export default function setUpScoreboardUI(scoreCardPane){

console.log("setting up scorecard")
 ///////////////////Labels for scorecard////////////////////////////////////

  //title of scorecard
  new Label({
    text: "SCORECARD",
    size: 30,
    font: "Alata",
    align: "center",
    color: "white",
    lineHeight: 50,
    backing: new Rectangle(500, 80, "#2C57A0"),
  })
    .center(scoreCardPane)
    .pos(null, 0);


  ///////////////labels for transit
  new Label({
    text: "Transit Mode",
    size: 14,
    color: "white",
    backing: new Rectangle(100, 40, "#383838"),
    font: "Alata",
  })
    .center(scoreCardPane)
    .pos(35, 125);

  //first label for transit mode
  var transit1 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(145, 125);

  //second label for transit mode
  var transit2 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(255, 125);

  //third label for transit mode
  var transit3 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(365, 125);

  ///////////////labels for curve ball
  new Label({
    text: "Curve Ball",
    size: 14,
    color: "white",
    backing: new Rectangle(100, 40, "#383838"),
    font: "Alata",
  })
    .center(scoreCardPane)
    .pos(35, 175);

  //first label for curve ball
  var curve1 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(145, 175);

  //second label for curve ball
  var curve2 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(255, 175);

  //third label for curve ball
  var curve3 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(365, 175);

  /////labels for cost

  new Label({
    text: "Cost",
    size: 14,
    color: "white",
    backing: new Rectangle(100, 40, "#383838"),
    font: "Alata",
  })
    .center(scoreCardPane)
    .pos(35, 225);

  //first label for cost
  var cost1 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(145, 225);

  //second label for cost
  var cost2 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(255, 225);

  //third label for cost
  var cost3 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(365, 225);

  /////labels for CO2 Impact

  new Label({
    text: "CO2 Impact",
    size: 14,
    color: "white",
    backing: new Rectangle(100, 40, "#383838"),
    font: "Alata",
  })
    .center(scoreCardPane)
    .pos(35, 275);

  //first label for CO2 impact
  var cimpact1 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(145, 275);

  //second label for CO2 impact
  var cimpact2 = new Label({
    text: "",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(255, 275);

  //third label for CO2 impact
  var cimpact3 = new Label({
    text: "",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(365, 275);

  //////labels for calories

  new Label({
    text: "Calories",
    size: 14,
    color: "white",
    backing: new Rectangle(100, 40, "#383838"),
    font: "Alata",
  })
    .center(scoreCardPane)
    .pos(35, 325);

  //first label for calories
  var calories1 = new Label({
    text: "",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(145, 325);

  //second label for calories
  var calories2 = new Label({
    text: "",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(255, 325);

  //third label for calories
  var calories3 = new Label({
    text: "",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(365, 325);

  //////labels for budget

  new Label({
    text: "Budget",
    size: 14,
    color: "white",
    backing: new Rectangle(100, 40, "#383838"),
    font: "Alata",
  })
    .center(scoreCardPane)
    .pos(35, 375);

  //first label for budget
  var budget1 = new Label({
    text: "",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(145, 375);

  //second label for budget
  var budget2 = new Label({
    text: "",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(255, 375);


  //third label for budget
  var budget3 = new Label({
    text: "",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(365, 375);

  //////label indicating which is the current

  // new Label({
  //   text: "Current",
  //   size: 18,
  //   color: "white",
  //   backing: new Rectangle(100, 40, "#383838"),
  //   font: "Alata",
  //   align: "center"



  // })
  //   .center(scoreCardPane)
  //   .pos(365, 450);


    return ({ budget1, budget2, budget3, 
            calories1, calories2, calories3, 
            cimpact1, cimpact2, cimpact3,
            cost1, cost2, cost3,
            transit1, transit2, transit3,
            curve1, curve2, curve3
            })
}