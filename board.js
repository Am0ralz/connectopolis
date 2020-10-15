import { data } from "./info.js";
const frame = new Frame({
  scaling: "fit",
  width: 1924,
  height: 768,
  color: light,
  outerColor: light,
});

frame.on("ready", () => {
  const stage = frame.stage;
  let stageW = frame.width;
  let stageH = frame.height;
  frame.outerColor = "#ddd";
  frame.color = "#ddd";

  var board = new Board({
    num: 20,
    size: 25,
    info: JSON.stringify(data), //these are the paths from info.js
    borderWidth: 1,
  }).center();

  var player = board.add(new Person(), 5, 4); // adds a random person

  stage.update();
});
