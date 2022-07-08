let red = [200,10, 10]
let stone = [128, 120, 133]
let purple = [127, 0, 255]

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
    for (let i of floors){ // check every floor tile
      if (player.y >= i.y - i.catchZone){
        let relX = player.x - i.x
        let relZ = player.z - i.z
        let rottedX = relX * cos(i.rotation) - relZ * sin(i.rotation)
        // player coords rotated to align with the tested floor tile
        let rottedZ = relX * sin(i.rotation) + relZ * cos(i.rotation)
        if (rottedX >= i.unrotX1 && rottedX <= i.unrotX2 
          && rottedZ >= i.unrotZ1 && rottedZ <= i.unrotZ2){
          // checking if player is on the tile
          player.currentFloor = i // sets the floor the player stands on
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

class pathNode{
  constructor(x, z, connectedNodes, id){
    this.x = x
    this.z = z
    this.connectedNodes = connectedNodes
    this.id = id
  }
}

class entity{
  constructor(x, y, z, spriteSheet, collWidth, height){
    this.x = x
    this.y = y
    this.z = z
    this.spriteSheet = spriteSheet
    this.collWidth = collWidth
    this.height = height
    this.midVert = - (y + height)/2
  }
  
  render(){
    // let relX = player.x - this.x
    // let relZ = player.z - this.z
    // let relRotX = relX * cos(player.angleLR) - relZ * sin(player.angleLR)
    // let relRotZ = relX * sin(player.angleLR) + relZ * cos(player.angleLR)
    // let extraAngle = asin((player.x - relRotX)/dist(this.x, this.z, player.x, player.z))
    //console.log(extraAngle)
    console.log(8-Math.floor((22.5+player.angleLR)/45))
    push()
    translate(this.x, this.midVert, this.z + 500)
    rotateY(360 - player.angleLR)
    image(this.spriteSheet,
      -this.collWidth/2, -this.height/2,
      this.collWidth, this.height,
      0, 122 * (8 - Math.floor(player.angleLR/45)),
      84, 122
      )
    pop()
  }
}

class ai extends entity{
  constructor(x, y, z, spriteSheet, collWidth, height, speed){
    super(x, y, z, spriteSheet, collWidth, height)
    this.path = []
    this.goal = []
    this.speed = speed
  }

  chooseGoal(){
    let foundGoal = false
    while (foundGoal == false){
      let nodes = []
      this.goal = [random(50, 430), random(50, 350)]
      // choose a random goal
      for (let i of grid){
        nodes.push([i, dist(i.x, i.z, this.goal[0], this.goal[1])])
      }
      nodes.sort(sortFunction)
      // put nodes into a list sorted by distance from goal
      while (nodes.length >= 1){
        for (let i of walls){
          if (intersectCheck(
            [nodes[0][0].x, nodes[0][0].z], this.goal, [i.x1, i.z1], [i.x2, i.z2])){
            // start from first sorted node, check if there's a wall between it and goal
            nodes.shift() // remove from list if there are
            break
          }
          else if (i == walls[walls.length - 1]){
            // if no walls, this is closest valid node to goal
            return nodes[0][0]
          }
        }
      }
    }
  }

  findFirstNode(){
    // does the same as the validating part of chooseGoal()
    // but compares to AI's own coords, not goal
    let nodes = []
    for (let i of grid){
      nodes.push([i, dist(this.x, this.z, i.x, i.z)])
    }
    nodes.sort(sortFunction)
    for (let i of nodes){
      for (let j of walls){
        if (intersectCheck(
          [this.x, this.z], [i[0].x, i[0].z], [j.x1, j.z1], [j.x2, j.z2])){
          break
        }
        else if (j == walls[walls.length - 1]){
          return i[0]
        }
      }
    }
  }

  findPath(dest){
    let paths = [[[this.path[0]]]]
    let pathFound = 0
    let whichNode = dest.id
    let onDupe = false
    while (pathFound == 0){
      for (let j of paths[paths.length - 1]){
        // if the destination is found, finish searching
        if (j[0].id == dest.id){
          pathFound = 1
          break
        }
      }
      if (pathFound == 0){
        // if not found, create new depth level
        paths.push([])
        for (let i of paths[paths.length - 2]){
          for (let j of i[0].connectedNodes){
            for (let k of paths){
              if (k != paths[paths.length - 1]){
                onDupe = false
                for (let l of k){
                  //i, j, k, l check every node added last time
                  //and see every node connected to them
                  //and checks if it is already on the tree
                  if (l[0].id == grid[j].id){
                    onDupe = true
                    break
                  }
                }
              }
            }
            if (onDupe == false){ // if a node isn't in tree
              // add it, and the node which was used to find it
              paths[paths.length - 1].push([grid[j], i[0].id])
            }
          }
        }
      }
    }
    // once destination found
    this.path = [] // clears path for formatting
    for (let i = paths.length - 1; i >= 0; i -= 1){
      // checks backwards through path tree
      for (let j of paths[i]){
        if (j[0].id == whichNode){
          // find which node was used to get current one
          this.path.unshift([j[0].x, j[0].z]) // add coords to path
          whichNode = j[1]
          // update which node needs to be found next
          break
        }
      }
    }
  }

  followPath(){
    let opp = this.x - this.path[0][0]
    let adj = this.path[0][1] - this.z
    let hyp = dist(this.x, this.z, this.path[0][0], this.path[0][1])
    let angle
    if (asin(opp/hyp) <= 0){
      angle = 360-acos(adj/hyp)
    }
    if(asin(opp/hyp) >= 0){
      angle = acos(adj/hyp)
    } // calculate the angle between north and the position to move to
    if (hyp > this.speed){
      this.x -= sin(angle) * this.speed
      this.z += cos(angle) * this.speed
    } // move towards next position in path
    else {
      this.x -= sin(angle) * hyp
      this.z += cos(angle) * hyp
    } // move directly onto it if close enough
    let pathLength = this.path.length
    for (let j = this.path.length - 1; j >= 0; j -= 1){
      for (let i of walls){
        // checks for shortcut
        if (intersectCheck([this.x, this.z], this.path[j], [i.x1, i.z1], [i.x2, i.z2])){
          break
        }
        else if (i == walls[walls.length - 1]){
          // if no walls between AI and final goal, remove intermediate nodes
          for (let k = 0; k < j; k++){
            this.path.shift()
          }
        }
      }
      if (this.path.length < pathLength){
        break
      }
    }
    if (Math.floor(this.x) == Math.floor(this.path[0][0]) && Math.floor(this.z) == Math.floor(this.path[0][1])){
      // if first location on path has been reached, remove it
      this.path.shift()
      if (this.path.length == 0){
        //if path complete, ensure it's clear for next cycle
        this.goal = []
        this.path = []
      }
    }
  }
}

class staticNPC extends entity{
  constructor(x, y, z, spriteSheet, collWidth, height, menu, inventory){
    super(x, y, z, spriteSheet, collWidth, height)
    this.menu = menu
    this.inventory = inventory
  }
}

class movingNPC extends ai{
  constructor(x, y, z, spriteSheet, collWidth, height, speed, menu, inventory){
    super(x, y, z, spriteSheet, collWidth, height, speed)
    this.menu = menu
    this.inventory = inventory
  }
}

class container extends entity{
  constructor(x, y, z, spriteSheet, collWidth, height, inventory){
    super(x, y, z, spriteSheet, collWidth, height)
    this.inventory = inventory
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
let grid
let objects
let img

function moveCheck(dir){
  let x3 = player.x
  let z3 = player.z
  let x4
  let z4
  if (dir == 'fw'){
    x4 = player.x + sin(player.angleLR) * player.speed
    z4 = player.z - cos(player.angleLR) * player.speed
  }
  else if (dir == 'bw'){
    x4 = player.x - sin(player.angleLR) * player.speed
    z4 = player.z + cos(player.angleLR) * player.speed
  }
  else if (dir == 'lw'){
    x4 = player.x - cos(player.angleLR) * player.speed
    z4 = player.z - sin(player.angleLR) * player.speed
  }
  else {
    x4 = player.x + cos(player.angleLR) * player.speed
    z4 = player.z + sin(player.angleLR) * player.speed
  }

  for (let i of walls){
    let x1 = i.x1
    let x2 = i.x2
    let z1 = i.z1
    let z2 = i.z2
    let den = (x1-x2)*(z3-z4)-(z1-z2)*(x3-x4)
    let t = ((x1-x3)*(z3-z4)-(z1-z3)*(x3-x4))/den
    let u = ((x1-x3)*(z1-z2)-(z1-z3)*(x1-x2))/den
    if (t >= 0 && t <= 1 && u >= 0 && u <= 1 && i.base <= player.eyeLevel && i.base + i.height >= player.y + 51){
      return false
    }
  }
  return true
}

function preload(){
  //font = loadFont('upperercase.ttf')
  img = loadImage('imp.png')
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
    new boundary(0, 0, 0, 200, stone, 250, 0), new boundary(0, 200, 400, 400, stone, 250, 0), new boundary(400, 400, 600, 0, stone, 250, 0),
    new boundary(600, 0, 700, 100, stone, 250, 0), new boundary(700, 100, 750, 500, stone, 250, 0), new boundary(750, 500, 600, 600, stone, 250, 0),
    new boundary (600, 600, 600, 700, stone, 250, 0), new boundary(600, 700, 700, 750, stone, 250, 0), new boundary(700, 750, 750, 1000, stone, 250, 0),
    new boundary(750, 1000, 400, 900, stone, 250, 0), new boundary(400, 900, 400, 500, stone, 250, 0), new boundary(400, 500, -50, 400, stone, 250, 0),
    new boundary(-50, 400, -100, 0, stone, 250, 0), new boundary(-100, 0, 0, 0, stone, 250, 0)
  ]
  floors = [
    new floor(900, 1000, 350, 0, 550, 0, red, {})
  ]
  grid = [
    new pathNode(-25, 250, [1], 'a'), new pathNode(450, 450, [0], 'b'), new pathNode(500, 800, [1], 'c')
  ]
  objects = [new entity(500, 0, 500, img, 50, 175)]
  player = new pc(100, 0, 400, 175, 0, 0, 4, floors[0])
  cam.centerX += player.x
  cam.eyeX += player.x
  cam.centerY -= 175
  cam.eyeY -= 17
  cam.centerZ += player.z
  cam.eyeZ += player.z
  cam.cameraNear = 0
  uiCam.cameraNear = 0
  console.log(uiCam)
  noStroke()
  //stroke(255)
  frameRate(30)
  //texture(img)
  //strokeWeight(1)
  //textFont(font)
}

function draw() {
  background(0)
  controls()
  cam.pan(0)
  cam.tilt(0)

  for (let i of walls){
    push()
    fill(i.colour);
    translate(i.midX, i.midY, i.midZ + 500)
    rotateY(i.angle)
    plane(i.width, i.height)
    pop()
    //line(i.x1, i.z1, i.x2, i.z2)
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
  for (let i of grid){
    circle(i.x, i.z, 10)
  }
  for (let i of objects){
    i.render()
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
    if(moveCheck('fw')){
      player.x += player.speed * sin(player.angleLR)
      player.z -= player.speed * cos(player.angleLR)
      cam.eyeX += player.speed * sin(player.angleLR)
      cam.eyeZ -= player.speed * cos(player.angleLR)
    }
  }
  if (keyIsDown(83)){//s
    if(moveCheck('bw')){
      player.x -= player.speed * sin(player.angleLR)
      player.z += player.speed * cos(player.angleLR)
      cam.eyeX -= player.speed * sin(player.angleLR)
      cam.eyeZ += player.speed * cos(player.angleLR)
    }
  }
  if (keyIsDown(65)){//a
    if(moveCheck('lw')){
      player.x -= player.speed * cos(player.angleLR)
      player.z -= player.speed * sin(player.angleLR)
      cam.eyeX -= player.speed * cos(player.angleLR)
      cam.eyeZ -= player.speed * sin(player.angleLR)
    }
  }
  if (keyIsDown(68)){//d
    if(moveCheck('rw')){
      player.x += player.speed * cos(player.angleLR)
      player.z += player.speed * sin(player.angleLR)
      cam.eyeX += player.speed * cos(player.angleLR)
      cam.eyeZ += player.speed * sin(player.angleLR)
    }
  }
  if (keyIsDown(37)){//left
    player.angleLR -= 3
    if (player.angleLR < 0){
      player.angleLR += 360
    }
  }
  if (keyIsDown(38)){//up
    if (player.angleUD < 75){
      player.angleUD += 1
    }
  }
  if (keyIsDown(39)){//right key
    player.angleLR += 3 // rotate right
    if (player.angleLR > 360){
      player.angleLR -= 360
    }
  }
  if (keyIsDown(40)){//down key
    if (player.angleUD > -45){ // limit angle
      player.angleUD -= 1
    }
  }
  cam.eyeY = -player.eyeLevel
  // adjust view around player by trig values
  cam.centerX = cam.eyeX + sin(player.angleLR)
  cam.centerY = cam.eyeY - tan(player.angleUD)
  cam.centerZ = cam.eyeZ - cos(player.angleLR)
  if (keyIsDown(32) && jumpHeight == 0){//space
    jumping = true
  }
  player.floorCheck()
  if (player.y < player.currentFloor.y){
    player.y += player.speed
    player.eyeLevel = player.y + player.height
  }
}

function ui(){
  push() // auto reverses changes
    strokeWeight(0.1)
    stroke(255)
    setCamera(uiCam) // switches cam
    uiCam.setPosition(0, 0, 50)
    push() // health bar
      translate(0, 25, 0)
      fill(255, 0, 0)
      rect(0, 0, 30, 3) // replace 50 with hp
    pop()
    push() // crosshair
      line(-1, -1, 1, 1)
      line(1, -1, -1, 1)
    pop()
  pop()
}