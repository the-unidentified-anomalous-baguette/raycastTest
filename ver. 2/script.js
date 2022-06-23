let red = [200,10, 10]
let stone = [127, 127, 127]

class pc{
  constructor(x, y, z, height, angleLR, angleUD, speed){
    this.x = x
    this.y = y
    this.z = z
    this.height = height
    this.angleLR = angleLR
    this.angleUD = angleUD
    this.speed = speed // cm/s
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
  }
}

let cam;
let player;
let walls;

function moveCheck(directionX, directionZ){
  let x3 = player.x
  let x4 = x3 + directionX
  let z3 = player.z
  let z4 = z3 + directionZ

  for (let i of walls){
    let x1 = i.x1
    let x2 = i.x2
    let z1 = i.z1
    let z2 = i.z2
    //console.log(x1, x2, x3, x4)
    // console.log(player.z)
    // console.log(z1, z2, z3, z4)
    let den = (x1-x2)*(z3-z4)-(z1-z2)*(x3-x4)
    let t = ((x1-x3)*(z3-z4)-(z1-z3)*(x3-x4))/den
    let u = ((x1-x3)*(z1-z2)-(z1-z3)*(x1-x2))/den
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1){
      return false
    }
  }
  return true
}

function setup() {
  createCanvas(1024, 576, WEBGL);
  angleMode(DEGREES);
  noStroke();
  rectMode(CENTER)
  cam = createCamera();
  player = new pc(0, 0, 0, 175, 0, 0, 4)
  walls = [
    new boundary(0, 100, 0, 200, red, 600, 0), 
    new boundary(400, 0, 670, 290, stone, 200, 0), new boundary(670, 290, 1010, 340, red, 100, 100), 
    new boundary(1010, 340, 1160, 220, stone, 550, 0), new boundary(1160, 220, 1450, 240, stone, 50, 500), new boundary(1450, 240, 1810, 590, stone, 50, 0),
    new boundary(1120, 700, 1000, 390, stone, 50, 0), new boundary(1400, 710, 1640, 770, stone, 50, 0),
    new boundary(1000, 390, 660, 390, red, 100, 200), new boundary(660, 390, 490, 690, stone, 200, 0), new boundary(490, 690, 30, 570, stone, 200, 0), 
    //new boundary(30, 570, 0, 0, stone, 200, 0),
    new boundary(1400, 710, 1400, 830, stone, 50, 0), new boundary(1400, 830, 1580, 1010, stone, 50, 0), 
    new boundary(1580, 1010, 1640, 930, stone, 50, 0), new boundary(1640, 930, 1560, 850, stone, 50, 0), new boundary(1560, 850, 1640, 770, stone, 50, 0), 
    new boundary(1950, 950, 1950, 1230, stone, 50, 0), new boundary(1950, 1230, 1560, 1330, stone, 50, 0), new boundary(1810, 590, 1950, 950, red, 50, 0),
    new boundary(1560, 1330, 1120, 700, stone, 200, -300)]
  console.log(player.x)
  console.log(cam.centerX)
  // cam.centerY = player.y - player.height
  // cam.eyeY = player.y - player.height
  console.log(cam)
}

function draw() {
  background(120)
  controls()
  cam.pan(-movedX/2);
  cam.tilt(movedY/2);
  player.angleUD += movedY/2
  player.angleLR += movedX/2
  console.log(player.x)

  stroke(255)
  for (let i of walls){
    push()
    fill(i.colour);
    translate(i.midX, i.midY + 175, i.midZ + 450)
    rotateY(i.angle)
    plane(i.width, i.height)
    pop()
    line(i.x1, i.z1, i.x2, i.z2)
  }
  fill(0)
  circle(player.x, player.z, 10)
}

function controls(){
  if (keyIsDown(87)){//w
    requestPointerLock()
    if(moveCheck(sin(player.angleLR)*player.speed, -cos(player.angleLR)*player.speed)){
      cam.centerX += sin(player.angleLR)*player.speed
      cam.eyeX += sin(player.angleLR)*player.speed
      player.x += sin(player.angleLR)*player.speed
    // }
    // if(moveCheck(0, -cos(player.angleLR)*player.speed)){
      cam.centerZ -= cos(player.angleLR)*player.speed
      cam.eyeZ -= cos(player.angleLR)*player.speed
      player.z -= cos(player.angleLR)*player.speed
    }
  }
  if (keyIsDown(83)){//s
    if(moveCheck(-sin(player.angleLR)*player.speed, cos(player.angleLR)*player.speed)){
      cam.centerX -= sin(player.angleLR)*player.speed
      cam.eyeX -= sin(player.angleLR)*player.speed
      player.x -= sin(player.angleLR)*player.speed
    // }
    // if(moveCheck(0, cos(player.angleLR)*player.speed)){
      cam.centerZ += cos(player.angleLR)*player.speed
      cam.eyeZ += cos(player.angleLR)*player.speed
      player.z += cos(player.angleLR)*player.speed
    }
  }
  if (keyIsDown(65)){//a
    if(moveCheck(-cos(player.angleLR)*player.speed, -sin(player.angleLR)*player.speed)){
      cam.centerX -= cos(player.angleLR)*player.speed
      cam.eyeX -= cos(player.angleLR)*player.speed
      player.x -= cos(player.angleLR)*player.speed
    // }
    // if(moveCheck(0, -sin(player.angleLR)*player.speed)){
      cam.centerZ -= sin(player.angleLR)*player.speed
      cam.eyeZ -= sin(player.angleLR)*player.speed
      player.z -= sin(player.angleLR)*player.speed
    }
  }
  if (keyIsDown(68)){//d
    if(moveCheck(cos(player.angleLR)*player.speed, sin(player.angleLR)*player.speed)){
      cam.centerX += cos(player.angleLR)*player.speed
      cam.eyeX += cos(player.angleLR)*player.speed
      player.x += cos(player.angleLR)*player.speed
    // }
    // if(moveCheck(0, sin(player.angleLR)*player.speed)){
      cam.centerZ += sin(player.angleLR)*player.speed
      cam.eyeZ += sin(player.angleLR)*player.speed
      player.z += sin(player.angleLR)*player.speed
    }
  }
  if (keyIsDown(32)){//space
  }
}