/*
    Author: Jesse Rolheiser
    Name: Sound Examples
    
    Notes:
    - Click / Drag mouse to play different frequencies at different volumes
    - Press:
        - 1-8 to play the C Major Diatonic chords
        - 'm' for a simple melody (Mary Had a Little Lamb)
        - 'c' to play up and down the C Major scale
        - 'a' to play through the "Axis" chord progression
*/

let osc;              // oscillator object
let playing = false;  // whether sound is on

// Define middle register frequencies
const noteFreqMap = {
    'C4': 261.63,
    'C#4': 277.18,
    'D4': 293.66,
    'D#4': 311.13,
    'E4': 329.63,
    'F4': 349.23,
    'F#4': 369.99,
    'G4': 392.00,
    'G#4': 415.30,
    'A4': 440.00,
    'A#4': 466.16,
    'B4': 493.88
};

// One octave lower
noteFreqMap['C3'] = noteFreqMap['C4'] / 2;
noteFreqMap['C#3'] = noteFreqMap['C#4'] / 2;
noteFreqMap['D3'] = noteFreqMap['D4'] / 2;
noteFreqMap['D#3'] = noteFreqMap['D#4'] / 2;
noteFreqMap['E3'] = noteFreqMap['E4'] / 2;
noteFreqMap['F3'] = noteFreqMap['F4'] / 2;
noteFreqMap['F#3'] = noteFreqMap['F#4'] / 2;
noteFreqMap['G3'] = noteFreqMap['G4'] / 2;
noteFreqMap['G#3'] = noteFreqMap['G#4'] / 2;
noteFreqMap['A3'] = noteFreqMap['A4'] / 2;
noteFreqMap['A#3'] = noteFreqMap['A#4'] / 2;
noteFreqMap['B3'] = noteFreqMap['B4'] / 2;

// One octave higher
noteFreqMap['C5'] = noteFreqMap['C4'] * 2;
noteFreqMap['C#5'] = noteFreqMap['C#4'] * 2;
noteFreqMap['D5'] = noteFreqMap['D4'] * 2;
noteFreqMap['D#5'] = noteFreqMap['D#4'] * 2;
noteFreqMap['E5'] = noteFreqMap['E4'] * 2;
noteFreqMap['F5'] = noteFreqMap['F4'] * 2;
noteFreqMap['F#5'] = noteFreqMap['F#4'] * 2;
noteFreqMap['G5'] = noteFreqMap['G4'] * 2;
noteFreqMap['G#5'] = noteFreqMap['G#4'] * 2;
noteFreqMap['A5'] = noteFreqMap['A4'] * 2;
noteFreqMap['A#5'] = noteFreqMap['A#4'] * 2;
noteFreqMap['B5'] = noteFreqMap['B4'] * 2;

// Melodies
const cMajorScale = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'];
const simpleMelody = ['E4', 'D4', 'C4', 'D4', 'E4', 'E4', 'E4']; // Think: "Mary Had a Little Lamb"
const majorArpeggio = ['C4', 'E4', 'G4', 'C5'];

// Chords for the C Major scale
const cMajorTriad = ['C4', 'E4', 'G4'];
const dMinorTriad = ['D4', 'F4', 'A4'];
const eMinorTriad = ['E4', 'G4', 'B4'];
const fMajorTriad = ['F4', 'A4', 'C5'];
const gMajorTriad = ['G4', 'B4', 'D5'];
const aMinorTriad = ['A4', 'C5', 'E5'];
const bDiminTriad = ['B4', 'D5', 'F5'];
const c_5MajorTriad = ['C5', 'E5', 'G5'];

function setup() {
    let canvas = createCanvas(600, 400);
    canvas.parent('sketch-container');

    textAlign(CENTER, CENTER);
    textSize(20);

    // Create oscillator and set basic settings
    osc = new p5.Oscillator('sine');  // sine, square, triangle, sawtooth
    osc.amp(0);                       // start silent
    osc.start();                      // starts running in background
}

function draw() {
    background(30);
    fill(255);

    if (playing) {
        text("SOUND ON 🎶", width / 2, height / 2 - 40);
    } else {
        text("Press mouse to play sound", width / 2, height / 2 - 40);
    }

    // Visual feedback based on frequency and amplitude
    let amp = map(mouseY, 0, height, 1.0, 0.0);      // volume = vertical
    let freq = map(mouseX, 0, width, 100, 1000);     // frequency = horizontal

    fill(100, 200, 255);
    ellipse(mouseX, mouseY, amp * 200 + 20);         // amplitude circle

    // Display text
    fill(255);
    text(`Frequency: ${int(freq)} Hz`, width / 2, height - 60);
    text(`Volume: ${amp.toFixed(2)}`, width / 2, height - 30);

    // Live control (while playing)
    if (playing) {
        osc.freq(freq);
        osc.amp(amp, 0.05);  // fade to new amplitude
    }
}

function mousePressed() {
    // Enable sound on mouse press
    playing = true;
}

function mouseReleased() {
    // Turn off sound
    osc.amp(0, 0.2);
    playing = false;
}

function playNoteSequence(notes, bpm = 120) {
    let index = 0;
    let interval = (60 / bpm) * 1000; // ms per beat

    let seq = setInterval(() => {
        if (index >= notes.length) {
            clearInterval(seq);
            osc.amp(0, 0.2);
            return;
        }

        let note = notes[index];
        let freq = noteFreqMap[note];

        osc.freq(freq);
        osc.amp(0.5, 0.05);
        index++;
    }, interval);
}

function playChord(noteNames, duration = 1.0, waveform = 'sine') {
    const localOscillators = [];

    for (let note of noteNames) {
        const freq = noteFreqMap[note];
        const osc = new p5.Oscillator(waveform);
        osc.freq(freq);
        osc.amp(0.4);
        osc.start();
        localOscillators.push(osc);
    }

    // Use a closure to encapsulate cleanup
    setTimeout(() => {
        for (let osc of localOscillators) {
            osc.amp(0, 0.2);    // fade out
            osc.stop(0.3);      // stop after fade
        }
    }, duration * 1000);
}

function playChordProgression(chords, bpm = 60) {
    let i = 0;
    const interval = (60 / bpm) * 1000;

    const loop = setInterval(() => {
        if (i >= chords.length) {
            clearInterval(loop);
            return;
        }

        playChord(chords[i]);
        i++;
    }, interval);
}

function keyPressed() {
    // Demo Keys
    if (key === 'm') {
        playNoteSequence(simpleMelody, 150);
    }
    if (key === 'c') {
        const upAndDown = [...cMajorScale, ...cMajorScale.reverse()];
        playNoteSequence(upAndDown, 150);
    }

    // Chord keys
    if (key === '1') {
        playChord(cMajorTriad);
    }
    if (key === '2') {
        playChord(dMinorTriad);
    }
    if (key === '3') {
        playChord(eMinorTriad);
    }
    if (key === '4') {
        playChord(fMajorTriad);
    }
    if (key === '5') {
        playChord(gMajorTriad);
    }
    if (key === '6') {
        playChord(aMinorTriad);
    }
    if (key === '7') {
        playChord(bDiminTriad);
    }
    if (key === '8') {
        playChord(c_5MajorTriad);
    }

    // Play through the axis progression chords
    if (key == 'a') {
        let axisProgression = [
            cMajorTriad,
            gMajorTriad,
            aMinorTriad,
            fMajorTriad
        ]
        playChordProgression(axisProgression)
    }
}
