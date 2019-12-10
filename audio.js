const fMajor = ['C5','D5','E5','F5','G5','A5','Bb5','C6']
const orangeStar1 = [['F4','Bb3'],['F4','Bb3'],['C5','Bb3'],['F4','Bb3'],['Bb4','Bb3'],['A4','F4','Bb3'],['F4','Bb3'],['C5','F4','Bb3'],['Bb3'],['C5','F4','Bb3'],['Bb4','Bb3'],['A4','F4','Bb3'],['Bb4','Bb3'],['A4','F4','Bb3'],['F4','Bb3'],['C4','F4','Bb3'], 
  
['F4','F3'],['F4','F3'],['C5','F3'],['F4','F3'],['Bb4','F3'],['A4','F4','F3'],['F4','F3'],['C5','F4','F3'],['F3'],['C5','F4','F3'],['Bb4','F3'],['A4','F4','F3'],['Bb4','F3'],['A4','F4','F3'],['F4','F3'],['C4','F4','F3'],
  
['F4','G3'],['F4','G3'],['C5','G3'],['F4','G3'],['Bb4','G3'],['A4','F4','G3'],['F4','G3'],['C5','F4','G3'],['G3'],['C5','F4','G3'],['Bb4','G3'],['A4','F4','G3'],['Bb4','G3'],['A4','F4','G3'],['F4','G3'],['C4','F4','G3'],
  
['F4','A3'],['F4','A3'],['C5','A3'],['F4','A3'],['Bb4','A3'],['A4','F4','A3'],['F4','A3'],['C5','F4','A3'],'',['C5','F4',''],['Bb4',''],['A4','F4',''],['Bb4',''],['A4','F4',''],['F4',''],['C4','F4','']]

let notes = fMajor,
    minFrequency = new Tone().toFrequency(notes[0]),
    maxFrequency = new Tone().toFrequency(notes[notes.length-1]),
    currentNote,
    bpm,
    legato = true,
    bgm = false,
    vol = new Tone.Volume(0);
    gain1 = new Tone.Gain(0);
    gain2 = new Tone.Gain(.1)

Tone.context.latencyHint = 'fastest'

let mainOsc = new Tone.OmniOscillator ({
frequency : 440 ,
detune : 0 ,
phase : 0 ,
spread : 20 ,
type : 'sawtooth' ,
count : 3 ,
modulationIndex : 2 ,
modulationType : 'square' ,
harmonicity : 1,
partialCount : 0
})

let vibrato = new Tone.Vibrato({
maxDelay : 0.005 ,
frequency : 5 ,
depth : 0.1 ,
type : 'sine'
})


let synth
synth = new Tone.PolySynth({
  // "volume": -10,
  "envelope": {
    "attack": 0.1,
    "decay": 0,
    "sustain": 0.3,
    "release": 0.2,
    }
})

synth.set({"oscillator": {
          "type": "sine" 
					}
});

mainOsc.chain(vibrato,gain1,vol,Tone.Master)
synth.chain(gain2,vol,Tone.Master)

let pattern = new Tone.Pattern(function(time, note){
  // console.log(note)
  if(note !== ''){
    synth.triggerAttackRelease(note, '8n');
  }
}, orangeStar1 ,'up')
pattern.loop = true;
pattern.interval = "8n";


const generateNote = (x, y) => {
  let margin = .15
  let noteArea = 1 - margin*2
  let xScaled = 
      x < (WIDTH*margin) 
        ? 0
        : x > WIDTH * (margin + noteArea)
        ? 1
        : (x - (WIDTH*margin))/(noteArea*WIDTH)
  let yScaled = 
      y < 0
        ? 1
        : y > HEIGHT
        ? 0
        : (HEIGHT-y)/HEIGHT
  
  
  let selectedNote
  if(xScaled > 0){
    notes.forEach((e,i)=>{
      if( 1/(notes.length-2)*(i-1) <= xScaled && xScaled < 1/(notes.length-2)*i){
        selectedNote = e
        return
      }
    }) 
  }else{
    selectedNote = notes[0]
  }
  

  let calcFreq = xScaled * (maxFrequency - minFrequency) + minFrequency

  return {
    xScaled: xScaled,
    yScaled: yScaled,
    noteString: selectedNote,
    freq:calcFreq
  };
}; 

const updateTextAndAudio = (x,y) => {
  currentNote = generateNote(x,y);

  let newFreq = legato ? currentNote.freq : new Tone().toFrequency(currentNote.noteString)
  
  if(mainOsc.frequency.value !== newFreq){
    mainOsc.frequency.value = newFreq
  }else{
    // console.log('theSame')
  }
  
  bpm = 146 + currentNote.yScaled*60
  
  vibrato.frequency.value = currentNote.yScaled * 10
  gain1.gain.value = currentNote.yScaled * .05
  
  if(bgm === true){
    Tone.Transport.bpm.value = bpm
  }
  
  displayText.text = 
    bgm ? currentNote.noteString.replace(/\d+/g, '') + "|" + Math.floor(bpm) 
    : currentNote.noteString.replace(/\d+/g, '') ;
  
  displayText.position.set(WIDTH*.51 - displayText.width / 2, HEIGHT * .73);
  
  // graphics.clear()
  // graphics.lineStyle(2, 0xffbf00, 1);
  // graphics.alpha = 0.5
  // graphics.moveTo(0,y);
  // graphics.lineTo(WIDTH, y);
  // graphics.moveTo(x,0);
  // graphics.lineTo(x, HEIGHT);
}


// var calculateFrequency = function(x) {
//   var minFrequency = 391.99543598174927 || 0, //G4
//     maxFrequency = 783.9908719634986 || 0; //G5
//   let calcFreq = x * (maxFrequency - minFrequency) + minFrequency
//   return calcFreq;
// };


// var context = new (window.AudioContext || window.webkitAudioContext)(),
//   gainNode = context.createGain(),
//   oscillator = null,
//   distortion = context.createWaveShaper();

// gainNode.connect(context.destination);

// var calculateFrequency = function(x,xMin,xMax) {
//   var minFrequency = 391.99543598174927, //C1
//     maxFrequency = 783.9908719634986; //C6
//   let calcFreq = (x-xMin) / (xMax-xMin) * (maxFrequency - minFrequency) + minFrequency
//   return calcFreq;
// };

// var calculateGain = function(mouseYPosition) {
//   var minGain = 0,
//     maxGain = 0.1;

//   return (mouseYPosition / 100) * maxGain + minGain;
// };

// var calculateDB = function(mouseYPosition) {
//   var minGain = -48,
//     maxGain = 48;

//   return (mouseYPosition / 100) * maxGain + minGain;
// };

// var createOscillator = function(e) {
//   oscillator = context.createOscillator();
//   oscillator.frequency.setTargetAtTime(
//     calculateFrequency(0),
//     context.currentTime,
//     0.001
//   );
//   oscillator.type = 'sawtooth'
//   gainNode.gain.setTargetAtTime(calculateGain(0), context.currentTime, 0.001);
//   oscillator.connect(gainNode);
//   oscillator.start(context.currentTime);
// };

// var changeFrequency = function(x, y) {
//   if (oscillator) {
//     oscillator.frequency.setTargetAtTime(
//       calculateFrequency(x),
//       context.currentTime,
//       0.001
//     );
//     gainNode.gain.setTargetAtTime(calculateGain(y), context.currentTime, 0.001);
//   }
// };
