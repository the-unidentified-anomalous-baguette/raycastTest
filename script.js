let map = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]]

let pX = 80
let pY = 80
let pRadius = 15
let pSpeed = 5
let mapSize = 16
let pDir = 0

function setup(){
  rectMode(CENTER)
  ellipseMode(CENTER)
  angleMode(DEGREES)
  canvas = createCanvas(1024, 576)
  canvas.parent('container')
}

function draw(){
  background(100)
  noStroke()
  fill((255, 255, 255))
  for (let i = 0; i < map.length; i++){
    for (let j = 0; j < map[i].length; j++){
      if (map[i][j] == 1){
        rect(j * mapSize + mapSize/2, i * mapSize + mapSize/2, mapSize, mapSize)
      }
    }
  }
  stroke(0)
  if (keyIsDown(37)){
    pDir -= 3
  }
  if (keyIsDown(39)){
    pDir += 3
  }
  if (keyIsDown(87)){
    if (map[Math.floor((pY-pRadius) / mapSize)][Math.floor((pX + pSpeed*sin(pDir) - pRadius) / mapSize)] != 1 && 
        map[Math.floor((pY+pRadius) / mapSize)][Math.floor((pX + pSpeed*sin(pDir) - pRadius) / mapSize)] != 1 &&
        map[Math.floor((pY-pRadius) / mapSize)][Math.floor((pX + pSpeed*sin(pDir) + pRadius) / mapSize)] != 1 &&
        map[Math.floor((pY+pRadius) / mapSize)][Math.floor((pX + pSpeed*sin(pDir) + pRadius) / mapSize)] != 1){
      pX += pSpeed*sin(pDir)
    }
    if (map[Math.floor((pY - pSpeed*cos(pDir) - pRadius) / mapSize)][Math.floor((pX-pRadius) / mapSize)] != 1 && 
        map[Math.floor((pY - pSpeed*cos(pDir) - pRadius) / mapSize)][Math.floor((pX+pRadius) / mapSize)] != 1 &&
        map[Math.floor((pY - pSpeed*cos(pDir) + pRadius) / mapSize)][Math.floor((pX-pRadius) / mapSize)] != 1 &&
        map[Math.floor((pY - pSpeed*cos(pDir) + pRadius) / mapSize)][Math.floor((pX+pRadius) / mapSize)] != 1){
      pY -= pSpeed*cos(pDir)
    }
  }
  if (keyIsDown(83)){
    if (map[Math.floor((pY-pRadius) / mapSize)][Math.floor((pX - pSpeed*sin(pDir) - pRadius) / mapSize)] != 1 && 
        map[Math.floor((pY+pRadius) / mapSize)][Math.floor((pX - pSpeed*sin(pDir) - pRadius) / mapSize)] != 1 &&
        map[Math.floor((pY-pRadius) / mapSize)][Math.floor((pX - pSpeed*sin(pDir) + pRadius) / mapSize)] != 1 &&
        map[Math.floor((pY+pRadius) / mapSize)][Math.floor((pX - pSpeed*sin(pDir) + pRadius) / mapSize)] != 1){
      pX -= pSpeed*sin(pDir)
    }
    if (map[Math.floor((pY + pSpeed*cos(pDir) - pRadius) / mapSize)][Math.floor((pX-pRadius) / mapSize)] != 1 && 
        map[Math.floor((pY + pSpeed*cos(pDir) - pRadius) / mapSize)][Math.floor((pX+pRadius) / mapSize)] != 1 &&
        map[Math.floor((pY + pSpeed*cos(pDir) + pRadius) / mapSize)][Math.floor((pX-pRadius) / mapSize)] != 1 &&
        map[Math.floor((pY + pSpeed*cos(pDir) + pRadius) / mapSize)][Math.floor((pX+pRadius) / mapSize)] != 1){
      pY += pSpeed*cos(pDir)
    }
  }
  if (keyIsDown(65)){
    if (map[Math.floor((pY-pRadius) / mapSize)][Math.floor((pX - pSpeed*cos(pDir) - pRadius) / mapSize)] != 1 && 
        map[Math.floor((pY+pRadius) / mapSize)][Math.floor((pX - pSpeed*cos(pDir) - pRadius) / mapSize)] != 1 &&
        map[Math.floor((pY-pRadius) / mapSize)][Math.floor((pX - pSpeed*cos(pDir) + pRadius) / mapSize)] != 1 &&
        map[Math.floor((pY+pRadius) / mapSize)][Math.floor((pX - pSpeed*cos(pDir) + pRadius) / mapSize)] != 1){
      pX -= pSpeed*cos(pDir)
    }
    if (map[Math.floor((pY - pSpeed*sin(pDir) - pRadius) / mapSize)][Math.floor((pX-pRadius) / mapSize)] != 1 && 
        map[Math.floor((pY - pSpeed*sin(pDir) - pRadius) / mapSize)][Math.floor((pX+pRadius) / mapSize)] != 1 &&
        map[Math.floor((pY - pSpeed*sin(pDir) + pRadius) / mapSize)][Math.floor((pX-pRadius) / mapSize)] != 1 &&
        map[Math.floor((pY - pSpeed*sin(pDir) + pRadius) / mapSize)][Math.floor((pX+pRadius) / mapSize)] != 1){
      pY -= pSpeed*sin(pDir)
    }
  }
  if (keyIsDown(68)){
    if (map[Math.floor((pY-pRadius) / mapSize)][Math.floor((pX + pSpeed*cos(pDir) - pRadius) / mapSize)] != 1 && 
        map[Math.floor((pY+pRadius) / mapSize)][Math.floor((pX + pSpeed*cos(pDir) - pRadius) / mapSize)] != 1 &&
        map[Math.floor((pY-pRadius) / mapSize)][Math.floor((pX + pSpeed*cos(pDir) + pRadius) / mapSize)] != 1 &&
        map[Math.floor((pY+pRadius) / mapSize)][Math.floor((pX + pSpeed*cos(pDir) + pRadius) / mapSize)] != 1){
      pX += pSpeed*cos(pDir)
    }
    if (map[Math.floor((pY + pSpeed*sin(pDir) - pRadius) / mapSize)][Math.floor((pX-pRadius) / mapSize)] != 1 && 
        map[Math.floor((pY + pSpeed*sin(pDir) - pRadius) / mapSize)][Math.floor((pX+pRadius) / mapSize)] != 1 &&
        map[Math.floor((pY + pSpeed*sin(pDir) + pRadius) / mapSize)][Math.floor((pX-pRadius) / mapSize)] != 1 &&
        map[Math.floor((pY + pSpeed*sin(pDir) + pRadius) / mapSize)][Math.floor((pX+pRadius) / mapSize)] != 1){
      pY += pSpeed*sin(pDir)
    }
  }
  fill((120, 50, 50))
  rect(pX, pY, pRadius * 2, pRadius * 2)
  line(pX, pY, pX + 40 *sin(pDir), pY - 40 * cos(pDir))
}