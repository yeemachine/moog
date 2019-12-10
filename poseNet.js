const video = document.querySelector("video");

const options = {
  architecture: 'MobileNetV1',
  imageScaleFactor: 0.3,
  outputStride: 16,
  flipHorizontal: true,
  minConfidence: 0.8,
  maxPoseDetections: 1,
  scoreThreshold: 0.5,
  nmsRadius: 20,
  detectionType: 'single',
  inputResolution: 513,
  multiplier: 0.5,
  quantBytes: 2  
};

// Create a new poseNet method

let poseNet,
  rightHand = { x: 0, y: 0 },
  leftHand = { x: 0, y: 0 },
  currentPitch,
  currentGain;

const poseNetINIT = () => {
  poseNet = ml5.poseNet(video, options, modelLoaded);
  // let Net
  // posenet.load(options).then(net=>{
  //   Net = net
  //   async function poseDetectionFrame(){
  //     const pose = await Net.estimatePoses(video, options);
  //       processPoses(pose)
  //       requestAnimationFrame(poseDetectionFrame);
  //   }
  //   poseDetectionFrame()
  // }
  // )
};
// When the model is loaded
function modelLoaded() {
  console.log("Model Loaded!");
  poseNet.on("pose", function(results) {
    //Only Detect 1 person
      processPoses(results)
    
  });
}

const processPoses = (results) =>{
      if (results.length > 0 && gameActive) {
      let scaledPoints = [];
      let skeletonPoints = [];
      let rightWrist = results[0].pose.keypoints[10];
      let leftWrist = results[0].pose.keypoints[9];
      let nose = results[0].pose.keypoints[0];
      
      if(mouseMoved > 100){
        if(rightWrist.score > .5 && leftWrist.score > .5){
          //Two Hands
          rightHand = {
            x: scale(rightWrist.position.x, video.width, WIDTH) + WIDTH/2,
            y: scale(rightWrist.position.y, video.height, HEIGHT) + HEIGHT/2
          };

          leftHand = {
            x: scale(leftWrist.position.x, video.width, WIDTH) + WIDTH/2,
            y: scale(leftWrist.position.y, video.height, HEIGHT) + HEIGHT/2
          };

          lightR.position.copy(rightHand);
          lightL.position.copy(leftHand);
          lightL.brightness = 6

          updateTextAndAudio(rightHand.x, leftHand.y) 

        }else if (rightWrist.score > 0.2 || leftWrist.score > 0.2) {

            //One Hand
            let x = rightWrist.position.y < leftWrist.position.y ? rightWrist.position.x : leftWrist.position.x;
            let y = rightWrist.position.y < leftWrist.position.y ? rightWrist.position.y : leftWrist.position.y;

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
      }
      
      
      
      if (nose.score > 0.2 ){
        lightC.position.copy({
          x:scale(nose.position.x, video.width, WIDTH) + WIDTH/2,
          y:scale(nose.position.y, video.height, HEIGHT) + HEIGHT/2
        });
        lightC.brightness = 6
      }else{
        lightC.brightness = 0
      }
    } else {
    }
}

const scale = (num, in_min, in_max) => {
  return ((num - in_min / 2) * in_max) / in_min;
};
