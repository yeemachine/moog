const fMajor = ["C5", "D5", "E5", "F5", "G5", "A5", "Bb5", "C6", "D6", "E6", "F6", "G6", "A6", "Bb6", "C7"];
let margin = 0.12;

const orangeStar1 = [
  ["F4", "Bb3"],
  ["F4", "Bb3"],
  ["C5", "Bb3"],
  ["F4", "Bb3"],
  ["Bb4", "Bb3"],
  ["A4", "F4", "Bb3"],
  ["F4", "Bb3"],
  ["C5", "F4", "Bb3"],
  ["Bb3"],
  ["C5", "F4", "Bb3"],
  ["Bb4", "Bb3"],
  ["A4", "F4", "Bb3"],
  ["Bb4", "Bb3"],
  ["A4", "F4", "Bb3"],
  ["F4", "Bb3"],
  ["C4", "F4", "Bb3"],

  ["F4", "F3"],
  ["F4", "F3"],
  ["C5", "F3"],
  ["F4", "F3"],
  ["Bb4", "F3"],
  ["A4", "F4", "F3"],
  ["F4", "F3"],
  ["C5", "F4", "F3"],
  ["F3"],
  ["C5", "F4", "F3"],
  ["Bb4", "F3"],
  ["A4", "F4", "F3"],
  ["Bb4", "F3"],
  ["A4", "F4", "F3"],
  ["F4", "F3"],
  ["C4", "F4", "F3"],

  ["F4", "G3"],
  ["F4", "G3"],
  ["C5", "G3"],
  ["F4", "G3"],
  ["Bb4", "G3"],
  ["A4", "F4", "G3"],
  ["F4", "G3"],
  ["C5", "F4", "G3"],
  ["G3"],
  ["C5", "F4", "G3"],
  ["Bb4", "G3"],
  ["A4", "F4", "G3"],
  ["Bb4", "G3"],
  ["A4", "F4", "G3"],
  ["F4", "G3"],
  ["C4", "F4", "G3"],

  ["F4", "A3"],
  ["F4", "A3"],
  ["C5", "A3"],
  ["F4", "A3"],
  ["Bb4", "A3"],
  ["A4", "F4", "A3"],
  ["F4", "A3"],
  ["C5", "F4", "A3"],
  "",
  ["C5", "F4", ""],
  ["Bb4", ""],
  ["A4", "F4", ""],
  ["Bb4", ""],
  ["A4", "F4", ""],
  ["F4", ""],
  ["C4", "F4", ""]
];

let notes = fMajor,
  minFrequency = new Tone().toFrequency(notes[0]),
  maxFrequency = new Tone().toFrequency(notes[notes.length - 1]),
  currentNote,
  bpm,
  legato = true,
  bgm = false,
  vol = new Tone.Volume(0);
gain1 = new Tone.Gain(0);
gain2 = new Tone.Gain(0.4);

if (!isMobile) {
  Tone.context.latencyHint = "fastest";
}

Tone.Transport.bpm.value = 187;

let mainOsc = new Tone.OmniOscillator({
  frequency: 440,
  detune: 0,
  phase: 0,
  spread: 20,
  type: "sawtooth",
  count: 3,
  modulationIndex: 2,
  modulationType: "square",
  harmonicity: 1,
  partialCount: 0
});

let vibrato = new Tone.Vibrato({
  maxDelay: 0.005,
  frequency: 5,
  depth: 0.1,
  type: "sine"
});

let synth = new Tone.PolySynth(3, Tone.Synth, {
  oscillator: {
    type: "triangle"
  },
  envelope: {
    attack: 0.005,
    decay: 0.1,
    sustain: 0.3,
    release: 1.5
  },
  detune: 0
});

var phaser = new Tone.Phaser({
  frequency: 0
});

let feedback = new Tone.FeedbackEffect();
var delay = new Tone.FeedbackDelay(0.5);
let reverb = new Tone.JCReverb({ roomSize: 0 });

let synth2 = new Tone.PolySynth(1, Tone.Synth, {
  oscillator: {
    type: "square"
  },
  volume: -13,
  envelope: {
    attack: 0.005,
    decay: 0.5,
    sustain: 0.5,
    release: 1.5
  }
});
synth2.set("detune", -1200);

mainOsc.chain(vibrato, gain1, vol, Tone.Master);
synth.chain(gain2, vol, Tone.Master);
synth2.chain(phaser, gain2, vol, Tone.Master);

let pattern = new Tone.Pattern(
  function(time, note) {
    if (note !== "") {
      synth.triggerAttackRelease(note, "8n");
    }
    if (note.slice(-1)[0] && note.slice(-1)[0] !== "") {
      synth2.triggerAttackRelease(note.slice(-1)[0], "8n");
    }
  },
  orangeStar1,
  "up"
);
pattern.loop = true;
pattern.interval = "8n";

const generateNote = (x, y) => {
  let noteArea = 1 - margin * 2;
  let xScaled =
    x < WIDTH * margin
      ? 0
      : x > WIDTH * (margin + noteArea)
      ? 1
      : (x - WIDTH * margin) / (noteArea * WIDTH);
  let yScaled = y < 0 ? 1 : y > HEIGHT ? 0 : (HEIGHT - y) / HEIGHT;

  let selectedNote;
  if (xScaled > 0) {
    notes.forEach((e, i) => {
      if (
        (1 / (notes.length - 2)) * (i - 1) <= xScaled &&
        xScaled < (1 / (notes.length - 2)) * i
      ) {
        selectedNote = e;
        return;
      }
    });
  } else {
    selectedNote = notes[0];
  }

  let calcFreq = xScaled * (maxFrequency - minFrequency) + minFrequency;

  return {
    xScaled: xScaled,
    yScaled: yScaled,
    noteString: selectedNote,
    freq: calcFreq
  };
};

const updateTextAndAudio = (x, y) => {
  currentNote = generateNote(x, y);

  let newFreq = legato
    ? currentNote.freq
    : new Tone().toFrequency(currentNote.noteString);

  if (mainOsc.frequency.value !== newFreq) {
    mainOsc.frequency.value = newFreq;
  } else {
  }

  bpm = 146 + currentNote.yScaled * 60;

  vibrato.frequency.value = currentNote.yScaled * 10;
  gain1.gain.value = currentNote.yScaled * 0.1;

  if (bgm === true) {
    synth.set({
      envelope: {
        attack: 0.005 + (1 - currentNote.xScaled) * 0.05,
        sustain: 0.51 - (1 - currentNote.yScaled) * 0.5
      }
    });
    knob3.rotation = -0.8 * Math.PI + currentNote.xScaled * 1.6 * Math.PI;
    knob4.rotation = -0.8 * Math.PI + currentNote.yScaled * 1.6 * Math.PI;
    for (let i = 0; i < 4; i++) {
      warmLightContainer.children[i].color = lerpColor(
        0xff0000,
        0xff7f00,
        currentNote.xScaled
      );
    }
    timeFreq = 5 + 45 * (1 - currentNote.yScaled);
  } else {
    knob3.rotation = -0.8 * Math.PI;
    knob4.rotation = -0.8 * Math.PI;
  }

  knob1.rotation = -0.8 * Math.PI + currentNote.yScaled * 1.6 * Math.PI;
  knob2.rotation = -0.8 * Math.PI + currentNote.xScaled * 1.6 * Math.PI;

  displayText.text = currentNote.noteString
    .replace(/\d+/g, "")
    .replace("b", "ᵇ");
  displayText2.text = pad(Math.floor(currentNote.yScaled * 100), 3);

  if (mouseMoved <= 100) {
    displayText3.text = "a_1";
    displayText3.alpha = 0.3;
  }
};

function pad(n, width, z) {
  z = z || "0";
  n = n + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
