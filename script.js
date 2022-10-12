let red = [200,10, 10]
let green = [10, 200, 10]
let grey = [150, 150, 150]
let purple = [150, 10, 200]

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
      player.inventory.weapons.push(player.hotbar[0])
      player.hotbar[0] = data
      player.inventory.weapons.splice(player.inventory.weapons.indexOf(data), 1)
      hotbarSelect = false
      console.log('item moved')
      break
    case 'eqp2':
      player.inventory.weapons.push(player.hotbar[1])
      player.hotbar[1] = data
      player.inventory.weapons.splice(player.inventory.weapons.indexOf(data), 1)
      hotbarSelect = false
      break
    case 'eqp3':
      player.inventory.weapons.push(player.hotbar[2])
      player.hotbar[2] = data
      player.inventory.weapons.splice(player.inventory.weapons.indexOf(data), 1)
      hotbarSelect = false
      break
    case 'eqp4':
      player.inventory.weapons.push(player.hotbar[3])
      player.hotbar[3] = data
      player.inventory.weapons.splice(player.inventory.weapons.indexOf(data), 1)
      hotbarSelect = false
      break
    case 'giveWpn':

      break
    case 'giveRmr':

      break
    case 'givePot':

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
    case 'heal25':
      player.hp += 25
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
  constructor(x, y, z, height, angleLR, angleUD, speed, currentFloor, hp, weapon, {xp = 0, level = 0}){
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
    if (keyIsDown(73) && this.attackFrame == 0){
      exitPointerLock()
      hotbarSelect = false
      gameState = 'inventory'
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

    for (let i of currentCell.objects){
      if (i.interactible != false){
        let x3 = i.x - (i.collWidth/2)*cos(this.angleLR)
        let z3 = i.z - (i.collWidth/2)*sin(this.angleLR)
        let x4 = i.x + (i.collWidth/2)*cos(this.angleLR)
        let z4 = i.z + (i.collWidth/2)*sin(this.angleLR)
        let den = (x1-x2)*(z3-z4)-(z1-z2)*(x3-x4)
        let t = ((x1-x3)*(z3-z4)-(z1-z3)*(x3-x4))/den
        let u = ((x1-x3)*(z1-z2)-(z1-z3)*(x1-x2))/den
        if (0 <= t && t <= 1 && 0 <= u && u <= 1){
          return [true, i]
        }
      }
    }
    return [false, false]
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
    //texture(this.texture)
    fill(red)
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
    //texture(this.texture)
    fill(grey)
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
    this.spriteSheet = spriteSheet
    // this.spriteSheet = spriteSheet.image
    // this.sWidth = spriteSheet.sWidth
    // this.sHeight = spriteSheet.sHeight
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
    fill(this.spriteSheet)
    translate(this.x, this.midVert, this.z + 500)
    rotateY(360 - player.angleLR)
    rect(0, 0, this.collWidth, this.height)
    // switch (this.animation) {
    //   case 'i':
    //     image(this.spriteSheet,
    //       -this.collWidth / 2, -this.height / 2,
    //       this.collWidth, this.height,
    //       this.sWidth * spriteAngle, 0,
    //       this.sWidth, this.sHeight
    //     )
    //     break
    //   case 'w':
    //     image(this.spriteSheet,
    //       -this.collWidth/2, -this.height/2,
    //       this.collWidth, this.height,
    //       Math.floor(this.frame) * this.sWidth, this.sHeight * (spriteAngle + 1),
    //       this.sWidth, this.sHeight
    //     )
    //     if (gameState == 'game'){
    //       this.frame += 0.2
    //       if (this.frame >= 4) {
    //         this.frame = 0
    //       }
    //     }
    //     break
    //   case 'a':
    //     image(this.spriteSheet,
    //       -this.collWidth/2, -this.height/2,
    //       this.collWidth, this.height,
    //       this.sWidth * (spriteAngle + 5), this.sHeight * (2 + Math.floor(this.frame)),
    //       this.sWidth, this.sHeight
    //      )
    //     break
    //   case 'd':
    //     image(this.spriteSheet,
    //       -this.collWidth / 2, -this.height / 2,
    //       this.collWidth, this.height,
    //       this.sWidth * (Math.floor(this.frame) + 5), this.sHeight,
    //       this.sWidth, this.sHeight
    //     )
    //     if (this.frame < 4) {
    //       this.frame += 0.6
    //     }
    //     break
    //   }
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
        if (collideRectCircle(i.unrotX1, i.unrotZ1, i.width1, i.width2, rottedX, rottedZ, currentCell.objects[this.linkedNtt].collWidth)){ // checking if AI is on the tile
          finalY = i.y // sets the floor the AI stands on
        }
      }
    }
    this.y = finalY
    this.midVert = -(this.y + (this.height/2))
  }
}

class cell{
  constructor(walls, floors, objects, AIs, grid){
    this.walls = walls
    this.floors = floors
    this.objects = objects
    this.AIs = AIs
    this.grid = grid
  }
}

class weapon{
  constructor(name, damage, spriteSheet, aF, dF, spriteSizes){
    this.damage = damage
    this.spriteSheet = spriteSheet
    this.aF = aF
    this.dF = dF
    this.spriteSizes = spriteSizes
    this.name = name
    this.type = 'weapon'
  }
}

class apparel{
  constructor(name, defense){
    this.defense = defense
    this.name = name
    this.type = 'apparel'
  }
}

class consumable{
  constructor(name, func){
    this.name = name
    this.func = func
    this.type = 'consumable'
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
  savedWorld = [new pc(player.x, player.y, player.z, player.height, player.angleLR, player.angleUD, player.speed, player.currentFloor, player.hp, player.weapon, {xp: player.xp, level: player.level}),
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
let brick
let tallWall
let swordSprite
let crossImg
let beginButt
let loadButt
let fistSprite
//more general?
let gameState = 'menu'
let mainMenuButts
let meleeMin = 75
let meleeMax = 150
let interactCheckVariable
let talkDepth
let talkOption
let mouseWasPressed
//cells
let testCell
let testCell2
let currentCell
let currentCellNo
//weapons
let punch
let defSword
let nmeSword
//armour
let defArmour
//general
let world
let savedWorld
let loadButton
let exitButton
let chibiSprite
let chibiSpritesheet
let hotbarSelect
let selectedWeapon
let hotbarButts

function preload(){
  font = loadFont('COMIC.ttf')
  impSprite = loadImage('imp.png')
  chibiSprite = loadImage('chibiSprite.png')
  brick = loadImage('brickTemp.png')
  tallWall = loadImage('tallWall.png')
  swordSprite = loadImage('sword1.png')
  beginButt = loadImage('beginButton.png')
  loadButt = loadImage('deathButton.png')
  crossImg =  loadImage('exitButton.png')
  fistSprite = loadImage('punch.png')
}

function setup() {
  impSpritesheet = new spritesheet(impSprite, 42, 61)
  chibiSpritesheet = new spritesheet(chibiSprite, 44, 50)
  punch = new weapon('just your fists', 2, fistSprite, 3, 2, [])
  defSword = new weapon('default sword', 10, swordSprite, 3, 2, [])
  nmeSword = new weapon('the sword enemies use', 20, swordSprite, 5, 4, [])
  defArmour = new apparel('default armour', 2)
  createCanvas(1024, 576, WEBGL);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER)
  noStroke();
  rectMode(CENTER)
  mainMenuButts = [
    new menuButton(-512, -5, 200, 60, 'beginGame', beginButt, 200, 60)
  ]
  hotbarButts = [
    new menuButton(-404, -20, 40, 40, 'eqp1', crossImg, 64, 64), new menuButton(-148, -20, 40, 40, 'eqp2', crossImg, 64, 64),
    new menuButton(108, -20, 40, 40, 'eqp3', crossImg, 64, 64), new menuButton(364, -20, 40, 40, 'eqp4', crossImg, 64, 64)
  ]
  loadButton = new menuButton(-100, 100, 200, 60, 'load', loadButt, 200, 60)
  exitButton = new menuButton(400, -200, 32, 32, 'beginGame', crossImg, 64, 64)
  cam = createCamera();
  uiCam = createCamera();
  setCamera(cam)
  testCell = new cell([
    new boundary(0, 0, 1000, 0, tallWall, 500, 0), new boundary(1000, 0, 1000, 1000, tallWall, 50, 0), new boundary(1000, 1000, 0, 1000, tallWall, 500, 0),
    new boundary(10000, 500, 500, 500, tallWall, 475, 25), new boundary(1000, 0, 1000, 500, tallWall, 500, 0),
    new boundary(1500, 1000, 1500, 2000, tallWall, 50, 100), new boundary(1000, 1000, 1500, 1000, tallWall, 100, 0),
    new boundary(1500, 1000, 2000, 1000, tallWall, 150, 0), new boundary(2000, 500, 2000, 1000, tallWall, 200, 0),
    new boundary(2000, 1000, 2500, 1000, tallWall, 50, 150)
    // new boundary(500, 500, 2500, 500, tallWall, 250, 0), new boundary(2500, 500, 2500, 1000, brick, 250, 0), new boundary(2500, 1000, 1500, 1250, brick, 250, 0),
    // new boundary(2500, 1000, 3000, 900, brick, 250, 0), new boundary(3000, 2000, 2500, 2500, brick, 250, 0), new boundary(2000, 2500, 800, 2200, brick, 250, 0), new boundary(800, 2200, 500, 500, brick, 250, 0),
    // new boundary(2500, 2500, 2500, 3000, brick, 250, 0), new boundary(2500, 3000, 3000, 3250, brick, 250, 0), new boundary(3000, 3250, 2500, 3500, brick, 250, 0), new boundary(2500, 3500, 2000, 3400, brick, 250, 0),
    // new boundary(2000, 3400, 800, 2200, brick, 250, 0), new boundary(1500, 1250, 1800, 1400, brick, 250, 0), new boundary(1800, 1400, 2000, 1125, brick, 250, 0), new boundary(3000, 2000, 2800, 1500, brick, 250, 0),
    // new boundary(2800, 1500, 3500, 1900, brick, 250, 0), new boundary(3500, 1900, 3100, 2050, brick, 250, 0), new boundary(3100, 2050, 3400, 2500, brick, 250, 0), new boundary(3400, 2500, 4000, 2500, brick, 250, 0),
    // new boundary(4000, 2500, 4300, 2100, brick, 250, 0), new boundary(4300, 2100, 3900, 1600, brick, 250, 0), new boundary(3900, 1600, 3650, 1600, brick, 250, 0), new boundary(3650, 1600, 3700, 1000, brick, 250, 0),
    // new boundary(3700, 1000, 3000, 900, brick, 250, 0), new boundary(3700, 1000, 3000, 1200, brick, 250, 0)
  ],[
    new floor(1000, 1000, 500, 0, 500, 0, tallWall, {}),
    new floor(1000, 1000, 1500, 50, 500, 0, tallWall, {}),
    new floor(1000, 1000, 1500, 100, 1500, 0, tallWall, {}),
    //new floor(1000, 1000, 2000, 500, 500, 0, tallWall, {}),
    new floor(1000, 1000, 2000, 150, 1500, 0, tallWall, {}),
    new floor(500, 500, 2250, 200, 750, 0, tallWall, {})
    // new floor(1000, 1000, 300, 0, 500, 0, brick, {}),
    // new floor(700, 2000, 1150, 0, 1000, 0, brick, {}),
    // new floor(509.9019513592785, 500, 1450 + 250*sin(78.69006752597979), 50, 1650 + (509.9019513592785/2)*cos(78.69006752597979), 78.69006752597979, brick, {}),
    // new floor(200, 200, 1600, 100, 1550, 0, brick, {}),
    // new floor(1000, 1000, 300, 250, 500, 0, brick, {}), new floor(500, 500, 1000, 50, 1000, 0, tallWall, {}),
    // new floor(500, 500, 900, 100, 1500, 45, tallWall, {})
  ],[
    //new entity(750, 0, 500, green, 75, 175, false, [], 0, {}),
    new entity(250, 0, 500, purple, 75, 175, 'loot', [], 1, new inventory([nmeSword], [defArmour], []), {canCollide: false})
    // new entity(3600, 0, 2000, impSpritesheet, 50, 175, false, [], 0), new entity(1500, 0, 1000, impSpritesheet, 50, 175, false, [], 1),
    // new entity(3700, 0, 2100, chibiSpritesheet, 50, 175, false, [], 2), new entity(2000, 0, 3000, impSpritesheet, 50, 175, false, [], 3),
    // new entity(1000, 0, 1000, impSpritesheet, 50, 175, 'loadZone', [1, 0, 0, 0], 4), new entity(2000, 0, 3100, impSpritesheet, 50, 175, false, [], 5)
  ],[
    new ai(750, 0, 250, 0, 4, 100, 0, 'h', nmeSword, 50)
    // new ai(3600, 0, 2000, 0, 5, 50, 0, 'h', nmeSword, 50), new ai(1500, 0, 1000, 0, 5, 50, 1, 'h', nmeSword, 50),
    // new ai(3700, 0, 2100, 0, 5, 50, 2, 'h', nmeSword, 50), new ai(2000, 0, 3000, 0, 5, 50, 3, 'h', nmeSword, 50),
    // new ai(1000, 0, 2001, 0, 5, 50, 5, 'h', nmeSword, 50)//, new ai(2000, 0, 2000, 0, 4, 50, 1, 'h', 4) 
  ],[
    new pathNode(250, 250, [1], 'a'), new pathNode(250, 750, [0, 2], 'b'), new pathNode(1250, 750, [1, 3], 'c'), 
    new pathNode(1250, 1500, [1, 2, 4], 'd'), new pathNode(2250, 1500, [3, 5], 'e'), new pathNode(2250, 750, [4], 'f')
    // new pathNode(1000, 1000, [1, 2, 3], 'a'), new pathNode(2000, 800, [0], 'b'), 
    // new pathNode(1000, 2000, [0, 3, 4], 'c'), new pathNode(2000, 2000, [0, 2, 4, 5], 'd'), 
    // new pathNode(2500, 1250, [3, 2, 8, 5], 'e'), new pathNode(2250, 2700, [3, 6, 7, 4], 'f'), new pathNode(1400, 2600, [5, 7], 'g'),
    // new pathNode(2300, 3200, [5, 6], 'h'), new pathNode(3300, 1400, [4, 9], 'i'), new pathNode(3900, 2200, [8], 'j')
  ])
  for (let i = 0; i < testCell.objects.length; i++){
    testCell.objects[i].ogIndex = i
  }
  testCell2 = new cell([
    new boundary(2500, 1000, 3000, 900, brick, 250, 0), new boundary(3000, 2000, 2500, 2500, brick, 250, 0), new boundary(2000, 2500, 800, 2200, brick, 250, 0), new boundary(800, 2200, 500, 500, brick, 250, 0),
    new boundary(2500, 2500, 2500, 3000, brick, 250, 0), new boundary(2500, 3000, 3000, 3250, brick, 250, 0), new boundary(3000, 3250, 2500, 3500, brick, 250, 0), new boundary(2500, 3500, 2000, 3400, brick, 250, 0),
    new boundary(2000, 3400, 800, 2200, brick, 250, 0), new boundary(1500, 1250, 1800, 1400, brick, 250, 0), new boundary(1800, 1400, 2000, 1125, brick, 250, 0), new boundary(3000, 2000, 2800, 1500, brick, 250, 0),
    new boundary(2800, 1500, 3500, 1900, brick, 250, 0), new boundary(3500, 1900, 3100, 2050, brick, 250, 0), new boundary(3100, 2050, 3400, 2500, brick, 250, 0), new boundary(3400, 2500, 4000, 2500, brick, 250, 0),
    new boundary(4000, 2500, 4300, 2100, brick, 250, 0), new boundary(4300, 2100, 3900, 1600, brick, 250, 0), new boundary(3900, 1600, 3650, 1600, brick, 250, 0), new boundary(3650, 1600, 3700, 1000, brick, 250, 0),
    new boundary(3700, 1000, 3000, 1200, brick, 250, 0)
  ],[
    new floor(1000, 1000, 300, 0, 500, 0, brick, {}),
    new floor(700, 2000, 1150, 0, 1000, 0, brick, {})
    // new floor(509.9019513592785, 500, 1450 + 250*sin(78.69006752597979), 50, 1650 + (509.9019513592785/2)*cos(78.69006752597979), 78.69006752597979, brick, {}),
    // new floor(200, 200, 1600, 100, 1550, 0, brick, {}),
    // new floor(1000, 1000, 300, 250, 500, 0, brick, {})
  ],[
    new entity(1000, 0, -100, impSpritesheet, 50, 175, 'loadZone', 
    [0, 1200, 0, 1500], 0, new inventory([], [], []), {}
      ),
    new entity(500, 0, 1000, impSpritesheet, 50, 175, 'dialogue',
    [
      [['never seen'], ['beginning dialogue']],
      [['player response 1', 'player response 2'], ['npc reaction 1', 'npc reaction 2']],
      [['player response'], ['npc text line']],
      [['player final line'], ['never seen']]
    ], 1, new inventory([], [], []), {}
      )
  ],[
  ],[
    new pathNode(1000, 1000, [1, 2, 3], 'a'), new pathNode(2000, 800, [0], 'b'), 
    new pathNode(1000, 2000, [0, 3, 4], 'c'), new pathNode(2000, 2000, [0, 2, 4, 5], 'd'), 
    new pathNode(2500, 1250, [3, 2, 8, 5], 'e'), new pathNode(2250, 2700, [3, 6, 7, 4], 'f'), new pathNode(1400, 2600, [5, 7], 'g'),
    new pathNode(2300, 3200, [5, 6], 'h'), new pathNode(3300, 1400, [4, 9], 'i'), new pathNode(3900, 2200, [8], 'j')
  ])
  for (let i = 0; i < testCell2.objects.length; i++){
    testCell2.objects[i].ogIndex = i
  }
  world = [testCell, testCell2]
  for (let i of world){
    i.floors.floorSort
  }
  currentCell = testCell
  currentCellNo = 0
  player = new pc(1920, 600, 1500, 175, 0, 0, 8, currentCell.floors[0], 100, 0, {})
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
}

function draw() {
  player.speed = 8 * (30/frameRate())
  background(0)
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
      currentCell.objects = currentCell.objects.sort(entitySort)
      for (let i of currentCell.objects){
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entityUnsort)
      if (keyIsDown(69)){
        interactCheckVariable = player.interactCheck()
        if (interactCheckVariable[0]){
          if (interactCheckVariable[1].interactible != 'loadZone'){
            gameState = interactCheckVariable[1].interactible
            talkDepth = 0
            talkOption = 0
            mouseWasPressed = true
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
        if (jumpHeight >= 50){
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
  let hotbarPos = 
  push() // auto reverses changes
    strokeWeight(0.1)
    stroke(255)
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
    rect(-110, 250, 30, 30)
    rect(-150, 250, 30, 30)
    rect(110, 250, 30, 30)
    rect(150, 250, 30, 30)
    fill(0)
    text(player.xp, 500, 250)
    text(player.def, 500, 225)
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
    fill(25, 25, 25, 170)
    rect(-256, 0, 400, 400)
    rect(256, 0, 400, 400)
    textSize(25)
    fill(255, 0, 0)
    text(entity.useData[talkDepth][1][talkOption], -256, 0, 400, 400)
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
  let weaponsButtons = []
  for (let i = 0; i < player.inventory.weapons.length; i++){
    weaponsButtons.push(new menuButton(-400, -175 + (20 * i), 800/3, 20, 'moveToHotbar', player.inventory.weapons[i], 64, 64))
  }
  let apparelButtons = []
  for (let i = 0; i < player.inventory.apparels.length; i++){
    apparelButtons.push(new menuButton(-400/3, -175 + (20 * i), 800/3, 20, 'equipRmr', player.inventory.apparels[i], 64, 64))
  }
  let usablesButtons = []
  for (let i = 0; i < player.inventory.usables.length; i++){
    usablesButtons.push(new menuButton(-400/3, -175 + (20 * i), 800/3, 20, 'usePot', player.inventory.usables[i], 64, 64))
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
    fill(25, 25, 25, 170)
    rect(0, 0, 800, 400)
    fill(255, 0, 0)
    textSize(20)
    text('weapons', -800/3, -200)
    text('apparel', 0, -200)
    text('consumables', 800/3, -200)
    for (let i of weaponsButtons){
      text(i.spriteSheet.name, i.collX + (i.w/2), i.collY)
      if (i.checkHovered() && mouseIsPressed && hotbarSelect == false){
        selectedWeapon = i.spriteSheet
        hotbarSelect = true
      }
    }
    for (let i of apparelButtons){
      text(i.spriteSheet.name, i.collX + (i.w/2), i.collY)
      if (i.checkHovered() && mouseIsPressed && hotbarSelect == false){
        player.def = i.spriteSheet.defense
      }
    }
    for (let i of usablesButtons){
      text(i.spriteSheet.name, i.collx + (i.w/2), i.collY)
    }
    if (keyIsDown(81)){
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
  let weaponsButtons = []
  for (let i = 0; i < lootee.inventory.weapons.length; i++){
    weaponsButtons.push(new menuButton(-400, -175 + (20 * i), 800/3, 20, 'giveWpn', lootee.inventory.weapons[i], 64, 64))
  }
  let apparelButtons = []
  for (let i = 0; i < lootee.inventory.apparels.length; i++){
    apparelButtons.push(new menuButton(-400/3, -175 + (20 * i), 800/3, 20, 'giveRmr', lootee.inventory.apparels[i], 64, 64))
  }
  let usablesButtons = []
  for (let i = 0; i < lootee.inventory.usables.length; i++){
    usablesButtons.push(new menuButton(-400/3, -175 + (20 * i), 800/3, 20, 'givePot', lootee.inventory.usables[i], 64, 64))
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
    fill(25, 25, 25, 170)
    rect(0, 0, 800, 400)
    fill(255, 0, 0)
    textSize(20)
    text('weapons', -800/3, -200)
    text('apparel', 0, -200)
    text('consumables', 800/3, -200)
    for (let i of weaponsButtons){
      text(i.spriteSheet.name, i.collX + (i.w/2), i.collY)
      if (i.checkHovered() && mouseIsPressed){
        player.inventory.weapons.push(i.spriteSheet)
        lootee.inventory.weapons.splice(weaponsButtons.indexOf(i), 1)
      }
    }
    for (let i of apparelButtons){
      text(i.spriteSheet.name, i.collX + (i.w/2), i.collY)
      if (i.checkHovered() && mouseIsPressed){
        player.inventory.apparels.push(i.spriteSheet)
        lootee.inventory.apparels.splice(apparelButtons.indexOf(i), 1)
      }
    }
    for (let i of usablesButtons){
      text(i.spriteSheet.name, i.collx + (i.w/2), i.collY)
      if (i.checkHovered() && mouseIsPressed){
        player.inventory.usables.push(i.spriteSheet)
        lootee.inventory.usables.splice(usablesButtons.indexOf(i), 1)
      }
    }
    exitButton.render()
    exitButton.executeFunc({})
  pop()
}

function hotbarUI(weapon){
  for (let i of hotbarButts){
    i.render()
    i.executeFunc({data: weapon})
  }
}