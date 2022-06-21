let red = [200,10, 10]
let stone = [127, 127, 127]

class boundary{
  constructor(x1, y1, x2, y2, colour, height, base){
    this.a = createVector(x1, y1)
    this.b = createVector(x2, y2)
    this.hyp = dist(x1, y1, x2, y2)
    this.adj = dist(x1, y1, x2, y1)
    this.cosAng = acos(this.adj/this.hyp)
    this.colour = colour
    this.height = height * 288/175
    this.base = base * 288/175
  }

  show(){
    stroke(color(0, 255, 0))
    line(this.a.x, this.a.y, this.b.x, this.b.y)
    stroke(255)
  }
}

class ray{
  constructor(dir){
    this.pos = createVector(player.x, player.y)
    this.dir = createVector(sin(dir), -cos(dir))
  }

  show(u){
    push()
    translate(this.pos.x, this.pos.y)
    line(0, 0, this.dir.x * u, this.dir.y * u)
    pop()
  }

  cast(wall){
    let x1 = wall.a.x
    let x2 = wall.b.x
    let y1 = wall.a.y
    let y2 = wall.b.y

    let x3 = this.pos.x
    let x4 = x3 + (this.dir.x * renderDist)
    let y3 = this.pos.y
    let y4 = y3 + (this.dir.y * renderDist)

    let pt = createVector()

    let den = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4)
    if (den == 0){return 2}
    let t = ((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/den
    let u = ((x1-x3)*(y1-y2)-(y1-y3)*(x1-x2))/den
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1){
      pt.x = ((x1*y2 - y1*x2)*(x3 - x4) - (x1-x2)*(x3*y4 - y3*x4))/den
      pt.y = ((x1*y2 - y1*x2)*(y3 - y4) - (y1-y2)*(x3*y4 - y3*x4))/den
      //this.show(u)
      return u
    } else {return 2}
  }

  hitCheck(wall){
    let x1 = wall.a.x
    let x2 = wall.b.x
    let y1 = wall.a.y
    let y2 = wall.b.y

    let x3 = this.pos.x
    let x4 = x3 + (this.dir.x * player.speed)
    let y3 = this.pos.y
    let y4 = y3 + (this.dir.y * player.speed)

    let den = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4)
    if (den == 0){return true}
    let t = ((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/den
    let u = ((x1-x3)*(y1-y2)-(y1-y3)*(x1-x2))/den
    if (t >= 0 && t <= 1 && u > 0 && u < 1 && wall.base < player.eyeLevel && wall.base + wall.height > player.z){
      return false
    } 
    return true
  }
}

class pc{
  constructor(x, y, z, angley, anglex, speed, height){
    this.x = x
    this.y = y
    this.angley = angley
    this.anglex = anglex
    this.speed = speed
    this.z = z
    this.height = height
    this.eyeLevel = z + height
  }

  parallelMove(wall){
    let parrComp = sin(wall.cosAng) * player.speed
    let xComp = cos(wall.cosAng) * parrComp
    let yComp = -sin(wall.cosAng) * parrComp
    player.x += xComp
    player.y += yComp
  }
}

let walls
let player
let seenWalls = []
let renderDist = 288
let horizon = 288

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] > b[0]) ? -1 : 1;
    }
}

function renderCalc(){
  let rayReturn
  let rendIst
  let rayAng
  let opp = 0
  seenWalls = []
  for (let i = 0; i <= 45; i = atan(opp + 1/90)){
    opp = tan(i)
    for (let j = 0; j < walls.length; j++){
      rayAng = player.angley + i
      rayReturn = new ray(rayAng).cast(walls[j])
      if (rayReturn <= 1){
        seenWalls.push([rayReturn, rayAng, walls[j]])
      }
      rayAng = player.angley - i
      rayReturn = new ray(rayAng).cast(walls[j])
      if (rayReturn <= 1){
        seenWalls.push([rayReturn, rayAng, walls[j]])
      }
    }
  }
  seenWalls.sort(sortFunction);
}

function setup(){
  rectMode(CORNER)
  ellipseMode(CENTER)
  angleMode(DEGREES)
  colorMode(RGB, 255)
  canvas = createCanvas(1024, 576)
  canvas.parent('container')
  stroke(255)
  fill(25)
  walls = [new boundary(3, 5, 57, 8, stone, 600, 0), new boundary(57, 8, 67, 29, stone, 200, 0), new boundary(67, 29, 101, 34, red, 100, 100), 
           new boundary(101, 34, 116, 22, stone, 550, 0), new boundary(116, 22, 145, 24, stone, 50, 500), new boundary(145, 24, 181, 59, stone, 50, 0),
           new boundary(112, 70, 100, 39, stone, 50, 0), new boundary(140, 71, 164, 77, stone, 50, 0),
           new boundary(100, 39, 66, 39, red, 100, 200), new boundary(66, 39, 49, 69, stone, 200, 0), new boundary(49, 69, 3, 57, stone, 200, 0), 
           new boundary(3, 57, 3, 5, stone, 200, 0), new boundary(140, 71, 140, 83, stone, 50, 0), new boundary(140, 83, 158, 101, stone, 50, 0), 
           new boundary(158, 101, 164, 93, stone, 50, 0), new boundary(164, 93, 156, 85, stone, 50, 0), new boundary(156, 85, 164, 77, stone, 50, 0), 
           new boundary(195, 95, 195, 123, stone, 50, 0), new boundary(195, 123, 156, 133, stone, 50, 0), new boundary(181, 59, 195, 95, red, 50, 0),
           new boundary(156, 133, 112, 70, stone, 50, 0)]
  frameRate(30)
  player = new pc(50, 35, 0, 90, 0, 2, 175)
  renderCalc()
}

let jumping
function draw(){
  background(color(100, 100, 255))
  fill(100, 50, 0)
  
  if (keyIsDown(37)){
    player.angley -= player.speed
    if (player.angley < 0){
      player.angley += 360
    }
    renderCalc()
  }
  if (keyIsDown(39)){
    player.angley += player.speed
    if (player.angley > 360){
      player.angley -= 360
    }
    renderCalc()
  }
  if (keyIsDown(40)){
    player.anglex -= 1
    if (player.anglex < -45){
      player.anglex = -45
    }
    horizon = 288 + 288 * tan(player.anglex)
  }
  if (keyIsDown(38)){
    player.anglex += 1
    if (player.anglex > 45){
      player.anglex = 45
    }
    horizon = 288 + 288 * tan(player.anglex)
  }
  rect(0, 288 + (576 * tan(player.anglex)), 1024, 576 - 288 * tan(player.anglex))
  if (keyIsDown(87)){
    let canFw = false
    for (let i = 0; i < walls.length; i++){
      canFw = new ray(player.angley).hitCheck(walls[i])
      if (canFw == false){
        break
      }
    }
    if (canFw){
      player.x += sin(player.angley)
      player.y += -cos(player.angley)
      renderCalc()
    }
  }
  if (keyIsDown(83)){
    let canBw = false
    for (let i = 0; i < walls.length; i++){
      canBw = new ray(player.angley + 180).hitCheck(walls[i])
      if (canBw == false){
        break
      }
    }
    if (canBw){
      player.x -= sin(player.angley)
      player.y -= -cos(player.angley)
      renderCalc()
    }
  }
  if (keyIsDown(65)){
    let canLw = false
    for (let i = 0; i < walls.length; i++){
      canLw = new ray(player.angley - 90).hitCheck(walls[i])
      if (canLw == false){
        break
      }
    }
    if (canLw){
      player.x += -cos(player.angley)
      player.y -= sin(player.angley)
      renderCalc()
    }
  }
  if (keyIsDown(68)){
    let canRw = false
    for (let i = 0; i < walls.length; i++){
      canRw = new ray(player.angley + 90).hitCheck(walls[i])
      if (canRw == false){
        break
      }
    }
    if (canRw){
      player.x -= -cos(player.angley)
      player.y += sin(player.angley)
      renderCalc()
    }
  }
  if (keyIsDown(32)){
    jumping = true
  }
  if (jumping){
    player.z += 5
    if (player.z >= 100){
      jumping = false
    }
  }
  else if (player.z > 0){
    player.z -= 5
    if (player.z < 0){
      player.z = 0
    }
  }
  player.eyeLevel = player.z + player.height
  noStroke()
  for (let i = 0; i < seenWalls.length; i++){
    fill(seenWalls[i][2].colour[0] * (1 - seenWalls[i][0]) * (1 - seenWalls[i][0]) * (1 - seenWalls[i][0]),
    seenWalls[i][2].colour[1] * (1 - seenWalls[i][0]) * (1 - seenWalls[i][0]) * (1 - seenWalls[i][0]),
    seenWalls[i][2].colour[2] * (1 - seenWalls[i][0]) * (1 - seenWalls[i][0]) * (1 - seenWalls[i][0]))
    rect(
      512 - (512 * (player.angley-seenWalls[i][1])/45) - 4,
      horizon + (288 * (1-seenWalls[i][0])) + //flat distance
      (288 * tan(player.anglex) * seenWalls[i][0]) + //player rotation
      ((player.eyeLevel - seenWalls[i][2].base) * (1-seenWalls[i][0])), //vertical distance
      8, 
      (-seenWalls[i][2].height * (1-seenWalls[i][0])) - Math.abs((1-seenWalls[i][0]) * tan(player.anglex))// + ((1-seenWalls[i][0]) * seenWalls[i][2].height * tan(player.anglex))
      )
  }
  strokeWeight(1)
  for (let i = 0; i < walls.length; i++){
    stroke((0, 255, 0))
    walls[i].show()
  }
  line(502, 288, 522, 288)
  line(512, 278, 512, 298)
  noStroke()
  fill(0)
  circle(player.x, player.y, 10)
  text(Math.floor(frameRate()), 10, 20);
}

function keyPressed() {
  if (keyCode == SHIFT){
    if (player.height == 80){
      player.height = 175
    }
    else {
      player.height = 80
    }
  }
}