let red = [200,10, 10]
let green = [10, 200, 10]
let stone = [128, 120, 133]
let purple = [127, 0, 255]

class menuButton{
  constructor(x, y, w, h, func, spriteSheet, sW, sH){
    this.collX = x
    this.collY = y
    this.collW = x + w
    this.collH = y + h
    this.h = h
    this.w = w
    this.transX = x + (w/2)
    this.transY = y + (h/2)
    this.func = func
    this.spriteSheet = spriteSheet
    this.sW = sW
    this.sH = sH
  }

  checkHovered(){
    let mousePosX = mouseX - 512
    let mousePosY = mouseY - 288
    if (mousePosX >= this.collX && mousePosX <= this.collW && mousePosY >= this.collY && mousePosY <= this.collH){
      return 1
    }
    return 0
  }

  render(){
    push()
      translate(this.transX, this.transY, 0)
      fill(this.spriteSheet[this.checkHovered()])
      rect(0, 0, this.w, this.h)
    pop()
  }

  executeFunc(){
    if (this.checkHovered()){
      switch (this.func){
        case 'beginGame':
          beginGame()
          break
      }
    }
  }
}

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
        else {
          player.currentFloor = floors[0]
        }
      }
    }
  }

  moveCheck(dir){
    let x3 = this.x
    let z3 = this.z
    let x4
    let z4
    let den
    let t
    let u
    if (dir == 'fw'){
      x4 = this.x + sin(this.angleLR) * this.speed
      z4 = this.z - cos(this.angleLR) * this.speed
    }
    else if (dir == 'bw'){
      x4 = this.x - sin(this.angleLR) * this.speed
      z4 = this.z + cos(this.angleLR) * this.speed
    }
    else if (dir == 'lw'){
      x4 = this.x - cos(this.angleLR) * this.speed
      z4 = this.z - sin(this.angleLR) * this.speed
    }
    else {
      x4 = this.x + cos(this.angleLR) * this.speed
      z4 = this.z + sin(this.angleLR) * this.speed
    }
  
    for (let i of walls){
      let x1 = i.x1
      let x2 = i.x2
      let z1 = i.z1
      let z2 = i.z2
      let dz = i.z2 - i.z1
      dz *= 75/i.width
      let dx = i.x2 - i.x1
      dx *= 75/i.width
      x3 = x4 + dz
      z3 = z4 - dx
      den = (x1-x2)*(z3-z4)-(z1-z2)*(x3-x4)
      t = ((x1-x3)*(z3-z4)-(z1-z3)*(x3-x4))/den
      u = ((x1-x3)*(z1-z2)-(z1-z3)*(x1-x2))/den
      if (t >= 0 && t <= 1 && u >= 0 && u <= 1 && i.base <= this.eyeLevel && i.base + i.height >= this.y + 51){
        return false
      }
      x3 = x4 - dz
      z3 = z4 + dx
      den = (x1-x2)*(z3-z4)-(z1-z2)*(x3-x4)
      t = ((x1-x3)*(z3-z4)-(z1-z3)*(x3-x4))/den
      u = ((x1-x3)*(z1-z2)-(z1-z3)*(x1-x2))/den
      if (t >= 0 && t <= 1 && u >= 0 && u <= 1 && i.base <= this.eyeLevel && i.base + i.height >= this.y + 51){
        return false
      }
      // x1 = i.x1
      // x2 = i.x2
      // z1 = i.z1
      // z2 = i.z2
      // x3 = this.x
      // z3 = this.z
      // den = (x1-x2)*(z3-z4)-(z1-z2)*(x3-x4)
      // t = ((x1-x3)*(z3-z4)-(z1-z3)*(x3-x4))/den
      // u = ((x1-x3)*(z1-z2)-(z1-z3)*(x1-x2))/den
      // if (t >= 0 && t <= 1 && u >= 0 && u <= 1 && i.base <= this.eyeLevel && i.base + i.height >= this.y + 51){
      //   return false
      // }
    }
    return true
  }

  controls(){
    if (keyIsDown(87)){//w
      if(this.moveCheck('fw')){
        this.x += this.speed * sin(this.angleLR)
        this.z -= this.speed * cos(this.angleLR)
        cam.eyeX += this.speed * sin(this.angleLR)
        cam.eyeZ -= this.speed * cos(this.angleLR)
      }
    }
    if (keyIsDown(83)){//s
      if(this.moveCheck('bw')){
        this.x -= this.speed * sin(this.angleLR)
        this.z += this.speed * cos(this.angleLR)
        cam.eyeX -= this.speed * sin(this.angleLR)
        cam.eyeZ += this.speed * cos(this.angleLR)
      }
    }
    if (keyIsDown(65)){//a
      if(this.moveCheck('lw')){
        this.x -= this.speed * cos(this.angleLR)
        this.z -= this.speed * sin(this.angleLR)
        cam.eyeX -= this.speed * cos(this.angleLR)
        cam.eyeZ -= this.speed * sin(this.angleLR)
      }
    }
    if (keyIsDown(68)){//d
      if(this.moveCheck('rw')){
        this.x += this.speed * cos(this.angleLR)
        this.z += this.speed * sin(this.angleLR)
        cam.eyeX += this.speed * cos(this.angleLR)
        cam.eyeZ += this.speed * sin(this.angleLR)
      }
    }
    if (keyIsDown(37)){//left
      this.angleLR -= 3
      if (this.angleLR < 0){
        this.angleLR += 360
      }
    }
    if (keyIsDown(38)){//up
      if (this.angleUD < 75){
        this.angleUD += 1
      }
    }
    if (keyIsDown(39)){//right key
      this.angleLR += 3 // rotate right
      if (this.angleLR > 360){
        this.angleLR -= 360
      }
    }
    if (keyIsDown(40)){//down key
      if (this.angleUD > -45){ // limit angle
        this.angleUD -= 1
      }
    }
    if (keyIsDown(27)){
      gameState = 'pause'
    }
    cam.eyeY = -this.eyeLevel
    // adjust view around player by trig values
    cam.centerX = cam.eyeX + sin(this.angleLR)
    cam.centerY = cam.eyeY - tan(this.angleUD)
    cam.centerZ = cam.eyeZ - cos(this.angleLR)
    if (keyIsDown(32) && jumpHeight == 0){//space
      jumping = true
    }
    this.floorCheck()
    if (this.y < this.currentFloor.y){
      this.y += this.speed
      this.eyeLevel = this.y + this.height
    }
  }

  interactCheck(){

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

  render(){
    push()
    texture(brick)
    // strokeWeight(2)
    // stroke(255, 0, 0)
    // fill(this.colour);
    translate(this.midX, this.midY, this.midZ + 500)
    rotateY(this.angle)
    plane(this.width, this.height)
    pop()
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

  render(){
    push()
    texture(brick)
    // strokeWeight(2)
    // stroke(0, 255, 0)
    // fill(this.colour)
    translate(this.x, -this.y, this.z + 450)
    rotateX(90)
    rotateZ(this.rotation)
    plane(this.width1, this.width2)
    pop()
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
    let spriteAngle = Math.floor((360-player.angleLR + 22.5)/45)
    if (spriteAngle == 8){
      spriteAngle = 0
    }
    push()
    translate(this.x, this.midVert, this.z + 500)
    rotateY(360 - player.angleLR)
    image(this.spriteSheet,
      -this.collWidth/2, -this.height/2,
      this.collWidth, this.height,
      0, (122 * spriteAngle) + 1,
      84, 122
      )
    pop()
  }
}

class ai extends entity{
  constructor(x, y, z, spriteSheet, collWidth, height, speed, angle, inventory, trackingMode){
    super(x, y, z, spriteSheet, collWidth, height)
    this.path = []
    this.goal = []
    this.speed = speed
    this.inventory = inventory
    this.trackingMode = trackingMode
    this.angle = angle
  }

  render(){
    let spriteAngle = Math.floor((this.angle - player.angleLR + 22.5 + 180)/45)
    if (spriteAngle >= 8){
      spriteAngle -= 8
    }
    else if (spriteAngle < 0){
      spriteAngle += 8
    }
    push()
    translate(this.x, this.midVert, this.z + 500)
    rotateY(360 - player.angleLR)
    image(this.spriteSheet,
      -this.collWidth/2, -this.height/2,
      this.collWidth, this.height,
      0, (122 * spriteAngle) + 1,
      84, 122
      )
    pop()
  }

  chooseGoal(){
    let foundGoal = false
    while (foundGoal == false){
      let nodes = []
      this.goal = [player.x, player.z]
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
    this.angle = angle
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

  fullPathfinding(){
    let finalNode
    if (this.goal.length == 0){ // if the AI has no goal
      finalNode = this.chooseGoal() 
      // run goal finding algorithm (chooses goal and finds nearest node to it)
      for (let i of walls){ // override for goal with unobstructed path
        if (intersectCheck([this.x, this.z], this.goal, [i.x1, i.z1], [i.x2, i.z2])){
          break
        }
        else if (i == walls[walls.length - 1]){ 
          // if no walls between AI and goal, skip pathfinding
          this.path = [this.goal]
        }
      }
      if (this.path.length == 0){ // pathFinding
        this.path.push(this.findFirstNode()) // find first node
        this.findPath(finalNode) // find path from there to goal's nearest node
        this.path.push(this.goal) // add final goal to end of instructions
      }
    }
    // if it has a path, follow it
    this.followPath()
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
  constructor(x, y, z, spriteSheet, collWidth, height, speed, angle, menu, inventory, trackingMode){
    super(x, y, z, spriteSheet, collWidth, height, speed, angle, inventory, trackingMode)
    this.menu = menu
  }
}

class container extends entity{
  constructor(x, y, z, spriteSheet, collWidth, height, inventory){
    super(x, y, z, spriteSheet, collWidth, height)
    this.inventory = inventory
  }
}

function beginGame(){
  gameState = 'game'
}

function sortFunction(a, b) {
  if (a[1] === b[1]) {
      return 0;
  }
  else {
      return (a[1] < b[1]) ? -1 : 1;
  }
}

function intersectCheck(l11, l12, l21, l22){
  let x1 = l21[0]
  let x2 = l22[0]
  let z1 = l21[1]
  let z2 = l22[1]

  let x3 = l11[0]
  let x4 = l12[0]
  let z3 = l11[1]
  let z4 = l12[1]

  let den = (x1-x2)*(z3-z4)-(z1-z2)*(x3-x4)
  if (den == 0){return false}
  let t = ((x1-x3)*(z3-z4)-(z1-z3)*(x3-x4))/den
  let u = ((x1-x3)*(z1-z2)-(z1-z3)*(x1-x2))/den
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1){
    return true
  } 
  return false
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
let impSprite
let brick
let gameState = 'menu'
let mainMenuButts
let interactibles

function preload(){
  font = loadFont('upperercase.ttf')
  impSprite = loadImage('imp.png')
  brick = loadImage('brickTemp.png')
}

function setup() {
  createCanvas(1024, 576, WEBGL);
  angleMode(DEGREES);
  textAlign(CENTER)
  noStroke();
  rectMode(CENTER)
  mainMenuButts = [
    new menuButton(-512, -5, 200, 50, 'beginGame', [red, green], 0, 0)
  ]
  cam = createCamera();
  uiCam = createCamera();
  setCamera(cam)
  walls = [
    new boundary(0, 0, 0, 400, stone, 500, 0), new boundary(0, 400, 800, 800, stone, 500, 0), new boundary(800, 800, 1200, 0, stone, 500, 0),
    new boundary(1200, 0, 1400, 200, stone, 500, 0), new boundary(1400, 200, 1500, 1000, stone, 500, 0), new boundary(1500, 1000, 1200, 1200, stone, 500, 0),
    new boundary(1200, 1200, 1200, 1400, stone, 500, 0), new boundary(1200, 1400, 1400, 1500, stone, 500, 0), new boundary(1400, 1500, 1500, 2000, stone, 50, 0),
    new boundary(1500, 2000, 800, 1800, stone, 250, 0), new boundary(800, 1800, 800, 1000, stone, 250, 0), new boundary(800, 1000, -100, 800, stone, 250, 0),
    new boundary(-100, 800, -200, 0, stone, 250, 0), new boundary(-200, 0, 0, 0, stone, 250, 0)
  ]
  console.log(walls[8])
  floors = [
    new floor(1000, 1000, 300, 0, 550, 0, red, {}),
    //new floor(700, 2000, 1150, 0, 1050, 0, red, {}),
    new floor(509.9019513592785, 100, 1450 + 50*sin(78.69006752597979), 50, 1740 + (509.9019513592785/2)*cos(78.69006752597979), 78.69006752597979, red, {})
  ]
  grid = [
    new pathNode(-100, 500, [1], 'a'), new pathNode(900, 900, [0, 2], 'b'), new pathNode(1000, 1600, [1], 'c')
  ]
  objects = [new ai(1000, 0, 1000, impSprite, 50, 175, 1, 0, 0, 0)]
  player = new pc(1200, 0, 1500, 175, 90, 0, 4, floors[0])
  cam.centerX += player.x
  cam.eyeX += player.x
  cam.centerY -= 175
  cam.eyeY -= 17
  cam.centerZ += player.z
  cam.eyeZ += player.z
  cam.cameraNear = 0
  uiCam.cameraNear = 0
  uiCam.ortho()
  textFont(font)
  noStroke()
  frameRate(30)
}

function draw() {
  background(0)
  switch (gameState){
    case 'menu':
      menuUI()
      break
    case 'game':
      cam.pan(0)
      cam.tilt(0)
      player.controls()

      for (let i of walls){
        i.render()
      }
      for (let i of floors){
        i.render()
      }
      for (let i of objects){
        //i.fullPathfinding()
        i.render()
      }
      // for (let i of interactibles){

      // }
      //circle(player.x, player.z, 140)
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
      break
    case 'pause':
      for (let i of walls){
        i.render()
      }
      for (let i of floors){
        i.render()
      }
      for (let i of objects){
        i.render()
      }
      pauseUI()
      break
    }
}

function ui(){
  push() // auto reverses changes
    strokeWeight(0.1)
    stroke(255)
    setCamera(uiCam) // switches cam
    uiCam.setPosition(0, 0, 50)
    push() // health bar
      translate(0, 250, 0)
      fill(255, 0, 0)
      rect(0, 0, 300, 30) // replace 50 with hp
    pop()
    push() // crosshair
      strokeWeight(1)
      line(-10, -10, 10, 10)
      line(10, -10, -10, 10)
    pop()
  pop()
}

function menuUI(){
  push()
    setCamera(uiCam)
    uiCam.setPosition(0, 0, 50)
    for (let i of mainMenuButts){
      i.render()
      if (mouseIsPressed){
        i.executeFunc()
      }
    }
  pop()
}

function pauseUI(){
  push()
    setCamera(uiCam)
    uiCam.setPosition(0, 0, 50)
    for (let i of mainMenuButts){
      i.render()
      if (mouseIsPressed){
        i.executeFunc()
      }
    }
  pop()
}