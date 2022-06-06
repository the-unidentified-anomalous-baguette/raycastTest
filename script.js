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
    this.height = height
    this.base = base
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
  constructor(x, y, z, angle, speed, height){
    this.x = x
    this.y = y
    this.angle = angle
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
let rayReturn
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
  seenWalls = []
  for (let i = player.angle - 45; i <= player.angle + 45; i+=.5){
    for (let j = 0; j < walls.length; j++){
      rayReturn = new ray(i).cast(walls[j])
      if (rayReturn <= 1){
        seenWalls.push([rayReturn, i, walls[j]])
        // for (let k = 0; k < seenWalls.length - 1; k++){
        //   if (seenWalls[k][1] == seenWalls[seenWalls.length - 1][1]){
        //     if (seenWalls[k][0] < seenWalls[seenWalls.length - 1][0]){
        //       seenWalls.pop()
        //     }
        //     else {
        //       seenWalls.splice(k, 1)
        //     }
        //   }
        // }
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
  walls = [new boundary(3, 5, 57, 8, stone, 50), new boundary(57, 8, 67, 29, stone, 50), new boundary(67, 29, 101, 34, red, 50), 
           new boundary(101, 34, 116, 22, stone, 50), new boundary(116, 22, 145, 24, stone, 50), new boundary(145, 24, 181, 59, stone, 50),
           new boundary(151, 50, 140, 71, stone, 50), new boundary(112, 70, 100, 39, stone, 50), new boundary(151, 50, 164, 77, stone, 50),
           new boundary(100, 39, 66, 39, red, 50), new boundary(66, 39, 49, 69, stone, 50), new boundary(49, 69, 3, 57, stone, 50), 
           new boundary(3, 57, 3, 5, stone, 50), new boundary(140, 71, 140, 83, stone, 50), new boundary(140, 83, 158, 101, stone, 50), 
           new boundary(158, 101, 164, 93, stone, 50), new boundary(164, 93, 156, 85, stone, 50), new boundary(156, 85, 164, 77, stone, 50), 
           new boundary(195, 95, 195, 123, stone, 50), new boundary(195, 123, 156, 133, stone, 50), new boundary(181, 59, 195, 95, red, 50),
           new boundary(156, 133, 149, 107, stone, 50), new boundary(149, 107, 112, 70, stone, 50)]
  frameRate(30)
  player = new pc(10, 10, 0, 45, 2, 288)
  renderCalc()
}

function draw(){
  background(color(100, 100, 255))
  fill(100, 50, 0)
  
  if (keyIsDown(37)){
    player.angle -= player.speed
    renderCalc()
  }
  if (keyIsDown(39)){
    player.angle += player.speed
    renderCalc()
  }
  if (keyIsDown(40)){
    horizon -= player.speed * 10
    if (horizon < 0){
      horizon = 0
    }
  }
  if (keyIsDown(38)){
    horizon += player.speed * 10
    if (horizon > 576){
      horizon = 576
    }
  }
  // if (keyIsDown(16)){
  //   horizon = 188
  // }
  //else {horizon = 288}
  rect(0, horizon, 1024, 576 - horizon)
  for (let i = 0; i < 576 - horizon; i++){
    fill(0, 0, 0, 255 - (255 * i/576))
    rect(0, i + horizon, 1024, 1)
  }
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
      renderCalc()
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
      renderCalc()
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
      renderCalc()
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
      renderCalc()
    }
  }
  noStroke()
  for (let i = 0; i < seenWalls.length; i++){
    fill(seenWalls[i][2].colour[0], seenWalls[i][2].colour[1], seenWalls[i][2].colour[2])
    rect(1024 * (45+seenWalls[i][1] - player.angle)/90, 
    horizon - seenWalls[i][2].height * (1-Math.pow(seenWalls[i][0], -0.9))/2 , 
    //Math.log(2 - seenWalls[i][0]),
    6.5, 
    //(Math.pow(Math.log(seenWalls[i][0]+1), 0.5) + Math.log(seenWalls[i][0])) * seenWalls[i][2].height)
    seenWalls[i][2].height * (1-Math.pow(seenWalls[i][0], -0.5)))
    //fill(0, 0, 0, 256 * seenWalls[i][0] * seenWalls[i][0] * 8)
    // fill(2048 / (255 * seenWalls[i][0] * seenWalls[i][0]), 0, 0, (256 / (255 * seenWalls[i][0] * seenWalls[i][0]))/256 - 50)
    // rect(1024 * (45+seenWalls[i][1] - player.angle)/90, horizon - 144 * (1-Math.pow(seenWalls[i][0], -0.5)), 
    // 12, 288 * (1-Math.pow(seenWalls[i][0], -0.5)))
  }strokeWeight(1)
  for (let i = 0; i < walls.length; i++){
    stroke((0, 255, 0))
    walls[i].show()
  }
  noStroke()
  fill(0)
  circle(player.x, player.y, 10)
  text(Math.ceil(frameRate()), 10, 20);
}
