const video = document.querySelector("video");

const options = {
 imageScaleFactor: 0.3,
 outputStride: 16,
 flipHorizontal: true,
 minConfidence: 0.5,
 maxPoseDetections: 3,
 scoreThreshold: 0.5,
 nmsRadius: 20,
 detectionType: 'single',
 multiplier: 0.75,
}

// Create a new poseNet method

let poseNet,
    rightHand = {x:0,y:0}, leftHand = {x:0,y:0},
    currentPitch, currentGain

const poseNetINIT = ()=> {
  poseNet = ml5.poseNet(video,options, modelLoaded);
}
// When the model is loaded
function modelLoaded() {
  console.log("Model Loaded!");
  poseNet.on("pose", function(results) {
  
  //Only Detect 1 person  
  if(results.length > 0){
    // flock.toPoint = true
    let scaledPoints = []
    let skeletonPoints = []
    let rightWrist = results[0].pose.rightWrist
    let leftWrist = results[0].pose.leftWrist
    // console.log(rightHand)
    
    if(rightWrist.confidence > 0.2 || leftWrist > 0.2){
      let x = (rightWrist.y < leftWrist.y) ? rightWrist.x : leftWrist.x
      let y = (rightWrist.y < leftWrist.y) ? rightWrist.y : leftWrist.y
      
      rightHand = {
        x:scale(x,video.width,600)+300,
        y:scale(y,video.height,340)+170,
      }
      
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
      
      let formatedNote = generateNote(rightHand.x,rightHand.y)
      displayText.text = formatedNote.scale + '|' + formatedNote.level
      displayText.position.set(308-displayText.width/2,249)
      mouseOver = true
      changeFrequency(formatedNote.scaleNum,formatedNote.level)
      
    } 
    

    
  

  }else{
  }
});
}

const generateNote = (x,y) => {
  let notes = ["G","F#","E","D","C","B","A","G"]
  let scale = 
          (x<150) ? 'G':
          (150<=x && x<150+300/6) ? 'A':
          (150+300/8<=x && x<150+300/6*2) ? 'B':
          (150+300/8*2<=x && x<150+300/6*3) ? 'C':
          (150+300/8*3<=x && x<150+300/6*4) ? 'D':
          (150+300/8*4<=x && x<150+300/6*5) ? 'E':
          (150+300/8*5<=x && x<450) ? 'F#':
          (x>=450) ? 'G':
          'G',
      level = Math.floor((340-y)/340*100)
  return ({
    scale: scale,
    scaleNum: x,
    level: (level < 0) ? 0:
            (level > 100) ? 100 :
             level
  })
}

const scale = (num, in_min, in_max) => {
  return (num - in_min/2)*in_max/in_min
}

