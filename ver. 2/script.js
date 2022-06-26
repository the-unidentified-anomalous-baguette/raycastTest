let red = [200,10, 10]
let stone = [128, 120, 133]

class pc{
  constructor(x, y, z, height, angleLR, angleUD, speed){
    this.x = x
    this.y = y
    this.z = z
    this.height = height
    this.angleLR = angleLR
    this.angleUD = angleUD
    this.speed = speed // cm/s
    this.eyeLevel = y + height
  }

  floorCheck(){
    for (let i of floors){
      if (player.y > i.y - i.catchZone){
        let rottedX = player.x * cos(i.rotation) - player.y * sin(i.rotation) //player x rotated to align with the tested floor tile
        let rottedZ = player.x * sin(i.rotation) + player.y * cos(i.rotation)
        if (rottedX > i.unrotX1 && rottedX < i.unrotX2 && rottedZ > i.unrotZ1 && rottedZ < i.unrotZ21){

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
  constructor(width1, width2, x, y, z, rotation, colour, {catchZone = 25}){
    this.width1 = width1
    this.width2 = width2
    this.x = x
    this.y = y
    this.z = z
    this.rotation = rotation
    this.colour = colour
    this.unrotX1 = x - width1/2
    this.unrotX2 = x + width1/2
    this.unrotZ1 = z - width2/2
    this.unrotZ2 = z + width2/2
  }
}

let cam;
let player;
let walls;
let floors;
let jumping = false
let jumpHeight = 0
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
    //console.log(x1, x2, x3, x4)
    // console.log(player.z)
    // console.log(z1, z2, z3, z4)
    let den = (x1-x2)*(z3-z4)-(z1-z2)*(x3-x4)
    let t = ((x1-x3)*(z3-z4)-(z1-z3)*(x3-x4))/den
    let u = ((x1-x3)*(z1-z2)-(z1-z3)*(x1-x2))/den
    //console.log(i)
    if (t >= 0 && t <= 1 && u >= 0 && u <= 2 && i.base <= player.eyeLevel && i.base + i.height >= player.y){
      return false
    }
  }
  return true
}

// function preload(){
//   img = loadImage('impdance.gif')
// }

function setup() {
  createCanvas(1024, 576, WEBGL);
  angleMode(DEGREES);
  noStroke();
  rectMode(CENTER)
  cam = createCamera();
  player = new pc(100, 0, 100, 175, 0, 0, 4)
  walls = [
    new boundary(0, 0, 400, 0, stone, 200, 0), new boundary(400, 0, 400, 400, stone, 200, 0), new boundary(400, 400, 500, 400, stone, 200, 0),
    new boundary(500, 400, 500, 500, stone, 200, 0), new boundary(500, 500, 0, 500, stone, 200, 0), new boundary(100, 500, 0, 0, stone, 200, 0)
  ]
  floors = [new floor(400, 500, 200, 0, 250, 0, red), new floor(100, 100, 450, 100, 450, 0, red)]
  cam.centerX += player.x
  cam.eyeX += player.x
  cam.centerZ += player.z
  cam.eyeZ += player.z
  cam.centerY -= 175
  cam.eyeY -= 175
  console.log(cam)
  //noStroke()
  stroke(255)
  //texture(img)
  strokeWeight(2)
}

function draw() {
  background(0)
  controls()
  cam.pan(-movedX/2)
  cam.tilt(movedY/2);
  cam.tilt(keyIsDown(40))
  cam.tilt(-keyIsDown(38))
  cam.pan(-keyIsDown(39))
  cam.pan(keyIsDown(37))
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
  circle(player.x, player.z, 10)
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
  else if (jumpHeight > 0){
    cam.centerY += 2
    cam.eyeY += 2
    player.y -= 2
    player.eyeLevel -= 2
    jumpHeight -= 2
    if (jumpHeight < 0){
      jumpHeight = 0
    }
  }
}

function controls(){
  if (keyIsDown(87)){//w
    //requestPointerLock()
    if(moveCheck('fw')){
      cam.move(0, 0, -player.speed)
      //cam.eyeY = player.trackedFloor.y
    }
  }
  if (keyIsDown(83)){//s
    if(moveCheck('bw')){
      cam.move(0, 0, player.speed)
      //cam.eyeY = player.trackedFloor.y
    }
  }
  if (keyIsDown(65)){//a
    if(moveCheck('lw')){
      cam.move(-player.speed, 0, 0)
      //cam.eyeY = player.trackedFloor.y
    }
  }
  if (keyIsDown(68)){//d
    if(moveCheck('rw')){
      cam.move(player.speed, 0, 0)
      //cam.eyeY = player.trackedFloor.y
    }
  }
  if (keyIsDown(32) && jumpHeight == 0){//space
    jumping = true
  }
  //player.floorCheck()
  player.x = cam.eyeX
  player.z = cam.eyeZ
  player.y = 0
}