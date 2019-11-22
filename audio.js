var context = new AudioContext(),
  gainNode = context.createGain(),
  oscillator = null;

gainNode.connect(context.destination);

var calculateFrequency = function(mouseXPosition) {
  var minFrequency = 30,
    maxFrequency = 1500;

  return (mouseXPosition / 600) * maxFrequency + minFrequency;
};

var calculateGain = function(mouseYPosition) {
  var minGain = 0,
    maxGain = 0.2;

  return (mouseYPosition / 100) * maxGain + minGain;
};

var createOscillator = function(e) {
  oscillator = context.createOscillator();
  oscillator.frequency.setTargetAtTime(
    calculateFrequency(0),
    context.currentTime,
    0.001
  );
  gainNode.gain.setTargetAtTime(calculateGain(0), context.currentTime, 0.001);
  oscillator.connect(gainNode);
  oscillator.start(context.currentTime);
};

var changeFrequency = function(x, y) {
  if (oscillator) {
    oscillator.frequency.setTargetAtTime(
      calculateFrequency(x),
      context.currentTime,
      0.001
    );
    gainNode.gain.setTargetAtTime(calculateGain(y), context.currentTime, 0.001);
  }
};
