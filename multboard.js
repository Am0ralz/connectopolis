import { data } from "./info.js";
import { DiffTree, TrafficLight } from "./objects.js";
import setupScorecardUI from "./setupScorecardUI.js";
var gameId = localStorage.getItem("gameId");
console.log(gameId)

// code from Zim dude's turn.html
var scaling = "full"; 
// var width = 1024;
// var height = 768;
var color = light;
var outerColor = darker;
var socket;
var waiter;
var board;
var listofPlayers = [];
let numOfPlayers = 4;
var playerTurn = 0;
var playerIds = [];
var myPlayer;
var myId;
var lablabel;
var onstart;
var path;


var playerInfo = new Rectangle({
  width: 150,
  height: 150,
  color: "white",
  corner: 10,
});


var newPlayerLabel;

// Characters placement cards and Budget Cards setup 
let loc = ["Rural", "Suburban", "Urban", "Downtown"];
let budget = [5, 15, 25, 50];
let locPos = { "Rural": { x: 20, y: 0 }, "Suburban": { x: 21, y: 15 }, "Urban": { x: 3, y: 16 }, "Downtown": { x: 2, y: 1 } }

var scoreCardPane;

let 
// des1, des2, des3, 
  budget1, budget2, budget3, 
  calories1, calories2, calories3, 
  cimpact1, cimpact2, cimpact3,
  cost1, cost2, cost3,
  transit1, transit2, transit3,
  curve1, curve2, curve3
  


  function UpdateScoreUI(plyr){
    console.log("should update score UI")
    console.log("player scores are", plyr.scores)
    let tmpScores;
    if (plyr.scores.length > 3){
      tmpScores = plyr.scores.slice(plyr.scores.length - 3);
      console.log(tmpScores);
    }
  else{
    tmpScores = plyr.scores.slice(0);
    console.log(tmpScores);
  }
    // des1.text = tmpScores[0].Destination.x +","+tmpScores[0].Destination.y;
    transit1.text = tmpScores[0].TransitMode;
    curve1.text = tmpScores[0].CurveBall;
    cost1.text = tmpScores[0].Cost
    cimpact1.text = tmpScores[0].CO2
    calories1.text = tmpScores[0].Calories
    budget1.text = "$" + tmpScores[0].Budget
    
  if (plyr.scores.length > 1){
    // des2.text = tmpScores[1].Destination.x +","+tmpScores[1].Destination.y;
    transit2.text = tmpScores[1].TransitMode
    curve2.text = tmpScores[1].CurveBall
    cost2.text = tmpScores[1].Cost
    cimpact2.text = tmpScores[1].CO2
    calories2.text = tmpScores[1].Calories
    budget2.text = "$" + tmpScores[1].Budget
  }
  if (plyr.scores.length > 2){
    // des3.text = tmpScores[2].Destination.x +","+tmpScores[2].Destination.y;
    transit3.text = tmpScores[2].TransitMode
    curve3.text = tmpScores[2].CurveBall
    cost3.text = tmpScores[2].Cost
    cimpact3.text = tmpScores[2].CO2
    calories3.text = tmpScores[2].Calories
    budget3.text = "$" + tmpScores[2].Budget
    
  }
  }

function updateTurn(turn, num) {
  console.log("should update turn")
  let playerTurn = turn;
  playerTurn++;
  if (playerTurn === num) {
    playerTurn = 0;
  }
   socket.setProperty("playerTurn", playerTurn)
  // setReady(playerTurn);
  return playerTurn;
}

function findMyIndex(){
  var my_index = playerIds.findIndex((element)=>element === myId)
  // console.log(myId)
  return my_index;
}

  var circle1 = new Circle(5, "white");
  var circle2 = new Circle(5, "white");
  var circle3 = new Circle(5, "white");
  var circle4 = new Circle(5, "white");
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
    // stage.update();
  }


var frame = new Frame({
  scaling: scaling,
  color: color,
  outerColor: outerColor,
  assets: [
    { src: "https://fonts.googleapis.com/css2?family=Alata" },
    
  ],
});


frame.on("ready", function() {
    zog("ready from ZIM Frame");

    var stage = frame.stage;
    var stageW = frame.width;
    var stageH = frame.height;
    
    // In this case, we are going to auto start the game when there are three people 
    // We want the players to only play with the players who were there at the start of the game 
    // Normally, this is accomplished by setting the maxNum param to three and the fill param to false 
    // But then if someone leaves before we reach three people we will not start with a three person game 
    // The answer is to create a waiting room and let it fill until there are three people 
    // Then switch the three people to the game room - that has a max of 3 with no fill

    // get the app name here: https://zimjs.com/request.html
    var appName = "cnctpls";
    var roomName = gameId ? gameId:"waiting"
	  socket = new zim.Socket(zimSocketURL, appName, roomName); 
    // as this room fills with people they are sent to the game room when there are three
    
    var maxNum = 4;
    // var minNum =
    // var instructions = new Label({
    //     text:"Waiting: play will begin when there are " + maxNum + " players",
    //     align:CENTER
    // }).alp(.7).pos(0,280,CENTER);    
    
    
    socket.on("ready", function() {
      console.log("in first socket ready")

        zogg("connected");
        
        // we will adjust this in the setNum() function
        var number = new Label({        
            text:"Waiting for players to connect...",
            align:"center",
            font: "Alata",

        }).center();
        
        // the socket.size gives the number of others in the socket (not including you)    
        // if we reach the number we want then it is game time!
        if (socket.size+1 == maxNum) {
            socket.setProperty("play", 1); // tell others it is time to play
            // setGame() will be called in the data event for all the others 
            // but for this player, they will not receive a data event 
            // as they are the one that is sending the data 
            // so we need to call the setGame() directly
            setGame(); // set up our game
        } else {
            setNum();  
        }

      // var timer = new Timer({
      //     time:60,
      //     borderColor:dark,
      //     isometric:"left"
      // }).loc(27, 231, stage, 0); // .place();
      // timer.on("complete",()=>{
      //   if(socket.size+1 >= 3){
      //         // maxNum = socket.size + 1
      //         socket.setProperty("play", 1)
      //         setGame();
      //   }
      //     stage.update();
      // });
      // function timedText() {
      //   setTimeout(myTimeout1, 20000) 
      // // }
      // function myTimeout1() {
      //   if(socket.size+1 >= 2){
      //     socket.setProperty("play", 1)
      //     setGame();
      //   }
      //   else{
      //     console.log("ehhhhhhhhhhhh")
      //   }
      // }

    
    function setNum() {
    number.text = `Waiting for players to connect...
   
Players connected : ${socket.size + 1}`;
    stage.update();
    } 
        
        function setGame() {            
            // swap player to new room called game 
            // this room will fill up three at a time 
            // and not fill in when someone leaves
            number.removeFrom()
            // timer.removeFrom()
            // (()=>{
            socket.changeRoom(appName, "game", maxNum, false)
            // }, 10000);
            // we need to wait until the player changes rooms 
            // before continuing - so set a roomchange event
            waiter = new Waiter({
              corner:5,
              backgroundColor: "#2C57A0"
            }).show();    
        

            socket.on("roomchange", showGameBoard);
        }     
        
        // this button is shown for the current player 
        // so make and position it but then remove it
        // until we know if we are the current player inside the game function
        
    
        // this event gets called every time another player sets a property
        // we receive the property (or properties) as a parameter (collected as d)
        socket.on("data", function (data) {
          console.log("in first socket onData")
          console.log(data)

          if (data.play) setGame(); // we have enough players!

          if (data.newPlayerInfo){
            console.log("received new player info:", data.newPlayerInfo)
            // board = data.board; // reset board
            // var newList = JSON.parse(data.list)
            let {player_location, player_budget} = data.newPlayerInfo
            const newplayer = new Player(player_location, player_budget, data.id).sca(0.6).top();
            playerIds = listofPlayers.map((player)=> player.id)
            findMyIndex()
          if(listofPlayers.length < socket.size+1){
            if(!playerIds.includes(data.id)){
              listofPlayers.push(newplayer)
              console.log("my list is now:", listofPlayers)
              console.log(listofPlayers)     
              console.log(socket.size + 1) 
            }
      // listofPlayers.concat(newList);
          }

          if(listofPlayers.length == socket.size+1){
            console.log("received all connected users")
            listofPlayers.sort((a, b) => (a.id > b.id) ? 1 : -1)
            playerIds = listofPlayers.map((player)=> player.id)
            console.log("my index is:", findMyIndex())

            console.log("sorted array:", listofPlayers)
            listofPlayers.forEach((new_player, index) => {
          
              new_player.budget = budget[index]
              var player_loc = loc[index]
              new_player.startPosition = locPos[player_loc]



              board.add(new_player, new_player.startPosition["x"], new_player.startPosition["y"]);

                if (index == findMyIndex()){
                  console.log("the socket is saying", index, findMyIndex())
                  myPlayer.budget = budget[index]
                  myPlayer.startPosition = locPos[player_loc]
                  myPlayer.scores[0] = {
                    Destination: locPos[player_loc],
                    TransitMode: "",
                    CurveBall: "",
                    Budget: budget[index],
                    Cost: 0,
                    CO2: 0,
                    Calories: 0,
                  }


                  lablabel.text = `Your location is ${loc[findMyIndex()]} and your budget is $${myPlayer.budget}`
                  
                  onstart.show().pos({
                    index: 1000,
                  })

                  console.log(myPlayer.budget, myPlayer.startPosition)
                  console.log("I should have the right budget!")
                  UpdateScoreUI(myPlayer)
                  stage.update()
               }


              var yPosition = 20 + (30 * index)
              new_player.clone().sca(.45).center(playerInfo).pos(20, yPosition);


              newPlayerLabel = new Label({
                text: findMyIndex() == index ? "My Player" : `Player ${index + 1}`,
                size: 12,
                font: "Alata",
                labelWidth: 250,
                shiftVertical: -30,
                align: "center",
                lineHeight: 25,
  
              });

              yPosition = 48 + (30 * index)

              newPlayerLabel.center(playerInfo).pos(40, yPosition);
              console.log("board should update...")
              stage.update()
            })
            // console.log("should see a healthy list", listofPlayers)
            // board.clearData("Player")
          }

           //we sent data because a player is moving
    
           stage.update()
        }

        if (data.path && data.mode) {
          console.log("someone made a move!")
          // playerIds.findIndex()
          board.followPath(listofPlayers[playerTurn], data.path, null, null); // nudge camera 2

            //Record path for Curveballs
            listofPlayers[playerTurn].tracker(data.path);

            //Where the score card get updated//
            listofPlayers[playerTurn].updatePlayerInfo(data.path, data.mode);

            
            //socket.setProperty("playerTurn", playerTurn)

            stage.update();              
        }

        if (data.playerTurn != null){
          // console.log("playerTurn is:", playerTurn)
          console.log(data)
          console.log("socket received new player turn", data.playerTurn)
          playerTurn = data.playerTurn;
          setReady(data.playerTurn);
          stage.update();
  

        }
        
      });
        
    
    
    socket.on("otherjoin", function (d) { 
      console.log("in first socket otherjoin")

      setNum(); // adjust our connections number when someone arrives   
    });
        
    
    socket.on("error", function () {
        instructions.text = "Sorry, error connecting";
        stage.update();
    });

    stage.update(); // this is needed to show any changes

}); // end of ready
});


// Create a function to render and play Connectopolis board game
const showGameBoard = () => {

console.log(firebase);





ZIMONON = true;

///function to shuffle arrays arround///
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
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
// document.getElementById("myCanvas").remove()

 frame = new Frame({
  scaling: "test",
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
    "skip.png",
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

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // LOCATION AND BUDGET STARTUP CARD
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// zimSocketURL is a dynamic link to the ZIM Socket server in case it changes location 
	// it is stored in one of the js files we have imported
	// then we pass in the id that we set up at https://zimjs.com/request.html
  
  // const socket = new Socket(zimSocketURL, "connectopolis", "waiting");

  
  waiter.hide();
  
      
  lablabel = new Label({
    text: "",
    size: 20,
    font: "Alata",
    labelWidth: 250,
    shiftVertical: -30,
    align: "center",
  });

 onstart = new Pane({
    label: lablabel,
    width: 300,
    height: 200,
    backdropClose: false,
    displayClose: false,
    corner: 15,
  });


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

  // if(socket.getProperties("board")){
  //   console.log("conditionalllll")
  //   console.log(socket.getProperties("board"))
  // }

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

    //scorecard pane that will show the players score
    scoreCardPane = new Pane({
      width: 500,
      height: 460,
      backgroundColor: "white",
      corner: 0,
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
    console.log("should show")
    console.log(scoreCardPane)
    scoreCardPane.show();
  });

  scoreCardBtn.pos({ x: 20, y: 50, index: 0 });

  ({ budget1, budget2, budget3, 
    calories1, calories2, calories3, 
    cimpact1, cimpact2, cimpact3,
    cost1, cost2, cost3,
    transit1, transit2, transit3,
    curve1, curve2, curve3}
    = setupScorecardUI(scoreCardPane))



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

  playerTurn = 0;
  if (listofPlayers.length != parseInt(numOfPlayers)) {
    console.log("creating my player")
    var player_location = locPos[loc[0]]
    var player_budget = budget[0]
    myPlayer = new Player(player_location, player_budget, 0).sca(0.6).top();

    var my = socket.getMyData()
    console.log("my data is...", my)

    myPlayer.id = my.id
    myId = my.id
    console.log("my index is:", findMyIndex())

    // board.add(myPlayer, myPlayer.startPosition["x"], myPlayer.startPosition["y"]);

    listofPlayers.push(myPlayer)

    if(listofPlayers.length == socket.size+1){
      console.log("received all connected users after creation")
      listofPlayers.sort((a, b) => (a.id > b.id) ? 1 : -1)
      playerIds = listofPlayers.map((player)=> player.id)
      console.log("sorted array:", listofPlayers)
      listofPlayers.forEach((new_player, index) => {
        new_player.budget = budget[index]
        var player_loc = loc[index]
        new_player.startPosition = locPos[player_loc]

        console.log("the indeces", index, findMyIndex())
        if (index == findMyIndex()){
          console.log("should be updating my player budget")
          myPlayer.setBudget(budget[index])
          myPlayer.startPosition = locPos[player_loc]
          myPlayer.scores[0] = {
            Destination: locPos[player_loc],
            TransitMode: "",
            CurveBall: "",
            Budget: budget[index],
            Cost: 0,
            CO2: 0,
            Calories: 0,
          }
          console.log(myPlayer.budget, myPlayer.startPosition)
          UpdateScoreUI(myPlayer)


          
         
       }

        var yPosition = 20 + (30 * index)
        new_player.clone().sca(.45).center(playerInfo).pos(20, yPosition);


      

        newPlayerLabel = new Label({
          text: findMyIndex() == index ? "My Player" : `Player ${index + 1}`,
          size: 12,
          font: "Alata",
          labelWidth: 250,
          shiftVertical: -30,
          align: "center",
          lineHeight: 25,

        });

       yPosition = 48 + (30 * index)

        newPlayerLabel.center(playerInfo).pos(40, yPosition);
       

      
      
        board.add(new_player, new_player.startPosition["x"], new_player.startPosition["y"]);
        console.log("board should update...")
        stage.update()
      })

      // console.log("should see a healthy list", listofPlayers)
      // board.clearData("Player")
    }
      UpdateScoreUI(myPlayer)
      stage.update()
      socket.setProperty("newPlayerInfo", {player_location, player_budget})


    // socket.setProperties({board: JSON.prune(board), list: JSON.prune(listofPlayers), playerTurn: JSON.prune(playerTurn)})

    // listofPlayers.push(player2)
  }

    console.log("my player is!!!!!", myPlayer)
    
    myPlayer.on("moving", () => {
      console.log("my player is moving")
      if (board.getItems(myPlayer.boardTile)[0].type == "TrafficLight" && !myPlayer.hitCurveBall && !myPlayer.secondturn) {
        myPlayer.hitCurveBall = true

      }
      
    });


    myPlayer.on("movingdone", () => {
     
      console.log("my player stopped moving")

      if (walkBtn.enabled == false) {
        walkBtn.enabled = true;
        bikeBtn.enabled = true;
        busBtn.enabled = true;
        scooterBtn.enabled = true;
        carBtn.enabled = true;

      }

      if (!myPlayer.hitCurveBall) {
        if (!myPlayer.didWin()) {
          myPlayer.secondturn = false;
          playerTurn = updateTurn(playerTurn, numOfPlayers);
          setReady(playerTurn);
          UpdateScoreUI(myPlayer);
          // socket.setProperty("playerTurn", playerTurn)

          mode = "Walk"
          AI.setAcceptableTiles(tilesLimits["Walk"]);
          walkBtn.backgroundColor = "#ccc";
          bikeBtn.backgroundColor = "white";
          busBtn.backgroundColor = "white";
          scooterBtn.backgroundColor = "white";
          carBtn.backgroundColor = "white";

        } else {
          alert("player" + (myPlayer.id) + " won!!!!! Congratulations I hope you play again!");
        }
      } else {

        // socket.setProperties({mode, path})
        curveBall(mode, myPlayer);
        

      }
    });

  

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




  board.on("change", () => {
    console.log("in on change")
    // change triggers when rolled over square changes
    // if(!checkIfMyTurn())
    if (myPlayer.moving) return;
    // if(playerTurn == )
    // get the index of our player

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
      myPlayer.boardCol, // any board item has a boardCol prop
      myPlayer.boardRow,
      board.currentTile.boardCol, // any tile has a boardColo prop
      board.currentTile.boardRow,
      function (thePath) {
        // the callback function when path is found
        if (thePath) {
          ////// This where we set the path according to the Mode/////
          path = thePath.slice(0, myPlayer.modes[mode].spaces + 1);

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
// TODO: change listofplayers to myPlayer, play with playerIds idea 

  board.tiles.tap((e) => {
    if(!checkIfMyTurn()) return;
    if (myPlayer.moving) return; // moving pieces given moving property
    if (path) {
      if (myPlayer.moneyMove(mode)) {
        console.log("board was tapped and player is moving", myPlayer)


        board.followPath(myPlayer, path, null, null); // nudge camera 2

        //Record path for Curveballs
        myPlayer.tracker(path);

        //Where the score card get updated//
        myPlayer.updatePlayerInfo(path, mode);

        //update the socket
        console.log("should send movement data to socket")

        socket.setProperties({path,mode})

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

  function checkIfMyTurn(){
   var myIndex = findMyIndex()
    
    if(playerTurn == myIndex ){

      return true;
    } else{
      return false;
    }

  }


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // CURVE BALL
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~



  function curveBall(md, plyr) {
    console.log("inside curveballs")

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
          // socket.setProperty("playerTurn", playerTurn)

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
          // socket.setProperty("playerTurn", playerTurn)
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
        // socket.setProperty("playerTurn", playerTurn)
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
          // socket.setProperty("playerTurn", playerTurn)
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
          // socket.setProperty("playerTurn", playerTurn)
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
          // socket.setProperty("playerTurn", playerTurn)
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
          // socket.setProperty("playerTurn", playerTurn)
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


  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // UI FOR BUTTONS FOR MODE OF TRANSPORT
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  //icons for mode of transport
  let walkIcon = asset("assets/walk.png").pos(14, 15).sca(0.65);
  let bikeIcon = asset("assets/bike.png").pos(14, 15).sca(0.65);
  let carIcon = asset("assets/car.png").pos(14, 15).sca(0.65);
  let scooterIcon = asset("assets/scooter.png").pos(14, 15).sca(0.65);
  let busIcon = asset("assets/bus.png").pos(14, 15).sca(0.65);
  let skipIcon = asset("assets/skip.png").pos(14, 15).sca(0.65);


  //buttons for mode of transport
  var walkBtn = new Button({
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
    width: 50,
    height: 50,
    backgroundColor: "white",
    rollBackgroundColor: "#f5f5f5",
    corner: 10,
    icon: carIcon,
    indent: 20,
    align: "right",
  });


  var skipBtn = new Button({
    width: 50,
    height: 50,
    backgroundColor: "white",
    rollBackgroundColor: "#f5f5f5",
    corner: 10,
    icon: skipIcon,
    indent: 20,
    align: "right",
  });


  //displays buttons on right side of screen
  walkBtn.pos({ horizontal: "right", x: 20, y: 50, index: 0 });
  bikeBtn.pos({ horizontal: "right", x: 20, y: 130, index: 0 });
  busBtn.pos({ horizontal: "right", x: 20, y: 210, index: 0 });
  scooterBtn.pos({ horizontal: "right", x: 20, y: 290, index: 0 });
  carBtn.pos({ horizontal: "right", x: 20, y: 370, index: 0 });
  skipBtn.pos({ horizontal: "right", x: 20, y: 450, index: 0 });


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
    skipBtn.backgroundColor = "white";

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
    skipBtn.backgroundColor = "white";

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
    skipBtn.backgroundColor = "white";

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
    skipBtn.backgroundColor = "white";

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
    skipBtn.backgroundColor = "white";

  });


  skipBtn.on("click", function () {
    mode = "Skip";
    AI.setAcceptableTiles(tilesLimits[mode]);

    //changes the background color for the chosen mode transport
    walkBtn.backgroundColor = "white";
    bikeBtn.backgroundColor = "white";
    busBtn.backgroundColor = "white";
    scooterBtn.backgroundColor = "white";
    carBtn.backgroundColor = "white";
    skipBtn.backgroundColor = "#ccc";
  });
  UpdateScoreUI(myPlayer);
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
    label: btnlabel.clone(),
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

  // var playerInfo = new Rectangle({
  //   width: 150,
  //   height: 150,
  //   color: "white",
  //   corner: 10,
  // });
  playerInfo.pos({ x: 20, y: 110, vertical: "bottom" });

  var playerLabel = new Label({
    text: "My Player",
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
  var myID = myPlayer.id
  var my_index = playerIds.findIndex((id)=> id == myID)






  
  // listofPlayers[0].sca(.45).center(playerInfo).pos(20, 20);
  // listofPlayers[1].clone().sca(.45).center(playerInfo).pos(20, 50);
  // listofPlayers[2].clone().sca(.45).center(playerInfo).pos(20,80);
  // listofPlayers[3].clone().sca(.45).center(playerInfo).pos(20,110);

  //labels for player numbers
  // playerLabel.center(playerInfo).pos(40, 48);
  // player2Label.center(playerInfo).pos(40, 78);
  // player3Label.center(playerInfo).pos(40, 108);
  // player4Label.center(playerInfo).pos(40, 138);



  circle1.center(playerInfo).pos(110, 30);

  circle2.center(playerInfo).pos(110, 60);

  circle3.center(playerInfo).pos(110, 90);

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
    width: 650,
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


  //icon for buildings
  new Rectangle(30, 30, "#333333").center(helpPane).pos(190, 90);

  new Label({
text: `Building - no 
mode allowed
on this tile`,
size: 14,
font: "Alata",
  }).center(helpPane).pos(160, 140);

  //icon for grass
  new Rectangle(30, 30, "#acd241").center(helpPane).pos(320, 90);

  new Label({
    text: `Grass - walk & 
bike only`,
    size: 14,
    font: "Alata",
  }).center(helpPane).pos(290, 140);



    //icon for highway
    new Rectangle(30, 30, "#555555").center(helpPane).pos(440, 90);
    asset("assets/tile5.png").sca(.7).center(helpPane).pos(440, 90);
  
new Label({
text: `Highway -  
car only`,
size: 14,
font: "Alata",
}).center(helpPane).pos(420, 140);

    
  //icon for bus line
  asset("assets/3.png").sca(.25).center(helpPane).pos(540, 90);

  new Label({
    text: `Bus Line - bus,
walk & car only`,
    size: 14,
    font: "Alata",
  }).center(helpPane).pos(510, 140);




  //modes of transportation label
  new Label({
    text: "Modes of Transportation",
    size: 25,
    font: "Alata",
  }).center(helpPane).pos(null, 210);


  //labels for mode of transport
new Label({
text: `Cost:
Spaces:
C02 Impact: 
Calories:`,
size: 12,
font: "Alata",
}).center(helpPane).pos(50, 300);

new Label({
text: `$0
 1
 0
21`,
size: 12,
font: "Alata",
}).center(helpPane).pos(160, 300);

new Label({
text: `$1
 2
 0
27`,
size: 12,
font: "Alata",
}).center(helpPane).pos(240, 300);


new Label({
text: `$4
 4 
 6
1.6`,
size: 12,
font: "Alata",
}).center(helpPane).pos(320, 300);

new Label({
text: `$3
 3
 0
1.8`,
font: "Alata",
size: 12,
}).center(helpPane).pos(400, 300);


new Label({
text: `$8
 5
10
 3`,
size: 12,
font: "Alata",
}).center(helpPane).pos(480, 300);

  //icons for mode of transportation
  asset("walk.png").sca(.8).center(helpPane).pos(160, 260);
  asset("bike.png").sca(.8).center(helpPane).pos(230, 260);
  asset("bus.png").sca(.8).center(helpPane).pos(310, 260);
  asset("scooter.png").sca(.8).center(helpPane).pos(390, 260);
  asset("car.png").sca(.8).center(helpPane).pos(470, 260);



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

}