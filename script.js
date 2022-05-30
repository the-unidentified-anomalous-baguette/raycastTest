class boundary{
  constructor(x1, y1, x2, y2){
    this.a = createVector(x1, y1)
    this.b = createVector(x2, y2)
  }

  show(){
    line(this.a.x, this.a.y, this.b.x, this.b.y)
  }
}

class ray{
  constructor(x, y){
    this.pos = createVector(x, y)
    this.dir = createVector(1, -1)
  }

  show(u){
    this.dir.x = sin(pAngle) * u
    this.dir.y = -cos(pAngle) * u
    push()
    translate(this.pos.x, this.pos.y)
    line(0, 0, this.dir.x * 1000, this.dir.y * 1000)
    pop()
  }

  cast(wall){
    let x1 = wall.a.x
    let x2 = wall.b.x
    let y1 = wall.a.y
    let y2 = wall.b.y

    circle(wall.a.x, wall.a.y, 20)
    circle(wall.b.x, wall.b.y, 20)

    let x3 = this.pos.x
    let x4 = x3 + this.dir.x
    let y3 = this.pos.y
    let y4 = y3 + this.dir.y

    let pt = createVector()

    let den = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4)
    if (den == 0){return}
    let t = ((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/den
    let u = ((x1-x3)*(y1-y2)-(y1-y3)*(x1-x2))/den
    this.show(u)
    //console.log(u)
    if (t >= 0 && t <= 1 && u >= 0){
      pt.x = ((x1*y2 - y1*x2)*(x3 - x4) - (x1-x2)*(x3*y4 - y3*x4))/den
      pt.y = ((x1*y2 - y1*x2)*(y3 - y4) - (y1-y2)*(x3*y4 - y3*x4))/den
      circle(pt.x, pt.y, 20)
      console.log(u, sqrt((x3 - pt.x)*(x3 - pt.x) + (y3 - pt.y)*(y3 - pt.y)))
      //console.log(true)
      return pt
    } else {return}
  }
}

let bound1
let bound2
let ray1
let pAngle = 0

function setup(){
  rectMode(CENTER)
  ellipseMode(CENTER)
  angleMode(DEGREES)
  canvas = createCanvas(1024, 576)
  canvas.parent('container')
  stroke(255)
  fill(25)
  bound1 = new boundary(200, 100, 300, 500)
  bound2 = new boundary(700, 50, 1000, 570)
  ray1 = new ray(500, 400)
}

function draw(){
  background(100)
  bound1.show()
  bound2.show()
  ray1.show(1)
  if (keyIsDown(37)){
    pAngle -= 1
  }
  if (keyIsDown(39)){
    pAngle += 1
  }
  ray1.cast(bound1)
  ray1.cast(bound2)
}
