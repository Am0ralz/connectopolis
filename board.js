import { data } from "./info.js";

ZIMONON = true;
const frame = new Frame({
  scaling: "fit",
  width: 1924,
  height: 968,
  color: "#ddd",
  outerColor: "#ddd",
});

TIME = "milliseconds";

frame.on("ready", () => {
  const stage = frame.stage;
  const stageW = frame.width;
  const stageH = frame.height;


//creates class for traffic light object
var TrafficLight = function(){

    this.super_constructor();
    this.type = "TrafficLight";
    this.arguments = Array.prototype.slice.call(arguments);

   
    const post = new Rectangle(10, 80, black).centerReg().loc(-5, -40,this); //post for traffic light
    new Circle(10 / 2, black).sca(1, 0.3).centerReg(post).mov(0, 40); //small disk under post to give illusion of 3d post
    new Rectangle(35, 80, black).centerReg().loc(-5, -80,this); //traffic  light
    new Circle(35 / 3, black).sca(1, 0.3).loc(-5, -40,this); //small disk under traffic light
    
    new Circle(8, red).loc(-5, -100,this); //red traffic light
    new Circle(8, yellow).loc(-5, -80,this); //yellow traffic light
    new Circle(8, green).loc(-5, -60,this); //green traffic light
    
  }
  extend(TrafficLight, Container);

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // BOARD
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const board = new Board({
    // num: 20,
    rows: 20,
    cols: 20,
    size: 25,
    // isometric: false,
    info: JSON.stringify(data), // these are the paths from info.js
    borderWidth: 0.2,
    borderColor: "#555555",
    arrows: false,
    indicatorBorderColor: "white",
    indicatorBorderWidth: 1,
  }).center();

  board.tiles.tap((e) => {
    if (player.moving) return; // moving pieces given moving property
    if (path) {
      // because rolled over already
      board.followPath(player, path, null, null, 2); // nudge camera 2
      path = null;
    } else {
      // could be tapping or on mobile with no rollover
      getPath(true);
    }
    stage.update();
  });

  // add a player
  const player = new Person();
  board.add(player, 6, 6);


// add a traffic light
  const trafficLight = new TrafficLight();
  board.add(trafficLight, 8,8);

  
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
        path = thePath;
        Ticker.remove(ticker);
        board.showPath(path);
        if (go) {
          // from a press on the tile
          board.followPath(player, path, null, null, 2); // nudge camera 2
          path = null;
        }
      }
    );
    // must calculate the path in a Ticker
    ticker = Ticker.add(() => {
      AI.calculate();
    });
  }

  stage.update(); // this is needed to show any changes
}); // end ready
