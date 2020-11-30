export const setupGameUI = (frame, board, AI, UpdateScoreUI, mode, listofPlayers) => {

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

  var cb1 = new Label({
    text: `Heat 
    Subtract spaces: 
    -2 for bike or scooter
    -1 for walk`,
    size: 20,
    font: "Alata",
    labelWidth: 250,
    shiftVertical: -30,
    align: "center",
    lineHeight: 25,
  });

  var cb2 = new Label({
    text: `Snow
    Subtract spaces: 
    -2 for bike or scooter
    -1 for bus
    -4 for car`,
    size: 20,
    font: "Alata",
    labelWidth: 250,
    shiftVertical: -30,
    align: "center",
    lineHeight: 25,

  });

  var cb3 = new Label({
    text: `Rain
    Subtract spaces: 
    -2 for bike or scooter
    -1 for bus
    -4 for car`,
    size: 20,
    font: "Alata",
    labelWidth: 250,
    shiftVertical: -30,
    align: "center",
    lineHeight: 25,

  });

  var cb4 = new Label({
    text: `Traffic
    Subtract or add spaces: 
    +1 for walk
    +1 for bike or scooter
    -3 for bus`,
    size: 20,
    font: "Alata",
    labelWidth: 250,
    shiftVertical: -30,
    align: "center",
    lineHeight: 25,

  });

  var cb5 = new Label({
    text: `High Gas
    Subtract or add money: 
   +$10 extra for car
   +$1 extra for bus`,
    size: 20,
    font: "Alata",
    labelWidth: 250,
    shiftVertical: -30,
    align: "center",
    lineHeight: 25,

  });

  var cb6 = new Label({
    text: `Flat Tire
    Subtract spaces: 
    -7 for car
    -4 for bus`,
    size: 20,
    font: "Alata",
    labelWidth: 250,
    shiftVertical: -30,
    align: "center",
    lineHeight: 25,

  });

  var cb7 = new Label({
    text: `Free Scooter Ride
    Change mode to scooter
    & write $0 in cost for 
    this turn`,
    size: 20,
    font: "Alata",
    labelWidth: 250,
    shiftVertical: -30,
    align: "center",
    lineHeight: 25,

  });

  var cb8 = new Label({
    text: `Late Bus
    Subtract spaces: 
    -4 for bus`,
    size: 20,
    font: "Alata",
    labelWidth: 250,
    shiftVertical: -30,
    align: "center",
    lineHeight: 25,

  });

  var cb9 = new Label({
    text: `Sunny Day
    Add 4 spaces`,
    size: 20,
    font: "Alata",
    labelWidth: 250,
    shiftVertical: -30,
    align: "center",
    lineHeight: 25,

  });


  let cb = [cb1, cb2, cb3, cb4, cb5, cb6, cb7, cb8, cb9]

  //random curve ball array
  let rCB = cb[Math.floor(Math.random() * cb.length)];

  var curveBallPane = new Pane({
    label: rCB,
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

}