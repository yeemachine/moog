let Stream;
const getWebCam = () => {
  const constraints = {
    video: {
      facingMode: "user"
    },
    audio: false
  };

  // Get access to the camera!
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    if (!Stream || Stream.active === false) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(stream => {
          Stream = stream;
          gotStream(stream);
        })
        .catch(err => {
          alert(err);
        });
    } else {
      stopStream();
    }
  }
};

function gotStream(stream) {
  document.querySelector("video").srcObject = stream;
  console.log("Webcam On");
  let b = setInterval(() => {
    if (document.querySelector("video").readyState >= 3 && !poseNet) {
      poseNetINIT();
      //stop checking every half second
      clearInterval(b);
    }
  }, 500);
}

const stopStream = () => {
  if (Stream) {
    Stream.getTracks().forEach(track => track.stop());
    console.log("Webcam Off");
  }
};
