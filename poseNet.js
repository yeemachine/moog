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
      let scaledPoints = [];
      let skeletonPoints = [];
      let rightWrist = results[0].pose.rightWrist;
      let leftWrist = results[0].pose.leftWrist;
      let nose = results[0].pose.nose;
      
      if(rightWrist.confidence > .5 && leftWrist.confidence > .5){
        //Two Hands
        rightHand = {
          x: scale(rightWrist.x, video.width, WIDTH) + WIDTH/2,
          y: scale(rightWrist.y, video.height, HEIGHT) + HEIGHT/2
        };
        
        leftHand = {
          x: scale(leftWrist.x, video.width, WIDTH) + WIDTH/2,
          y: scale(leftWrist.y, video.height, HEIGHT) + HEIGHT/2
        };
        
        lightR.position.copy(rightHand);
        lightL.position.copy(leftHand);
        lightL.brightness = 6
        
        updateTextAndAudio(rightHand.x, leftHand.y) 
       
      }else if (rightWrist.confidence > 0.3 || leftWrist.confidence > 0.3) {

          //One Hand
          let x = rightWrist.y < leftWrist.y ? rightWrist.x : leftWrist.x;
          let y = rightWrist.y < leftWrist.y ? rightWrist.y : leftWrist.y;

          rightHand = {
            x: scale(x, video.width, WIDTH) + WIDTH/2,
            y: scale(y, video.height, HEIGHT) + HEIGHT/2
          };

          lightR.position.copy(rightHand);
          lightL.brightness = 0 
            
          updateTextAndAudio(rightHand.x, rightHand.y)
      }else{
        lightL.brightness = 0
      }
      
      
      
      if (nose.confidence > 0.2 ){
        lightC.position.copy({
          x:scale(nose.x, video.width, WIDTH) + WIDTH/2,
          y:scale(nose.y, video.height, HEIGHT) + HEIGHT/2
        });
        lightC.brightness = 6
      }else{
        lightC.brightness = 0
      }
    } else {
    }
  });
}

const generateNote = (x, y) => {
  let notes = ["G", "F#", "E", "D", "C", "B", "A", "G"];
  let scale =
      x < WIDTH * .25
        ? "G"
        : WIDTH * .25 <= x && x < WIDTH * (.25 + .0625)
        ? "A"
        : WIDTH * (.25 + .0625) <= x && x < WIDTH * (.25 + .0625 * 2)
        ? "B"
        : WIDTH * (.25 + .0625 * 2) <= x && x < WIDTH * (.25 + .0625 * 3)
        ? "C"
        : WIDTH * (.25 + .0625 * 3) <= x && x < WIDTH * (.25 + .0625 * 4)
        ? "D"
        : WIDTH * (.25 + .0625 * 4) <= x && x < WIDTH * (.25 + .0625 * 5)
        ? "E"
        : WIDTH * (.25 + .0625 * 5) <= x && x < WIDTH * .75
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
