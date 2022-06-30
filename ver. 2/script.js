let red = [200,10, 10]
let stone = [128, 120, 133]

class pc{
  constructor(x, y, z, height, angleLR, angleUD, speed, currentFloor){
    this.x = x
    this.y = y
    this.z = z
    this.height = height
    this.angleLR = angleLR
    this.angleUD = angleUD
    this.speed = speed // cm/s
    this.eyeLevel = y + height
    this.currentFloor = currentFloor
  }

  floorCheck(){
    for (let i of floors){
      if (player.y >= i.y - i.catchZone){
        let relX = player.x - i.x
        let relZ = player.z - 450 - i.z
        let rottedX = relX * cos(i.rotation) - relZ * sin(i.rotation) //player x rotated to align with the tested floor tile
        let rottedZ = relX * sin(i.rotation) + relZ * cos(i.rotation)
        if (rottedX >= i.unrotX1 && rottedX <= i.unrotX2 && rottedZ >= i.unrotZ1 && rottedZ <= i.unrotZ2){
          player.currentFloor = i
        }
      }
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
}

class floor{
  constructor(width1, width2, x, y, z, rotation, colour, {catchZone = 50}){
    this.width1 = width1
    this.width2 = width2
    this.x = x
    this.y = y
    this.z = z
    this.rotation = rotation
    this.colour = colour
    this.unrotX1 = -width1/2
    this.unrotX2 = width1/2
    this.unrotZ1 = -width2/2
    this.unrotZ2 = width2/2
    this.catchZone = catchZone
  }
}

let cam;
let uiCam;
let player;
let walls;
let floors;
let jumping = false
let jumpHeight = 0
let font
//let img;

function moveCheck(dir){
  let x3 = player.x
  let z3 = player.z
  if (dir == 'fw'){
    cam.move(0, 0, -player.speed)
  }
  else if (dir == 'bw'){
    cam.move(0, 0, player.speed)
  }
  else if (dir == 'lw'){
    cam.move(-player.speed, 0, 0)
  }
  else {
    cam.move(player.speed, 0, 0)
  }
  let x4 = cam.eyeX
  let z4 = cam.eyeZ
  if (dir == 'fw'){
    cam.move(0, 0, player.speed)
  }
  else if (dir == 'bw'){
    cam.move(0, 0, -player.speed)
  }
  else if (dir == 'lw'){
    cam.move(player.speed, 0, 0)
  }
  else {
    cam.move(-player.speed, 0, 0)
  }

  for (let i of walls){
    let x1 = i.x1
    let x2 = i.x2
    let z1 = i.z1 + 450
    let z2 = i.z2 + 450
    let den = (x1-x2)*(z3-z4)-(z1-z2)*(x3-x4)
    let t = ((x1-x3)*(z3-z4)-(z1-z3)*(x3-x4))/den
    let u = ((x1-x3)*(z1-z2)-(z1-z3)*(x1-x2))/den
    if (t >= 0 && t <= 1 && u >= 0 && u <= 2 && i.base <= player.eyeLevel && i.base + i.height >= player.y + 51){
      return false
    }
  }
  return true
}

function preload(){
  font = loadFont('upperercase.ttf')
}

function setup() {
  createCanvas(1024, 576, WEBGL);
  angleMode(DEGREES);
  textAlign(CENTER)
  noStroke();
  rectMode(CENTER)
  cam = createCamera();
  uiCam = createCamera();
  setCamera(cam)
  walls = [
    new boundary(0, 0, 400, 0, stone, 250, 0), new boundary(400, 0, 400, 400, stone, 250, 0), //new boundary(400, 400, 500, 400, stone, 200, 0),
    //new boundary(500, 400, 500, 500, stone, 200, 0), new boundary(500, 500, 0, 500, stone, 200, 0), 
    new boundary(0, 500, 0, 0, stone, 250, 0),
    new boundary(400, 400, 400, 500, red, 50, 0), new boundary(429, 400, 500, 471, red, 50, 50), new boundary(450, 400, 550, 400, red, 50, 100),
    new boundary(400, 400, 450, 400, stone, 250, 0), new boundary(450, 400, 450, 300, stone, 100, 150), new boundary(450, 300, 550, 300, stone, 100, 150),
    new boundary(550, 300, 500, 471, stone, 150, 100), new boundary(500, 471, 0, 500, stone, 250, 0)
  ]
  floors = [
    new floor(400, 500, 200, 0, 250, 0, red, {}), new floor(100, 100, 450, 50, 450, 0, red, {}), new floor(100, 100, 500, 100, 400, 45, red, {}),
    new floor(100, 100, 500, 150, 350, 0, red, {})
  ]
  player = new pc(100, 0, 100, 175, 0, 0, 4, floors[0])
  cam.centerX += player.x
  cam.eyeX += player.x
  cam.centerZ += player.z
  cam.eyeZ += player.z
  cam.centerY -= 175
  cam.eyeY -= 17
  console.log(cam)
  noStroke()
  stroke(255)
  //texture(img)
  strokeWeight(1)
  textFont(font)
}

function draw() {
  background(0)
  controls()
  if (keyIsDown(39)){
    console.log(cam.centerX, cam.centerY, cam.centerZ)
  }
  //cam.pan(-movedX/2)
  //cam.tilt(movedY/2);
  cam.tilt(keyIsDown(40))
  cam.tilt(-keyIsDown(38))
  cam.pan(-keyIsDown(39))
  cam.pan(keyIsDown(37))
  if (keyIsDown(39)){
    console.log(cam.centerX, cam.centerY, cam.centerZ)
  }
  for (let i of walls){
    push()
    fill(i.colour);
    translate(i.midX, i.midY, i.midZ + 450)
    rotateY(i.angle)
    plane(i.width, i.height)
    pop()
    line(i.x1, i.z1 + 450, i.x2, i.z2 + 450)
  }
  for (let i of floors){
    push()
    fill(i.colour)
    translate(i.x, -i.y, i.z + 450)
    rotateX(90)
    rotateZ(i.rotation)
    plane(i.width1, i.width2)
    pop()
  }
  //circle(player.x, player.z, 10)
  if (jumping){
    cam.centerY -= 2
    cam.eyeY -= 2
    player.y += 2
    player.eyeLevel += 2
    jumpHeight += 2
    if (jumpHeight >= 50){
      jumping = false
    }
  }
  else if (player.y > player.currentFloor.y){
    player.y -= 2
    cam.centerY += 2
    cam.eyeY += 2
    player.eyeLevel = player.y + player.height
    if (player.y <= player.currentFloor.y){
      jumpHeight = 0
    }
  }
  ui()
}

function controls(){
  if (keyIsDown(87)){//w
    //requestPointerLock()
    if(moveCheck('fw')){
      cam.move(0, 0, -player.speed)
    }
  }
  if (keyIsDown(83)){//s
    if(moveCheck('bw')){
      cam.move(0, 0, player.speed)
    }
  }
  if (keyIsDown(65)){//a
    if(moveCheck('lw')){
      cam.move(-player.speed, 0, 0)
    }
  }
  if (keyIsDown(68)){//d
    if(moveCheck('rw')){
      cam.move(player.speed, 0, 0)
    }
  }
  if (keyIsDown(32) && jumpHeight == 0){//space
    jumping = true
  }
  player.floorCheck()
  if (player.y < player.currentFloor.y){
    player.y = player.currentFloor.y
    player.eyeLevel = player.y + player.height
  }
  player.x = cam.eyeX
  player.z = cam.eyeZ
  cam.eyeY = -player.eyeLevel
}

function ui(){
  push()
  setCamera(uiCam)
  uiCam.setPosition(0, 0, 50)
  translate(0, 50, -50)
  fill(255, 0, 0)
  rect(0, 0, 50, 10)
  pop()
}