const videoElement = document.querySelector('video');

(() => {

  const constraints = { 
    video: { 
      facingMode: "user" 
    }, 
    audio: false 
  }

  // Get access to the camera!
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    
    navigator.mediaDevices.getUserMedia(constraints)
    .then((stream)=>{
      gotStream(stream)
    }).catch(err=>{
      alert(err)
    });
    
  }

})();


function gotStream(stream) {
  
  videoElement.srcObject = stream;
  
  let b = setInterval(()=>{
    
    if(videoElement.readyState >= 3){
      
      poseNetINIT()

      //stop checking every half second
      clearInterval(b);
      
    }      
    
  },500);
  
}
