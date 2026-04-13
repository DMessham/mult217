let capture;

let seg;
let threshold;

function setup() {
    let canvas = createCanvas(1080, 720);
    // Optional, but without a 'parent' set, the canvas is added to the end of <main> by default
    canvas.parent('sketch-container');

    createFAB(width - 50, height - 50, 28, "?", () => {
        ui.panelOpen = !ui.panelOpen;
    });

    createKnob("seg", 80, 100, 16, 1, 10, 5);
    createKnob("threshold", 80, 200, 16, 1, 50, 20);

    createKnob("FG_RED", 80, 400, 16, 0, 255, 255);
    createKnob("FG_GREEN", 80, 500, 16, 0, 255, 0);
    createKnob("FG_BLUE", 80, 600, 16, 0, 255, 0);

    capture = createCapture(VIDEO);
    capture.size(1080, 720);
    capture.hide();
}

function draw() {
    // background(2, 76, 104);
    background('black');

    fg_red = Math.round(getKnobValue('FG_RED'));
    fg_green = Math.round(getKnobValue('FG_GREEN'));
    fg_blue = Math.round(getKnobValue('FG_BLUE'));

    fill(fg_red, fg_green, fg_blue);
    noStroke();

    seg = Math.round(getKnobValue('seg'));
    threshold = getKnobValue('threshold');

    capture.loadPixels();
    var allpoints = [];
    for (let i = 0; i < width; i += seg) {
        for (let j = 0; j < height; j += seg) {
            let num = j * width + i;
            let num2 = j * width + (i + 1);
            let num3 = (j + 1) * width + i;
            let c = [capture.pixels[num * 4], capture.pixels[1 + num * 4], capture.pixels[2 + num * 4]];
            let c1 = [capture.pixels[num2 * 4], capture.pixels[1 + num2 * 4], capture.pixels[2 + num2 * 4]];
            let c2 = [capture.pixels[num3 * 4], capture.pixels[1 + num3 * 4], capture.pixels[2 + num3 * 4]];

            if (pixelchecker(c, c1, c2, threshold)) {
                allpoints.push([i, j]);
            }
        }
    }

    for (var i = 0; i < allpoints.length; i++) {
        ellipse(allpoints[i][0], allpoints[i][1], seg, seg);
    }
    fill(255);

    drawKnobPanel();
    drawFAB();
}

// simple edge detection function
function pixelchecker(c, c1, c2, edge) {
    let r = c[0];
    let g = c[1];
    let b = c[2];
    let r1 = c1[0];
    let g1 = c1[1];
    let b1 = c1[2];
    let r2 = c2[0];
    let g2 = c2[1];
    let b2 = c2[2];
    if (
        sqrt((r - r1) * (r - r1) + (g - g1) * (g - g1) + (b - b1) * (b - b1)) >= edge ||
        sqrt((r - r2) * (r - r2) + (g - g2) * (g - g2) + (b - b2) * (b - b2)) >= edge
    ) {
        return true;
    } else {
        return false;
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