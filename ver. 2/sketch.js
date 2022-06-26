let red = [200,10, 10]
let stone = [128, 120, 133]

class Player extends RoverCam {
	constructor() {
		super();
		this.dimensions = createVector(1, 3, 1);
		this.velocity = createVector(0, 0, 0);
		this.gravity = createVector(0, 0.03, 0);
		this.grounded = false;
		this.pointerLock = false;
		this.sensitivity = 0.002;
		this.speed = 0.04;
	}

	controller() { // override
		this.yaw(movedX * this.sensitivity);   // mouse left/right
		this.pitch(movedY * this.sensitivity); // mouse up/down
		if(keyIsDown(65) || keyIsDown(LEFT_ARROW))  this.moveY(0.01); // a
		if(keyIsDown(68) || keyIsDown(RIGHT_ARROW)) this.moveY(-0.01);// d
		if (keyIsDown(87) || keyIsDown(UP_ARROW)) this.moveX(this.speed);    // w
		if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) this.moveX(-this.speed); // s
		if (keyIsDown(69)) this.moveZ(0.05); // e
	}

	update() {
		if (keyIsPressed && key == 'e') {
			this.grounded = false;
			return;
		}
		//this.velocity.add(this.gravity);
		this.position.add(this.velocity);

		if (this.grounded && keyIsPressed && keyCode == 32) { // space
			this.grounded = false;
			this.velocity.y = -1.5;
			this.position.y -= 0.2;
		}
	}
}

class boundary{
  constructor(x1, z1, x2, z2, colour, height, base){
    this.midX = ((x1+x2)/2)
    this.midZ = ((z1+z2)/2)
    this.midY = -(base+(height/2))
    this.angle = -atan((z2-z1)/(x2-x1))
    this.width = Math.pow(((x2-x1)*(x2-x1))+((z2-z1)*(z2-z1)), 0.5)
    this.height = height
    this.colour = colour
    this.x1=x1
    this.z1=z1
    this.x2=x2
    this.z2=z2
    this.base = base
  }

	draw(){
		push()
    fill(this.colour);
    translate(this.midX, this.midY, this.midZ)
    rotateY(this.angle)
    plane(this.width, this.height)
    pop()
	}
}

class floor{
  constructor(width1, width2, x, y, z, rotation, colour, catchZone){
    this.width1 = width1
    this.width2 = width2
    this.x = x
    this.y = y
    this.z = z
    this.rotation = rotation
    this.colour = colour
    this.cornerTL = [this.x - this.width1/2, this.z - this.width2/2] // corners of un-rotated tile
    this.cornerTR = [this.x + this.width1/2, this.z - this.width2/2] // used for finding if the
    this.cornerBR = [this.x + this.width1/2, this.z + this.width2/2] // player is standing on it
    this.cornerBL = [this.x - this.width1/2, this.z + this.width2/2]
		this.catchZone = catchZone + 50
  }

	draw(){
		push()
    fill(this.colour)
    translate(this.x, this.y + 175, this.z + 450)
    rotateX(90)
    rotateZ(this.rotation)
    plane(this.width1, this.width2)
    pop()
	}
}

let player
let canvas
let walls
let floors

function setup() {
  angleMode(DEGREES);
  noStroke();
  rectMode(CENTER)
	canvas = createCanvas(1024, 576, WEBGL);
	player = new Player()
	player.setState = {
		position: [50,0,50],
	};
  player.fovy = 1 + (7/9)
	frameRate(60);
	walls = [
		new boundary(0, 0, 0, 50, red, 1, 0)
   // new boundary(0, 0, 40, 0, stone, 200, 0), new boundary(40, 0, 40, 40, stone, 200, 0), new boundary(40, 40, 50, 40, stone, 200, 0),
   // new boundary(50, 40, 50, 50, stone, 200, 0), new boundary(50, 50, 0, 50, stone, 200, 0), new boundary(0, 50, 0, 0, stone, 200, 0)
  ]
  floors = [new floor(400, 500, 200, 0, 250, 0, red, 0), new floor(100, 100, 450, 0, 450, 0, red, 0)]
  console.log(player)
}

function draw() {
	background(0, 0, 51);
	player.update();
	for (let i of walls){
		i.draw()
	}
	// for (let i of floors){
	// 	i.draw()
	// }
}