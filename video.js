const getVideo = () => {
  const constraints = {
    video: {
      facingMode: "user"
    },
    audio: false
  };

  // Get access to the camera!
  if (
    navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia &&
    document.querySelector("video").srcObject === null
  ) {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(stream => {
        gotStream(stream);
      })
      .catch(err => {
        alert(err)
      });
  }
};

function gotStream(stream) {
  document.querySelector("video").srcObject = stream;

  let b = setInterval(() => {
    if (document.querySelector("video").readyState >= 3) {
      poseNetINIT();
      //stop checking every half second
      clearInterval(b);
    }
  }, 500);
}
