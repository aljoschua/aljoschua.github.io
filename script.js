let screen_scale; // vector which spans 1% of screen width & 1% of screen height
let shapes = []; // array for containing all shapes
let num_shapes = 20; // number of shapes to render
const colors = [ // color palette containing hex codes
    "#ed2226",
    "#4deeea",
    "#74ee15",
    "#ffe700",
    "#f000ff",
    "#001eff"
];
const sizes = [ // list of possible shape sizes, in percent of screen size
    10, 15, 20
];
const types = [ // list of possible shape types
    "square", "circle", "triangle", "flipped_triangle"
];
const correctionMean = .25; // mean for gaussian distribution of speeds of a shape, should it pass the softBorder
const softBorder = 10; // border after which point shapes shall have a tendency to go back into the middle, in % of screen size

function setup() { // p5 function called on page (re-)load
    createCanvas(windowWidth, windowHeight); // create canvas to draw on
    frameRate(60); // set framerate to 60 frames per second

    screen_scale = createVector(width / 100, height / 100); // initialize screen scale

    for (i = 0; i < num_shapes; i++) { // create all shape objects
        shapes.push(new Shape());
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    screen_scale = createVector(width / 100, height / 100);
}

function draw() { // p5 function called on every frame
    background(220); // overdraw the last frame
    shapes.forEach(drawAndUpdateShape); // draw and update each shape
}

function drawAndUpdateShape(shape) {
    shape.draw();
    shape.update();
}


function randomArrayElement(array) {
    return array[int(random()*array.length)];
}

function getNewColor() {
    return randomArrayElement(colors);
}

function getNewSize() {
    return randomArrayElement(sizes);
}

function getNewSpeed(meanX, meanY) {
    return createVector(randomGaussian(meanX, .1), randomGaussian(meanY, .1));
}

function getNewPos() {
    return createVector(randomGaussian(50, 25), randomGaussian(50, 25));
}

function getNewType() {
    return randomArrayElement(types);
}

class Shape {
    constructor() {
        this.color = getNewColor();
        this.pos = getNewPos();
        this.speed = getNewSpeed(0, 0);
        this.size = getNewSize();
        this.type = getNewType();
    }

    draw() {
        fill(this.color);
        const pos = p5.Vector.mult(screen_scale, this.pos);
        const size = this.size * screen_scale.x;

        switch (this.type) {
            case "square": square(pos.x, pos.y, size);
                break;
            case "circle": circle(pos.x, pos.y, size);
                break;
            case "triangle": triangle(pos.x, pos.y, pos.x + size, pos.y, pos.x + size / 2, pos.y + size);
                break;
            case "flipped_triangle": triangle(pos.x, pos.y, pos.x + size, pos.y, pos.x + size / 2, pos.y - size);
                break;
            default: this.type = "square";
        }
    }

    update() {
        this.pos.add(this.speed);
        if (random() > .99) {
            let meanX = 0;
            let meanY = 0;

            if (this.pos.x < softBorder) {
                meanX = correctionMean;
            } else if (this.pos.x > (100 - softBorder)) {
                meanX = -correctionMean;
            }

            if (this.pos.y < softBorder) {
                meanY = correctionMean;
            } else if (this.pos.y > (100 - softBorder)) {
                meanY = -correctionMean;
            }

            this.speed = getNewSpeed(meanX, meanY);
        }
    }
}
