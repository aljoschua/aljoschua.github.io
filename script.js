let speed_scaling_factor; // vector which spans 1% of screen width & 1% of screen height
let shapes = []; // array for containing all shapes
let num_shapes = 50; // number of shapes to render
const colors = [ // color palette containing hex codes
    "#ed2226",
    "#4deeea",
    "#74ee15",
    "#ffe700",
    "#f000ff",
    "#001eff"

];
const sizes = [ // list of possible shape sizes
    40, 50, 60, 70, 80, 90, 100, 110
];
const types = [ // list of possible shape types
    "square", "circle", "triangle"
];
const correctionMean = .2; // mean for gaussian distribution of speeds of a shape, should it pass the softBorder
const softBorder = 1 / 8; // border after which point shapes shall have a tendency to go back into the middle, relative to screen size

function setup() { // p5 function called on page (re-)load
    createCanvas(windowWidth, windowHeight); // create canvas to draw on
    frameRate(60); // set framerate to 60 frames per second

    speed_scaling_factor = createVector(width / 100, height / 100); // initialize speed_scaling_factor

    for (i = 0; i < num_shapes; i++) { // create all shape objects
        shapes.push(new Shape());
    }
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
    return createVector(randomGaussian(width / 2, width / 4), randomGaussian(height / 2, height / 4));
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
        switch (this.type) {
            case "square": square(this.pos.x, this.pos.y, this.size);
                break;
            case "circle": circle(this.pos.x, this.pos.y, this.size);
                break;
            case "triangle": triangle(this.pos.x, this.pos.y, this.pos.x + this.size, this.pos.y, this.pos.x + this.size / 2, this.pos.y + this.size);
                break;
            default: this.type = "square";
        }
    }

    update() {
        this.pos.add(p5.Vector.mult(speed_scaling_factor, this.speed));
        if (random() > .99) {
            let meanX = 0;
            let meanY = 0;

            if (this.pos.x < width * softBorder) {
                meanX = correctionMean;
            } else if (this.pos.x > width * (1 - softBorder)) {
                meanX = -correctionMean;
            }

            if (this.pos.y < height * softBorder) {
                meanY = correctionMean;
            } else if (this.pos.y > height * (1 - softBorder)) {
                meanY = -correctionMean;
            }

            this.speed = getNewSpeed(meanX, meanY);
        }
    }
}
