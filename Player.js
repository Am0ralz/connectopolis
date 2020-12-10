///////////////////Player/////////////////////////////////
class Player extends Person {

    modes = {
      Walk: { cost: 0, spaces: 2, cImpact: 0, calories: 21 },
      Bike: { cost: 1, spaces: 4, cImpact: 0, calories: 27 },
      Bus: { cost: 4, spaces: 8, cImpact: 6, calories: 1.6 },
      Scooter: { cost: 3, spaces: 6, cImpact: 0, calories: 1.8 },
      Car: { cost: 8, spaces: 10, cImpact: 10, calories: 3 },
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
  
      // static function fromObject(obj){
  
      // }
  
    }

    setBudget(budget){
      this.budget = budget;
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