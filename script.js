let red = [200,10, 10]
let green = [10, 200, 10]
let grey = [150, 150, 150]
let purple = [150, 10, 200]
let dGrey = [30, 30, 30]

//********************************************************************************************************************
//* REMINDER TO MAKE THE UNIVERSAL ACTION SWITCH:                                                                    *
//* add the universal action switch to replace specific action switches for buttons, consumables, and other triggers *
//* REMINDER END                                                                                                     *
//********************************************************************************************************************

function universalSwitch(event, {data = null}){
  switch (event){
    case 'beginGame':
      beginGame()
      break
    case 'advanceTalk0':
      talkDepth += 1
      talkOption = 0
      break
    case 'advanceTalk1':
      talkDepth += 1
      talkOption = 1
      break
    case 'advanceTalk2':
      talkDepth += 1
      talkOption = 2
      break
    case 'advanceTalk3':
      talkDepth += 1
      talkOption = 3
      break
    case 'load':
      loadGame()
      gameState = 'game'
      requestPointerLock() 
      break
    case 'eqp1':
      if (player.hotbar[0] != punch){
        player.inventory.weapons.push(player.hotbar[0])
      }
      player.hotbar[0] = data
      player.inventory.weapons.splice(player.inventory.weapons.indexOf(data), 1)
      hotbarSelect = false
      break
    case 'eqp2':
      if (player.hotbar[1] != punch){
        player.inventory.weapons.push(player.hotbar[1])
      }
      player.hotbar[1] = data
      player.inventory.weapons.splice(player.inventory.weapons.indexOf(data), 1)
      hotbarSelect = false
      break
    case 'eqp3':
      if (player.hotbar[2] != punch){
        player.inventory.weapons.push(player.hotbar[2])
      }
      player.hotbar[2] = data
      player.inventory.weapons.splice(player.inventory.weapons.indexOf(data), 1)
      hotbarSelect = false
      break
    case 'eqp4':
      if (player.hotbar[3] != punch){
        player.inventory.weapons.push(player.hotbar[3])
      }
      player.hotbar[3] = data
      player.inventory.weapons.splice(player.inventory.weapons.indexOf(data), 1)
      hotbarSelect = false
      break
    case 'unequip':
      if (data[0] != punch){
        player.hotbar[data[1]] = punch
        player.inventory.weapons.push(data[0])
      }
      break
    case 'giveWpn':
      player.inventory.weapons.push(data)
      break
    case 'giveRmr':
      player.inventory.apparels.push(data)
      break
    case 'givePot':
      player.inventory.usables.push(data)
      break
    case 'moveToHotbar':
      hotbarSelect = true
      break
    case 'equipRmr':
      player.armour = data
      break
    case 'usePot':
      universalSwitch(data)
      break
    case 'exitInv':
      if (droppedInv.weapons.length >= 1 || droppedInv.apparels.length >= 1 || droppedInv.usables.length >= 1){
        currentCell.objects.push(new entity(player.x, player.currentFloor.y, player.z, droppedSpritesheet, 8, 8, 'loot', 'delOnEmpty', 0, droppedInv, {canCollide: false}))
        currentCell.objects[currentCell.objects.length - 1].ogIndex = currentCell.objects.length - 1
      }
      droppedInv = new inventory([], [], [])
      gameState = 'game'
      requestPointerLock()
      break
    case 'heal25':
      player.hp += 25
      break
    case 'scrollUp':
      if (invOffset >= 1){
        invOffset -= 1
      }
      break
    case 'scrollDown':
      if (invOffset < Math.floor((player.inventory.weapons.length - 1)/5)|| invOffset < Math.floor(player.inventory.apparels.length/5) || invOffset < Math.floor(player.inventory.usables.length/5)){
        invOffset += 1
      }
      break
  }
}

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
      //checks if the mouse is over the button
      return 1
    }
    return 0
  }

  render(){
    push() //draws the buttons sprite, changes state by being hovered
      image(this.spriteSheet,
        this.collX, this.collY,
        this.w, this.h,
        this.checkHovered() * this.sW, 0,
        this.sW, this.sH
        )
    pop()
  }

  executeFunc({data = null}){ //executes a buttons function (will be merged into universal action switch)
    if (this.checkHovered() && !mouseWasPressed && mouseIsPressed){
      universalSwitch(this.func, {data: data})
    }
  }
}

class pc{
  constructor(x, y, z, height, angleLR, angleUD, speed, currentFloor, hp, weapon, armour, {xp = 0, level = 0}){
    this.x = x
    this.y = y
    this.z = z
    this.height = height
    this.angleLR = angleLR
    this.angleUD = angleUD
    this.speed = speed // cm/s
    this.eyeLevel = y + height
    this.currentFloor = currentFloor
    this.hp = hp
    this.maxHp = hp
    this.def = 0
    this.weapon = weapon
    this.armour = armour
    this.attacking = false
    this.attackFrame = 0
    this.inventory = new inventory([], [], [])
    this.hotbar = [punch, punch, punch, punch]
    this.xp = xp
    this.level = level
  }

  floorCheck(){
    for (let i of currentCell.floors){ // check every floor tile
      if (this.y >= i.y - i.catchZone){
        let relX = this.x - i.x
        let relZ = this.z - i.z
        let rottedX = (relX * cos(i.rotation)) + (relZ * sin(i.rotation))
        // player coords rotated to align with the tested floor tile
        let rottedZ = -(relX * sin(i.rotation)) + (relZ * cos(i.rotation))
        if (collideRectCircle(i.unrotX1, i.unrotZ1, i.width1, i.width2, rottedX, rottedZ, 150)){
          // checking if player is on the tile
          this.currentFloor = i // sets the floor the player stands on
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
    //projects player forward, changes direction depending on where the player is trying to go
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
  
    for (let i of currentCell.walls){
      //checks if the players projected path collides with any walls
      if (i.base <= this.eyeLevel && i.base + i.height >= this.y + 51){
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
        if (dist(x4, z4, i.x1, i.z1) <= 75 || dist(x4, z4, i.x2, i.z2) <= 75){
          //checks if the players projected position would touch a walls end point
          //necessary as other checks don't account for this
          return false
        }
        if (intersectCheck([x1, z1], [x2, z2], [x3, z3], [x4, z4])){
          //checks if player would otherwise be within a wall
          return false
        }
        x3 = x4 - dz
        z3 = z4 + dx
        if (intersectCheck([x1, z1], [x2, z2], [x3, z3], [x4, z4])){
          //also checks if player would be in a wall
          return false
        }
        x3 = this.x
        z3 = this.z
        if (intersectCheck([x1, z1], [x2, z2], [x3, z3], [x4, z4])){
          //also checks if player would pass through a wall while moving
          return false
        }
      }
    }
    for (let i of currentCell.objects){
      //checks if the player would be colliding with an entity
      if(dist(x4, z4, i.x, i.z) <= 75 && i.y + i.height > this.y && i.y < this.y + this.height && i.collisive == true){
        return false
      }
    }
    return true //if none of the invalid scenarios are found, return true
  }

  controls(){
    if (keyIsDown(87)){//w
      if(this.moveCheck('fw')){
        this.x += this.speed * sin(this.angleLR)
        this.z -= this.speed * cos(this.angleLR)
      }
    }
    if (keyIsDown(83)){//s
      if(this.moveCheck('bw')){
        this.x -= this.speed * sin(this.angleLR)
        this.z += this.speed * cos(this.angleLR)
      }
    }
    if (keyIsDown(65)){//a
      if(this.moveCheck('lw')){
        this.x -= this.speed * cos(this.angleLR)
        this.z -= this.speed * sin(this.angleLR)
      }
    }
    if (keyIsDown(68)){//d
      if(this.moveCheck('rw')){
        this.x += this.speed * cos(this.angleLR)
        this.z += this.speed * sin(this.angleLR)
      }
    }
    if (keyIsDown(37)){//left
      this.angleLR -= 3 * (30/frameRate())
    }
    if (keyIsDown(38)){//up
      if (this.angleUD < 75){
        this.angleUD += 1 * (30/frameRate())
      }
    }
    if (keyIsDown(39)){//right key
      this.angleLR += 3 * (30/frameRate())// rotate right
    }
    if (keyIsDown(40)){//down key
      if (this.angleUD > -45){ // limit angle
        this.angleUD -= 1 * (30/frameRate())
      }
    }
    if (keyIsDown(49)){//numbers for hotbar
      this.weapon = 0
    }
    if (keyIsDown(50)){
      this.weapon = 1
    }
    if (keyIsDown(51)){
      this.weapon = 2
    }
    if (keyIsDown(52)){
      this.weapon = 3
    }
    this.angleLR += movedX  * (30/frameRate()) * 0.1
    if (this.angleLR > 360){
      this.angleLR -= 360
    }
    else if (this.angleLR < 0){
      this.angleLR += 360
    }
    if (this.angleUD <= 75 && this.angleUD >= -89){
      this.angleUD -= movedY * (30/frameRate()) * 0.1
      if (this.angleUD > 75){
        this.angleUD = 75
      }
      else if (this.angleUD < -89){
        this.angleUD = -89
      }
    }
    if (keyIsDown(27)){//escape key
      gameState = 'pause'
    }
    cam.eyeX = player.x
    cam.eyeZ = player.z + 500
    this.eyeLevel = this.y + this.height
    cam.eyeY = -this.eyeLevel
    // adjust view around player by trig values
    cam.centerX = cam.eyeX + sin(this.angleLR)
    cam.centerY = cam.eyeY - tan(this.angleUD)
    cam.centerZ = cam.eyeZ - cos(this.angleLR)
    if (keyIsDown(32) && jumpHeight == 0 && this.y == this.currentFloor.y){//space
      jumping = true
    }
    this.floorCheck()
    if (jumping == false){
      if (this.y < this.currentFloor.y){
        if (this.currentFloor.y - this.y < 12.5){
          this.y = this.currentFloor.y
        }
        else {
          this.y += (this.currentFloor.y - this.y)/2
        }
        this.eyeLevel = this.y + this.height
      }
    }
    if (this.y == this.currentFloor.y){
      jumpHeight = 0
    }
    if (keyIsDown(73) && this.attackFrame == 0){ //i for inventory
      exitPointerLock()
      hotbarSelect = false
      gameState = 'inventory'
      droppedInv = new inventory([], [], [])
      invOffset = 0
    }
    if (this.xp >= 100){
      this.level += 1
      this.xp -= 100
    }
  }

  interactCheck(){
    let x1 = this.x
    let z1 = this.z
    let x2 = this.x + 200*sin(this.angleLR)
    let z2 = this.z - 200*cos(this.angleLR)

    for (let i of currentCell.objects){ //check every entity
      if (i.interactible != false && player.y <= i.y + i.height && player.y + player.height >= i.y){
        let x3 = i.x - (i.collWidth/2)*cos(this.angleLR)
        let z3 = i.z - (i.collWidth/2)*sin(this.angleLR)
        let x4 = i.x + (i.collWidth/2)*cos(this.angleLR)
        let z4 = i.z + (i.collWidth/2)*sin(this.angleLR)
        let den = (x1-x2)*(z3-z4)-(z1-z2)*(x3-x4)
        let t = ((x1-x3)*(z3-z4)-(z1-z3)*(x3-x4))/den
        let u = ((x1-x3)*(z1-z2)-(z1-z3)*(x1-x2))/den
        if (0 <= t && t <= 1 && 0 <= u && u <= 1){ //if player looking at entity
          for (let j of currentCell.walls){ //check if no walls in the way
            x3 = j.x1
            x4 = j.x2
            z3 = j.z1
            z4 = j.z2
            den = (x1-x2)*(z3-z4)-(z1-z2)*(x3-x4)
            t = ((x1-x3)*(z3-z4)-(z1-z3)*(x3-x4))/den
            u = ((x1-x3)*(z1-z2)-(z1-z3)*(x1-x2))/den
            if (0 <= t && t <= 1 && 0 <= u && u <= 1){
              return [false, false] //tell program which entity was interacted with
            }
          }
          return [true, i]
        }
      }
    }
    return [false, false] //if no valid interaction found
  }

  attackCheck(){
    let x1 = this.x
    let z1 = this.z
    let x2 = this.x + 200*sin(this.angleLR)
    let z2 = this.z - 200*cos(this.angleLR)

    for (let i of currentCell.AIs){
      if (i.y < this.eyeLevel && i.y + currentCell.objects[i.linkedNtt].height > this.y){
        let x3 = i.x - (currentCell.objects[i.linkedNtt].collWidth/2)*cos(this.angleLR)
        let z3 = i.z - (currentCell.objects[i.linkedNtt].collWidth/2)*sin(this.angleLR)
        let x4 = i.x + (currentCell.objects[i.linkedNtt].collWidth/2)*cos(this.angleLR)
        let z4 = i.z + (currentCell.objects[i.linkedNtt].collWidth/2)*sin(this.angleLR)
        let den = (x1-x2)*(z3-z4)-(z1-z2)*(x3-x4)
        let t = ((x1-x3)*(z3-z4)-(z1-z3)*(x3-x4))/den
        let u = ((x1-x3)*(z1-z2)-(z1-z3)*(x1-x2))/den
        if (0 <= t && t <= 1 && 0 <= u && u <= 1){
          return i
        }
      }
    }
    return false
  }
}

class boundary{
  constructor(x1, z1, x2, z2, texture, height, base){
    this.midX = ((x1+x2)/2)
    this.midZ = ((z1+z2)/2)
    this.midY = -(base+(height/2))
    this.angle = -atan((z2-z1)/(x2-x1))
    this.width = Math.pow(((x2-x1)*(x2-x1))+((z2-z1)*(z2-z1)), 0.5)
    this.height = height
    this.texture = texture
    this.x1=x1
    this.z1=z1
    this.x2=x2
    this.z2=z2
    this.base = base
  }

  render(){
    push()
    texture(this.texture)
    translate(this.midX, this.midY, this.midZ + 500)
    rotateY(this.angle)
    plane(this.width, this.height)
    pop()
  }
}

class floor{
  constructor(width1, width2, x, y, z, rotation, texture, {catchZone = 50}){
    this.width1 = width1
    this.width2 = width2
    this.x = x
    this.y = y
    this.z = z
    this.rotation = rotation
    this.texture = texture
    this.unrotX1 = -width1/2
    this.unrotX2 = width1/2
    this.unrotZ1 = -width2/2
    this.unrotZ2 = width2/2
    this.catchZone = catchZone
  }

  render(){
    push()
    texture(this.texture)
    translate(this.x, -this.y, this.z + 500)
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
  constructor(x, y, z, spriteSheet, collWidth, height, interactible, useData, ogIndex, inventory, {canCollide = true}){
    this.x = x
    this.y = y
    this.z = z
    this.spriteSheet = spriteSheet.image
    this.sWidth = spriteSheet.sWidth
    this.sHeight = spriteSheet.sHeight
    this.collWidth = collWidth
    this.height = height
    this.midVert = - (y + (height/2))
    this.angle = 0
    this.interactible = interactible
    this.useData = useData
    this.animation = 'i'
    this.frame = 0
    this.hp = 0
    this.maxHp = 0
    this.ogIndex = ogIndex
    this.collisive = canCollide
    this.inventory = inventory
  }
  
  render() {
    let spriteAngle = Math.floor((this.angle - player.angleLR + 22.5 + 180) / 45)
    this.midVert = -(this.y + (this.height / 2))
    if (spriteAngle >= 8) {
      spriteAngle -= 8
    }
    else if (spriteAngle < 0) {
      spriteAngle += 8
    }
    push()
    translate(this.x, this.midVert, this.z + 500)
    rotateY(360 - player.angleLR)
    fill(purple)
    switch (this.animation) {
      case 'i':
        image(this.spriteSheet,
          -this.collWidth / 2, -this.height / 2,
          this.collWidth, this.height,
          this.sWidth * spriteAngle, 0,
          this.sWidth, this.sHeight
        )
        break
      case 'w':
        image(this.spriteSheet,
          -this.collWidth/2, -this.height/2,
          this.collWidth, this.height,
          Math.floor(this.frame) * this.sWidth, this.sHeight * (spriteAngle + 1),
          this.sWidth, this.sHeight
        )
        if (gameState == 'game'){
          this.frame += 0.2
          if (this.frame >= 4) {
            this.frame = 0
          }
        }
        break
      case 'a':
        image(this.spriteSheet,
          -this.collWidth/2, -this.height/2,
          this.collWidth, this.height,
          this.sWidth * (spriteAngle + 5), this.sHeight * (2 + Math.floor(this.frame)),
          this.sWidth, this.sHeight
         )
        break
      case 'd':
        image(this.spriteSheet,
          -this.collWidth / 2, -this.height / 2,
          this.collWidth, this.height,
          this.sWidth * (Math.floor(this.frame) + 5), this.sHeight,
          this.sWidth, this.sHeight
        )
        if (this.frame < 7) {
          this.frame += 0.6
        }
        break
      }
    if(this.animation != 'd'){
      fill(red)
      rect(0, (-this.height/2) - 5, this.collWidth * (this.hp / this.maxHp), 5)
    }
    pop()
  }
}

class spritesheet{
  constructor(image, sWidth, sHeight){
    this.image = image
    this.sWidth = sWidth
    this.sHeight = sHeight
  }
}

class ai{
  constructor(x, y, z, angle, speed, hp, linkedNtt, mode, weapon, xp){
    this.x = x
    this.y = y
    this.z = z
    this.angle = angle
    this.speed = speed
    this.hp = hp
    this.linkedNtt = linkedNtt
    this.mode = mode
    this.path = []
    this.goal = []
    this.weapon = weapon
    this.attackFrame = 0
    this.xp = xp
    this.maxHp = hp
  }

  chooseGoal(){
    let foundGoal = false
    while (foundGoal == false){
      let nodes = []
      this.goal = [player.x, player.z]
      // sets goal at player coords
      for (let i of currentCell.grid){
        nodes.push([i, dist(i.x, i.z, this.goal[0], this.goal[1])])
      }
      nodes.sort(sortFunction)
      // put nodes into a list sorted by distance from goal
      while (nodes.length >= 1){
        for (let i of currentCell.walls){
          if (intersectCheck(
            [nodes[0][0].x, nodes[0][0].z], this.goal, [i.x1, i.z1], [i.x2, i.z2]) && i.base <= this.y + currentCell.objects[this.linkedNtt].height && i.base + i.height > this.y + 50){
          // start from first sorted node, check if there's a wall between it and goal
            nodes.shift() // remove from list if there are
            break
          }
          else if (i == currentCell.walls[currentCell.walls.length - 1]){
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
    for (let i of currentCell.grid){
      nodes.push([i, dist(this.x, this.z, i.x, i.z)])
    }
    nodes.sort(sortFunction)
    for (let i of nodes){
      for (let j of currentCell.walls){
        if (intersectCheck(
          [this.x, this.z], [i[0].x, i[0].z], [j.x1, j.z1], [j.x2, j.z2]) && j.base <= this.y + currentCell.objects[this.linkedNtt].height && j.base + j.height > this.y + 50){
          break
        }
        else if (j == currentCell.walls[currentCell.walls.length - 1]){
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
                  if (l[0].id == currentCell.grid[j].id){
                    onDupe = true
                    break
                  }
                }
              }
            }
            if (onDupe == false){ // if a node isn't in tree
              // add it, and the node which was used to find it
              paths[paths.length - 1].push([currentCell.grid[j], i[0].id])
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
    for (let i of currentCell.walls){
      // checks for shortcut to player
      if (intersectCheck([this.x, this.z], [player.x, player.z], [i.x1, i.z1], [i.x2, i.z2]) && i.base < this.y + currentCell.objects[this.linkedNtt].height && i.base + i.height > this.y + 50){
        if (this.path.length == 1){
          this.path = []
          this.goal = []
        }
        break
      }
      else if (i == currentCell.walls[currentCell.walls.length - 1]){
        this.path = [[player.x, player.z]]
        this.goal = [player.x, player.z]
      }
    }
    for (let j = this.path.length - 1; j >= 0; j -= 1){
      for (let i of currentCell.walls){
        // checks for shortcut between nodes
        if (intersectCheck([this.x, this.z], this.path[j], [i.x1, i.z1], [i.x2, i.z2]) && i.base < this.y + currentCell.objects[this.linkedNtt].height && i.base + i.height > this.y + 50){
          break
        }
        else if (i == currentCell.walls[currentCell.walls.length - 1]){
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
    if (this.path.length >= 1 && Math.floor(this.x) == Math.floor(this.path[0][0]) && Math.floor(this.z) == Math.floor(this.path[0][1])){
      // if first location on path has been reached, remove it
      this.path.shift()
      if (this.path.length == 0){
        //if path complete, ensure it's clear for next cycle
        this.goal = []
        this.path = []
      }
    }
    this.floorCheck()
    currentCell.objects[this.linkedNtt].x = this.x
    currentCell.objects[this.linkedNtt].y = this.y
    currentCell.objects[this.linkedNtt].z = this.z
    currentCell.objects[this.linkedNtt].angle = this.angle
  }

  meleeCheck(){
    let hyp = dist(this.x, this.z, player.x, player.z)
    if (hyp <= meleeMax && hyp >= meleeMin && player.y < this.y + currentCell.objects[this.linkedNtt].height && player.eyeLevel > this.y){ // if in melee range
      for (let i of currentCell.walls){
        // checks if there's a wall in the way
        if (intersectCheck([this.x, this.z], [player.x, player.z], [i.x1, i.z1], [i.x2, i.z2]) && i.base < this.y + currentCell.objects[this.linkedNtt].height && i.base + i.height > this.y + 50){
          this.mode = 'h'
          return false
        }
        else if (i == currentCell.walls[currentCell.walls.length - 1]){
          // if no walls between AI and player, enter melee
          this.path = []
          this.goal = []
          this.mode = 'm'
          return true
        }
      }
    }
    else {
      this.mode = 'h'
      return false
    }
  }

  fullPathfinding() {
    switch (this.mode) {
      case 'h': // hostile
        let finalNode
        if (this.goal.length == 0) { // if the AI has no goal
          finalNode = this.chooseGoal()
          // run goal finding algorithm (chooses goal and finds nearest node to it)
          this.path.push(this.findFirstNode()) // find first node
          this.findPath(finalNode) // find path from there to goal's nearest node
          this.path.push(this.goal) // add final goal to end of instructions
        }
        // if it has a path, follow it
        this.followPath()
        currentCell.objects[this.linkedNtt].angle = this.angle
        currentCell.objects[this.linkedNtt].animation = 'w'
        this.meleeCheck()
        break;
      case 'm': // melee
        let opp = this.x - player.x
        let adj = player.z - this.z
        let hyp = dist(this.x, this.z, player.x, player.z)
        let angle
        if (asin(opp / hyp) <= 0) {
          angle = 360 - acos(adj / hyp)
        }
        if (asin(opp / hyp) >= 0) {
          angle = acos(adj / hyp)
        } // calculate the angle between north and the position to move to
        this.angle = angle
        this.mode = 'a'
        currentCell.objects[this.linkedNtt].angle = this.angle
        break;
      case 'a': // attacking
        currentCell.objects[this.linkedNtt].animation = 'a'
        this.attackFrame += 0.25
        if (this.attackFrame == this.weapon.dF && this.meleeCheck()) {
          let opp = this.x - player.x
          let adj = player.z - this.z
          let hyp = dist(this.x, this.z, player.x, player.z)
          let angle
          if (asin(opp / hyp) <= 0) {
            angle = 360 - acos(adj / hyp)
          }
          if (asin(opp / hyp) >= 0) {
            angle = acos(adj / hyp)
          }
          if (Math.floor(angle) == Math.floor(this.angle)) {
            player.hp -= this.weapon.damage / (player.level + 1)
          }
          this.mode = 'a'
        }
        if (this.attackFrame >= this.weapon.aF) {
          this.attackFrame = 0
          this.meleeCheck()
        }
        currentCell.objects[this.linkedNtt].frame = this.attackFrame
        break
      case 'd': // dead
        currentCell.objects[this.linkedNtt].animation = 'd'
        break;
    }
    if (this.mode != 'd') {
      if (this.hp <= 0) {
        this.mode = 'd'
        currentCell.objects[this.linkedNtt].animation = 'd'
        currentCell.objects[this.linkedNtt].frame = 0
        currentCell.objects[this.linkedNtt].hp = 0
        player.xp += this.xp
      }
      currentCell.objects[this.linkedNtt].hp = this.hp
      currentCell.objects[this.linkedNtt].maxHp = this.maxHp
    }
  }

  floorCheck(){
    let finalY = this.y
    for (let i of currentCell.floors){ // check every floor tile
      if (this.y >= i.y - i.catchZone){
        let relX = this.x - i.x
        let relZ = this.z - i.z
        let rottedX = (relX * cos(i.rotation)) + (relZ * sin(i.rotation))
        // AI coords rotated to align with the tested floor tile
        let rottedZ = -(relX * sin(i.rotation)) + (relZ * cos(i.rotation))
        if (collideRectCircle(i.unrotX1, i.unrotZ1, i.width1, i.width2, rottedX, rottedZ, currentCell.objects[this.linkedNtt].collWidth/2)){ // checking if AI is on the tile
          finalY = i.y // sets the floor the AI stands on
        }
      }
    }
    this.y = finalY
    this.midVert = -(this.y + (this.height/2))
  }
}

class cell{
  constructor(walls, floors, objects, AIs, grid, dialogueBg, fogColour){
    this.walls = walls
    this.floors = floors
    this.objects = objects
    this.AIs = AIs
    this.grid = grid
    this.dialogueBg = dialogueBg
    this.fogColour = fogColour
  }
}

class weapon{
  constructor(name, damage, spriteSheet, aF, dF, spriteSizes, icon){
    this.damage = damage
    this.spriteSheet = spriteSheet
    this.aF = aF
    this.dF = dF
    this.spriteSizes = spriteSizes
    this.name = name
    this.icon = icon
  }
}

class apparel{
  constructor(name, defense, icon){
    this.defense = defense
    this.name = name
    this.icon = icon
  }
}

class consumable{
  constructor(name, func){
    this.name = name
    this.func = func
  }

  executeFunc({data = null}){
    universalSwitch(this.func, {data: data})
  }
}

class inventory{
  constructor(weapons, apparels, usables){
    this.weapons = weapons
    this.apparels = apparels
    this.usables = usables
  }
}

function beginGame(){
  gameState = 'game'
  requestPointerLock()
}

function sortFunction(a, b){
  if (a[1] === b[1]) {
    return 0
  }
  else {
    return (a[1] < b[1]) ? -1 : 1
  }
}

function entitySort(a, b){
  if (dist(a.x, a.z, player.x, player.z) === dist(b.x, b.z, player.x, player.z)){
    return 0
  }
  else {
    return (dist(a.x, a.z, player.x, player.z) > dist(b.x, b.z, player.x, player.z)) ? -1 : 1
  }
}

function entityUnsort(a, b){
  if (a.ogIndex === b.ogIndex){
    return 0
  }
  else {
    return (a.ogIndex < b.ogIndex) ? -1 : 1
  }
}

function floorSort(a, b){
  if (a.y == b.y){
    return 0
  }
  else {
    return (a.y > b.y) ? -1 : 1
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

function saveGame(){
  savedWorld = [new pc(player.x, player.y, player.z, player.height, player.angleLR, player.angleUD, player.speed, player.currentFloor, player.hp, player.weapon, player.armour, {xp: player.xp, level: player.level}),
    [], currentCellNo
   ]
  for (let i of world){
    let walls = []
    let AIs = []
    let objects = []
    let floors = []
    let grid = []
    for (let j of i.walls){
      walls.push(new boundary(j.x1, j.z1, j.x2, j.z2, j.texture, j.height, j.base))
    }
    walls = Object.assign({}, walls)
    walls = Object.values(walls)
    for (let j of i.objects){
      objects.push(new entity(j.x, j.y, j.z, new spritesheet(j.spriteSheet, j.sWidth, j.sHeight), j.collWidth, j.height, j.interactible, j.useData, j.ogIndex, new inventory(j.inventory.weapons, j.inventory.apparels, j.inventory.usables), {canCollide: j.collisive}))
    }
    objects = Object.assign({}, objects)
    objects = Object.values(objects)
    for (let j of i.AIs){
      AIs.push(new ai(j.x, j.y, j.z, j.angle, j.speed, j.hp, j.linkedNtt, j.mode, j.weapon, j.xp))
    }
    AIs = Object.assign({}, AIs)
    AIs = Object.values(AIs)
    for (let j of AIs){
      j.path = []
      j.goal = []
    }
    for (let j of i.floors){
      floors.push(new floor(j.width1, j.width2, j.x, j.y, j.z, j.rotation, j.texture, {catchZone: j.catchZone}))
    }
    floors = Object.assign({}, floors)
    floors = Object.values(floors)
    for (let j of i.grid){
      grid.push(new pathNode(j.x, j.z, j.connectedNodes, j.id))
    }
    grid = Object.assign({}, grid)
    grid = Object.values(grid)
    savedWorld[1].push(new cell(walls, floors, objects, AIs, grid))
  }
  savedWorld = Object.assign({}, savedWorld)
}

function loadGame(){
  player = savedWorld[0]
  world = savedWorld[1]
  currentCell = world[savedWorld[2]]
  currentCellNo = savedWorld[2]
  saveGame()
}

//general vars
let cam;
let uiCam;
let player;
let jumping = false
let jumpHeight = 0
let font
//spritesheets and images
let impSprite
let impSpritesheet
let chibiSprite
let chibiSpritesheet
let droppedSprite
let droppedSpritesheet
let brick
let tallWall
let stone
let gravelled
let swordSprite
let fistSprite
let crossImg
let beginButt
let loadButt
let upButton
let downButton
let swordIcon
let swordIcon2
let punchIcon
let teeIcon
let menuBg
//more general?
let gameState = 'menu'
let mainMenuButts
let meleeMin = 75
let meleeMax = 150
let interactCheckVariable
let talkDepth
let talkOption
let mouseWasPressed
let droppedInv
let entitiesToDelete
let delIndex
//cells
let cell1
let cell2
let currentCell
let currentCellNo
//weapons
let punch
let defSword
let nmeSword
//armour
let defArmour
//general! again!
let world
let savedWorld
let loadButton
let exitButton
let hotbarSelect
let selectedWeapon
let hotbarButts
let invOffset

function preload(){
  font = loadFont('COMIC.ttf')
  //entity spritesheets
  impSprite = loadImage('imp.png')
  chibiSprite = loadImage('chibiSprite.png')
  droppedSprite = loadImage('droppedSprite.png')
  //walls and floors
  brick = loadImage('brickTemp.png')
  tallWall = loadImage('tallWall.png')
  stone = loadImage('stone.png')
  gravelled = loadImage('gravelled.png')
  //weapons
  swordSprite = loadImage('sword1.png')
  fistSprite = loadImage('punch.png')
  //buttons
  beginButt = loadImage('beginButton.png')
  loadButt = loadImage('deathButton.png')
  crossImg =  loadImage('exitButton.png')
  upButton = loadImage('upButton.png')
  downButton = loadImage('downButton.png')
  //inventory icons
  swordIcon = loadImage('swordIcon.png')
  swordIcon2 = loadImage('swordIcon2.png')
  punchIcon = loadImage('punchIcon.png')
  teeIcon = loadImage('armourIcon.png')
  //background images
  menuBg = loadImage('mainMenuUI.png')
}

function setup() {
  impSpritesheet = new spritesheet(impSprite, 42, 61)
  chibiSpritesheet = new spritesheet(chibiSprite, 44, 50)
  droppedSpritesheet = new spritesheet(droppedSprite, 8, 8)
  punch = new weapon('just your fists', 2, fistSprite, 3, 2, [], punchIcon)
  defSword = new weapon('default sword', 10, swordSprite, 3, 2, [], swordIcon)
  nmeSword = new weapon('the sword enemies use', 20, swordSprite, 5, 4, [], swordIcon2)
  defArmour = new apparel('default armour', 2, teeIcon)
  createCanvas(1024, 576, WEBGL);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER)
  noStroke();
  rectMode(CENTER)
  mainMenuButts = [
    new menuButton(-83, -100, 166, 56, 'beginGame', beginButt, 166, 56)
  ]
  loadButton = new menuButton(-100, 100, 200, 60, 'load', loadButt, 200, 60)
  exitButton = new menuButton(400, -200, 32, 32, 'exitInv', crossImg, 64, 64)
  cam = createCamera();
  uiCam = createCamera();
  setCamera(cam)
  cell1 = new cell([
    //beginning room
    new boundary(0, 2000, 250, 500, stone, 2000, 0), new boundary(250, 500, 2000, 0, stone, 2000, 0), new boundary(2000, 0, 4000, 0, stone, 2000, 0),
    new boundary(4000, 0, 5000, 750, stone, 2000, 0), new boundary(5000, 750, 5000, 1500, stone, 1500, 500),
    new boundary(5000, 1500, 4750, 2500, stone, 2000, 0), new boundary(4750, 2500, 3250, 4000, stone, 2000, 0), new boundary(3250, 4000, 1500, 4000, stone, 2000, 0),
    new boundary(0, 2000, 1500, 4000, stone, 2000, 0), 
    //first corridor
    new boundary(5000, 750, 6500, 750, stone, 500, 0), new boundary(5000, 1500, 6000, 1500, stone, 500, 0), new boundary(6500, 750, 7500, 1750, stone, 550, -50),
    new boundary(6000, 1500, 6875, 3000, stone, 550, -50),
    // first corridor step edges
    new boundary(6500, 750, 6500, 1500, gravelled, 50, -50), new boundary(6500, 1500, 6000, 1500, gravelled, 50, -50)
  ], [
    //beginning room
    new floor(5000, 4000, 2500, 0, 2000, 0, gravelled, {}), new floor(5000, 4000, 2500, 2000, 2000, 180, stone, {}),
    //first corridor
    new floor(1500, 750, 5750, 0, 1125, 0, gravelled, {}), new floor(1500, 750, 5750, 500, 1125, 0, stone, {})
  ], [

  ], [

  ], [

  ], stone, dGrey)
  world = [cell1]
  for (let i of world){
    i.floors.floorSort
    for (let j of i.objects){
      j.ogIndex = i.objects.indexOf(j)
    }
  }
  currentCell = world[0]
  currentCellNo = 0
  player = new pc(1375, 0, 2750, 175, 225, -45, 8, currentCell.floors[0], 100, 0, defArmour, {})
  cam.centerX += player.x
  cam.eyeX += player.x
  cam.centerY -= 175
  cam.eyeY -= 175
  cam.centerZ += player.z
  cam.eyeZ += player.z
  uiCam.ortho()
  textFont(font)
  noStroke()
  saveGame()
  frameRate(30)
  player.inventory.weapons.push(defSword)
  player.inventory.weapons.push(defSword)
  player.inventory.weapons.push(defSword)
  player.inventory.weapons.push(defSword)
  player.inventory.weapons.push(defSword)
  player.inventory.weapons.push(defSword)
  player.inventory.weapons.push(defSword)
  player.inventory.weapons.push(defSword)
  setAttributes('alpha', false);
}

function draw() {
  player.speed = 20 * (30/frameRate())
  background(0)
  noErase()
  switch (gameState){
    case 'menu':
      menuUI()
      break
    case 'game':
      cam.pan(0)
      cam.tilt(0)
      player.controls()
      for (let i of currentCell.walls){
        i.render()
      }
      for (let i of currentCell.floors){
        i.render()
      }
      for (let i of currentCell.AIs){
        i.fullPathfinding()
      }
      for (let i = 5000; i > 2400; i -= 200){
        push()
          fill(currentCell.fogColour[0], currentCell.fogColour[1], currentCell.fogColour[2], 100)
          translate(player.x, player.eyeLevel, player.z)
          sphere(i)
        pop()
        for (let j of currentCell.objects){
          if (dist(j.x, j.z, player.x, player.z) < i && dist(j.x, j.z, player.x, player.z) >= i - 200){
            j.render()
          }
        }
      }
      currentCell.objects = currentCell.objects.sort(entitySort)
      for (let i of currentCell.objects){
        if (dist(i.x, i.z, player.x, player.z) <= 2400){
          i.render()
        }
      }
      currentCell.objects = currentCell.objects.sort(entityUnsort)
      for (let i of currentCell.objects){
        if (i.interactible == 'loot' && i.useData == 'delOnEmpty' && 
        i.inventory.weapons.length == 0 && i.inventory.apparels.length == 0 && i.inventory.usables.length == 0){
          currentCell.objects.splice(currentCell.objects.indexOf(i), 1)
          break
        }
      }
      if (keyIsDown(69)){ //interaction check
        interactCheckVariable = player.interactCheck()
        if (interactCheckVariable[0]){
          if (interactCheckVariable[1].interactible != 'loadZone'){
            gameState = interactCheckVariable[1].interactible
            talkDepth = 0
            talkOption = 0
            mouseWasPressed = true
            invOffset = 0
            droppedInv = new inventory([], [], [])
            exitPointerLock()
          }
          else {
            currentCell = world[interactCheckVariable[1].useData[0]]
            currentCellNo = interactCheckVariable[1].useData[0]
            player.x = interactCheckVariable[1].useData[1]
            player.y = interactCheckVariable[1].useData[2]
            player.z = interactCheckVariable[1].useData[3]
          }
        }
      }
      if (!mouseWasPressed && mouseIsPressed && player.attacking == false){
        player.attacking = true
      }
      if (player.attacking == true){
        player.attackFrame += 1
        if (player.attackFrame == player.hotbar[player.weapon].dF){
          interactCheckVariable = player.attackCheck()
          if (interactCheckVariable != false){
            interactCheckVariable.hp -= player.hotbar[player.weapon].damage + player.level
          }
        }
        if (player.attackFrame > player.hotbar[player.weapon].aF){
          player.attacking = false
          player.attackFrame = 0
        }
      }
      if (jumping){
        cam.centerY -= 3 * (30/frameRate())
        cam.eyeY -= 3 * (30/frameRate())
        player.y += 3 * (30/frameRate())
        player.eyeLevel += 3 * (30/frameRate())
        jumpHeight += 3 * (30/frameRate())
        if (jumpHeight >= 100){
          jumping = false
        }
      }
      else if (player.y > player.currentFloor.y){
        player.y -= 5 * (30/frameRate())
        cam.centerY += 5 * (30/frameRate())
        cam.eyeY += 5 * (30/frameRate())
        player.eyeLevel = player.y + player.height
        if (player.y <= player.currentFloor.y){
          jumpHeight = 0
          player.y = player.currentFloor.y
          //player.eyeLevel = player.y + player.height
          //cam.eyeY = -player.eyeLevel
          //cam.centerY = player.eyeLevel + tan(player.angleUD)
        }
      }
      ui()
      if (keyIsDown(113)){ //save
        if (player.y > player.currentFloor.y){ //necessary as saving in the air causes problems
          saveFailUI()
        }
        else{
          saveGame()
        }
      }
      if (keyIsDown(120)){ //load
        loadGame()
      }
      if (player.hp <= 0){
        gameState = 'death'
        exitPointerLock()
      }
      else if (player.xp >= 100){
        player.xp -= 100
        player.level += 1
      }
      break
    case 'pause':
      for (let i of currentCell.walls){
        i.render()
      }
      for (let i of currentCell.floors){
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entitySort)
      for (let i of currentCell.objects){
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entityUnsort)
      pauseUI()
      break
    case 'dialogue':
      for (let i of currentCell.walls){
        i.render()
      }
      for (let i of currentCell.floors){
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entitySort)
      for (let i of currentCell.objects){
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entityUnsort)
      for (let i of currentCell.objects){
        i.render()
      }
      dialogueUI(interactCheckVariable[1])
      break
    case 'death':
      deathUI()
      break
    case 'inventory':
      for (let i of currentCell.walls){
        i.render()
      }
      for (let i of currentCell.floors){
        i.render()
      }
      // for (let i of currentCell.AIs){
      //   i.fullPathfinding()
      // }
      currentCell.objects = currentCell.objects.sort(entitySort)
      for (let i of currentCell.objects){
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entityUnsort)
      inventoryUI()
      break
    case 'loot':
      for (let i of currentCell.walls){
        i.render()
      }
      for (let i of currentCell.floors){
        i.render()
      }
      // for (let i of currentCell.AIs){
      //   i.fullPathfinding()
      // }
      currentCell.objects = currentCell.objects.sort(entitySort)
      for (let i of currentCell.objects){
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entityUnsort)
      lootUI(interactCheckVariable[1])
      break
  }
  mouseWasPressed = mouseIsPressed
}

function ui(){
  let hbHlPos = [-150, -110, 110, 150]
  push() // auto reverses changes
    setCamera(uiCam) // switches cam
    uiCam.setPosition(0, 0, 0)
    fill(255, 0, 0)
    image(player.hotbar[player.weapon].spriteSheet,
      -512, -288,
      1024, 576,
      320 * player.attackFrame, 0,
      320, 180
      )
    rect(0, 250, 170 * player.hp/player.maxHp, 30)
    fill(216, 158, 99)
    rect(-150, 250, 30, 30)
    rect(-110, 250, 30, 30)
    rect(110, 250, 30, 30)
    rect(150, 250, 30, 30)
    image(player.hotbar[0].icon,
      -165, 235,
      30, 30,
      0, 0,
      64, 64)
    image(player.hotbar[1].icon,
      -125, 235,
      30, 30,
      0, 0,
      64, 64)
    image(player.hotbar[2].icon,
      95, 235,
      30, 30,
      0, 0,
      64, 64)
    image(player.hotbar[3].icon,
      135, 235,
      30, 30,
      0, 0,
      64, 64)
    fill(0, 0, 0, 0)
    stroke(0)
    strokeWeight(2)
    rect(hbHlPos[player.weapon], 250, 40, 40)
    strokeWeight(0.1)
    stroke(255)
    strokeWeight(1)
    line(-10, -10, 10, 10)
    line(10, -10, -10, 10)
    if (player.interactCheck()[0]){
      textSize(20)
      fill(red)
      text('interact (e)', 0, 10)
    }
  pop()
}

function menuUI(){
  push()
    setCamera(uiCam)
    uiCam.setPosition(0, 0, 50)
    image(menuBg, -512, -288)
    for (let i of mainMenuButts){
      i.render()
      i.executeFunc({})
    }
  pop()
}

function pauseUI(){
  push()
    setCamera(uiCam)
    uiCam.setPosition(0, 0, 50)
    for (let i of mainMenuButts){
      i.render()
      i.executeFunc({})
    }
  pop()
}

function dialogueUI(entity){
  let reactButtons = []
  for (let i = 0; i < entity.useData[talkDepth + 1][0].length; i++){
    reactButtons.push(new menuButton(56, 100 * (i-2), 400, 100, 'advanceTalk' + i, 'noSpriteSheet', 0, 0))
  }
  push()
    setCamera(uiCam)
    uiCam.setPosition(0, 0, 50)
    noStroke()
    fill(216, 158, 99)
    rect(-256, 0, 400, 400)
    rect(256, 0, 400, 400)
    fill(182, 132, 82)
    rect(256, -50, 400, 100)
    rect(256, 150, 400, 100)
    image(
      currentCell.dialogueBg, 
      -451, -195,
      390, 190
      )
    image(
      entity.spriteSheet,
      -451, -195,
      390, 190,
      entity.sWidth * 12, 0,
      entity.sWidth, entity.sHeight
      )
    textSize(25)
    fill(0)
    text(entity.useData[talkDepth][1][talkOption], -256, 100, 400, 200)
    for (let i = 0; i < entity.useData[talkDepth + 1][0].length; i++){
      text(entity.useData[talkDepth + 1][0][i], 256, 100 * (i-2) + 10, 400, 400)
    }
    for (let i of reactButtons){
      i.executeFunc({})
    }
    if (talkDepth == entity.useData.length - 1){
      gameState = 'game'
      requestPointerLock()
    }
  pop()
}

function deathUI(){
  push()
    setCamera(uiCam)
    uiCam.setPosition(0, 0, 50)
    fill(255)
    textSize(20)
    text('you died, select an option below', 0, 0)
    loadButton.render()
    loadButton.executeFunc({})
  pop()
}

function saveFailUI(){
  push() // auto reverses changes
    setCamera(uiCam) // switches cam
    uiCam.setPosition(0, 0, 0)
    textSize(20)
    textAlign(LEFT, TOP)
    fill(255)
    text('You can not save while jumping or falling', -512, -288)
  pop()
}

function inventoryUI(){
  let hotbarButts = [
    new menuButton(-320, 180, 40, 40, 'unequip', player.hotbar[0].icon, 64, 64), new menuButton(-120, 180, 40, 40, 'unequip', player.hotbar[1].icon, 64, 64),
    new menuButton(80, 180, 40, 40, 'unequip', player.hotbar[2].icon, 64, 64), new menuButton(280, 180, 40, 40, 'unequip', player.hotbar[3].icon, 64, 64)
  ]
  let scrollButts = [new menuButton(-440, -215, 40, 40, 'scrollUp', upButton, 64, 64), new menuButton(-440, 140, 40, 40, 'scrollDown', downButton, 64, 64)]
  let weaponsButtons = []
  if(player.inventory.weapons.length > invOffset * 5){
    for (let i = invOffset * 5; i < player.inventory.weapons.length && i < (invOffset * 5) + 5; i++){
      weaponsButtons.push(new menuButton(-400, -175 + (70 * (i - (invOffset * 5))), 800/3, 70, 'moveToHotbar', player.inventory.weapons[i], 64, 64))
    }
  }
  let apparelButtons = []
  if (player.inventory.apparels.length > invOffset * 5){
    for (let i = invOffset * 5; i < player.inventory.apparels.length && i < (invOffset * 5) + 5; i++){
      apparelButtons.push(new menuButton(-400/3, -175 + (70 * (i - (invOffset * 5))), 800/3, 70, 'equipRmr', player.inventory.apparels[i], 64, 64))
    }
  }
  let usablesButtons = []
  if (player.inventory.usables.length > invOffset * 5){
    for (let i = invOffset * 5; i < player.inventory.usables.length && i < (invOffset * 5) + 5; i++){
      usablesButtons.push(new menuButton(-400/3, -175 + (70 * (i - (invOffset * 5))), 800/3, 70, 'usePot', player.inventory.usables[i], 64, 64))
    }
  }
  push()
    setCamera(uiCam)
    uiCam.setPosition(0, 0, 50)
    image(player.hotbar[player.weapon].spriteSheet,
      -512, -288,
      1024, 576,
      320 * player.attackFrame, 0,
      320, 180
      )
    fill(216, 158, 99)
    rect(-800/3, 0, 800/3, 360)
    rect(800/3, 0, 800/3, 360)
    rect(0, -195, 800/3, 30)
    fill(182, 132, 82)
    rect(0, 0, 800/3, 360)
    rect(-800/3, -195, 800/3, 30)
    rect(800/3, -195, 800/3, 30)
    textSize(20)
    fill(0)
    text('weapons', -800/3, -200)
    text('apparel', 0, -200)
    text('consumables', 800/3, -200)
    textAlign(LEFT, TOP)
    for (let i of weaponsButtons){
      fill(255)
      rect(-384, i.collY + 16, 32, 32)
      image(i.spriteSheet.icon, -400, i.collY, 32, 32, 0, 0, 64, 64)
      fill(0)
      text(i.spriteSheet.name, -366, i.collY)
      text('dmg: ' + i.spriteSheet.damage, -400, i.collY + 34)
      if (i.checkHovered() && mouseIsPressed && hotbarSelect == false){
        selectedWeapon = i.spriteSheet
        hotbarSelect = true
      }
    }
    for (let i of apparelButtons){
      fill(255)
      rect(-352/3, i.collY + 16, 32, 32)
      image(i.spriteSheet.icon, -400/3, i.collY, 32, 32, 0, 0, 64, 64)
      fill(0)
      text(i.spriteSheet.name, -298/3, i.collY)
      text('def: ' + i.spriteSheet.defense, -400/3, i.collY + 34)
      if (i.checkHovered() && mouseIsPressed && hotbarSelect == false){
        player.def = i.spriteSheet.defense
      }
    }
    for (let i of usablesButtons){
      text(i.spriteSheet.name, i.collx + (i.w/2), i.collY)
    }
    for(let i = 0; i < hotbarButts.length; i++){
      let j = hotbarButts[i]
      fill(216, 158, 99)
      rect(j.transX, j.transY, 40, 40)
      image(j.spriteSheet, j.collX, j.collY, 40, 40)
      if (hotbarSelect == false){
        hotbarButts[i].executeFunc({data: [player.hotbar[i], i]})
      }
    }
    for (let i of scrollButts){
      i.render()
      i.executeFunc({})
    }
    if (keyIsDown(81) && player.inventory.weapons.length >= 1){
      droppedInv.weapons.push(player.inventory.weapons[0])
      player.inventory.weapons.shift()
    }
    exitButton.render()
    exitButton.executeFunc({})
  if (hotbarSelect == true){
    hotbarUI(selectedWeapon)
  }
  pop()
}

function lootUI(lootee){
  let scrollButts = [new menuButton(-440, -215, 40, 40, 'scrollUp', upButton, 64, 64), new menuButton(-440, 140, 40, 40, 'scrollDown', downButton, 64, 64)]
  let weaponsButtons = []
  for (let i = invOffset * 5; i < lootee.inventory.weapons.length && i < (invOffset * 5) + 5; i++){
    weaponsButtons.push(new menuButton(-400, -175 + (70 * (i - (invOffset * 5))), 800/3, 70, 'giveWpn', lootee.inventory.weapons[i], 64, 64))
  }
  let apparelButtons = []
  for (let i = invOffset * 5; i < lootee.inventory.apparels.length && i < (invOffset * 5) + 5; i++){
    apparelButtons.push(new menuButton(-400/3, -175 + (70 * (i - (invOffset * 5))), 800/3, 70, 'giveRmr', lootee.inventory.apparels[i], 64, 64))
  }
  let usablesButtons = []
  for (let i = invOffset * 5; i < lootee.inventory.usables.length && i < (invOffset * 5) + 5; i++){
    usablesButtons.push(new menuButton(-400/3, -175 + (70 * (i - (invOffset * 5))), 800/3, 70, 'givePot', lootee.inventory.usables[i], 64, 64))
  }
  push()
    setCamera(uiCam)
    uiCam.setPosition(0, 0, 50)
    image(player.hotbar[player.weapon].spriteSheet,
      -512, -288,
      1024, 576,
      320 * player.attackFrame, 0,
      320, 180
      )
    fill(216, 158, 99)
    rect(-800/3, 0, 800/3, 360)
    rect(800/3, 0, 800/3, 360)
    rect(0, -195, 800/3, 30)
    fill(182, 132, 82)
    rect(0, 0, 800/3, 360)
    rect(-800/3, -195, 800/3, 30)
    rect(800/3, -195, 800/3, 30)
    textSize(20)
    fill(0)
    text('weapons', -800/3, -200)
    text('apparel', 0, -200)
    text('consumables', 800/3, -200)
    textAlign(LEFT, TOP)
    for (let i of weaponsButtons){
      fill(255)
      rect(-384, i.collY + 16, 32, 32)
      image(i.spriteSheet.icon, -400, i.collY, 32, 32, 0, 0, 64, 64)
      fill(0)
      text(i.spriteSheet.name, -366, i.collY)
      text('dmg: ' + i.spriteSheet.damage, -400, i.collY + 34)
      if (i.checkHovered() && mouseIsPressed && !mouseWasPressed){
        lootee.inventory.weapons.splice(weaponsButtons.indexOf(i), 1)
        player.inventory.weapons.push(i)
      }
    }
    for (let i of apparelButtons){
      fill(255)
      rect(-352/3, i.collY + 16, 32, 32)
      image(i.spriteSheet.icon, -400/3, i.collY, 32, 32, 0, 0, 64, 64)
      fill(0)
      text(i.spriteSheet.name, -298/3, i.collY)
      text('def: ' + i.spriteSheet.defense, -400/3, i.collY + 34)
      if (i.checkHovered() && mouseIsPressed && !mouseWasPressed){
        lootee.inventory.apparels.splice(apparelButtons.indexOf(i), 1)
        player.inventory.apparels.push(i.spriteSheet)
      }
    }
    for (let i of usablesButtons){
      text(i.spriteSheet.name, i.collx + (i.w/2), i.collY)
      if (i.checkHovered() && mouseIsPressed && !mouseWasPressed){
        lootee.inventory.usables.splice(usablesButtons.indexOf(i), 1)
        player.inventory.usables.push(i.spriteSheet)
      }
    }
    for (let i of scrollButts){
      i.render()
      i.executeFunc({})
    }
    exitButton.render()
    exitButton.executeFunc({})
  pop()
}

function hotbarUI(weapon){
  let hotbarButts = [
    new menuButton(-404, -20, 40, 40, 'eqp1', player.hotbar[0].icon, 64, 64), new menuButton(-148, -20, 40, 40, 'eqp2', player.hotbar[1].icon, 64, 64),
    new menuButton(108, -20, 40, 40, 'eqp3', player.hotbar[2].icon, 64, 64), new menuButton(364, -20, 40, 40, 'eqp4', player.hotbar[3].icon, 64, 64)
  ]
  for (let i of hotbarButts){
    i.render()
    i.executeFunc({data: weapon})
  }
}