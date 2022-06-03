class boundary{
  constructor(x1, y1, x2, y2){
    this.a = createVector(x1, y1)
    this.b = createVector(x2, y2)
    this.hyp = dist(x1, y1, x2, y2)
    this.adj = dist(x1, y1, x2, y1)
    this.cosAng = acos(this.adj/this.hyp)
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
    if (t >= 0 && t <= 1 && u > 0 && u < 1){
      return false
    } 
    return true
  }
}

class pc{
  constructor(x, y, angle, speed){
    this.x = x
    this.y = y
    this.angle = angle
    this.speed = speed
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
let rayReturn
let renderDist = 288
let horizon = 288

function setup(){
  rectMode(CORNER)
  ellipseMode(CENTER)
  angleMode(DEGREES)
  canvas = createCanvas(1024, 576)
  canvas.parent('container')
  stroke(255)
  fill(25)
  walls = [new boundary(100, 100, 200, 500), new boundary(200, 500, 300, 310), new boundary(500, 300, 700, 100), 
           new boundary(700, 100, 100, 100), new boundary(300, 300, 310, 300), new boundary(310, 300, 310, 310),
           new boundary(300, 310, 300, 300), new boundary(310, 310, 500, 300), new boundary(300, 300, 230, 230),
           new boundary(200, 200, 220, 200), new boundary(220, 200, 230, 230), new boundary(230, 230, 190, 205), 
           new boundary(190, 205, 200, 200)]
  frameRate(30)
  player = new pc(150, 150, 45, 2)
}

function draw(){
  background(color(100, 100, 255))
  fill(100, 50, 0)
  rect(0, horizon, 1024, 576 - horizon)
  for (let i = 288; i < 576; i++){
    fill(0, 0, 0, 255 - 255 * (i*i)/(577*577))
    rect(0, i, 1024, 1)
  }
  seenWalls = []
  if (keyIsDown(37)){
    player.angle -= player.speed
  }
  if (keyIsDown(39)){
    player.angle += player.speed
  }
  if (keyIsDown(16)){
    horizon = 188
  }
  else {horizon = 288}
  if (keyIsDown(87)){
    let canFw = false
    for (let i = 0; i < walls.length; i++){
      canFw = new ray(player.angle).hitCheck(walls[i])
      if (canFw == false){
        break
      }
    }
    if (canFw){
      player.x += sin(player.angle)
      player.y += -cos(player.angle)
    }
  }
  if (keyIsDown(83)){
    let canBw = false
    for (let i = 0; i < walls.length; i++){
      canBw = new ray(player.angle + 180).hitCheck(walls[i])
      if (canBw == false){
        break
      }
    }
    if (canBw){
      player.x -= sin(player.angle)
      player.y -= -cos(player.angle)
    }
  }
  if (keyIsDown(65)){
    let canLw = false
    for (let i = 0; i < walls.length; i++){
      canLw = new ray(player.angle - 90).hitCheck(walls[i])
      if (canLw == false){
        break
      }
    }
    if (canLw){
      player.x += -cos(player.angle)
      player.y -= sin(player.angle)
    }
  }
  if (keyIsDown(68)){
    let canRw = false
    for (let i = 0; i < walls.length; i++){
      canRw = new ray(player.angle + 90).hitCheck(walls[i])
      if (canRw == false){
        break
      }
    }
    if (canRw){
      player.x -= -cos(player.angle)
      player.y += sin(player.angle)
    }
  }
  for (let i = player.angle - 45; i <= player.angle + 45; i++){
    for (let j = 0; j < walls.length; j++){
      rayReturn = new ray(i).cast(walls[j])
      if (rayReturn <= 1){
        seenWalls.push([rayReturn, i])
        for (let k = 0; k < seenWalls.length - 1; k++){
          if (seenWalls[k][1] == seenWalls[seenWalls.length - 1][1]){
            if (seenWalls[k][0] < seenWalls[seenWalls.length - 1][0]){
              seenWalls.pop()
            }
          }
        }
      }
    }
  }
  noStroke()
  for (let i = 0; i < seenWalls.length; i++){
    fill(2048 / (255 * seenWalls[i][0] * seenWalls[i][0]), 512 / (255 * seenWalls[i][0] * seenWalls[i][0]), 0)
    rect(1024 * (45+seenWalls[i][1] - player.angle)/90, horizon - 144 * (1-Math.pow(seenWalls[i][0], -0.5)), 12, 288 * (1-Math.pow(seenWalls[i][0], -0.5)))
  }strokeWeight(1)
  for (let i = 0; i < walls.length; i++){
    stroke((0, 255, 0))
    walls[i].show()
  }
  noStroke()
  fill(0)
  circle(player.x, player.y, 10)
}
