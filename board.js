const frame = new Frame({
    scaling:"fit",
    width:1924,
    height:768,
    color:light,
    outerColor: dark
});

frame.on("ready", () => {
    const stage = frame.stage;
    let stageW = frame.width;
    let stageH = frame.height;
    frame.outerColor = "#444";
    frame.color = "#ddd";
    
    var board = new Board(
      {
      num:25,
      size:20,
      arrows: true,
}
).center();

    var tile = board.getTile(19,9);
    board.setColor(tile,red);




  // var holder = new Container();

  // var tiles = new Tile(
  //   new Rectangle(20, 20, frame.light, frame.dark).centerReg({ add: false }), 25, 25 )
  //   .rot(45)
  //   .addTo(holder);

  //   holder.sca(2, 1).center();

  // //on mouse over changes tile to pink
  // tiles.on("mouseover", function (e) {
  //   e.target.color = frame.pink;
  //   stage.update();
  // });

  // //on mouse out goes back to oringal tile color or light color
  // tiles.on("mouseout", function (e) {
  //   e.target.color = frame.light;
  //   stage.update();
  // });

  //creates ball with shadow
  var ball = new Circle(15, frame.blue, frame.dark).center().sha();

  tiles.on("click", function (e) {
   
    //this will update the clicks on this rotated stage
    var point = tiles.localToGlobal(e.target.x, e.target.y);
    //this will only update if it isnt rotated
    // ball.pos(point.x, point.y).mov(-20,-35); //.mov will adjust the ball offset x,y to center it

    ball.animate({
      obj: { x: point.x, y: point.y-15 }, 
      time: 500,
      events: true,
    });
    stage.update();
});

  //baseMin, baseMax, targetMin, targetMax, factor
  //this will make the ball appear small towards the back of the stage 
  //and bigger towards front of stage
  var proportion = new Proportion(0, stageH, .8, 1.3);
  
  ball.on("animation", function () {
      ball.sca(proportion.convert(ball.y));
      });


 

stage.update();
});


