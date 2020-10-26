import { data } from "./info.js";
import { DiffTree, TrafficLight } from "./objects.js";

ZIMONON = true;

  ///////////////////ScoreCard////////////////////////////////////
  class scoreCard {
    constructor(startPostion, budget) {
      this.scores = [{
          Destination: startPostion,
          TransitMode: "",
          CurveBall: "",
          Budget: budget,
          Cost: 0,
          CO2: 0,
          Calories: 0,
        }];
  }
}

let landmarks = [false, false];
//Mode selecters. Option are  Walk, Bike Bus Scooter or Car. Walk be default.
let mode = "Walk"; 

/////////////////// //Different Modes and their properties////////////////////
  const modes = {
    Walk: { cost: 0, spaces: 1, cImpact: 0, calories: 21 },
    Bike: { cost: 1, spaces: 2, cImpact: 0, calories: 27 },
    Bus: { cost: 4, spaces: 4, cImpact: 6, calories: 1.6 },
    Scooter: { cost: 3, spaces: 3, cImpact: 0, calories: 1.8 },
    Car: { cost: 8, spaces: 5, cImpact: 10, calories: 3 },
  };

const frame = new Frame({
  scaling: "full",
  // width: 1924,
  // height: 968,
  color: "#ddd",
  outerColor: "#ddd",
  assets: { src: "https://fonts.googleapis.com/css2?family=Alata" },
});


TIME = "milliseconds";

frame.on("ready", () => {
  const stage = frame.stage;
  const stageW = frame.width;
  const stageH = frame.height;

  extend(TrafficLight, Container);
  extend(DiffTree, Container);


let loc = ["Rural 1", "Suburban 2", "Urban 3", "Downtown 4"];
let budget = ["$5", "$15", "$25", "$50"];

var randomLocation = loc[Math.floor(Math.random() * loc.length)];
var randomBudget = budget[Math.floor(Math.random() * budget.length)];


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// LOCATION AND BUDGET STARTUP CARD
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var lablabel = new Label({
    text: `Your location is ${randomLocation} and budget is ${randomBudget}`,
    size: 20,
    font: "Alata",
    labelWidth: 250,
    shiftVertical: -30,
    align: "center"
  })

  var onstart = new Pane({
    label: lablabel,
    width: 300,
    height: 200, 
    backdropClose: false,
    displayClose: false,
    corner: 15
  });

  // onstart.show().pos({
  //   index: 1000,
  // })
 
  var btnlabel = new Label({
    text: "GOT IT",
    size: 20,
    font: "Alata",
    color: "white"
  })

  var closebtn = new Button({
    label:  btnlabel,
    font: "Alata",
    width: 100,
    height: 50,
    backgroundColor: "#2C57A0",
    rollBackgroundColor: "#244682",
    corner: 10,
  }).tap(function () {
    onstart.hide();
  });


  closebtn.center(onstart).pos(null, 120);


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // BOARD
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const board = new Board({
    // num: 20,
    rows: 20,
    cols: 20,
    size: 18,
    // isometric: false,
    info: JSON.stringify(data), // these are the paths from info.js
    borderWidth: 0.2,
    borderColor: "#555555",
    arrows: false,
    indicatorBorderColor: "white",
    indicatorBorderWidth: 1,
  }).center().pos({
    index: 0,
  });

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Player and Scorecard Created
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const player = new Person().sca(0.6).top();
console.log(typeof player);
board.add(player, 8, 7);
let player1Scorecard = new scoreCard({x:8,y:7},26);

// add a traffic light
var trafficLight = new TrafficLight().sca(0.65);
board.add(trafficLight, 19, 0);


// var diffTree = new DiffTree();
// board.add(diffTree, 2, 4);

// let grass = frame.asset("grass.jpg").sca(.02);
// board.info[0][19] = {data:"-", color:"#acd241", icon:grass, items:[]};

// board.info[19][0] = {data:"-", color:"#555555", icon:null, items:[new DiffTree()]};
// board.update()

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// PATH FINDING
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

const AI = new EasyStar.js();

AI.setTileCost("x", 0); // nothing
AI.setTileCost("g", 0); // nothing
AI.setTileCost("o", 0); // nothing
AI.setTileCost("r", 0); // nothing

AI.setAcceptableTiles(["x", "g", "o", "r"]); // default lighter grey tile
let pathID;
let ticker;
let path;

board.on("change", () => {
  // change triggers when rolled over square changes
  if (player.moving) return;
  getPath(); // just get path - don't go to path with the go parameter true
});

function getPath(go) {
  // called from change (mouseover) and from tap
  AI.setGrid(board.data); // a subset of the info array with only data values
  // cancel any previous path and ticker
  AI.cancelPath(pathID);
  if (ticker) Ticker.remove(ticker);
  // if no currentTile then mouse is outside board
  if (!board.currentTile) {
    board.clearPath();
    path = null;
    return;
  }

  // get a path from the player to the currentTile
  // currentTile is the selected or highlighted tile
  pathID = AI.findPath(
    player.boardCol, // any board item has a boardCol prop
    player.boardRow,
    board.currentTile.boardCol, // any tile has a boardColo prop
    board.currentTile.boardRow,
    function (thePath) {
      // the callback function when path is found
      if (thePath) {
        ////// This where we set the path according to the Mode/////
        path = thePath.slice(0, modes[mode].spaces + 1);
        Ticker.remove(ticker);
        board.showPath(path);
        // this how to get move character by clicking on the screen might omit later//
        if (go) {
          // from a press on the tile
          board.followPath(player, path, null, null, 2); // nudge camera 2
          path = null;
        }
      }
    }
  );
  // must calculate the path in a Ticker
  ticker = Ticker.add(() => {
    AI.calculate();
  });
}

/////
  board.tiles.tap((e) => {
    if (player.moving) return; // moving pieces given moving property
    if (path) {
      // because rolled over already

      // Where the character moves
      board.followPath(player, path, null, null, ); // nudge camera 2

      //Where the score card get updated//
      player1Scorecard.scores.push({
          Destination: path[path.length-1],
          TransitMode: mode,
          CurveBall: "",
          Budget:player1Scorecard.scores[player1Scorecard.scores.length -1].Budget - modes[mode].cost,
          Cost: modes[mode].cost,
          CO2: player1Scorecard.scores[player1Scorecard.scores.length -1].CO2 + modes[mode].cImpact,
          Calories: player1Scorecard.scores[player1Scorecard.scores.length -1].Calories + modes[mode].calories,
        

      })
    
      path = null;
    } else {
      // could be tapping or on mobile with no rollover
      getPath(true);
    }
    stage.update();
  });

  player.on("moved", function () {
    //could be used later after jas finishes landmarks
      // console.log(player.boardTile.lastColor);
      console.log(player.square);
      if(player.square == "16-10"){
        landmarks[0]= true;
      }
      if(player.square == "8-1" && landmarks[0]){
          landmarks[1]=true
        }
      if(player.square == "7-9" && landmarks.every(Boolean)){
        //Player has won the game
          console.log("Winnnerrrr")
      }
        
    });

    

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // UI FOR SCORECARD
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  let gridIcon = frame.asset("assets/grid.png").pos(15, 15).sca(0.6);

  //label for scorecard button
  var scorecardLabel = new Label({
    text: "View Scorecard",
    size: 20,
    font: "Alata",
  });

  //button for scorecard button
  var scoreCardBtn = new Button({
    label: scorecardLabel,
    width: 210,
    height: 50,
    backgroundColor: "white",
    rollBackgroundColor: "#f5f5f5",
    corner: 10,
    icon: gridIcon,
    indent: 50,
    align: "left",
  }).tap(function () {
    scoreCardPane.show();
  });

  scoreCardBtn.pos({x: 50, y: 80, index: 0});

  //scorecard pane that will show the players score
  var scoreCardPane = new Pane({
    width: 500,
    height: 600,
    backgroundColor: "white",
    // backdropClose: false,
    // displayClose: false,
    // close: true,
    corner: 0,
  });


  ///////////////////Labels for scorecard////////////////////////////////////
  
  //title of scorecard
  new Label({
    text: "SCORECARD",
    size: 30,
    font: "Alata",
    align: "center",
    color: "white",
    lineHeight: 50,
    backing:new Rectangle(500, 80, "#2C57A0"),
  }).center(scoreCardPane)
  .pos(null, 0);
  

  ///////////labels for destination
  new Label({
    text: "Destination",
    size: 14,
    color: "white",
    backing:new Rectangle(100, 40, "#383838"),
    font: "Alata",
  }).center(scoreCardPane)
  .pos(20, 100);


 new Label({
    text: " ",
    size: 18,
    backing:new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
  }).center(scoreCardPane)
  .pos(130, 100);

  new Label({
    text: " ",
    size: 18,
    backing:new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
  }).center(scoreCardPane)
  .pos(240, 100);
  
  
  new Label({
    text: " ",
    size: 18,
    backing:new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
  }).center(scoreCardPane)
  .pos(350, 100);

///////////////labels for transit
  new Label({
    text: "Transit Mode",
    size: 14,
    color: "white",
    backing:new Rectangle(100, 40, "#383838"),
    font: "Alata",
  }).center(scoreCardPane)
  .pos(20, 150);

  new Label({
    text: " ",
    size: 18,
    backing:new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
  }).center(scoreCardPane)
  .pos(130, 150);

  new Label({
    text: " ",
    size: 18,
    backing:new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
  }).center(scoreCardPane)
  .pos(240, 150);
  
  new Label({
    text: " ",
    size: 18,
    backing:new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
  }).center(scoreCardPane)
  .pos(350, 150);
  



  ///////////////labels for curve ball
  new Label({
    text: "Curve Ball",
    size: 14,
    color: "white",
    backing:new Rectangle(100, 40, "#383838"),
    font: "Alata",
  }).center(scoreCardPane)
  .pos(20, 200);

  new Label({
    text: " ",
    size: 18,
    backing:new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
  }).center(scoreCardPane)
  .pos(130, 200);

  new Label({
    text: " ",
    size: 18,
    backing:new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
  }).center(scoreCardPane)
  .pos(240, 200);
  
  new Label({
    text: " ",
    size: 18,
    backing:new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
  }).center(scoreCardPane)
  .pos(350, 200);



 
 /////labels for cost
 
 new Label({
  text: "Cost",
  size: 14,
  color: "white",
  backing:new Rectangle(100, 40, "#383838"),
  font: "Alata",
}).center(scoreCardPane)
.pos(20, 250);

new Label({
  text: " ",
  size: 18,
  backing:new Rectangle(100, 40, "#f0f0f0"),
  font: "Alata",
}).center(scoreCardPane)
.pos(130, 250);

new Label({
  text: " ",
  size: 18,
  backing:new Rectangle(100, 40, "#f0f0f0"),
  font: "Alata",
}).center(scoreCardPane)
.pos(240, 250);

new Label({
  text: " ",
  size: 18,
  backing:new Rectangle(100, 40, "#f0f0f0"),
  font: "Alata",
}).center(scoreCardPane)
.pos(350, 250);


/////labels for CO2 Impact

new Label({
  text: "CO2 Impact",
  size: 14,
  color: "white",
  backing:new Rectangle(100, 40, "#383838"),
  font: "Alata",
}).center(scoreCardPane)
.pos(20, 300);

new Label({
  text: " ",
  size: 18,
  backing:new Rectangle(100, 40, "#f0f0f0"),
  font: "Alata",
}).center(scoreCardPane)
.pos(130, 300);

new Label({
  text: " ",
  size: 18,
  backing:new Rectangle(100, 40, "#f0f0f0"),
  font: "Alata",
}).center(scoreCardPane)
.pos(240, 300);

new Label({
  text: " ",
  size: 18,
  backing:new Rectangle(100, 40, "#f0f0f0"),
  font: "Alata",
}).center(scoreCardPane)
.pos(350, 300);


//////labels for calories

new Label({
  text: "Calories",
  size: 14,
  color: "white",
  backing:new Rectangle(100, 40, "#383838"),
  font: "Alata",
}).center(scoreCardPane)
.pos(20, 350);

new Label({
  text: " ",
  size: 18,
  backing:new Rectangle(100, 40, "#f0f0f0"),
  font: "Alata",
}).center(scoreCardPane)
.pos(130, 350);

new Label({
  text: " ",
  size: 18,
  backing:new Rectangle(100, 40, "#f0f0f0"),
  font: "Alata",
}).center(scoreCardPane)
.pos(240, 350);

new Label({
  text: " ",
  size: 18,
  backing:new Rectangle(100, 40, "#f0f0f0"),
  font: "Alata",
}).center(scoreCardPane)
.pos(350, 350);


//////labels for budget

new Label({
  text: "Budget",
  size: 14,
  color: "white",
  backing:new Rectangle(100, 40, "#383838"),
  font: "Alata",
}).center(scoreCardPane)
.pos(20, 400);

new Label({
  text: " ",
  size: 18,
  backing:new Rectangle(100, 40, "#f0f0f0"),
  font: "Alata",
}).center(scoreCardPane)
.pos(130, 400);

new Label({
  text: " ",
  size: 18,
  backing:new Rectangle(100, 40, "#f0f0f0"),
  font: "Alata",
}).center(scoreCardPane)
.pos(240, 400);

new Label({
  text: " ",
  size: 18,
  backing:new Rectangle(100, 40, "#f0f0f0"),
  font: "Alata",
}).center(scoreCardPane)
.pos(350, 400);
 


//////label indicating which is the current

new Label({
  text: "Current",
  size: 18,
  color: "white",
  backing:new Rectangle(100, 40, "#383838"),
  font: "Alata",
}).center(scoreCardPane)
.pos(350, 450);
 



  
  
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // CURVE BALL
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  let tileCol = trafficLight.boardTile.tileCol;
  let tileRow = trafficLight.boardTile.tileRow;

  //curve ball condition statement
  function curveBall() {
    let chance = "";
    switch (tileCol && tileRow) {
      case 19 && 0:
        chance = "go back 5 steps";
        console.log(chance)
        break;
      case 3 && 3:
        chance = "go 3 steps ahead";
        console.log(chance)
        break;
      case 19 && 19:
        chance = "go 2 steps left";
        console.log(chance)
        break;
    }

    document.getElementById("text").innerHTML = chance;
  }

  //displays curveBall card
  function displayCard() {
    curveBall();
    document.getElementById("screen").style.display = "block";
  }

  //when player hits traffic light shows curveball card
  player.moveEvent = player.on("moving", () =>
    // {timeout(50, () =>
    {
      if (player.boardTile == trafficLight.boardTile) {
        player.off("moving", player.moveEvent);

        displayCard();
      }
      // });
    }
  );

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // UI FOR BUTTONS FOR MODE OF TRANSPORT 
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //icons for mode of transport
  let walkIcon = frame.asset("assets/walk.png").pos(14, 15).sca(0.65);
  let bikeIcon = frame.asset("assets/bike.png").pos(14, 15).sca(0.65);
  let carIcon = frame.asset("assets/car.png").pos(14, 15).sca(0.65);
  let scooterIcon = frame.asset("assets/scooter.png").pos(14, 15).sca(0.65);
  let busIcon = frame.asset("assets/bus.png").pos(14, 15).sca(0.65);

  //labels for mode of transport
  var walklabel = new Label({
    text: "Walk",
    size: 18,
    font: "Alata",
  });

  var bikelabel = new Label({
    text: "Bike",
    size: 18,
    font: "Alata",
  });

  var carlabel = new Label({
    text: "Car",
    size: 18,
    font: "Alata",
  });

  var scooterlabel = new Label({
    text: "e-Scooter",
    size: 18,
    font: "Alata",
  });

  var buslabel = new Label({
    text: "Bus",
    size: 18,
    font: "Alata",
  });

  //buttons for mode of transport
  var walkBtn = new Button({
    // label: walklabel,
    // width: 100,
    width: 50,
    height: 50,
    backgroundColor: "white",
    rollBackgroundColor: "#f5f5f5",
    corner: 10,
    icon: walkIcon,
    indent: 20,
    align: "right",
  });

  var bikeBtn = new Button({
    // label: bikelabel,
    // width: 100,
    width: 50,
    height: 50,
    backgroundColor: "white",
    rollBackgroundColor: "#f5f5f5",
    corner: 10,
    icon: bikeIcon,
    indent: 20,
    align: "right",
  });

  var carBtn = new Button({
    // label: carlabel,
    // width: 95,
    width: 50,
    height: 50,
    backgroundColor: "white",
    rollBackgroundColor: "#f5f5f5",
    corner: 10,
    icon: carIcon,
    indent: 20,
    align: "right",
  });

  var scooterBtn = new Button({
    // label: scooterlabel,
    // width: 150,
    width: 50,
    height: 50,
    backgroundColor: "white",
    rollBackgroundColor: "#f5f5f5",
    corner: 10,
    icon: scooterIcon,
    indent: 20,
    align: "right",
  });

  var busBtn = new Button({
    // label: buslabel,
    // width: 90,
    width: 50,
    height: 50,
    backgroundColor: "white",
    rollBackgroundColor: "#f5f5f5",
    corner: 10,
    icon: busIcon,
    indent: 20,
    align: "right",
  });

  //displays buttons on right side of screen
  walkBtn.pos({ horizontal: "right", x: 20, y: 80, index: 0 });
  bikeBtn.pos({ horizontal: "right", x: 20, y: 160, index: 0 });
  carBtn.pos({ horizontal: "right", x: 20, y: 400, index: 0 });
  scooterBtn.pos({ horizontal: "right", x: 20, y: 320, index: 0 });
  busBtn.pos({ horizontal: "right", x: 20, y: 240, index: 0 });

  //changes mode of transport on click of button
  walkBtn.on("click", function () {
    mode = "Walk";
    
    //changes the background color for the chosen mode transport 
    walkBtn.backgroundColor = "#ccc"
    bikeBtn.backgroundColor = "white" 
    busBtn.backgroundColor = "white"
    scooterBtn.backgroundColor = "white"
    carBtn.backgroundColor = "white"
  });
  bikeBtn.on("click", function () {
    mode = "Bike";

    //changes the background color for the chosen mode transport 
    walkBtn.backgroundColor = "white"
    bikeBtn.backgroundColor = "#ccc" 
    busBtn.backgroundColor = "white"
    scooterBtn.backgroundColor = "white"
    carBtn.backgroundColor = "white"

  });
  busBtn.on("click", function () {
    mode = "Car";

    //changes the background color for the chosen mode transport 
    walkBtn.backgroundColor = "white"
    bikeBtn.backgroundColor = "white" 
    busBtn.backgroundColor = "#ccc"
    scooterBtn.backgroundColor = "white"
    carBtn.backgroundColor = "white"

  });
  scooterBtn.on("click", function () {
    mode = "Scooter";
   
    //changes the background color for the chosen mode transport 
    walkBtn.backgroundColor = "white"
    bikeBtn.backgroundColor = "white" 
    busBtn.backgroundColor = "white"
    scooterBtn.backgroundColor = "#ccc"
    carBtn.backgroundColor = "white"

  });
  carBtn.on("click", function () {
    mode = "Bus";
    
    //changes the background color for the chosen mode transport 
    walkBtn.backgroundColor = "white"
    bikeBtn.backgroundColor = "white" 
    busBtn.backgroundColor = "white"
    scooterBtn.backgroundColor = "white"
    carBtn.backgroundColor = "#ccc"
  });

  stage.update(); // this is needed to show any changes
}); // end ready
