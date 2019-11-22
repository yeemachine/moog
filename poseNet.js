const video = document.querySelector("video");

const options = {
  imageScaleFactor: 0.3,
  outputStride: 16,
  flipHorizontal: true,
  minConfidence: 0.5,
  maxPoseDetections: 3,
  scoreThreshold: 0.5,
  nmsRadius: 20,
  detectionType: "single",
  multiplier: 0.75
};

// Create a new poseNet method

let poseNet,
  rightHand = { x: 0, y: 0 },
  leftHand = { x: 0, y: 0 },
  currentPitch,
  currentGain;

const poseNetINIT = () => {
  poseNet = ml5.poseNet(video, options, modelLoaded);
};
// When the model is loaded
function modelLoaded() {
  console.log("Model Loaded!");
  poseNet.on("pose", function(results) {
    //Only Detect 1 person
    if (results.length > 0 && gameActive) {
      // flock.toPoint = true
      let scaledPoints = [];
      let skeletonPoints = [];
      let rightWrist = results[0].pose.rightWrist;
      let leftWrist = results[0].pose.leftWrist;
      // console.log(rightHand)

      if (rightWrist.confidence > 0.2 || leftWrist > 0.2) {
        let x = rightWrist.y < leftWrist.y ? rightWrist.x : leftWrist.x;
        let y = rightWrist.y < leftWrist.y ? rightWrist.y : leftWrist.y;

        rightHand = {
          x: scale(x, video.width, WIDTH) + WIDTH/2,
          y: scale(y, video.height, HEIGHT) + HEIGHT/2
        };

        // Two Hand Ver.
        //       rightHand = {
        //         x:scale(rightWrist.x,video.width,600)+300,
        //         y:scale(rightWrist.y,video.height,340)+170,
        //       }

        //       leftHand = {
        //         x:scale(leftWrist.x,video.width,600)+300,
        //         y:scale(leftWrist.y,video.height,340)+170,
        //       }

        lightR.position.copy(rightHand);
        lightL.position.copy(rightHand);

        let formatedNote = generateNote(rightHand.x, rightHand.y);
        displayText.text = formatedNote.scale + "|" + formatedNote.level;
        displayText.position.set(WIDTH*.51 - displayText.width / 2, HEIGHT * .745);
        changeFrequency(formatedNote.scaleNum, formatedNote.level);
      }
    } else {
    }
  });
}

const generateNote = (x, y) => {
  let notes = ["G", "F#", "E", "D", "C", "B", "A", "G"];
  let scale =
      x < WIDTH/4
        ? "G"
        : WIDTH/4 <= x && x < WIDTH/4 + WIDTH/2 / 6
        ? "A"
        : WIDTH/4 + WIDTH/2 / 8 <= x && x < WIDTH/4 + (WIDTH/2 / 6) * 2
        ? "B"
        : WIDTH/4 + (WIDTH/2 / 8) * 2 <= x && x < WIDTH/4 + (WIDTH/2 / 6) * 3
        ? "C"
        : WIDTH/4 + (WIDTH/2 / 8) * 3 <= x && x < WIDTH/4 + (WIDTH/2 / 6) * 4
        ? "D"
        : WIDTH/4 + (WIDTH/2 / 8) * 4 <= x && x < WIDTH/4 + (WIDTH/2 / 6) * 5
        ? "E"
        : WIDTH/4 + (WIDTH/2 / 8) * 5 <= x && x < WIDTH * .75
        ? "F#"
        : x >= WIDTH * .75
        ? "G"
        : "G",
    level = Math.floor(((HEIGHT - y) / HEIGHT) * 100);
  return {
    scale: scale,
    scaleNum: x,
    level: level < 0 ? 0 : level > 100 ? 100 : level
  };
}; 

const scale = (num, in_min, in_max) => {
  return ((num - in_min / 2) * in_max) / in_min;
};
