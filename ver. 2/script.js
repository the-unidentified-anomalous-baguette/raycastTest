const skyBoxColors = [
  'lightcoral',
  'green',
  'goldenrod',
  'mediumblue',
  'skyblue',
  'saddlebrown'
];

const skyBoxSize = 2000;

let cam;
let skyBoxGraphics;
let skyBoxDirections;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  noStroke();
  cam = createCamera();
  cam.move(0, -50, 0);
}

const speed = 2;
const mouseSensitivity = 0.1;

function draw() {
  if (mouseCaptured) {
    if (keyIsDown(27)) {
      mouseCaptured = false;
      exitPointerLock();
    }

    cam.pan(-movedX * mouseSensitivity);
    cam.tilt(movedY * mouseSensitivity);
    cam.move(
      // D - right, A - left 
      (keyIsDown(68) ? speed : 0) + (keyIsDown(65) ? -speed : 0),
      // Q - down, E - up
      (keyIsDown(81) ? speed : 0) + (keyIsDown(69) ? -speed : 0),
      // S - backward, W - forward
      (keyIsDown(83) ? speed : 0) + (keyIsDown(87) ? -speed : 0)
    );
  }

  //debugMode();
  drawSkyBox();

  ambientLight(50, 50, 50);
  directionalLight(200, 200, 200, 0.5, 0.75, -1);

  fill('teal');
  box(100);
}

let mouseCaptured = false;

function mouseClicked() {
  if (!mouseCaptured) {
    mouseCaptured = true;
    requestPointerLock();
  }
}

function drawSkyBox() {
  push();
  translate(cam.eyeX, cam.eyeY, cam.eyeZ);

  push();
  for (let i = 0; i < 4; i++) {
    translate(0, 0, -skyBoxSize / 2);
    fill(skyBoxColors[i]);
    plane(skyBoxSize, skyBoxSize);
    translate(0, 0, skyBoxSize / 2);
    rotateY(-90);
  }
  pop();

  push();
  rotateX(-90);
  translate(0, 0, -skyBoxSize / 2);
  fill(skyBoxColors[4]);
  plane(skyBoxSize, skyBoxSize);
  pop();
  push();
  rotateX(90);
  fill(skyBoxColors[5]);
  translate(0, 0, -skyBoxSize / 2);
  plane(skyBoxSize, skyBoxSize);
  pop();

  pop();
}