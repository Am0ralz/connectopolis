
//creates class for custom tree object
export var DiffTree = function(){
    
    this.super_constructor();
    this.type = "DiffTree";
    this.arguments = arguments;
  
    new Circle(10,"#764A23").sca(1,.5).addTo(this);
    this.centerReg(null,null,false);
    new Rectangle(20,50, "#764A23").loc(-10,-50,this);
    new Circle(rand(35,45),"#81B721").sca(1,.65).loc(0,-50,this);
    new Circle(rand(20,30), "#81B721").sca(1,1).loc(-5,-70,this);
    new Circle(rand(15,20), "#81B721").sca(1,1).loc(12,-72,this);
  }
  
  
//creates class for traffic light object
  export var TrafficLight = function () {
    this.super_constructor();
    this.type = "TrafficLight";
    this.arguments = arguments;

    const post = new Rectangle(10, 80, black).centerReg().loc(0, -40, this); //post for traffic light
    new Circle(10 / 2, black).sca(1, 0.3).centerReg(post).mov(0, 40); //small disk under post to give illusion of 3d post
    new Rectangle(30, 50, black).centerReg().loc(0, -65, this); //traffic  light
    new Circle(30 / 2.5, black).sca(1, 0.3).loc(0, -90, this); //small disk above traffic light
    new Circle(30 / 2.5, black).sca(1, 0.3).loc(0, -39, this); //small disk under traffic light

    new Circle(6, red).loc(0, -80, this); //red traffic light
    new Circle(6, yellow).loc(0, -64, this); //yellow traffic light
    new Circle(6, green).loc(0, -48, this); //green traffic light
  };