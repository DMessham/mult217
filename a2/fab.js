/*
=========================
Simple FAB + Experimental Knob / Dial UI Kit for p5.js
- Author: Jesse Rolheiser

Most Effective if you use:
- createFAB() and createKnob() methods in your setup() logic
- drawFAB() and drawKnobPanel() methods near the end of your draw() logic
- getKnobValue() method to retrieve knob values
- handleFABPressed(), handleKnobDrag(), and handleKnobRelease() methods in your mouse events
=========================
*/

// Local State Management
let UTIL_UI = {
    fab: null,
    knobs: [],
    panelOpen: true,
    activeKnob: null
};

// ---------- Floating Action Buttons (FAB) ----------

// Used to configure a Floating Action Button (FAB)
function createFAB(x, y, r, label = "+", onClick = null) {
    UTIL_UI.fab = {
        x,
        y,
        r,
        label,
        onClick
    };
}

// FAB drawing helper, should be called near the end of your draw() method
function drawFAB() {
    if (!UTIL_UI.fab) return;

    push();
    noStroke();

    let hovered = dist(mouseX, mouseY, UTIL_UI.fab.x, UTIL_UI.fab.y) < UTIL_UI.fab.r;

    fill(hovered ? 70 : 40);
    circle(UTIL_UI.fab.x, UTIL_UI.fab.y, UTIL_UI.fab.r * 2);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(UTIL_UI.fab.r);
    text(UTIL_UI.fab.label, UTIL_UI.fab.x, UTIL_UI.fab.y - 2);
    pop();
}

// Configures press event handler
// Should be called in your mousePressed() method
function handleFABPressed() {
    if (!UTIL_UI.fab) return false;

    let hovered = dist(mouseX, mouseY, UTIL_UI.fab.x, UTIL_UI.fab.y) < UTIL_UI.fab.r;

    if (hovered) {
        if (UTIL_UI.fab.onClick) UTIL_UI.fab.onClick();
        return true;
    }

    return false;
}

// ---------- KNOBS ----------

// Adds a new experimental knob to the UI
function createKnob(label, x, y, radius, minVal, maxVal, startVal) {
    let knob = {
        label,
        x,
        y,
        radius,
        minVal,
        maxVal,
        value: constrain(startVal, minVal, maxVal),
        dragging: false
    };

    UTIL_UI.knobs.push(knob);
    return knob;
}

// Helper to retrieve the value of a knob by its label
function getKnobValue(label) {
    for (let knob of UTIL_UI.knobs) {
        if (knob.label === label) return knob.value;
    }
    return null;
}

function setKnobValue(label, value) {
    for (let knob of UTIL_UI.knobs) {
        if (knob.label === label) knob.value=value;
    }
    return null;
}

// Internal knob draw helper, does not need to be called in your program
function drawKnob(knob) {
    let angle = map(knob.value, knob.minVal, knob.maxVal, -135, 135);
    let rad = radians(angle);

    let pointerX = knob.x + cos(rad) * knob.radius * 0.7;
    let pointerY = knob.y + sin(rad) * knob.radius * 0.7;

    push();
    textAlign(CENTER, CENTER);

    // label
    noStroke();
    fill(255);
    textSize(14);
    text(knob.label, knob.x, knob.y - knob.radius - 18);

    // knob body
    stroke(255);
    strokeWeight(2);
    fill(50);
    circle(knob.x, knob.y, knob.radius * 2);

    // arc guide
    noFill();
    stroke(120);
    strokeWeight(3);
    arc(
        knob.x,
        knob.y,
        knob.radius * 1.8,
        knob.radius * 1.8,
        radians(-135),
        radians(135)
    );

    // pointer
    stroke(255, 200, 80);
    strokeWeight(4);
    line(knob.x, knob.y, pointerX, pointerY);

    // center dot
    noStroke();
    fill(255);
    circle(knob.x, knob.y, 8);

    // value text
    fill(255);
    textSize(12);

    // Number Format(nf): https://p5js.org/reference/p5/nf/
    text(nf(knob.value, 1, 2), knob.x, knob.y + knob.radius + 18);

    pop();
}

// Draws the knob panel, should be called near the end of your draw() method
function drawKnobPanel() {
    if (!UTIL_UI.panelOpen) return;

    for (let knob of UTIL_UI.knobs) {
        drawKnob(knob);
    }
}

// Internal hit test helper
function knobHitTest(knob, mx, my) {
    return dist(mx, my, knob.x, knob.y) < knob.radius;
}

// Configures press event handler
// Should be called in your mousePressed() method
function handleKnobPressed() {
    if (!UTIL_UI.panelOpen) return false;

    for (let knob of UTIL_UI.knobs) {
        if (knobHitTest(knob, mouseX, mouseY)) {
            knob.dragging = true;
            UTIL_UI.activeKnob = knob;
            updateKnobFromMouse(knob);
            return true;
        }
    }

    return false;
}

// Configures drag event handler
// Should be called in your mouseDragged() method
function handleKnobDragged() {
    if (UTIL_UI.activeKnob) {
        updateKnobFromMouse(UTIL_UI.activeKnob);
    }
}

// Configures release event handler
// Should be called in your mouseReleased() method
function handleKnobReleased() {
    if (UTIL_UI.activeKnob) {
        UTIL_UI.activeKnob.dragging = false;
        UTIL_UI.activeKnob = null;
    }
}

// Internal knob update helper
function updateKnobFromMouse(knob) {
    let angle = degrees(atan2(mouseY - knob.y, mouseX - knob.x));

    // clamp angle to usable knob sweep
    angle = constrain(angle, -135, 135);

    knob.value = map(angle, -135, 135, knob.minVal, knob.maxVal);
}
