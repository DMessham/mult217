// 600px x 600px canvas
// Runs once at startup
function setup() {
    let canvas = createCanvas(600, 600);

    // Optional, but without a 'parent' set, the canvas is added to the end of <main> by default
    canvas.parent('sketch-container');
}

function draw() {
    draw_grid();

    // draw_spokes();
    // draw_mouse_path();
    // draw_circle_square_mirror();
    // draw_speed_trail();

    // draw_controllable_orange_square();
    // draw_lerp_trailing_circle();
}

function draw_tile(xPos, yPos, size, color = 'red') {
    // Adds a new "Drawing Style Settings" into memory
    push();

    // Translate helps you work on smaller drawing problems
    translate(xPos, yPos);

    let angleDiff = 0;

    if (cursorMode === 'USER') {
        // What's the angle between me and the mouse?
        angleDiff = atan2(mouseY - yPos, mouseX - xPos);
    } else if (cursorMode === 'FIGURE-EIGHT') {
        // What's the angle between me and the figure8 position?
        let cx = width / 2;
        let cy = height / 2;
        let size8 = width / 3;

        let x = cx + sin(counter * 6) * size8;
        let y = cy + sin(counter * 2) * size8 / 2;
        angleDiff = atan2(y - yPos, x - xPos);
    }

    // If mouse is pressed, make all circles point away from the target
    if (mouseIsPressed) {
        angleDiff -= radians(180);
    }

    // Need to account for our drawing pointing down 45 degrees by default
    // angleDiff -= radians(45);

    // Rotate the tile to match the angle
    rotate(angleDiff);

    stroke(0);  // Black lines / borders
    strokeWeight(3);
    fill(color);  // Red-ish fill color
    ellipse(0, 0, size, size);  // Draw a red ellipse
    line(0, 0, size * .5, 0); // Draw a line from center to bottom right corner

    // Removes the temporary "Drawing Settings" from memory
    pop();
}

// Control Variables
let tileSize = 21;
let color = 'cyan';
let cursorMode = 'FIGURE-EIGHT'; // Try 'USER'
// let cursorMode = 'USER'; // Try 'USER'
function draw_grid() {
    // Clear the canvas
    clear();

    // Tiling the plane
    for (let x = 0; x < width; x += tileSize) {
        for (let y = 0; y < height; y += tileSize) {
            draw_tile(x, y, tileSize, color);
        }
    }

    if (cursorMode === 'USER') {
        // Custom Cursor
        draw_circle_cursor('yellow');
    } else if (cursorMode === 'FIGURE-EIGHT') {
        // Custom Cursor (Figure Eight Pattern)
        draw_figure_eight_cursor();
    }
}

function draw_circle_cursor(color = 'red') {
    noCursor();
    push();
    strokeWeight(3);
    fill(color);
    ellipse(mouseX, mouseY, 55, 55);
    pop();
}

let counter = 0;
function draw_figure_eight_cursor() {
    let cx = width / 2;
    let cy = height / 2;

    let size8 = width / 3;

    let x = cx + sin(counter * 6) * size8;
    let y = cy + sin(counter * 2) * size8 / 2;

    circle(x, y, 40);

    counter += 0.005;
}

function draw_spokes() {
    // Clear our previous frame
    clear();

    // Translating our origin makes working center out easier
    // This effectively puts (0,0) in the middle of our canvas
    translate(width / 2, height / 2);

    // Remember there are TWO_PI radians in a circle
    let pieces = 3; // Default to 3

    // Draw more spokes the further the mouse is to the right
    let maxNumPieces = 24
    pieces = ceil((mouseX / width) * maxNumPieces);

    // Figure out how much angle is between each spoke
    let angle_delta = TWO_PI / pieces;

    let spokeLength = 200; // Default to 200px
    // Draw longer lines the further the mouse is to the bottom
    spokeLength = ceil((mouseY / height) * 200);

    stroke(0);
    for (let angle = 0; angle < TWO_PI; angle += angle_delta) {
        let x = cos(angle) * spokeLength;
        let y = sin(angle) * spokeLength;
        line(0, 0, x, y);
    }
}

let mouse_history = [];
function draw_mouse_path() {
    // Clear previous frame
    clear();

    // Save the current mouse location
    mouse_history.push({
        x: mouseX,
        y: mouseY
    });

    // Only remember the last 100 mouse positions
    if (mouse_history.length > 100) {
        mouse_history.shift();
    }

    // No fill, just drawing a black line
    noFill();
    stroke(0);
    beginShape();

    // Loop to draw each point with smooth curving
    for (let p of mouse_history) {
        curveVertex(p.x, p.y);
    }
    endShape();
}

function draw_circle_square_mirror() {
    // Turns off borders / lines
    noStroke();
    if (mouseX < width / 2) {
        fill(255, 0, 0, 100);
        ellipse(mouseX, mouseY, 20);
    } else {
        fill(0, 0, 255, 100);
        rect(mouseX, mouseY, 20, 20);
    }
}

function draw_speed_trail() {
    // Figure out how many pixels the user moved between frames
    let speed = dist(mouseX, mouseY, pmouseX, pmouseY);

    // "Clamp" the speed to 50
    speed = min(150, speed);

    // Turns off borders / lines
    noStroke();

    // Light Blue, slightly transparent
    fill(0, 150, 255, 100);

    // Draw an ellipse where the mouse is
    ellipse(mouseX, mouseY, speed);
}

function draw_controllable_orange_square() {
    // Translate to make drawing a bit easier
    translate(width / 2, height / 2);

    // Rotate based on mouseX position
    rotate(radians(mouseX));
    // Scale the shape based on mouseY position

    let portionDownTheScreen = mouseY / height;
    let scaleFactor = lerp(0.5, 2, portionDownTheScreen);

    scale(scaleFactor);

    stroke(0);
    fill(255, 150, 0);
    rectMode(CENTER);
    rect(0, 0, 100, 100);
}

// Where the circle is
let circleX = 300;
let circleY = 300;

// Where the circle is trying to go (Target is initialized to start position)
let targetX = 300;
let targetY = 300;

function draw_lerp_trailing_circle() {
    background(220);

    // Move x and y toward the target. Using "Linear Interpolation"
    // Nudge the circle 5% towards the target location
    circleX = lerp(circleX, targetX, 0.05);
    circleY = lerp(circleY, targetY, 0.05);

    // Draw the circle.
    circle(circleX, circleY, 100);
}

function mouseMoved() {
    // If the user moves, set a new target location for the lerp example
    targetX = mouseX;
    targetY = mouseY;
}

// Handle Key Press events (Spacebar to Pause)
function keyPressed() {
    // If the user presses the space bar
    if (key == ' ') {
        // If we are drawing, pause
        if (isLooping()) {
            noLoop();
        } else {
            // If we are paused, resume
            loop();
        }
    }
}