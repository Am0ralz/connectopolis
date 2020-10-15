import { data } from "./info.js";

const frame = new Frame({
  scaling: "fit",
  width: 1924,
  height: 768,
  color: "#ddd",
  outerColor: "#ddd",
});

frame.on("ready", () => {
  const stage = frame.stage;
  const stageW = frame.width;
  const stageH = frame.height;

  //   // frame.loadAssets("build.png");

  //   // frame.on("complete", function(){
  //   //   var pic = frame.asset("build.png");
  //   //   pic.center(stage).rot(-3)
  //   //   stage.update();
  //   // })

  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // BOARD
  // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const board = new Board({
    num: 20,
    size: 25,
    info: JSON.stringify(data), // these are the paths from info.js
    borderWidth: 1,
    // indicatorType: "square",
    // indicatorSize: 5,
    // indicatorColor: "pink",
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
        console.log(path);
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
