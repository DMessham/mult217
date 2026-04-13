let game = {};
let config = {};

let IS_DEBUG = true;

function setup() {
    createCanvas(800, 500);

    initUI();
    initGameState();
    resetGameState();
}

function draw() {
    updateGame();
    drawGame();
    drawUI();
}

function initUI() {
    // Show debug UI FAB in debug mode
    if (IS_DEBUG) {
        createFAB(width - 40, height - 40, 24, "≡", () => {
            UTIL_UI.panelOpen = !UTIL_UI.panelOpen;
        });
    }

    // varName, x, y, radius, min, max, default
    createKnob("speed", 80, 100, 16, 1, 10, 4);
}

function initGameState() {
    game = {
        scene: "play",
        score: 0,
        lives: 0,
        timer: 0
    };

    game.player = {};
    game.sequence = [];

    config = {
        tempo: 4,
        noteWidth: 80,
        debug: IS_DEBUG
    };
}

function resetGameState() {
    game.score = 0;
    game.lives = 3;
    game.timer = 0;

    game.player = {
        x: 150
    };

    // game.sequence = [
    //     { note: "UP", hit: false, missed: false },
    //     { note: "DOWN", hit: false, missed: false },
    //     { note: "REST", hit: false, missed: false },
    //     { note: "RIGHT", hit: false, missed: false },
    //     { note: "LEFT", hit: false, missed: false },
    //     { note: "UP", hit: false, missed: false },
    //     { note: "DOWN", hit: false, missed: false },
    //     { note: "REST", hit: false, missed: false },
    //     { note: "RIGHT", hit: false, missed: false },
    //     { note: "LEFT", hit: false, missed: false }
    // ];

    game.sequence = generateRandomSequence(30);
    loop();
}

function generateRandomSequence(n = 20) {
    const notes = ["UP", "DOWN", "LEFT", "RIGHT", "REST"];
    let newSequence = [];
    for (let i = 0; i < n; i++) {
        let randomNote = notes[Math.floor(Math.random() * notes.length)];
        newSequence.push({ note: randomNote, hit: false, missed: false });
    }
    return newSequence;
}

function updateGame() {
    if (IS_DEBUG) {
        config.tempo = Math.round(getKnobValue('speed'));
    }

    // Increase Timer (Used to keep track of the game progression)
    game.timer += config.tempo;

    updateSequence();

    // Check if the last note has touched the left canvas edge
    let lastNotePlayHead = getPlayHeadLocation(game.sequence.length) - 100;

    // If you run out of lives, or reach the end of the sequence
    if (game.lives <= 0 || (lastNotePlayHead <= 0)) {
        noLoop();
    }
}

function updateSequence() {
    // Iterate through sequence, checking for missed notes
    for (let i = 0; i < game.sequence.length; i++) {
        let note = game.sequence[i];

        // Skip RESTS
        if (note.note == "REST") {
            continue;
        }

        // Check if the note is missed or hit
        if (!note.hit && !note.missed) {
            let playHead = getPlayHeadLocation(i);

            // If the right edge of the note is past the player
            if (playHead < game.player.x - config.noteWidth) {
                // Note is missed
                note.missed = true;
                // Lose a life
                game.lives--;
            }
        }
    }
}

function drawGame() {
    drawBackground();
    drawPlayer();
    drawSequence();
}

function drawUI() {
    // Draw a simple HUD in the top-left corner
    fill(255);
    textSize(20);
    text("Score: " + game.score, 20, 30);
    text("Lives: " + game.lives, 20, 55);

    // Helpers from utilities.js
    if (IS_DEBUG) {
        drawKnobPanel();
        drawFAB();
    }
}

function drawBackground() {
    background(20);
}

function drawPlayer() {
    push();
    stroke('red');
    strokeWeight(13);
    line(game.player.x, 0, game.player.x, height);
    pop();
}

function drawSequence() {
    /*
        Draw the entire sequence at once.
        Pans from Right to Left.
        Like a piano roll / guitar game board.
    */
    push();
    for (let i = 0; i < game.sequence.length; i++) {
        let note = game.sequence[i];

        if (note.note == "REST") {
            continue;
        }

        // PlayHead will be the left edge of each note
        let playHead = getPlayHeadLocation(i);

        // Draw each note as a rectangle
        /*
            if the note is fully right of the player.x: white
            if the note is overlapping the player.x: orange
            if the note is fully left of the player.x: red
        */
        if (note.hit) {
            fill('green');
        } else if (playHead > game.player.x) {
            fill('white');
        } else if (playHead < game.player.x && playHead > game.player.x - config.noteWidth) {
            fill('orange');
        } else {
            fill('red')
        }
        rect(playHead, height / 2, config.noteWidth, config.noteWidth);

        // Draw the note / text inside the box
        fill(0);
        textSize(21);
        text(note.note, playHead, height / 2 + config.noteWidth / 2);
    }
    pop();
}

function getPlayHeadLocation(i) {
    return (width + i * 100) - game.timer;
}

function keyPressed() {
    checkKeyPress(keyCode);
}

function checkKeyPress(keyCode) {
    for (let i = 0; i < game.sequence.length; i++) {
        let note = game.sequence[i];

        // Don't check against REST notes or already hit notes
        if (note == "REST" || note.hit) {
            continue;
        }

        // Left edge of the current note
        let playHead = getPlayHeadLocation(i);

        if (playHead < game.player.x && playHead > game.player.x - config.noteWidth) {
            // Check if the keycode matches the note
            if ((note.note == "UP" && keyCode == UP_ARROW) ||
                (note.note == "DOWN" && keyCode == DOWN_ARROW) ||
                (note.note == "LEFT" && keyCode == LEFT_ARROW) ||
                (note.note == "RIGHT" && keyCode == RIGHT_ARROW)) {

                // Correct key press
                game.score++;

                // Flag as "hit"
                game.sequence[i].hit = true;
            }
        }
    }
}

function mousePressed() {
    if (handleFABPressed()) return;
    if (handleKnobPressed()) return;
}

function mouseDragged() {
    handleKnobDragged();
}

function mouseReleased() {
    handleKnobReleased();
}