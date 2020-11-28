import { data } from "./info.js";
import { DiffTree, TrafficLight } from "./objects.js";

console.log(firebase);


var gameId = localStorage.getItem("gameId");
console.log(gameId)


ZIMONON = true;
///////////////////Player/////////////////////////////////
class Player extends Person {

  modes = {
    Walk: { cost: 0, spaces: 1, cImpact: 0, calories: 21 },
    Bike: { cost: 1, spaces: 2, cImpact: 0, calories: 27 },
    Bus: { cost: 4, spaces: 3, cImpact: 6, calories: 1.6 },
    Scooter: { cost: 3, spaces: 4, cImpact: 0, calories: 1.8 },
    Car: { cost: 8, spaces: 5, cImpact: 10, calories: 3 },
  };
  constructor(startPosition, budget, id) {
    super();
    this.startPosition = startPosition;
    this.budget = budget;
    this.cO2 = 0;
    this.calories = 0;
    this.hitCurveBall = false;
    this.secondturn = false;

    this.id = id;
    this.landmarks = [false, false];
    this.pathHist = [];
    // this.mode;

    this.scores = [{
      Destination: startPosition,
      TransitMode: "",
      CurveBall: "",
      Budget: budget,
      Cost: 0,
      CO2: 0,
      Calories: 0,
    },
    ];



  }


  moneyMove(mode) {
    if (this.budget >= this.modes[mode].cost) {
      return true;
    }
    return false;
  }


  updatePlayerInfo(path, mode) {
    this.budget = this.budget - this.modes[mode].cost;
    this.cO2 = this.cO2 + this.modes[mode].cImpact;
    this.calories = this.calories + this.modes[mode].calories;
    this.scores.push({
      Destination: path[path.length - 1],
      TransitMode: mode,
      CurveBall: "",
      Budget: this.budget,
      Cost: this.modes[mode].cost,
      CO2: this.cO2,
      Calories: this.calories,
    })


  }
  didWin() {
    if (this.square == "20-13") {
      this.landmarks[0] = true;
    }
    if (this.square == "8-1" && this.landmarks[0]) {
      this.landmarks[1] = true;
    }
    if (this.square == "2-7" && this.landmarks.every(Boolean)) {
      return true;
    }

    return false;
    
  }


  tracker(nw) {
    let newspots = nw.length - 1;
    let leftover = 10 - this.pathHist.length;

    if (this.pathHist.length == 10) {
      this.pathHist.splice(0, newspots);
      this.pathHist.push.apply(this.pathHist, nw.slice(1));
    } else if (this.pathHist.length > 0 && leftover < newspots) {
      this.pathHist.splice(0, newspots - leftover);
      this.pathHist.push.apply(this.pathHist, nw.slice(1));
    } else if (this.pathHist.length == 0) {
      this.pathHist.push.apply(this.pathHist, nw);
    } else {
      this.pathHist.push.apply(this.pathHist, nw.slice(1));
    }
    return this.pathHist;
  }
}
///function to shuffle arrays arround///
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
function updateTurn(turn, num) {
  let playerTurn = turn;
  playerTurn++;
  if (playerTurn === num) {
    playerTurn = 0;
  }

  // setReady(playerTurn);
  return playerTurn;
}



//Mode selecters. Option are  Walk, Bike Bus Scooter or Car. Walk be default.
let tilesLimits = {
  Walk: ["x", "g", "r"],
  Bike: ["x","g"],
  Bus: ["r"],
  Scooter:["x"],
  Car: ["r","o","x"],
  Special: ["x","g","r","o"]
};
let mode = "Walk";

/////////////////// //Different Modes and their properties////////////////////


const frame = new Frame({
  scaling: "full",
  // width: 1924,
  // height: 968,
  color: "#ddd",
  outerColor: "#ddd",
  assets: [
    { src: "https://fonts.googleapis.com/css2?family=Alata" },
    "1.png",
    "2.png",
    "3.png",
    "tile1.png",
    "tile2.png",
    "tile3.png",
    "tile4.png",
    "tile5.png",
    "bike.png",
    "bus.png",
    "car.png",
    "scooter.png",
    "walk.png",
    "library.png",
    "park.png",
    "school.png"
  ],
  path: "assets/",
});

TIME = "milliseconds";


frame.on("ready", () => {
  const stage = frame.stage;
  const stageW = frame.width;
  const stageH = frame.height;

  extend(TrafficLight, Container);
  extend(DiffTree, Container);

  const waiter = new Waiter({
      corner:5,
      backgroundColor: "#2C57A0"
    }).show();    

  frame.on("complete", function() {
    waiter.hide();   
 });

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // LOCATION AND BUDGET STARTUP CARD
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var lablabel = new Label({
    // text: `Your location is ${randomLocation} and budget is $${randomBudget}`,
    size: 20,
    font: "Alata",
    labelWidth: 250,
    shiftVertical: -30,
    align: "center",
  });

  var onstart = new Pane({
    label: lablabel,
    width: 300,
    height: 200,
    backdropClose: false,
    displayClose: false,
    corner: 15,
  });

  // onstart.show().pos({
  //   index: 1000,
  // })

  var btnlabel = new Label({
    text: "GOT IT",
    size: 20,
    font: "Alata",
    color: "white",
  });

  var closebtn = new Button({
    label: btnlabel,
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
    rows: 25,
    cols: 25,
    size: 17,
    info: JSON.stringify(data), // these are the paths from info.js
    borderWidth: 0.2,
    borderColor: "#555555",
    arrows: false,
    indicatorBorderColor: "white",
    indicatorBorderWidth: 1,
  })
    .center()
    .pos({
      index: 0,
    });

  var cvLabel = new Label({
    text: "Change View",
    size: 12,
    font: "Alata",
    shiftHorizontal: 15,
  });

  let eye = frame.asset("assets/eye.png").sca(0.7).center().pos(20, null);

  var changeView = new Button({
    label: cvLabel,
    icon: eye,
    width: 150,
    height: 40,
    backgroundColor: "#2C57A0",
    rollBackgroundColor: "#244682",
    corner: 10,
  }).tap(function () {
    board.isometric = !board.isometric;
  });

  changeView.pos({ x: 20, y: 50, vertical: "bottom", index: 0 })

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Player Creation 
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // Characters placement cards and Budget Cards setup 
  let loc = ["Rural 1", "Suburban 2", "Urban 3", "Downtown 4"];
  let budget = [5, 15, 25, 50];
  let locPos = { "Rural 1": { x: 20, y: 0 }, "Suburban 2": { x: 21, y: 15 }, "Urban 3": { x: 3, y: 16 }, "Downtown 4": { x: 2, y: 1 } }

  //////////////Shuffle loc cards and budget cards so it can be random////////////
  shuffleArray(loc);
  shuffleArray(budget);

  /////////////Number of players playing the game////////////////////////
  // let numOfPlayers = prompt("Please number of players: 2, 3 or 4", "");
  // numOfPlayers = parseInt(numOfPlayers);
  
/*
# TODO
FETCH Players from Firebase
*/

  // let numOfPlayers = 1;
  let listofPlayers = []
  // let playerTurn = 0;
  // if (parseInt(numOfPlayers)) {
  //   const player1 = new Player(locPos[loc.pop()], budget.pop(), 0).sca(0.6).top();
   
    // const player2 = new Player(locPos[loc.pop()], budget.pop(), 1).sca(0.6).top();

    // board.add(player1, player1.startPosition["x"], player1.startPosition["y"]);
    
    // board.add(player2, player2.startPosition["x"], player2.startPosition["y"]);

    // listofPlayers.push(player1)
    
    // listofPlayers.push(player2)
  // }
//   if (parseInt(numOfPlayers) >= 3) {
//     const player3 = new Player(locPos[loc.pop()], budget.pop(), 2).sca(0.6).top();
//     board.add(player3, player3.startPosition["x"], player3.startPosition["y"]);
//     listofPlayers.push(player3)
//   }
//   if (parseInt(numOfPlayers) >= 4) {
//     const player4 = new Player(locPos[loc.pop()], budget.pop(), 3).sca(0.6).top();
//     board.add(player4, player4.startPosition["x"], player4.startPosition["y"]);
//     listofPlayers.push(player4)
//   }

if(listofPlayers.length != 0){
  for (let plyer of listofPlayers) {
    console.log(plyer.budget);
    
    plyer.on("moving", () => {
      if (board.getItems(plyer.boardTile)[0].type == "TrafficLight" && !plyer.hitCurveBall && !plyer.secondturn) {
        plyer.hitCurveBall = true

      }
      
    });
  

    plyer.on("movingdone", () => {
     

      if (walkBtn.enabled == false) {
        walkBtn.enabled = true;
        bikeBtn.enabled = true;
        busBtn.enabled = true;
        scooterBtn.enabled = true;
        carBtn.enabled = true;

      }

      if (!plyer.hitCurveBall) {
        if (!plyer.didWin()) {
          plyer.secondturn = false;
          playerTurn = updateTurn(playerTurn, numOfPlayers);
          setReady(playerTurn);
          UpdateScoreUI(listofPlayers[playerTurn]);

          mode = "Walk"
          AI.setAcceptableTiles(tilesLimits["Walk"]);
          walkBtn.backgroundColor = "#ccc";
          bikeBtn.backgroundColor = "white";
          busBtn.backgroundColor = "white";
          scooterBtn.backgroundColor = "white";
          carBtn.backgroundColor = "white";

        } else {
          alert("player" + (plyer.id + 1) + " won!!!!! Congratulations I hope you play again!");
        }
      } else {

        curveBall(mode, plyer);


      }
    });
  }
}

  

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // PATH FINDING
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const AI = new EasyStar.js();

  AI.setTileCost("x", 0); // nothing
  AI.setTileCost("g", 0); // nothing
  AI.setTileCost("o", 0); // nothing
  AI.setTileCost("r", 0); // nothing
  AI.setAcceptableTiles(tilesLimits[mode]);
   // default lighter grey tile
  let pathID;
  let ticker;
  let path;


  //sets color of circle of player turn green
  function setReady(n) {
    switch (n) {
      case 0:
        circle1.color = "green";
        circle2.color = "white";
        circle3.color = "white";
        circle4.color = "white";
        break;
      case 1:
        circle1.color = "white";
        circle2.color = "green";
        circle3.color = "white";
        circle4.color = "white";
        break;
      case 2:
        circle1.color = "white";
        circle2.color = "white";
        circle3.color = "green";
        circle4.color = "white";
        break;
      case 3:
        circle1.color = "white";
        circle2.color = "white";
        circle3.color = "white";
        circle4.color = "green";
        break;
    }
    stage.update();
  }


  board.on("change", () => {
    // change triggers when rolled over square changes
    if (listofPlayers[playerTurn].moving) return;
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
      listofPlayers[playerTurn].boardCol, // any board item has a boardCol prop
      listofPlayers[playerTurn].boardRow,
      board.currentTile.boardCol, // any tile has a boardColo prop
      board.currentTile.boardRow,
      function (thePath) {
        // the callback function when path is found
        if (thePath) {
          ////// This where we set the path according to the Mode/////
          path = thePath.slice(0, listofPlayers[playerTurn].modes[mode].spaces + 1);

          Ticker.remove(ticker);
          board.showPath(path);
          // this how to get move character by clicking on the screen might omit later//
          if (go) {
            // from a press on the tile
            // board.followPath(listofPlayers[playerTurn], path, null, null, 2); // nudge camera 2
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

  /////Player Moves /////////////////////////////////////////////////////////

  board.tiles.tap((e) => {
    if (listofPlayers[playerTurn].moving) return; // moving pieces given moving property
    if (path) {
      if (listofPlayers[playerTurn].moneyMove(mode)) {



        board.followPath(listofPlayers[playerTurn], path, null, null); // nudge camera 2

        //Record path for Curveballs
        listofPlayers[playerTurn].tracker(path);

        //Where the score card get updated//
        listofPlayers[playerTurn].updatePlayerInfo(path, mode);






      } else {
        alert("You don't have enough money! Pick a different mode")
      }
      path = null;
    } else {
      // could be tapping or on mobile with no rollover
      getPath(true);
    }
    stage.update();
  });


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // CURVE BALL
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



  function curveBall(md, plyr) {
    let card = Math.floor(Math.random() * 10) + 1;;

    plyr.hitCurveBall = false;
    let tmpPath = plyr.pathHist.slice(0)
    let chance = "";
    switch (card) {
     
      ///Heat/////
      case 1:
        if (md == "Walk") {
          chance = "go back 1 steps";
          curveBallPane.label.text = cb1;
          curveBallPane.show();

          tmpPath = tmpPath.reverse().slice(0, 2)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;

        } else if (md == "Bike" || md == "Scooter") {
          chance = "go back 2 steps";
          curveBallPane.label.text = cb1;
          curveBallPane.show();

          tmpPath = tmpPath.reverse().slice(0, 3)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;
        } else {
          playerTurn = updateTurn(playerTurn, numOfPlayers);
          setReady(playerTurn);
        }
        console.log(chance)

        break;

      ///Rain///////
      case 2:
        if (md == "Bike" || md == "Scooter") {
          chance = "go back 2 steps";
          curveBallPane.label.text = cb3;
          curveBallPane.show();


          tmpPath = tmpPath.reverse().slice(0, 3)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;
        }
        else if (md == "Bus") {
          chance = "go back 1 steps";
          curveBallPane.label.text = cb3;
          curveBallPane.show();

          tmpPath = tmpPath.reverse().slice(0, 2)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;
        }

        else if (md == "Car") {
          chance = "go back 4 steps";
          curveBallPane.label.text = cb3;
          curveBallPane.show();

          tmpPath = tmpPath.reverse().slice(0, 5)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;
        }

        else {
          playerTurn = updateTurn(playerTurn, numOfPlayers);
          setReady(playerTurn);
        }
        console.log(chance)
        break;

      ///High gas///////
      case 3:
        if (md == "Car") {
          chance = "-$10";
          curveBallPane.label.text = cb5;
          curveBallPane.show();

          plyr.budget = plyr.budget - 10;
        }

        if (md == "Bus") {
          chance = "-$1";
          curveBallPane.label.text = cb5;
          curveBallPane.show();


          plyr.budget = plyr.budget - 1;
          playerTurn++;
        }
        playerTurn = updateTurn(playerTurn, numOfPlayers);
        setReady(playerTurn);
        console.log("$" + plyr.budget);
        break;

      ///Late Bus///////
      case 4:
        if (md == "Bus") {
          chance = "go back 4 steps";
          curveBallPane.label.text = cb8;
          curveBallPane.show();

          tmpPath = tmpPath.reverse().slice(0, 5)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;
        }
        break;

      ///Snow////////
      case 5:
        if (md == "Bus") {
          tmpPath = tmpPath.reverse().slice(0, 2)
          board.followPath(plyr, tmpPath, null, null,);
          chance = "go back 1 steps";
          curveBallPane.label.text = cb2;
          curveBallPane.show();
          plyr.secondturn = true;

        } else if (md == "Bike" || md == "Scooter") {
          chance = "go back 2 steps";
          curveBallPane.label.text = cb2;
          curveBallPane.show();


          tmpPath = tmpPath.reverse().slice(0, 3)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;

        } else if (md == "Car") {
          chance = "go back 4 steps";
          curveBallPane.label.text = cb2;
          curveBallPane.show();

          tmpPath = tmpPath.reverse().slice(0, 5)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;
        }
        else {
          playerTurn = updateTurn(playerTurn, numOfPlayers);
          setReady(playerTurn);
        }
        break;

      /// Traffic /////
      case 6:
        if (md == "Walk" || md == "Bike" || md == "Scooter") {
            chance = "go forward 1 steps";
            curveBallPane.label.text = cb4;
            curveBallPane.show();
            mode = "Walk"

            walkBtn.enabled = false;
            walkBtn.enabled = false;
            bikeBtn.enabled = false;
            busBtn.enabled = false;
            scooterBtn.enabled = false;
            carBtn.enabled = false;

            plyr.secondturn = true;
            // return mode

        } else if (md == "Bus") {
          chance = "go back 2 steps";
          //alert

          curveBallPane.label.text = cb4;
          curveBallPane.show();


          tmpPath = tmpPath.reverse().slice(0, 3)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;
        }
        else {
          playerTurn = updateTurn(playerTurn, numOfPlayers);
          setReady(playerTurn);
        }

        break;

      ///Flat Tire ////////
      case 7:
        if (md == "Car") {
          chance = "go back 7 steps";
          curveBallPane.label.text = cb6;
          curveBallPane.show();

          tmpPath = tmpPath.reverse().slice(0, 9)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;

        } else if (md == "Bus") {
          chance = "go back 2 steps";
          curveBallPane.label.text = cb6;
          curveBallPane.show();

          tmpPath = tmpPath.reverse().slice(0, 3)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;

        } else {
          playerTurn = updateTurn(playerTurn, numOfPlayers);
          setReady(playerTurn);
        }
        break;
     
      /////Free Scooter/////
      case 8:
        if (md == "Scooter") {
            chance = "Move again with Scooter";
            curveBallPane.label.text = cb7;
            curveBallPane.show();

            mode="Scooter"
            walkBtn.enabled = false;
            bikeBtn.enabled = false;
            busBtn.enabled = false;
            scooterBtn.enabled = false;
            carBtn.enabled = false;

        plyr.secondturn = true;
        } else {
          playerTurn = updateTurn(playerTurn, numOfPlayers);
          setReady(playerTurn);
        }

        break;

      ////Sunny Day////  
      case 9:
        chance = "go forward 5 steps";
        curveBallPane.label.text = cb9;
        curveBallPane.show();
        mode = "Scooter"
        plyr.budget = plyr.budget + 3; 
        AI.setAcceptableTiles(tilesLimits["Special"]);   

        walkBtn.enabled = false;
        bikeBtn.enabled = false;
        busBtn.enabled = false;
        scooterBtn.enabled = false;
        carBtn.enabled = false;
        plyr.secondturn = true;
        break;

      ////Great Breakfast////  
      case 10:
        chance = "go forward 5 steps";
        curveBallPane.label.text = cb10;
        curveBallPane.show();

        mode = "Car"
        plyr.budget = plyr.budget + 8;

        AI.setAcceptableTiles(tilesLimits["Special"]);

        walkBtn.enabled = false;
        walkBtn.enabled = false;
        bikeBtn.enabled = false;
        busBtn.enabled = false;
        scooterBtn.enabled = false;
        carBtn.enabled = false;
        plyr.secondturn = true;

        break;

    }

    //  //////Flood /////////
    //  case 11:
    //     if (board.getColor(plyr.boardTile) == "#acd241"
    //     ) {
    //       chance = "go back 2 steps";
    //       //alert
    //       tmpPath = tmpPath.reverse().slice(0, 3)
    //       board.followPath(plyr, tmpPath, null, null,);
    //       plyr.secondturn = true;
    //     } else {
    //       playerTurn = updateTurn(playerTurn, numOfPlayers);
    //       setReady(playerTurn);
    //     }
    //     console.log(chance)
    //     break;
  }

  function UpdateScoreUI(plyr){
    let tmpScores;
    if (plyr.scores.length > 3){
      tmpScores = plyr.scores.slice(plyr.scores.length - 3);
      console.log(tmpScores);
    }
  else{
    tmpScores = plyr.scores.slice(0);
    console.log(tmpScores);
  }
    des1.text = tmpScores[0].Destination.x +","+tmpScores[0].Destination.y;
    transit1.text = tmpScores[0].TransitMode;
    curve1.text = tmpScores[0].CurveBall;
    cost1.text = tmpScores[0].Cost
    cimpact1.text = tmpScores[0].CO2
    calories1.text = tmpScores[0].Calories
    budget1.text = "$" + tmpScores[0].Budget
    
  if (plyr.scores.length > 1){
    des2.text = tmpScores[1].Destination.x +","+tmpScores[1].Destination.y;
    transit2.text = tmpScores[1].TransitMode
    curve2.text = tmpScores[1].CurveBall
    cost2.text = tmpScores[1].Cost
    cimpact2.text = tmpScores[1].CO2
    calories2.text = tmpScores[1].Calories
    budget2.text = "$" + tmpScores[1].Budget
  }
  if (plyr.scores.length > 2){
    des3.text = tmpScores[2].Destination.x +","+tmpScores[2].Destination.y;
    transit3.text = tmpScores[2].TransitMode
    curve3.text = tmpScores[2].CurveBall
    cost3.text = tmpScores[2].Cost
    cimpact3.text = tmpScores[2].CO2
    calories3.text = tmpScores[2].Calories
    budget3.text = "$" + tmpScores[2].Budget
    
  }
  }

  

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

  scoreCardBtn.pos({ x: 20, y: 50, index: 0 });

  //scorecard pane that will show the players score
  var scoreCardPane = new Pane({
    width: 500,
    height: 600,
    backgroundColor: "white",
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
    backing: new Rectangle(500, 80, "#2C57A0"),
  })
    .center(scoreCardPane)
    .pos(null, 0);

  ///////////labels for destination
  new Label({
    text: "Destination",
    size: 14,
    color: "white",
    backing: new Rectangle(100, 40, "#383838"),
    font: "Alata",
  })
    .center(scoreCardPane)
    .pos(35, 100);

  //first label for destination
  var des1 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(145, 100);

  //second label for destination
  var des2 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(255, 100);

  //third label for destination
  var des3 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(365, 100);

  ///////////////labels for transit
  new Label({
    text: "Transit Mode",
    size: 14,
    color: "white",
    backing: new Rectangle(100, 40, "#383838"),
    font: "Alata",
  })
    .center(scoreCardPane)
    .pos(35, 150);

  //first label for transit mode
  var transit1 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(145, 150);

  //second label for transit mode
  var transit2 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(255, 150);

  //third label for transit mode
  var transit3 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(365, 150);

  ///////////////labels for curve ball
  new Label({
    text: "Curve Ball",
    size: 14,
    color: "white",
    backing: new Rectangle(100, 40, "#383838"),
    font: "Alata",
  })
    .center(scoreCardPane)
    .pos(35, 200);

  //first label for curve ball
  var curve1 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(145, 200);

  //second label for curve ball
  var curve2 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(255, 200);

  //third label for curve ball
  var curve3 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(365, 200);

  /////labels for cost

  new Label({
    text: "Cost",
    size: 14,
    color: "white",
    backing: new Rectangle(100, 40, "#383838"),
    font: "Alata",
  })
    .center(scoreCardPane)
    .pos(35, 250);

  //first label for cost
  var cost1 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(145, 250);

  //second label for cost
  var cost2 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(255, 250);

  //third label for cost
  var cost3 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(365, 250);

  /////labels for CO2 Impact

  new Label({
    text: "CO2 Impact",
    size: 14,
    color: "white",
    backing: new Rectangle(100, 40, "#383838"),
    font: "Alata",
  })
    .center(scoreCardPane)
    .pos(35, 300);

  //first label for CO2 impact
  var cimpact1 = new Label({
    text: " ",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(145, 300);

  //second label for CO2 impact
  var cimpact2 = new Label({
    text: "",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(255, 300);

  //third label for CO2 impact
  var cimpact3 = new Label({
    text: "",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(365, 300);

  //////labels for calories

  new Label({
    text: "Calories",
    size: 14,
    color: "white",
    backing: new Rectangle(100, 40, "#383838"),
    font: "Alata",
  })
    .center(scoreCardPane)
    .pos(35, 350);

  //first label for calories
  var calories1 = new Label({
    text: "",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(145, 350);

  //second label for calories
  var calories2 = new Label({
    text: "",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(255, 350);

  //third label for calories
  var calories3 = new Label({
    text: "",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(365, 350);

  //////labels for budget

  new Label({
    text: "Budget",
    size: 14,
    color: "white",
    backing: new Rectangle(100, 40, "#383838"),
    font: "Alata",
  })
    .center(scoreCardPane)
    .pos(35, 400);

  //first label for budget
  var budget1 = new Label({
    text: "",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(145, 400);

  //second label for budget
  var budget2 = new Label({
    text: "",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(255, 400);


  //third label for budget
  var budget3 = new Label({
    text: "",
    size: 18,
    backing: new Rectangle(100, 40, "#f0f0f0"),
    font: "Alata",
    align: "center"
  })
    .center(scoreCardPane)
    .pos(365, 400);

  //////label indicating which is the current

  new Label({
    text: "Current",
    size: 18,
    color: "white",
    backing: new Rectangle(100, 40, "#383838"),
    font: "Alata",
    align: "center"



  })
    .center(scoreCardPane)
    .pos(365, 450);

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // UI FOR BUTTONS FOR MODE OF TRANSPORT
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //icons for mode of transport
  let walkIcon = asset("assets/walk.png").pos(14, 15).sca(0.65);
  let bikeIcon = asset("assets/bike.png").pos(14, 15).sca(0.65);
  let carIcon = asset("assets/car.png").pos(14, 15).sca(0.65);
  let scooterIcon = asset("assets/scooter.png").pos(14, 15).sca(0.65);
  let busIcon = asset("assets/bus.png").pos(14, 15).sca(0.65);

  //buttons for mode of transport
  var walkBtn = new Button({
    // label: walklabel,
    // width: 100,
    width: 50,
    height: 50,
    backgroundColor: "#ccc",
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


  //displays buttons on right side of screen
  walkBtn.pos({ horizontal: "right", x: 20, y: 50, index: 0 });
  bikeBtn.pos({ horizontal: "right", x: 20, y: 130, index: 0 });
  busBtn.pos({ horizontal: "right", x: 20, y: 210, index: 0 });
  scooterBtn.pos({ horizontal: "right", x: 20, y: 290, index: 0 });
  carBtn.pos({ horizontal: "right", x: 20, y: 370, index: 0 });

  //changes mode of transport on click of button
  walkBtn.on("click", function () {
    mode = "Walk";
    AI.setAcceptableTiles(tilesLimits[mode]);
    //changes the background color for the chosen mode transport
    walkBtn.backgroundColor = "#ccc";
    bikeBtn.backgroundColor = "white";
    busBtn.backgroundColor = "white";
    scooterBtn.backgroundColor = "white";
    carBtn.backgroundColor = "white";
  });
  bikeBtn.on("click", function () {
    mode = "Bike";
    AI.setAcceptableTiles(tilesLimits[mode]);

    //changes the background color for the chosen mode transport
    walkBtn.backgroundColor = "white";
    bikeBtn.backgroundColor = "#ccc";
    busBtn.backgroundColor = "white";
    scooterBtn.backgroundColor = "white";
    carBtn.backgroundColor = "white";
  });
  busBtn.on("click", function () {
    mode = "Bus";
    AI.setAcceptableTiles(tilesLimits[mode]);

    //changes the background color for the chosen mode transport
    walkBtn.backgroundColor = "white";
    bikeBtn.backgroundColor = "white";
    busBtn.backgroundColor = "#ccc";
    scooterBtn.backgroundColor = "white";
    carBtn.backgroundColor = "white";
  });
  scooterBtn.on("click", function () {
    mode = "Scooter";
    AI.setAcceptableTiles(tilesLimits[mode]);
    //changes the background color for the chosen mode transport
    walkBtn.backgroundColor = "white";
    bikeBtn.backgroundColor = "white";
    busBtn.backgroundColor = "white";
    scooterBtn.backgroundColor = "#ccc";
    carBtn.backgroundColor = "white";
  });
  carBtn.on("click", function () {
    mode = "Car";
    AI.setAcceptableTiles(tilesLimits[mode]);

    //changes the background color for the chosen mode transport
    walkBtn.backgroundColor = "white";
    bikeBtn.backgroundColor = "white";
    busBtn.backgroundColor = "white";
    scooterBtn.backgroundColor = "white";
    carBtn.backgroundColor = "#ccc";
  });
  UpdateScoreUI(listofPlayers[0]);
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // BOARD ITEMS
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  ///adds landmarks to board
  let school = frame.asset("assets/school.png").rot(270).sca(.4);
  let park = frame.asset("assets/park.png").rot(270).sca(.4);
  let library = frame.asset("assets/library.png").rot(270).sca(.4);

  board.info[20][13] = { data: "x", color: "#707070", icon: school, items: [] };
  board.info[8][1] = { data: "x", color: "#acd241", icon: park, items: [] };
  board.info[2][7] = { data: "x", color: "#707070", icon: library, items: [] };


  //adds road to board
  board.info[8][9] = { data: "o", color: "#555", icon: asset("tile3.png").sca(.4), items: [] };
  board.info[9][9] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4), items: [] };
  board.info[10][9] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  board.info[11][9] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  // board.info[14][9] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  board.info[12][9] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  board.info[13][9] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  board.info[15][9] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  board.info[16][9] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  board.info[17][9] = { data: "o", color: "#555", icon: asset("tile4.png").sca(.4).rot(180), items: [] };
  board.info[17][10] = { data: "o", color: "#555", icon: asset("tile3.png").clone().sca(.4), items: [] };
  board.info[18][10] = { data: "o", color: "#555", icon: asset("tile2.png").clone().sca(.4), items: [] };
  board.info[19][10] = { data: "o", color: "#555", icon: asset("tile2.png").clone().sca(.4), items: [] };
  board.info[8][8] = { data: "o", color: "#555", icon: asset("tile5.png").sca(.4), items: [] };
  board.info[8][7] = { data: "o", color: "#555", icon: asset("tile4.png").sca(.4).rot(180).clone(), items: [] };
  board.info[7][7] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  board.info[6][7] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  board.info[5][7] = { data: "o", color: "#555", icon: asset("tile3.png").sca(.4).clone(), items: [] };
  board.info[5][6] = { data: "o", color: "#555", icon: asset("tile5.png").sca(.4).clone(), items: [] };
  board.info[5][5] = { data: "o", color: "#555", icon: asset("tile4.png").sca(.4).clone().rot(180), items: [] };
  board.info[4][5] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  board.info[3][5] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  board.info[2][5] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  board.info[1][5] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  board.info[0][5] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  board.info[20][10] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  board.info[21][10] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  board.info[22][10] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  board.info[23][10] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };
  board.info[24][10] = { data: "o", color: "#555", icon: asset("tile2.png").sca(.4).clone(), items: [] };


  
  //adds bus route tile
  board.info[14][9] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15).clone(), items: [] };
  board.info[19][12] = { data: "r", color: "#707070", icon: asset("2.png").sca(.15).rot(90), items: [] };
  board.info[18][12] = { data: "r", color: "#707070", icon: asset("2.png").sca(.15).rot(90).clone(), items: [] };
  board.info[17][12] = { data: "r", color: "#707070", icon: asset("2.png").sca(.15).rot(90).clone(), items: [] };
  board.info[16][12] = { data: "r", color: "#707070", icon: asset("2.png").sca(.15).rot(90).clone(), items: [] };
  board.info[15][12] = { data: "r", color: "#707070", icon: asset("2.png").sca(.15).rot(90).clone(), items: [] };
  board.info[13][12] = { data: "r", color: "#707070", icon: asset("2.png").sca(.15).rot(90).clone(), items: [] };
  board.info[12][12] = { data: "r", color: "#707070", icon: asset("2.png").sca(.15).rot(90).clone(), items: [] };
  board.info[11][12] = { data: "r", color: "#707070", icon: asset("2.png").sca(.15).rot(90).clone(), items: [] };
  board.info[10][12] = { data: "r", color: "#707070", icon: asset("2.png").sca(.15).rot(90).clone(), items: [] };
  board.info[9][12] = { data: "r", color: "#707070", icon: asset("2.png").sca(.15).rot(90).clone(), items: [] };
  board.info[14][0] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15), items: [] };
  board.info[14][1] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15).clone(), items: [] };
  board.info[14][2] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15).clone(), items: [] };
  board.info[14][4] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15).clone(), items: [] };
  board.info[14][5] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15).clone(), items: [] };
  board.info[14][6] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15).clone(), items: [] };
  board.info[14][7] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15).clone(), items: [] };
  board.info[14][8] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15).clone(), items: [] };
  board.info[14][10] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15).clone(), items: [] };
  board.info[14][11] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15).clone(), items: [] };
  board.info[14][13] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15).clone(), items: [] };
  board.info[14][14] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15).clone(), items: [] };
  board.info[14][15] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15).clone(), items: [] };
  board.info[14][16] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15).clone(), items: [] };
  board.info[20][12] = { data: "r", color: "#707070", icon: asset("2.png").sca(.15).clone(), items: [] };
  board.info[21][12] = { data: "r", color: "#707070", icon: asset("2.png").sca(.15).clone(), items: [] };
  board.info[22][12] = { data: "r", color: "#707070", icon: asset("2.png").sca(.15).clone(), items: [] };
  board.info[23][12] = { data: "r", color: "#707070", icon: asset("2.png").sca(.15).clone(), items: [] };
  board.info[24][12] = { data: "r", color: "#707070", icon: asset("2.png").sca(.15).clone(), items: [] };
  board.info[14][17] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15).clone(), items: [] };
  board.info[14][18] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15).clone(), items: [] };



  //adds trees to board
  board.info[18][1] = { data: "0", color: "#333", icon: null, items: [new Tree().sca(.8).alp(.9)] };
  board.info[4][1] = { data: "0", color: "#333", icon: null, items: [new Tree().sca(.8).alp(.9)] };
  board.info[9][1] = { data: "0", color: "#acd241", icon: null, items: [new Tree().sca(.8).alp(.9)] };
  board.info[5][20] = { data: "0", color: "#acd241", icon: null, items: [new Tree().sca(.8).alp(.9)] };
  board.info[2][15] = { data: "0", color: "#acd241", icon: null, items: [new Tree().sca(.8).alp(.9)] };
  board.info[5][14] = { data: "0", color: "#acd241", icon: null, items: [new Tree().sca(.8).alp(.9)] };
  board.info[2][19] = { data: "0", color: "#acd241", icon: null, items: [new Tree().sca(.8).alp(.9)] };



  //adds all traffic lights on board
  var trafficLight1 = new TrafficLight().sca(.6);
  var trafficLight2 = new TrafficLight().sca(.6);
  var trafficLight3 = new TrafficLight().sca(.6);
  var trafficLight4 = new TrafficLight().sca(.6);
  var trafficLight5 = new TrafficLight().sca(.6);
  var trafficLight6 = new TrafficLight().sca(.6);
  var trafficLight7 = new TrafficLight().sca(.6);
  var trafficLight8 = new TrafficLight().sca(.6);
  var trafficLight9 = new TrafficLight().sca(.6);

  board.add(trafficLight1, 2, 3);
  board.add(trafficLight2, 0, 12);
  board.add(trafficLight3, 15, 24);
  board.add(trafficLight4, 19, 22);
  board.add(trafficLight5, 10, 6);
  board.add(trafficLight6, 13, 9);
  board.add(trafficLight7, 9, 18);
  board.add(trafficLight8, 3, 14);
  board.add(trafficLight9, 12, 14);

  board.info[3][2] = { data: "x", color: "#707070", icon: null, items: [new TrafficLight().sca(.6)] };
  board.info[12][0] = { data: "x", color: "#707070", icon: null, items: [new TrafficLight().sca(.6)] };
  board.info[24][15] = { data: "x", color: "#707070", icon: null, items: [new TrafficLight().sca(.6)] };
  board.info[22][19] = { data: "x", color: "#707070", icon: null, items: [new TrafficLight().sca(.6)] };
  board.info[6][10] = { data: "x", color: "#707070", icon: null, items: [new TrafficLight().sca(.6)] };
  board.info[9][13] = { data: "x", color: "#707070", icon: null, items: [new TrafficLight().sca(.6)] };
  board.info[9][18] = { data: "x", color: "#707070", icon: null, items: [new TrafficLight().sca(.6)] };
  board.info[14][3] = { data: "r", color: "#707070", icon: asset("3.png").sca(.15).clone(), items: [new TrafficLight().sca(.6)] };
  board.info[14][12] = { data: "r", color: "#707070", icon: asset("1.png").sca(.15), items: [new TrafficLight().sca(.6)] };



  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // CURVE BALL UI
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

var cb1 = `Heat 
Subtract spaces: 
-2 for bike or scooter
-1 for walk`;

var cb2 = `Snow
Subtract spaces: 
-2 for bike or scooter
-1 for bus
-4 for car`;

var cb3 = `Rain
Subtract spaces: 
-2 for bike or scooter
-1 for bus
-4 for car`;

var cb4 = `Traffic
Subtract or add spaces: 
+1 for walk
+1 for bike or scooter
-3 for bus`;

var cb5 = `High Gas
Subtract or add money: 
-$10 extra for car
-$1 extra for bus`;

var cb6 = `Flat Tire
Subtract spaces: 
-7 for car
-4 for bus`;

var cb7 = `Free Scooter Ride
Change mode to scooter
& write $0 in cost for 
this turn`;

var cb8 = `Late Bus
Subtract spaces: 
-4 for bus`;

var cb9 = `Sunny Day

Add 4 spaces`;


var cb10 = `Great Breakfast

Add 5 spaces`;

  var cbLabel = new Label({
    text: "",
    size: 18,
    font: "Alata",
    labelWidth: 250,
    shiftVertical: -80,
    align: "center",
    lineHeight: 25,

  });


  var curveBallPane = new Pane({
    label: cbLabel,
    width: 300,
    height: 240,
    corner: 15,
    backdropClose: false,
    displayClose: false,
  });

  var closeCB = new Button({
    label: btnlabel,
    width: 100,
    height: 50,
    backgroundColor: "#2C57A0",
    rollBackgroundColor: "#244682",
    corner: 10,
  }).tap(function () {
    curveBallPane.hide();
  });

  closeCB.center(curveBallPane).pos(null, 165);


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // PLAYER INFO UI
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  var playerInfo = new Rectangle({
    width: 150,
    height: 150,
    color: "white",
    corner: 10,
  });
  playerInfo.pos({ x: 20, y: 110, vertical: "bottom" });

  var player1Label = new Label({
    text: "Player 1",
    size: 12,
    font: "Alata",
    labelWidth: 250,
    shiftVertical: -30,
    align: "center",
    lineHeight: 25,

  });
  var player2Label = new Label({
    text: "Player 2",
    size: 12,
    font: "Alata",
    labelWidth: 250,
    shiftVertical: -30,
    align: "center",
    lineHeight: 25,

  });
  var player3Label = new Label({
    text: "Player 3",
    size: 12,
    font: "Alata",
    labelWidth: 250,
    shiftVertical: -30,
    align: "center",
    lineHeight: 25,

  });
  var player4Label = new Label({
    text: "Player 4",
    size: 12,
    font: "Alata",
    labelWidth: 250,
    shiftVertical: -30,
    align: "center",
    lineHeight: 25,

  });

  //player avatars
  listofPlayers[0].clone().sca(.45).center(playerInfo).pos(20, 20);
//   listofPlayers[1].clone().sca(.45).center(playerInfo).pos(20, 50);
//   listofPlayers[2].clone().sca(.45).center(playerInfo).pos(20,80);
//   listofPlayers[3].clone().sca(.45).center(playerInfo).pos(20,110);

  //labels for player numbers
  player1Label.center(playerInfo).pos(40, 48);
//   player2Label.center(playerInfo).pos(40, 78);
//   player3Label.center(playerInfo).pos(40, 108);
//   player4Label.center(playerInfo).pos(40, 138);


  var circle1 = new Circle(5, "white");
  circle1.center(playerInfo).pos(110, 30);

  var circle2 = new Circle(5, "white");
  circle2.center(playerInfo).pos(110, 60);

  var circle3 = new Circle(5, "white");
  circle3.center(playerInfo).pos(110, 90);

  var circle4 = new Circle(5, "white");
  circle4.center(playerInfo).pos(110, 120);


  // setTimeout(setReady, 10000);

  setReady(playerTurn);

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // HELP BUTTON / MAP KEY
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  let helpIcon = frame.asset("assets/help.png").center();

  var helpBtn = new Button({
    width: 50,
    height: 50,
    backgroundColor: "white",
    rollBackgroundColor: "#f5f5f5",
    corner: 25,
    icon: helpIcon,
  }).tap(function () {
    helpPane.show();
  });

  helpBtn.pos({
    x: 20,
    y: 50,
    vertical: "bottom",
    horizontal: "right",
    index: 0,
  });

  var helpPane = new Pane({
    width: 600,
    height: 600,
    corner: 15,
  });



  //map key label
  new Label({
    text: "Map Key",
    size: 25,
    font: "Alata",
  }).center(helpPane).pos(null, 40);


  //icon for road
  new Rectangle(30, 30, "#707070").center(helpPane).pos(65, 90);

  new Label({
    text: `Road - walk, 
bike, car &
scooter only`,
    size: 14,
    font: "Alata",
  }).center(helpPane).pos(40, 140);

  //icon for grass
  new Rectangle(30, 30, "#acd241").center(helpPane).pos(190, 90);

  new Label({
    text: `Grass - walk & 
bike only`,
    size: 14,
    font: "Alata",
  }).center(helpPane).pos(160, 140);

  //icon for bus line
  asset("assets/3.png").sca(.25).center(helpPane).pos(330, 90);

  new Label({
    text: `Bus Line - walk,
bus & car only`,
    size: 14,
    font: "Alata",
  }).center(helpPane).pos(300, 140);


  //icon for highway
  new Rectangle(30, 30, "#555555").center(helpPane).pos(490, 90);
  asset("assets/tile5.png").sca(.7).center(helpPane).pos(490, 90);

  new Label({
    text: `Highway - car only`,
    size: 14,
    font: "Alata",
  }).center(helpPane).pos(450, 140);


  //modes of transportation label
  new Label({
    text: "Modes of Transportation",
    size: 25,
    font: "Alata",
  }).center(helpPane).pos(null, 210);


  //labels for mode of transport
  new Label({
text: `CO2 Impact: 0
Cost: Free
Spaces: 1
Calories: 21`,
size: 12,
font: "Alata",
  }).center(helpPane).pos(20, 300);

new Label({
text: `CO2 Impact: 0
Cost: $1
Spaces: 2
Calories 27`,
size: 12,
font: "Alata",
  }).center(helpPane).pos(140, 300);

new Label({
text: `CO2 Impact: 6
Cost: $4
Spaces: 4
Calories: 1.6`,
size: 12,
font: "Alata",
  }).center(helpPane).pos(260, 300);


new Label({
text: `CO2 Impact: 0
Cost: $3   
Spaces: 3
Calories: 1.8`,
size: 12,
font: "Alata",
}).center(helpPane).pos(380, 300);

new Label({
text: `CO2 Impact: 10
Cost: $8
Spaces: 5
Calories: 3`,
size: 12,
font: "Alata",
  }).center(helpPane).pos(500, 300);


  //icons for mode of transportation
  asset("walk.png").sca(.8).center(helpPane).pos(50, 260);
  asset("bike.png").sca(.8).center(helpPane).pos(170, 260);
  asset("bus.png").sca(.8).center(helpPane).pos(280, 260);
  asset("scooter.png").sca(.8).center(helpPane).pos(400, 260);
  asset("car.png").sca(.8).center(helpPane).pos(520, 260);



  //How to Play Label
  new Label({
    text: "How To Play",
    size: 25,
    font: "Alata",
  }).center(helpPane).pos(null, 390);

  new Label({
    text: "At the beginnning of the game each player will be given a random location and a random budget which the player will need to use to their advantage to get to their destinations. The goal of this game is to get to these destinations, in order, first. You must visit the school first, park second, and lastly the library. Whoever visits all places first, wins. Be mindful of your budget, calories, and CO2 impact all while playing this game as this is also important.",
    size: 14,
    font: "Alata",
    labelWidth: 550,
    align: "center"
  }).center(helpPane).pos(null, 430);



  //icons for destinations
  asset("school.png").sca(.7).center(helpPane).pos(240, 530);
  asset("park.png").sca(.7).center(helpPane).pos(300, 530);
  asset("library.png").sca(.7).center(helpPane).pos(360, 530);


  //labels for destinations
  new Label({
    text: "School",
    size: 12,
    font: "Alata",
    labelWidth: 550,
    align: "center",
  }).center(helpPane).pos(230, 560);


  new Label({
    text: "Park",
    size: 12,
    font: "Alata",
    labelWidth: 550,
    align: "center",
  }).center(helpPane).pos(300, 560);

  new Label({
    text: "Library",
    size: 12,
    font: "Alata",
    labelWidth: 550,
    align: "center",
  }).center(helpPane).pos(350, 560);


  board.update();

  stage.update(); // this is needed to show any changes
}); // end ready
