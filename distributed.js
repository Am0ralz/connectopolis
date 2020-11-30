// connectopolis game session

import Player from './Player.js';
import {setupGameUI} from './GameUI.js';
import { DiffTree, TrafficLight } from "./objects.js";
import { data } from "./info.js";


console.log(firebase);


var gameId = localStorage.getItem("gameId");
console.log(gameId)


ZIMONON = true;


/*----- constants -----*/

//Mode selecters. Option are  Walk, Bike Bus Scooter or Car. Walk be default.
const tilesLimits = {
    Walk: ["x", "g", "r"],
    Bike: ["x","g"],
    Bus: ["r"],
    Scooter:["x"],
    Car: ["r","o","x"],
    Special: ["x","g","r","o"]
  };

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

const stage = frame.stage;
const stageW = frame.width;
const stageH = frame.height;

TIME = "milliseconds";


// Characters placement cards and Budget Cards setup 
const loc = ["Rural 1", "Suburban 2", "Urban 3", "Downtown 4"];
const budget = [5, 15, 25, 50];
const locPos = { "Rural 1": { x: 20, y: 0 }, "Suburban 2": { x: 21, y: 15 }, "Urban 3": { x: 3, y: 16 }, "Downtown 4": { x: 2, y: 1 } }


/*----- app's state (variables) -----*/
let listofPlayers = [];
let board;
let playerTurn = 0;
let win;
let mode = "Walk";


/*----- game setup functions -----*/

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Utils
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // CURVE BALL
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  function curveBall(md, plyr) {
    let card = Math.floor(Math.random() * 10) + 1;;
    console.log("This card was chosen: " + card)
    plyr.hitCurveBall = false;
    let tmpPath = plyr.pathHist.slice(0)
    let chance = "";
    switch (card) {
      ///Heat/////
      case 1:
        if (md == "Walk") {
          chance = "go back 1 steps";
          alert(chance);
          tmpPath = tmpPath.reverse().slice(0, 2)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;
        } else if (md == "Bike") {
          chance = "go back 2 steps";
          alert(chance);
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
          tmpPath = tmpPath.reverse().slice(0, 3)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;
        }
        else if (md == "Bus") {
          chance = "go back 1 steps";
          tmpPath = tmpPath.reverse().slice(0, 2)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;
        }
        else if (md == "Car") {
          chance = "go back 4 steps";
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
          plyr.budget = plyr.budget - 10;
        }
        if (md == "Bus") {
          chance = "-$1";
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
        }
        console.log(chance)
        break;
      ///Snow////////
      case 5:
        if (md == "Bus") {
          tmpPath = tmpPath.reverse().slice(0, 2)
          board.followPath(plyr, tmpPath, null, null,);
          chance = "go back 1 steps";
          plyr.secondturn = true;
        } else if (md == "Bike") {
          chance = "go back 2 steps";
          tmpPath = tmpPath.reverse().slice(0, 3)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;
        } else if (md == "Scooter") {
          chance = "go back 2 steps";
          tmpPath = tmpPath.reverse().slice(0, 3)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;
        }
        else {
          playerTurn = updateTurn(playerTurn, numOfPlayers);
          setReady(playerTurn);
        }
        console.log(chance)
        break;
      /// Traffic /////
      case 6:
        if (md == "Walk" || "Bike") {
          chance = "go forward 1 steps";
          alert("Move forward 1 step");
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
          tmpPath = tmpPath.reverse().slice(0, 4)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;
        }
        else {
          playerTurn = updateTurn(playerTurn, numOfPlayers);
          setReady(playerTurn);
        }

        console.log(chance)
        break;
      ///Flat Tire ////////
      case 7:
        if (md == "Car") {
          chance = "go back 7 steps";
          tmpPath = tmpPath.reverse().slice(0, 9)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;
        } else if (md == "Bus") {
          chance = "go back 2 steps";
          tmpPath = tmpPath.reverse().slice(0, 3)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;
        } else {
          playerTurn = updateTurn(playerTurn, numOfPlayers);
          setReady(playerTurn);
        }
        console.log(chance)
        break;
      //////Flood /////////
      case 8:
        if (board.getColor(plyr.boardTile) == "#acd241"
        ) {
          chance = "go back 2 steps";
          tmpPath = tmpPath.reverse().slice(0, 3)
          board.followPath(plyr, tmpPath, null, null,);
          plyr.secondturn = true;
        } else {
          playerTurn = updateTurn(playerTurn, numOfPlayers);
          setReady(playerTurn);
        }
        console.log(chance)
        break;
      /////Free Scooter/////
      case 9:
        if (md == "Scooter") {
            chance = "Move again with Scooter";
            alert("Move forward 4 step");
            mode="Scooter"
            walkBtn.enabled = false;
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

        console.log(chance)
        break;
      ////Sunny Day////  
      case 10:
        chance = "go forward 5 steps";
        alert("Move forward 4 step");
        mode = "Scooter"
        AI.setAcceptableTiles(tilesLimits["Special"]);
    

        walkBtn.enabled = false;
        walkBtn.enabled = false;
        bikeBtn.enabled = false;
        busBtn.enabled = false;
        scooterBtn.enabled = false;
        carBtn.enabled = false;

        plyr.secondturn = true;


        break;

      ////Great Breakfast////  
      case 11:
        chance = "go forward 5 steps";
        alert("Move forward 5 step");
        mode = "Car"
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
  }


/*----- event listeners -----*/
frame.on("ready", () => {
    
init()
    

board.on("change", () => {
    // change triggers when rolled over square changes
    if (listofPlayers[playerTurn].moving) return;
    getPath(); // just get path - don't go to path with the go parameter true
  });


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
    alert("not enough money!! Pick a different Mode")
    }
    path = null;
} else {
    // could be tapping or on mobile with no rollover
    getPath(true);
}
stage.update();
});

})
/*----- game play functions -----*/
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Player Creation 
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function createPlayer(){
    //////////////Shuffle loc cards and budget cards so it can be random////////////
        shuffleArray(loc);
        shuffleArray(budget);
        newplayer = new Player(locPos[loc.pop()], budget.pop(), 0).sca(0.6).top();
        board.add(newplayer, newplayer.startPosition["x"], newplayer.startPosition["y"]);
        listofPlayers.push(newplayer)
    
        newplayer.on("moving", () => {
            if (board.getItems(newplayer.boardTile)[0].type == "TrafficLight" && !newplayer.hitCurveBall && !newplayer.secondturn) {
              newplayer.hitCurveBall = true
      
            }
        })
    
        newplayer.on("movingdone", () => {
            if (walkBtn.enabled == false) {
              walkBtn.enabled = true;
              bikeBtn.enabled = true;
              busBtn.enabled = true;
              scooterBtn.enabled = true;
              carBtn.enabled = true;
      
            }
      
            if (!newplayer.hitCurveBall) {
              if (!newplayer.didWin()) {
                newplayer.secondturn = false;
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
                alert("player" + (newplayer.id + 1) + " won!!!!! Congratulations I hope you play again!");
              }
            } else {
      
              curveBall(mode, newplayer);
    
            }
          });
    }
    


function init(){
    // connect to firebase
    // create players
    console.log("init")
    
    
    extend(TrafficLight, Container);
    extend(DiffTree, Container);

    board = new Board({
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
      });;
    
    setupGameUI(frame, board, AI, UpdateScoreUI, mode, listofPlayers)

    setReady(playerTurn);

}

