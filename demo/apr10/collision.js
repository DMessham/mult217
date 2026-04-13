/*
=========================
Collision Helper Functions for p5.js
- Author: Jesse Rolheiser

Most Effective if you use:
- Points with x, y properties
- Circles with x, y, r properties
- Axis Aligned Rectangles with x, y, w, h properties

Helper methods for:
- Point / Mouse in Rectangle
- Point / Mouse in Circle
- Rectangle-Rectangle Collision
- Circle-Circle Collision
- Circle-Rectangle Collision
=========================
*/

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function distSq(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return dx * dx + dy * dy;
}

function pointInRect(px, py, rx, ry, rw, rh) {
    return (
        px >= rx &&
        px <= rx + rw &&
        py >= ry &&
        py <= ry + rh
    );
}

function pointInCircle(px, py, cx, cy, cr) {
    return distSq(px, py, cx, cy) <= cr * cr;
}

function rectRectCollision(ax, ay, aw, ah, bx, by, bw, bh) {
    return (
        ax < bx + bw &&
        ax + aw > bx &&
        ay < by + bh &&
        ay + ah > by
    );
}

function circleCircleCollision(x1, y1, r1, x2, y2, r2) {
    let radii = r1 + r2;
    return distSq(x1, y1, x2, y2) <= radii * radii;
}

function circleRectCollision(cx, cy, cr, rx, ry, rw, rh) {
    let closestX = clamp(cx, rx, rx + rw);
    let closestY = clamp(cy, ry, ry + rh);

    return distSq(cx, cy, closestX, closestY) <= cr * cr;
}

// ---------- Object helper wrappers ----------

// Assumes axis-aligned rectangles, each having properties: x, y, w, h
function rectsOverlap(a, b) {
    return rectRectCollision(a.x, a.y, a.w, a.h, b.x, b.y, b.w, b.h);
}

// Assumes circles have properties: x, y, r
function circlesOverlap(a, b) {
    return circleCircleCollision(a.x, a.y, a.r, b.x, b.y, b.r);
}

// Assumes circle having properties: x, y, r
// Assumes axis-aligned rectangle: x, y, w, h
function circleHitsRect(circle, rect) {
    return circleRectCollision(circle.x, circle.y, circle.r, rect.x, rect.y, rect.w, rect.h);
}

// Assumes rectangle having properties: x, y, w, h
function mouseInRect(rect) {
    return pointInRect(mouseX, mouseY, rect.x, rect.y, rect.w, rect.h);
}

// Assumes circle having properties: x, y, r
function mouseInCircle(circle) {
    return pointInCircle(mouseX, mouseY, circle.x, circle.y, circle.r);
}