let position;
let velocity;

function setup() {
    createCanvas(windowWidth, windowHeight);
    frameRate(30);

    position = createVector(width / 2, height / 2);

    velocity = createVector(.3, 1);
}

function draw() {
    background(220);

    fill(color(200, 0, 200));
    rect(position.x, position.y, 50, 50);
    position.add(velocity);

}
