let red = [200,10, 10]
let green = [10, 200, 10]
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
      //translate(this.transX, this.transY, 0)
      image(this.spriteSheet,
        this.collX, this.collY,
        this.w, this.h,
        this.checkHovered() * this.sW, 0,
        this.sW, this.sH
        )
    pop()
  }

  executeFunc(){
    if (this.checkHovered()){
      switch (this.func){
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
      }
    }
  }
}

class pc{
  constructor(x, y, z, height, angleLR, angleUD, speed, currentFloor, hp, weapon){
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
    this.weapon = weapon
    this.attacking = false
    this.attackFrame = 0
    this.inventory = new inventory([], [], [])
  }

  floorCheck(){
    for (let i of currentCell.floors){ // check every floor tile
      if (this.y >= i.y - i.catchZone){
        let relX = this.x - i.x
        let relZ = this.z - i.z
        let rottedX = (relX * cos(i.rotation)) + (relZ * sin(i.rotation))
        // player coords rotated to align with the tested floor tile
        let rottedZ = -(relX * sin(i.rotation)) + (relZ * cos(i.rotation))
        if (rottedX >= i.unrotX1 && rottedX <= i.unrotX2
          && rottedZ >= i.unrotZ1 && rottedZ <= i.unrotZ2){
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
          return false
        }
        if (intersectCheck([x1, z1], [x2, z2], [x3, z3], [x4, z4])){
          return false
        }
        // den = (x1-x2)*(z3-z4)-(z1-z2)*(x3-x4)
        // t = ((x1-x3)*(z3-z4)-(z1-z3)*(x3-x4))/den
        // u = ((x1-x3)*(z1-z2)-(z1-z3)*(x1-x2))/den
        // if (t >= 0 && t <= 1 && u >= 0 && u <= 1){
        //   return false
        // }
        x3 = x4 - dz
        z3 = z4 + dx
        if (intersectCheck([x1, z1], [x2, z2], [x3, z3], [x4, z4])){
          return false
        }
      }
    }
    for (let i of currentCell.objects){
      if(dist(x4, z4, i.x, i.z) <= 75){
        return false
      }
    }
    return true
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
    if (keyIsDown(27)){
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
    if (keyIsDown(32) && jumpHeight == 0){//space
      jumping = true
    }
    this.floorCheck()
    if (this.y < this.currentFloor.y){
      this.y += this.speed
      this.eyeLevel = this.y + this.height
    }
    if (keyIsDown(73)){
      exitPointerLock()
      gameState = 'inventory'
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
  constructor(x, y, z, spriteSheet, collWidth, height, interactible, useData){
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
  }
  
  render(){
    let spriteAngle = Math.floor((this.angle - player.angleLR + 22.5 + 180)/45)
    this.midVert = -(this.y + (this.height/2))
    if (spriteAngle >= 8){
      spriteAngle -= 8
    }
    else if (spriteAngle < 0){
      spriteAngle += 8
    }
    push()
    translate(this.x, this.midVert, this.z + 500)
    rotateY(360 - player.angleLR)
    switch (this.animation){
      case 'i':
        image(this.spriteSheet,
          -this.collWidth/2, -this.height/2,
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
        if (this.frame < 4 && gameState == 'game'){
          this.frame += 0.2
          if (this.frame >= 4){
            this.frame = 0
          }
        }
        break
      case 'd':
        image(this.spriteSheet,
          -this.collWidth/2, -this.height/2,
          this.collWidth, this.height,
          this.sWidth * (Math.floor(this.frame) + 5), this.sHeight * 3,
          this.sWidth, this.sHeight
        )
        if (this.frame < 7 && gameState == 'game'){
          this.frame += 0.6
        }
        break
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
  constructor(x, y, z, angle, speed, hp, linkedNtt, mode, weapon){
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
            [nodes[0][0].x, nodes[0][0].z], this.goal, [i.x1, i.z1], [i.x2, i.z2])){//} && i.base <= this.y + this.height && i.base + i.height >= this.y + 51){
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
          [this.x, this.z], [i[0].x, i[0].z], [j.x1, j.z1], [j.x2, j.z2]) && i.base <= this.y + currentCell.objects[this.linkedNtt].height && i.base + i.height >= this.y + 51){
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
      if (intersectCheck([this.x, this.z], [player.x, player.z], [i.x1, i.z1], [i.x2, i.z2]) && i.base < this.y + currentCell.objects[this.linkedNtt].height && i.base + i.height > this.y){
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
        if (intersectCheck([this.x, this.z], this.path[j], [i.x1, i.z1], [i.x2, i.z2]) && i.base < this.y + currentCell.objects[this.linkedNtt].height && i.base + i.height > this.y){
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
    if (Math.floor(this.x) == Math.floor(this.path[0][0]) && Math.floor(this.z) == Math.floor(this.path[0][1])){
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
    if (hyp <= meleeMax && hyp >= meleeMin){ // if in melee range
      for (let i of currentCell.walls){
        // checks if there's a wall in the way
        if (intersectCheck([this.x, this.z], [player.x, player.z], [i.x1, i.z1], [i.x2, i.z2]) && i.base < this.y + currentCell.objects[this.linkedNtt].height && i.base + i.height > this.y){
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

  fullPathfinding(){
    switch (this.mode){
      case 'h':
        let finalNode
        if (this.goal.length == 0){ // if the AI has no goal
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
      case 'm':
        let opp = this.x - player.x
        let adj = player.z - this.z
        let hyp = dist(this.x, this.z, player.x, player.z)
        let angle
        if (asin(opp/hyp) <= 0){
          angle = 360-acos(adj/hyp)
        }
        if(asin(opp/hyp) >= 0){
          angle = acos(adj/hyp)
        } // calculate the angle between north and the position to move to
        this.angle = angle
        this.mode = 'a'
        currentCell.objects[this.linkedNtt].angle = this.angle
        break;
      case 'a':
        this.attackFrame += 1
        if (this.attackFrame == this.weapon.dF && this.meleeCheck()){
          let opp = this.x - player.x
          let adj = player.z - this.z
          let hyp = dist(this.x, this.z, player.x, player.z)
          let angle
          if (asin(opp/hyp) <= 0){
            angle = 360-acos(adj/hyp)
          }
          if(asin(opp/hyp) >= 0){
            angle = acos(adj/hyp)
          } 
          if (Math.floor(angle) == Math.floor(this.angle)){
            player.hp -= this.weapon.damage
          }
          this.mode = 'a'
        }
        if (this.attackFrame > this.weapon.aF){
          this.attackFrame = 0
          this.meleeCheck()
        }
        break
      case 'd':
        break;
    }
    if (this.mode != 'd'){
      if (this.hp <= 0){
        this.mode = 'd'
        currentCell.objects[this.linkedNtt].animation = 'd'
        currentCell.objects[this.linkedNtt].frame = 0
      }
    }
  }

  floorCheck(){
    for (let i of currentCell.floors){ // check every floor tile
      if (this.y >= i.y - i.catchZone){
        let relX = this.x - i.x
        let relZ = this.z - i.z
        let rottedX = (relX * cos(i.rotation)) + (relZ * sin(i.rotation))
        // player coords rotated to align with the tested floor tile
        let rottedZ = -(relX * sin(i.rotation)) + (relZ * cos(i.rotation))
        if (rottedX >= i.unrotX1 && rottedX <= i.unrotX2
          && rottedZ >= i.unrotZ1 && rottedZ <= i.unrotZ2){
          // checking if player is on the tile
          this.y = i.y // sets the floor the player stands on
          this.midVert = - (this.y + (this.height/2))
        }
      }
    }
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
  }
}

class apparel{
  constructor(name, defense){
    this.defense = defense
    this.name = name
  }
}

class consumable{
  constructor(name, func){
    this.name = name
    this.func = func
  }

  executeFunc(){
    switch (this.func){
      case 'heal25':
        player.hp += 25
        break;
    }
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

function saveGame(){
  savedWorld = [new pc(player.x, player.y, player.z, player.height, player.angleLR, player.angleUD, player.speed, player.currentFloor, player.hp, player.weapon),
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
      objects.push(new entity(j.x, j.y, j.z, new spritesheet(j.spriteSheet, j.sWidth, j.sHeight), j.collWidth, j.height, j.interactible, j.useData))
    }
    objects = Object.assign({}, objects)
    objects = Object.values(objects)
    for (let j of i.AIs){
      AIs.push(new ai(j.x, j.y, j.z, j.angle, j.speed, j.hp, j.linkedNtt, j.mode, j.weapon))
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

let cam;
let uiCam;
let player;
let jumping = false
let jumpHeight = 0
let font
let impSprite
let impSpritesheet
let brick
let tallWall
let swordSprite
let gameState = 'menu'
let mainMenuButts
let meleeMin = 75
let meleeMax = 150
let interactCheckVariable
let talkDepth
let talkOption
let mouseWasPressed
let testCell
let testCell2
let currentCell
let currentCellNo
let defSword
let world
let savedWorld
let beginButt
let loadButt
let loadButton
let crossImg
let exitButton

function preload(){
  font = loadFont('COMIC.ttf')
  impSprite = loadImage('imp.png')
  brick = loadImage('brickTemp.png')
  tallWall = loadImage('tallWall.png')
  swordSprite = loadImage('sword1.png')
  beginButt = loadImage('beginButton.png')
  loadButt = loadImage('deathButton.png')
  crossImg =  loadImage('exitButton.png')
}

function setup() {
  impSpritesheet = new spritesheet(impSprite, 42, 61)
  defSword = new weapon('default sword', 10, swordSprite, 3, 6, [])
  createCanvas(1024, 576, WEBGL);
  angleMode(DEGREES);
  textAlign(CENTER, CENTER)
  noStroke();
  rectMode(CENTER)
  mainMenuButts = [
    new menuButton(-512, -5, 200, 60, 'beginGame', beginButt, 200, 60)
  ]
  loadButton = new menuButton(-100, 100, 200, 60, 'load', loadButt, 200, 60)
  exitButton = new menuButton(400, -200, 32, 32, 'beginGame', crossImg, 64, 64)
  cam = createCamera();
  uiCam = createCamera();
  setCamera(cam)
  testCell = new cell([
    new boundary(500, 500, 2500, 500, tallWall, 250, 0), new boundary(2500, 500, 2500, 1000, brick, 250, 0), new boundary(2500, 1000, 1500, 1250, brick, 250, 0),
    new boundary(2500, 1000, 3000, 900, brick, 250, 0), new boundary(3000, 2000, 2500, 2500, brick, 250, 0), new boundary(2000, 2500, 800, 2200, brick, 250, 0), new boundary(800, 2200, 500, 500, brick, 250, 0),
    new boundary(2500, 2500, 2500, 3000, brick, 250, 0), new boundary(2500, 3000, 3000, 3250, brick, 250, 0), new boundary(3000, 3250, 2500, 3500, brick, 250, 0), new boundary(2500, 3500, 2000, 3400, brick, 250, 0),
    new boundary(2000, 3400, 800, 2200, brick, 250, 0), new boundary(1500, 1250, 1800, 1400, brick, 250, 0), new boundary(1800, 1400, 2000, 1125, brick, 250, 0), new boundary(3000, 2000, 2800, 1500, brick, 250, 0),
    new boundary(2800, 1500, 3500, 1900, brick, 250, 0), new boundary(3500, 1900, 3100, 2050, brick, 250, 0), new boundary(3100, 2050, 3400, 2500, brick, 250, 0), new boundary(3400, 2500, 4000, 2500, brick, 250, 0),
    new boundary(4000, 2500, 4300, 2100, brick, 250, 0), new boundary(4300, 2100, 3900, 1600, brick, 250, 0), new boundary(3900, 1600, 3650, 1600, brick, 250, 0), new boundary(3650, 1600, 3700, 1000, brick, 250, 0),
    new boundary(3700, 1000, 3000, 900, brick, 250, 0), new boundary(3700, 1000, 3000, 1200, brick, 250, 0)
  ],[
    new floor(1000, 1000, 300, 0, 500, 0, brick, {}),
    new floor(700, 2000, 1150, 0, 1000, 0, brick, {}),
    new floor(509.9019513592785, 500, 1450 + 250*sin(78.69006752597979), 50, 1650 + (509.9019513592785/2)*cos(78.69006752597979), 78.69006752597979, brick, {}),
    new floor(200, 200, 1600, 100, 1550, 0, brick, {}),
    new floor(1000, 1000, 300, 250, 500, 0, brick, {})
  ],[
    new entity(1000, 0, 5000, impSpritesheet, 50, 175, false, []), new entity(5000, 0, 1000, impSpritesheet, 50, 175, false, []), 
    new entity(1000, 0, 1000, impSpritesheet, 50, 175, 'loadZone', 
    [1, 0, 0, 0]
      )
  ],[
    new ai(3600, 0, 2000, 0, 20, 50, 0, 'h', defSword)//, new ai(2000, 0, 2000, 0, 4, 50, 1, 'h', 4)
  ],[
    new pathNode(1000, 1000, [1, 2, 3], 'a'), new pathNode(2000, 800, [0], 'b'), 
    new pathNode(1000, 2000, [0, 3, 4], 'c'), new pathNode(2000, 2000, [0, 2, 4, 5], 'd'), 
    new pathNode(2500, 1250, [3, 2, 8, 5], 'e'), new pathNode(2250, 2700, [3, 6, 7, 4], 'f'), new pathNode(1400, 2600, [5, 7], 'g'),
    new pathNode(2300, 3200, [5, 6], 'h'), new pathNode(3300, 1400, [4, 9], 'i'), new pathNode(3900, 2200, [8], 'j')
  ])
  testCell2 = new cell([
    new boundary(2500, 1000, 3000, 900, brick, 250, 0), new boundary(3000, 2000, 2500, 2500, brick, 250, 0), new boundary(2000, 2500, 800, 2200, brick, 250, 0), new boundary(800, 2200, 500, 500, brick, 250, 0),
    new boundary(2500, 2500, 2500, 3000, brick, 250, 0), new boundary(2500, 3000, 3000, 3250, brick, 250, 0), new boundary(3000, 3250, 2500, 3500, brick, 250, 0), new boundary(2500, 3500, 2000, 3400, brick, 250, 0),
    new boundary(2000, 3400, 800, 2200, brick, 250, 0), new boundary(1500, 1250, 1800, 1400, brick, 250, 0), new boundary(1800, 1400, 2000, 1125, brick, 250, 0), new boundary(3000, 2000, 2800, 1500, brick, 250, 0),
    new boundary(2800, 1500, 3500, 1900, brick, 250, 0), new boundary(3500, 1900, 3100, 2050, brick, 250, 0), new boundary(3100, 2050, 3400, 2500, brick, 250, 0), new boundary(3400, 2500, 4000, 2500, brick, 250, 0),
    new boundary(4000, 2500, 4300, 2100, brick, 250, 0), new boundary(4300, 2100, 3900, 1600, brick, 250, 0), new boundary(3900, 1600, 3650, 1600, brick, 250, 0), new boundary(3650, 1600, 3700, 1000, brick, 250, 0),
    new boundary(3700, 1000, 3000, 1200, brick, 250, 0)
  ],[
    new floor(1000, 1000, 300, 0, 500, 0, brick, {}),
    new floor(700, 2000, 1150, 0, 1000, 0, brick, {}),
    // new floor(509.9019513592785, 500, 1450 + 250*sin(78.69006752597979), 50, 1650 + (509.9019513592785/2)*cos(78.69006752597979), 78.69006752597979, brick, {}),
    // new floor(200, 200, 1600, 100, 1550, 0, brick, {}),
    // new floor(1000, 1000, 300, 250, 500, 0, brick, {})
  ],[
    new entity(1000, 0, -100, impSpritesheet, 50, 175, 'loadZone', 
    [0, 1200, 0, 1500]
      ),
    new entity(500, 0, 1000, impSpritesheet, 50, 175, 'dialogue',
    [
      [['never seen'], ['beginning dialogue']],
      [['player response 1', 'player response 2'], ['npc reaction 1', 'npc reaction 2']],
      [['player response'], ['npc text line']],
      [['player final line'], ['never seen']]
    ]
      )
  ],[
  ],[
    new pathNode(1000, 1000, [1, 2, 3], 'a'), new pathNode(2000, 800, [0], 'b'), 
    new pathNode(1000, 2000, [0, 3, 4], 'c'), new pathNode(2000, 2000, [0, 2, 4, 5], 'd'), 
    new pathNode(2500, 1250, [3, 2, 8, 5], 'e'), new pathNode(2250, 2700, [3, 6, 7, 4], 'f'), new pathNode(1400, 2600, [5, 7], 'g'),
    new pathNode(2300, 3200, [5, 6], 'h'), new pathNode(3300, 1400, [4, 9], 'i'), new pathNode(3900, 2200, [8], 'j')
  ])
  world = [testCell, testCell2]
  currentCell = testCell
  currentCellNo = 0
  player = new pc(1200, 0, 1500, 175, 0, 0, 8, currentCell.floors[0], 100, defSword)
  cam.centerX += player.x
  cam.eyeX += player.x
  cam.centerY -= 175
  cam.eyeY -= 17
  cam.centerZ += player.z
  cam.eyeZ += player.z
  uiCam.ortho()
  textFont(font)
  noStroke()
  saveGame()
  //frameRate(30)
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
      for (let i of currentCell.objects){
        i.render()
      }
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
      if (mouseIsPressed && player.attacking == false){
        player.attacking = true
      }
      if (player.attacking == true){
        player.attackFrame += 1
        if (player.attackFrame == player.weapon.dF){
          interactCheckVariable = player.attackCheck()
          if (interactCheckVariable != false){
            interactCheckVariable.hp -= player.weapon.damage
          }
        }
        if (player.attackFrame > player.weapon.aF){
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
        if (jumpHeight >= 500){
          jumping = false
        }
      }
      else if (player.y > player.currentFloor.y){
        player.y -= 3 * (30/frameRate())
        cam.centerY += 3 * (30/frameRate())
        cam.eyeY += 3 * (30/frameRate())
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
        if (player.y > player.currentFloor.y){
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
      break
    case 'pause':
      for (let i of currentCell.walls){
        i.render()
      }
      for (let i of currentCell.floors){
        i.render()
      }
      for (let i of currentCell.objects){
        i.render()
      }
      pauseUI()
      break
    case 'dialogue':
      for (let i of currentCell.walls){
        i.render()
      }
      for (let i of currentCell.floors){
        i.render()
      }
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
      for (let i of currentCell.objects){
        i.render()
      }
      inventoryUI()
    }
}

function ui(){
  push() // auto reverses changes
    strokeWeight(0.1)
    stroke(255)
    setCamera(uiCam) // switches cam
    uiCam.setPosition(0, 0, 0)
    fill(255, 0, 0)
    image(player.weapon.spriteSheet,
      -512, -288,
      1024, 576,
      320 * player.attackFrame, 0,
      320, 180
      )
    rect(0, 250, player.hp, 30)
    fill(0)
    strokeWeight(1)
    line(-10, -10, 10, 10)
    line(10, -10, -10, 10)
    if (player.interactCheck()[0]){
      textSize(50)
      fill(red)
      text('(e) interact', 0, 0)
    }
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
      if (mouseIsPressed && !mouseWasPressed){
        i.executeFunc()
      }
    }
    if (talkDepth == entity.useData.length - 1){
      gameState = 'game'
      requestPointerLock()
    }
  pop()
  mouseWasPressed = mouseIsPressed
}

function deathUI(){
  push()
    setCamera(uiCam)
    uiCam.setPosition(0, 0, 50)
    fill(255)
    textSize(20)
    text('you died, select an option below', 0, 0)
    loadButton.render()
    if (mouseIsPressed){
      loadButton.executeFunc()
    }
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
    weaponsButtons.push(new menuButton(-400, -180 + (20 * i), 800/3, 20, 'beginGame', player.inventory.weapons[i], 64, 64))
  }
  push()
    setCamera(uiCam)
    uiCam.setPosition(0, 0, 50)
    image(player.weapon.spriteSheet,
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
    }
    exitButton.render()
      if (mouseIsPressed){
        exitButton.executeFunc()
      }
  pop()
}