// A variable to hold our image data
let img;

let dog;
let cat;

// Preload, good for loading assets, blocks the setup() method
function preload() {
    // Loading an image from the internet into memory
    img = loadImage('https://www.planetnatural.com/wp-content/uploads/2024/04/Lotus-Flower-920x518.webp');

    // Load some animal pics
    dog = loadImage('https://upload.wikimedia.org/wikipedia/commons/c/c1/Flatcoat_retriever_2.jpg');
    cat = loadImage('https://upload.wikimedia.org/wikipedia/commons/9/9b/Gustav_chocolate.jpg');
}

function setup() {
    // Create the canvas to be the same size as the image
    let canvas = createCanvas(img.width, img.height);

    // Optional, but without a 'parent' set, the canvas is added to the end of <main> by default
    canvas.parent('sketch-container');

    noStroke();
}

function setup_animals() {
    let canvas = createCanvas(dog.width, dog.height);
    // Optional, but without a 'parent' set, the canvas is added to the end of <main> by default
    canvas.parent('sketch-container');

    // Resize the cat pic to be the same as the dog pic
    cat.resize(dog.width, dog.height);

    noStroke();
}

function draw() {
    draw_img_basic()
    // draw_pixelated()
    // draw_pixel_brush()
    // draw_half_and_half()
    // draw_scattered_glitch()
    // draw_dither_waves()
    // draw_random_pixel_brush()

    // These require a call to setup_animals() above
    // setup_animals()
    // draw_slider()
    // draw_checkerboard()
    // draw_hole_between_images()
}

function draw_img_basic() {
    // Draws the full image to the canvas
    image(img, 0, 0, width, height);
    // image(img, mouseX, mouseY, width * .1, height * .1);

    // image(dog, 0, 0, width, height);
    // image(cat, 0, 0, width, height);
}

function draw_pixelated() {
    const pixelSize = 10;
    for (let x = 0; x < width; x += pixelSize) {
        for (let y = 0; y < height; y += pixelSize) {
            // Get the color at (x, y)
            let c = img.get(x, y);
            // Set the fill color to match the picture
            fill(c);
            // Draw a rectangle / pixel at the original position
            rect(x, y, pixelSize, pixelSize);
        }
    }
}

function draw_pixel_brush() {
    const pixelSize = 5;
    const brushRadius = 50;
    for (let x = 0; x < width; x += pixelSize) {
        for (let y = 0; y < height; y += pixelSize) {
            // Check how far the mouse is from the current pixel
            let d = dist(x, y, mouseX, mouseY);
            // If it's below a threshold, draw it
            if (d < brushRadius) {
                let c = img.get(x, y);
                fill(c);
                rect(x, y, pixelSize, pixelSize);
            }
        }
    }
}

function draw_half_and_half() {
    const pixelSize = 10
    for (let x = 0; x < width; x += pixelSize) {
        for (let y = 0; y < height; y += pixelSize) {
            let c = img.get(x, y);
            fill(c);

            // Top or Bottom half of the screen?
            if (y > (height / 2)) {
                ellipse(x + (pixelSize / 2), y + (pixelSize / 2), pixelSize);
            } else {
                rect(x, y, pixelSize, pixelSize);
            }
        }
    }
}

function draw_scattered_glitch() {
    let w = 5;
    let scatterRange = 10;
    for (let x = 0; x < width; x += w) {
        for (let y = 0; y < height; y += w) {
            // random() gives a random value between 0 and 1
            // if the mouseIsPressed and random() < 0.5 (50% chance)
            if (random() < 0.5 && mouseIsPressed) {
                copy(img, x, y, w, w, x + random(-scatterRange, scatterRange), y + random(-scatterRange, scatterRange), w, w);
            } else {
                copy(img, x, y, w, w, x, y, w, w);
            }
        }
    }
}

function drawDitheredPixel(x, y, c, pixelWidth) {
    const speedFactor = 0.2;
    const ditherFactor = 0.02;
    fill(c);

    // Horizontal shake
    ellipse(x + cos(frameCount * speedFactor + y * ditherFactor) * 5, y, pixelWidth);

    // Vertical shake
    // ellipse(x, y + cos(frameCount * speedFactor + y * ditherFactor) * 5, pixelWidth);

    // Diagonal shake
    // ellipse(x + sin(frameCount * speedFactor + x * ditherFactor) * 5, y + sin(frameCount * speedFactor + y * ditherFactor) * 5, pixelWidth);
}

function draw_dither_waves() {
    const pixelWidth = 3;
    for (let x = 0; x < width; x += pixelWidth) {
        for (let y = 0; y < height; y += pixelWidth) {
            drawDitheredPixel(x, y, img.get(x, y), pixelWidth);
        }
    }
}

function draw_random_pixel_brush() {
    let c = img.get(mouseX, mouseY);
    fill(c);
    noStroke();
    // Random with arguments generates random numbers in that range
    circle(mouseX + random(-20, 20), mouseY + random(-20, 20), 10);
}

function draw_checkerboard() {
    let tileSize = 19;
    for (let y = 0; y < height; y += tileSize) {
        for (let x = 0; x < width; x += tileSize) {
            // Even / odd parity check to determine which image to use
            let useImg1 = ((x + y) % 2 === 0);
            let source = useImg1 ? cat : dog;

            copy(source, x, y, tileSize, tileSize, x, y, tileSize, tileSize);
        }
    }
}

function draw_slider() {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            let threshold = map(mouseX, 0, width, 0, 1);
            let source = (x / width < threshold) ? dog : cat;

            // Copy the pixel from the source image to the current position
            set(x, y, source.get(x, y));
        }
    }
    // Re-render the canvas
    updatePixels();
}

function draw_hole_between_images() {
    const radius = 50;
    const pixelSize = 5;
    for (let x = 0; x < width; x += pixelSize) {
        for (let y = 0; y < height; y += pixelSize) {
            // Distance check to determine animal source image
            let d = dist(x, y, mouseX, mouseY);
            let source = d < radius ? dog : cat;

            // Copy the pixel from the source image to the current position
            copy(source, x, y, pixelSize, pixelSize, x, y, pixelSize, pixelSize);
        }
    }
}