let red = [200, 10, 10]
let green = [10, 200, 10]
let grey = [150, 150, 150]
let purple = [150, 10, 200]
let dGrey = [30, 30, 30]
let brown = [100, 50, 0]

//extend map: this is the real main priority

function universalSwitch(event, { data = null }) {
  switch (event) {
    case 'beginGame':
      beginGame()
      currentCell.bgMusic.play()
      break
    case 'settings':
      prevState = gameState
      gameState = 'settings'
      exitPointerLock()
      currentCell.bgMusic.pause()
      break
    case 'return':
      gameState = prevState
      if (gameState == 'game') {
        requestPointerLock()
        currentCell.bgMusic.play()
      }
      break
    case 'advanceTalk0':
      universalSwitch(data[0].useData[talkDepth + 1][2][0], { data: data[1] })
      talkDepth += 1
      talkOption = 0
      break
    case 'advanceTalk1':
      universalSwitch(data[0].useData[talkDepth + 1][2][1], { data: data[1] })
      talkDepth += 1
      talkOption = 1
      break
    case 'advanceTalk2':
      universalSwitch(data[0].useData[talkDepth + 1][2][2], { data: data[1] })
      talkDepth += 1
      talkOption = 2
      break
    case 'advanceTalk3':
      universalSwitch(data[0].useData[talkDepth + 1][2][3], { data: data[1] })
      talkDepth += 1
      talkOption = 3
      break
    case 'load':
      loadGame()
      gameState = 'game'
      requestPointerLock()
      break
    case 'eqp1':
      if (player.hotbar[0] != punch) {
        player.inventory.weapons.push(player.hotbar[0])
      }
      player.hotbar[0] = data
      player.inventory.weapons.splice(player.inventory.weapons.indexOf(data), 1)
      hotbarSelect = false
      break
    case 'eqp2':
      if (player.hotbar[1] != punch) {
        player.inventory.weapons.push(player.hotbar[1])
      }
      player.hotbar[1] = data
      player.inventory.weapons.splice(player.inventory.weapons.indexOf(data), 1)
      hotbarSelect = false
      break
    case 'eqp3':
      if (player.hotbar[2] != punch) {
        player.inventory.weapons.push(player.hotbar[2])
      }
      player.hotbar[2] = data
      player.inventory.weapons.splice(player.inventory.weapons.indexOf(data), 1)
      hotbarSelect = false
      break
    case 'eqp4':
      if (player.hotbar[3] != punch) {
        player.inventory.weapons.push(player.hotbar[3])
      }
      player.hotbar[3] = data
      player.inventory.weapons.splice(player.inventory.weapons.indexOf(data), 1)
      hotbarSelect = false
      break
    case 'unequip':
      if (data[0] != punch) {
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
      if (gameState == 'inventory') {
        if (droppedInv.weapons.length >= 1 || droppedInv.apparels.length >= 1 || droppedInv.usables.length >= 1) {
          currentCell.objects.push(new entity(player.x, player.currentFloor.y, player.z, droppedSpritesheet, 8, 8, 'loot', 'delOnEmpty', 0, droppedInv, { canCollide: false }))
          currentCell.objects[currentCell.objects.length - 1].ogIndex = currentCell.objects.length - 1
        }
        droppedInv = new inventory([], [], [])
      }
      gameState = 'game'
      requestPointerLock()
      break
    case 'heal':
      player.hp += data
      if (player.hp > player.maxHp) {
        player.hp = player.maxHp
      }
      break
    case 'scrollUp':
      if (invOffset >= 1) {
        invOffset -= 1
      }
      break
    case 'scrollDown':
      if (invOffset < Math.floor((player.inventory.weapons.length - 1) / 5) || invOffset < Math.floor(player.inventory.apparels.length / 5) || invOffset < Math.floor(player.inventory.usables.length / 5)) {
        invOffset += 1
      }
      break
    case 'scrollDownLore':
      if (invOffset < Math.floor((loreShown.length - 1) / 2)) {
        invOffset += 1
      }
      break
    case 'loreTrigger':
      gameState = 'lore'
      loreShown = data
      invOffset = 0
      break
    case 'strUp':
      player.statBlock.str += 1
      gameState = 'game'
      requestPointerLock()
      break
    case 'dexUp':
      player.statBlock.dex += 1
      gameState = 'game'
      requestPointerLock()
      break
    case 'endUp':
      player.statBlock.end += 1
      gameState = 'game'
      requestPointerLock()
      break
    case 'intUp':
      player.statBlock.int += 1
      gameState = 'game'
      requestPointerLock()
      break
    case 'lckUp':
      player.statBlock.lck += 1
      gameState = 'game'
      requestPointerLock()
      break
    case 'vitUp':
      player.statBlock.vit += 1
      gameState = 'game'
      player.maxHp = 100 + Math.floor(Math.pow(Math.log(Math.pow(player.statBlock.vit, 10)), 1.25))
      requestPointerLock()
      break
    case 'triggerCombat':
      for (let i of data) {
        if (currentCell.AIs[i].mode != 'd') {
          currentCell.AIs[i].mode = 'h'
        }
      }
      break
    case 'musicDn':
      if (musicGain > 0) {
        musicGain -= 0.1
        musicGain = Math.floor(musicGain * 10) / 10
        for (let i of allMusic) {
          i.setVolume(musicGain)
        }
      }
      break
    case 'musicUp':
      if (musicGain < 1) {
        musicGain += 0.1
        musicGain = Math.floor(musicGain * 10) / 10
        for (let i of allMusic) {
          i.setVolume(musicGain)
        }
      }
      break
    case 'sfxDn':
      if (sfxGain > 0) {
        sfxGain -= 0.1
        sfxGain = Math.floor(sfxGain * 10) / 10
        for (let i of allSfx) {
          i.setVolume(sfxGain)
        }
      }
      break
    case 'sfxUp':
      if (sfxGain < 1) {
        sfxGain += 0.1
        sfxGain = Math.floor(sfxGain * 10) / 10
        for (let i of allSfx) {
          i.setVolume(sfxGain)
        }
      }
      break
    case 'boss1end':
      cell1.walls[95].height = 0
      cell1.walls[95].midY = 0
      cell1.walls[100].height = 50
      cell1.walls[100].midY = 525
      world[1].AIs[0].mode = 'h'
      break
    case 'talkSkip':
      talkDepth += data
      break
    case 'snstvtUp':
      if (ctrlListens.snstvt < 10){
        ctrlListens.snstvt += 1
      }
      break
    case 'snstvtDn':
      if (ctrlListens.snstvt > 0){
        ctrlListens.snstvt -= 1
      }
      break
  }
}

class menuButton {
  constructor(x, y, w, h, func, spriteSheet, sW, sH) {
    this.collX = x
    this.collY = y
    this.collW = x + w
    this.collH = y + h
    this.h = h
    this.w = w
    this.transX = x + (w / 2)
    this.transY = y + (h / 2)
    this.func = func
    this.spriteSheet = spriteSheet
    this.sW = sW
    this.sH = sH
  }

  checkHovered() {
    let mousePosX = mouseX - 512
    let mousePosY = mouseY - 288
    if (mousePosX >= this.collX && mousePosX <= this.collW && mousePosY >= this.collY && mousePosY <= this.collH) {
      //checks if the mouse is over the button
      return 1
    }
    return 0
  }

  render() {
    push() //draws the buttons sprite, changes state by being hovered
    image(this.spriteSheet,
      this.collX, this.collY,
      this.w, this.h,
      this.checkHovered() * this.sW, 0,
      this.sW, this.sH
    )
    pop()
  }

  executeFunc({ data = null }) { //executes a buttons function (will be merged into universal action switch)
    if (this.checkHovered() && !mouseWasPressed && mouseIsPressed) {
      universalSwitch(this.func, { data: data })
    }
  }
}

class pc {
  constructor(x, y, z, height, angleLR, angleUD, speed, currentFloor, hp, weapon, armour, { xp = 0, level = 0 }) {
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
    this.statBlock = new statBlock(2, 2, 2, 2, 2, 2)
  }

  floorCheck() {
    for (let i of currentCell.floors) { // check every floor tile
      if (this.y >= i.y - i.catchZone) {
        let relX = this.x - i.x
        let relZ = this.z - i.z
        let rottedX = (relX * cos(i.rotation)) + (relZ * sin(i.rotation))
        // player coords rotated to align with the tested floor tile
        let rottedZ = -(relX * sin(i.rotation)) + (relZ * cos(i.rotation))
        if (collideRectCircle(i.unrotX1, i.unrotZ1, i.width1, i.width2, rottedX, rottedZ, 150)) {
          // checking if player is on the tile
          this.currentFloor = i // sets the floor the player stands on
        }
      }
    }
  }

  ceilingCheck() {
    for (let i of currentCell.floors) { // check every floor tile
      if (i.y <= this.eyeLevel + 75 && i.y > player.eyeLevel) {
        let relX = this.x - i.x
        let relZ = this.z - i.z
        let rottedX = (relX * cos(i.rotation)) + (relZ * sin(i.rotation))
        // player coords rotated to align with the tested floor tile
        let rottedZ = -(relX * sin(i.rotation)) + (relZ * cos(i.rotation))
        if (collideRectCircle(i.unrotX1, i.unrotZ1, i.width1, i.width2, rottedX, rottedZ, 150)) {
          // checking if player is on the tile
          jumping = false// sets the floor the player stands on
        }
      }
    }
  }

  moveCheck(dir) {
    let x3 = this.x
    let z3 = this.z
    let x4
    let z4
    let den
    let t
    let u
    //projects player forward, changes direction depending on where the player is trying to go
    if (dir == 'fw') {
      x4 = this.x + sin(this.angleLR) * this.speed
      z4 = this.z - cos(this.angleLR) * this.speed
    }
    else if (dir == 'bw') {
      x4 = this.x - sin(this.angleLR) * this.speed
      z4 = this.z + cos(this.angleLR) * this.speed
    }
    else if (dir == 'lw') {
      x4 = this.x - cos(this.angleLR) * this.speed
      z4 = this.z - sin(this.angleLR) * this.speed
    }
    else {
      x4 = this.x + cos(this.angleLR) * this.speed
      z4 = this.z + sin(this.angleLR) * this.speed
    }

    for (let i of currentCell.walls) {
      //checks if the players projected path collides with any walls
      if (i.base <= this.eyeLevel && i.base + i.height >= this.y + 51) {
        let x1 = i.x1
        let x2 = i.x2
        let z1 = i.z1
        let z2 = i.z2
        let dz = i.z2 - i.z1
        dz *= 75 / i.width
        let dx = i.x2 - i.x1
        dx *= 75 / i.width
        x3 = x4 + dz
        z3 = z4 - dx
        if (dist(x4, z4, i.x1, i.z1) <= 75 || dist(x4, z4, i.x2, i.z2) <= 75) {
          //checks if the players projected position would touch a walls end point
          //necessary as other checks don't account for this
          return false
        }
        if (intersectCheck([x1, z1], [x2, z2], [x3, z3], [x4, z4])) {
          //checks if player would otherwise be within a wall
          return false
        }
        x3 = x4 - dz
        z3 = z4 + dx
        if (intersectCheck([x1, z1], [x2, z2], [x3, z3], [x4, z4])) {
          //also checks if player would be in a wall
          return false
        }
        x3 = this.x
        z3 = this.z
        if (intersectCheck([x1, z1], [x2, z2], [x3, z3], [x4, z4])) {
          //also checks if player would pass through a wall while moving
          return false
        }
      }
    }
    for (let i of currentCell.objects) {
      //checks if the player would be colliding with an entity
      if (dist(x4, z4, i.x, i.z) <= 75 && i.y + i.height > this.y && i.y < this.y + this.height && i.collisive == true) {
        return false
      }
    }
    return true //if none of the invalid scenarios are found, return true
  }

  controls() {
    if (keyIsDown(88)) {//debug log player position
      console.log(player.x, player.y, player.z)
    }
    if (keyIsDown(ctrlListens.fwKey) && !this.attacking) {//w
      if (this.moveCheck('fw')) {
        this.x += this.speed * sin(this.angleLR)
        this.z -= this.speed * cos(this.angleLR)
        if (!this.currentFloor.sound.isPlaying() && this.y == this.currentFloor.y) {
          this.currentFloor.sound.play()
        }
      }
    }
    if (keyIsDown(ctrlListens.bwKey) && !this.attacking) {//s
      if (this.moveCheck('bw')) {
        this.x -= this.speed * sin(this.angleLR)
        this.z += this.speed * cos(this.angleLR)
        if (!this.currentFloor.sound.isPlaying() && this.y == this.currentFloor.y) {
          this.currentFloor.sound.play()
        }
      }
    }
    if (keyIsDown(ctrlListens.lwKey) && !this.attacking) {//a
      if (this.moveCheck('lw')) {
        this.x -= this.speed * cos(this.angleLR)
        this.z -= this.speed * sin(this.angleLR)
        if (!this.currentFloor.sound.isPlaying() && this.y == this.currentFloor.y) {
          this.currentFloor.sound.play()
        }
      }
    }
    if (keyIsDown(ctrlListens.rwKey) && !this.attacking) {//d
      if (this.moveCheck('rw')) {
        this.x += this.speed * cos(this.angleLR)
        this.z += this.speed * sin(this.angleLR)
        if (!this.currentFloor.sound.isPlaying() && this.y == this.currentFloor.y) {
          this.currentFloor.sound.play()
        }
      }
    }
    if (keyIsDown(37)) {//left
      this.angleLR -= 3 * (30 / frameRate())
    }
    if (keyIsDown(38)) {//up
      if (this.angleUD < 75) {
        this.angleUD += 1 * (30 / frameRate())
      }
    }
    if (keyIsDown(39)) {//right key
      this.angleLR += 3 * (30 / frameRate())// rotate right
    }
    if (keyIsDown(40)) {//down key
      if (this.angleUD > -45) { // limit angle
        this.angleUD -= 1 * (30 / frameRate())
      }
    }
    if (keyIsDown(49)) {//numbers for hotbar
      this.weapon = 0
    }
    if (keyIsDown(50)) {
      this.weapon = 1
    }
    if (keyIsDown(51)) {
      this.weapon = 2
    }
    if (keyIsDown(52)) {
      this.weapon = 3
    }
    this.angleLR += movedX * (30 / frameRate()) * (0.1 + (ctrlListens.snstvt/10)) * (1 - (2 * invertX))
    if (this.angleLR > 360) {
      this.angleLR -= 360
    }
    else if (this.angleLR < 0) {
      this.angleLR += 360
    }
    if (this.angleUD <= 75 && this.angleUD >= -89) {
      this.angleUD -= movedY * (30 / frameRate()) * (0.1 + (ctrlListens.snstvt/10)) * (1 - (2 * invertY))
      if (this.angleUD > 75) {
        this.angleUD = 75
      }
      else if (this.angleUD < -89) {
        this.angleUD = -89
      }
    }
    if (keyIsDown(27)) {//escape key
      gameState = 'pause'
      currentCell.bgMusic.pause()
      battleMusic1.pause()
    }
    cam.eyeX = player.x
    cam.eyeZ = player.z + 500
    this.eyeLevel = this.y + this.height
    cam.eyeY = -this.eyeLevel
    // adjust view around player by trig values
    cam.centerX = cam.eyeX + sin(this.angleLR)
    cam.centerY = cam.eyeY - tan(this.angleUD)
    cam.centerZ = cam.eyeZ - cos(this.angleLR)
    if (keyIsDown(ctrlListens.jumpKey) && jumpHeight == 0 && this.y == this.currentFloor.y) {//space
      jumping = true
    }
    this.floorCheck()
    if (jumping == false) {
      if (this.y < this.currentFloor.y) {
        if (this.currentFloor.y - this.y < 12.5) {
          this.y = this.currentFloor.y
        }
        else {
          this.y += (this.currentFloor.y - this.y) / 2
        }
        this.eyeLevel = this.y + this.height
      }
    }
    if (this.y == this.currentFloor.y) {
      jumpHeight = 0
    }
    if (keyIsDown(ctrlListens.invKey) && this.attackFrame == 0) { //i for inventory
      exitPointerLock()
      hotbarSelect = false
      gameState = 'inventory'
      droppedInv = new inventory([], [], [])
      invOffset = 0
    }
    if (keyIsDown(ctrlListens.statKey)) {
      exitPointerLock()
      gameState = 'statView'
    }
  }

  interactCheck() {
    for (let i of currentCell.objects) { //check every entity
      if (i.interactible != false && player.y <= i.y + i.height && player.y + player.height >= i.y) {
        let x1 = this.x
        let z1 = this.z
        let x2 = this.x + 200 * sin(this.angleLR)
        let z2 = this.z - 200 * cos(this.angleLR)
        let x3 = i.x - (i.collWidth / 2) * cos(this.angleLR)
        let z3 = i.z - (i.collWidth / 2) * sin(this.angleLR)
        let x4 = i.x + (i.collWidth / 2) * cos(this.angleLR)
        let z4 = i.z + (i.collWidth / 2) * sin(this.angleLR)
        let den = (x1 - x2) * (z3 - z4) - (z1 - z2) * (x3 - x4)
        let t = ((x1 - x3) * (z3 - z4) - (z1 - z3) * (x3 - x4)) / den
        let u = ((x1 - x3) * (z1 - z2) - (z1 - z3) * (x1 - x2)) / den
        if (0 <= t && t <= 1 && 0 <= u && u <= 1) { //if player looking at entity
          x1 = this.x
          z1 = this.z
          x2 = i.x
          z2 = i.z
          for (let j of currentCell.walls) { //check if no walls in the way
            if (j.y < i.y && j.y < this.y && j.y + j.height > i.y + i.height && j.y + j.height > this.eyeLevel) {
              x3 = j.x1
              x4 = j.x2
              z3 = j.z1
              z4 = j.z2
              den = (x1 - x2) * (z3 - z4) - (z1 - z2) * (x3 - x4)
              t = ((x1 - x3) * (z3 - z4) - (z1 - z3) * (x3 - x4)) / den
              u = ((x1 - x3) * (z1 - z2) - (z1 - z3) * (x1 - x2)) / den
              if (0 <= t && t <= 1 && 0 <= u && u <= 1) {
                return [false, false] //tell program which entity was interacted with
              }
            }
          }
          return [true, i]
        }
      }
    }
    return [false, false] //if no valid interaction found
  }

  attackCheck() {
    let x1 = this.x
    let z1 = this.z
    let x2 = this.x + 200 * sin(this.angleLR)
    let z2 = this.z - 200 * cos(this.angleLR)

    for (let i of currentCell.AIs) {
      if (i.y < this.eyeLevel && i.y + currentCell.objects[i.linkedNtt].height > this.y) {
        let x3 = i.x - (currentCell.objects[i.linkedNtt].collWidth / 2) * cos(this.angleLR)
        let z3 = i.z - (currentCell.objects[i.linkedNtt].collWidth / 2) * sin(this.angleLR)
        let x4 = i.x + (currentCell.objects[i.linkedNtt].collWidth / 2) * cos(this.angleLR)
        let z4 = i.z + (currentCell.objects[i.linkedNtt].collWidth / 2) * sin(this.angleLR)
        let den = (x1 - x2) * (z3 - z4) - (z1 - z2) * (x3 - x4)
        let t = ((x1 - x3) * (z3 - z4) - (z1 - z3) * (x3 - x4)) / den
        let u = ((x1 - x3) * (z1 - z2) - (z1 - z3) * (x1 - x2)) / den
        if (0 <= t && t <= 1 && 0 <= u && u <= 1) {
          atkHit.play()
          return i
        }
      }
    }
    return false
  }

  damageCalc({ incLuck = true }) { //Never let player have stats below 2!
    let x = this.statBlock[this.hotbar[this.weapon].scaleStat] //finds which skill is used for weapon
    let a = this.hotbar[this.weapon].scaleAbility
    let mod = pow(x, 2)
    mod /= (x - 0.5)
    mod = Math.pow(mod, 2)
    mod = Math.log(mod)
    mod = Math.pow(mod, x)
    mod = Math.log(mod)
    mod = Math.pow(mod, 1.1)
    let d = Math.log(a + 1)
    d /= a
    mod /= d
    mod = Math.log(mod)
    mod += x / (6 - a)
    mod /= (6 - a)
    let damage = this.hotbar[this.weapon].damage * mod
    if (random(0, 10 / player.statBlock.lck) > player.statBlock.lck / (player.statBlock.lck + 1) && incLuck == true) {
      damage += random(0, player.statBlock.lck)
    }
    return damage //returns damage
  }
}

class boundary {
  constructor(x1, z1, x2, z2, texture, height, base) {
    this.midX = ((x1 + x2) / 2)
    this.midZ = ((z1 + z2) / 2)
    this.midY = -(base + (height / 2))
    this.angle = -atan((z2 - z1) / (x2 - x1))
    this.width = Math.pow(((x2 - x1) * (x2 - x1)) + ((z2 - z1) * (z2 - z1)), 0.5)
    this.height = height
    this.texture = texture
    this.x1 = x1
    this.z1 = z1
    this.x2 = x2
    this.z2 = z2
    this.base = base
  }

  render() {
    if (collideLineCircle(this.x1, this.z1, this.x2, this.z2, player.x, player.z, 7500)) { //will only try rendering walls the player can see
      push()
      texture(this.texture)
      translate(this.midX, this.midY, this.midZ + 500)
      rotateY(this.angle)
      plane(this.width, this.height)
      pop()
    }
  }
}

class triggerWall {
  constructor(x1, z1, x2, z2, height, base, event, data) {
    this.x1 = x1
    this.z1 = z1
    this.x2 = x2
    this.z2 = z2
    this.height = height
    this.base = base
    this.event = event
    this.data = data
    this.active = true
  }

  collideCheck() {
    if (
      collideLineCircle(this.x1, this.z1, this.x2, this.z2, player.x, player.z, 150) && // if player is in the trigger area
      player.y < this.base + this.height && player.eyeLevel > this.base &&
      this.active) { // and it's activated
      universalSwitch(this.event, { data: this.data }) // trigger its event
      this.active = false //and disable it
    }
  }
}

class floor {
  constructor(width1, width2, x, y, z, rotation, texture, { catchZone = 50, sound = footstepsGravel }) {
    this.width1 = width1
    this.width2 = width2
    this.x = x
    this.y = y
    this.z = z
    this.rotation = rotation
    this.texture = texture
    this.unrotX1 = -width1 / 2
    this.unrotX2 = width1 / 2
    this.unrotZ1 = -width2 / 2
    this.unrotZ2 = width2 / 2
    this.catchZone = catchZone
    this.sound = sound
  }

  render() {
    let relX = player.x - this.x
    let relZ = player.z - this.z
    let rottedX = (relX * cos(this.rotation)) + (relZ * sin(this.rotation))
    // player coords rotated to align with the tested floor tile
    let rottedZ = -(relX * sin(this.rotation)) + (relZ * cos(this.rotation))
    if (collideRectCircle(this.unrotX1, this.unrotZ1, this.width1, this.width2, rottedX, rottedZ, 7500)) {
      push()
      texture(this.texture)
      translate(this.x, -this.y, this.z + 500)
      rotateX(90)
      rotateZ(this.rotation)
      plane(this.width1, this.width2)
      pop()
    }
  }
}

class pathNode {
  constructor(x, z, connectedNodes, id) {
    this.x = x
    this.z = z
    this.connectedNodes = connectedNodes
    this.id = id
  }
}

class entity {
  constructor(x, y, z, spriteSheet, collWidth, height, interactible, useData, ogIndex, inventory, { canCollide = true }) {
    this.x = x
    this.y = y
    this.z = z
    this.spriteSheet = spriteSheet.image
    this.sWidth = spriteSheet.sWidth
    this.sHeight = spriteSheet.sHeight
    this.collWidth = collWidth
    this.height = height
    this.midVert = - (y + (height / 2))
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
          -this.collWidth / 2, -this.height / 2,
          this.collWidth, this.height,
          Math.floor(this.frame) * this.sWidth, this.sHeight * (spriteAngle + 1),
          this.sWidth, this.sHeight
        )
        if (gameState == 'game') {
          this.frame += 0.2
          if (this.frame >= 4) {
            this.frame = 0
          }
        }
        break
      case 'a':
        image(this.spriteSheet,
          -this.collWidth / 2, -this.height / 2,
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
    if (this.animation != 'd' && this.animation != 'i') {
      fill(red)
      rect(0, (-this.height / 2) - 5, this.collWidth * (this.hp / this.maxHp), 5)
    }
    pop()
  }
}

class spritesheet {
  constructor(image, sWidth, sHeight) {
    this.image = image
    this.sWidth = sWidth
    this.sHeight = sHeight
  }
}

class ai {
  constructor(x, y, z, angle, speed, hp, linkedNtt, mode, weapon, xp, { musicOverride = false, onDeath = 'none' }) {
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
    this.music = musicOverride
    this.onDeath = onDeath
  }

  chooseGoal({ playerQ = true }) {
    let foundGoal = false
    let mightPlayer = playerQ
    while (foundGoal == false) {
      let nodes = []
      this.goal = [random(-50000, 50000), random(-50000, 50000)]
      if (mightPlayer) {
        this.goal = [player.x, player.z]
      }
      // sets goal at player coords
      for (let i of currentCell.grid) {
        nodes.push([i, dist(i.x, i.z, this.goal[0], this.goal[1])])
      }
      nodes.sort(sortFunction)
      // put nodes into a list sorted by distance from goal
      while (nodes.length >= 1) {
        for (let i of currentCell.walls) {
          if (intersectCheck(
            [nodes[0][0].x, nodes[0][0].z], this.goal, [i.x1, i.z1], [i.x2, i.z2]) && i.base <= this.y + currentCell.objects[this.linkedNtt].height && i.base + i.height > this.y + 50) {
            // start from first sorted node, check if there's a wall between it and goal
            nodes.shift() // remove from list if there are
            break
          }
          else if (i == currentCell.walls[currentCell.walls.length - 1]) {
            // if no walls, this is closest valid node to goal
            return nodes[0][0]
          }
        }
      }
      mightPlayer = false
    }
  }

  findFirstNode() {
    // does the same as the validating part of chooseGoal()
    // but compares to AI's own coords, not goal
    let nodes = []
    for (let i of currentCell.grid) {
      nodes.push([i, dist(this.x, this.z, i.x, i.z)])
    }
    let k = nodes[0]
    nodes.sort(sortFunction)
    for (let i of nodes) {
      for (let j of currentCell.walls) {
        if (intersectCheck(
          [this.x, this.z], [i[0].x, i[0].z], [j.x1, j.z1], [j.x2, j.z2]) && j.base <= this.y + currentCell.objects[this.linkedNtt].height && j.base + j.height > this.y + 50) {
          break
        }
        else if (j == currentCell.walls[currentCell.walls.length - 1]) {
          return i[0]
        }
      }
    }
    return nodes[0][0] //fallback pathing (can cause AI to ignore physics)
  }

  findPath(dest) {
    let paths = [[[this.path[0]]]]
    let pathFound = 0
    let whichNode = dest.id
    let destination = dest
    let onDupe = false
    while (pathFound == 0) {
      for (let j of paths[paths.length - 1]) {
        // if the destination is found, finish searching
        if (j[0].id == destination.id) {
          pathFound = 1
          break
        }
      }
      if (paths.length >= 10) {
        pathFound = 1
      }
      if (paths[paths.length - 1].length == 0) {
        pathFound = 1
        whichNode = paths[paths.length - 2][0][0].id
        this.goal = [paths[paths.length - 2][0][0].x, paths[paths.length - 2][0][0].z]
        paths.pop()
      }
      if (pathFound == 0) {
        // if not found, create new depth level
        paths.push([])
        for (let i of paths[paths.length - 2]) {
          for (let j of i[0].connectedNodes) {
            onDupe = false
            for (let k of paths) {
              if (k != paths[paths.length - 1]) {
                for (let l of k) {
                  //i, j, k, l check every node added last time
                  //and see every node connected to them
                  //and checks if it is already on the tree
                  if (l[0].id == currentCell.grid[j].id) { //l is a node in the tree, j is a node to be checked
                    onDupe = true //if the node to be checked matches one in the tree
                    break
                  }
                }
              }
            }
            if (onDupe == false) { // if a node isn't in tree
              // add it, and the node which was used to find it
              paths[paths.length - 1].push([currentCell.grid[j], i[0].id])
              break
            }
          }
        }
      }
    }
    // once destination found
    this.path = [] // clears path for formatting
    for (let i = paths.length - 1; i >= 0; i -= 1) {
      // checks backwards through path tree
      for (let j of paths[i]) {
        if (j[0].id == whichNode) {
          // find which node was used to get current one
          this.path.unshift([j[0].x, j[0].z]) // add coords to path
          whichNode = j[1]
          // update which node needs to be found next
          break
        }
      }
    }
  }

  followPath() {
    if (this.x == this.path[0][0] && this.z == this.path[0][1]) {
      this.path.shift()
    }
    let opp = this.x - this.path[0][0]
    let adj = this.path[0][1] - this.z
    let hyp = dist(this.x, this.z, this.path[0][0], this.path[0][1])
    let angle
    if (asin(opp / hyp) <= 0) {
      angle = 360 - acos(adj / hyp)
    }
    if (asin(opp / hyp) >= 0) {
      angle = acos(adj / hyp)
    } // calculate the angle between north and the position to move to
    this.angle = angle
    if (hyp > this.speed) {
      this.x -= sin(angle) * this.speed
      this.z += cos(angle) * this.speed
    } // move towards next position in path
    else {
      this.x -= sin(angle) * hyp
      this.z += cos(angle) * hyp
    } // move directly onto it if close enough
    let pathLength = this.path.length
    for (let i of currentCell.walls) {
      // checks for shortcut to player
      if (intersectCheck([this.x, this.z], [player.x, player.z], [i.x1, i.z1], [i.x2, i.z2])) { //if there's a wall between found
        if (i.base < this.y + currentCell.objects[this.linkedNtt].height && i.base + i.height > this.y + 50) {
          break
        }
      }
      else if (i == currentCell.walls[currentCell.walls.length - 1]) {
        this.path = [[player.x, player.z]]
        this.goal = [player.x, player.z]
      }
    }
    if (this.path.length == 1) { //if locked directly to target but obstructed
      for (let i of currentCell.walls) {
        if (intersectCheck([this.x, this.z], this.goal, [i.x1, i.z1], [i.x2, i.z2])) { //if there's a wall between found
          if (i.base < this.y + currentCell.objects[this.linkedNtt].height && i.base + i.height > this.y + 50) {
            this.path = [] //clear path and goal to allow recalculation
            this.goal = []
          }
        }
      }
    }
    for (let j = this.path.length - 1; j >= 0; j -= 1) {
      for (let i of currentCell.walls) {
        // checks for shortcut between nodes
        if (intersectCheck([this.x, this.z], this.path[j], [i.x1, i.z1], [i.x2, i.z2])) {
          if (i.base < this.y + currentCell.objects[this.linkedNtt].height && i.base + i.height > this.y + 50) {
            break
          }
        }
        else if (i == currentCell.walls[currentCell.walls.length - 1]) {
          // if no walls between AI and final goal, remove intermediate nodes
          for (let k = 0; k < j; k++) {
            this.path.shift()
          }
        }
      }
      if (this.path.length < pathLength) {
        break
      }
    }
    if (this.path.length >= 1 && Math.floor(this.x) == Math.floor(this.path[0][0]) && Math.floor(this.z) == Math.floor(this.path[0][1])) {
      // if first location on path has been reached, remove it
      this.path.shift()
      if (this.path.length == 0) {
        this.path = []
        this.goal = []
      }
    }
    this.floorCheck()
    currentCell.objects[this.linkedNtt].x = this.x
    currentCell.objects[this.linkedNtt].y = this.y
    currentCell.objects[this.linkedNtt].z = this.z
    currentCell.objects[this.linkedNtt].angle = this.angle
  }

  meleeCheck() {
    let hyp = dist(this.x, this.z, player.x, player.z)
    if (hyp <= meleeMax && hyp >= meleeMin && player.y < this.y + currentCell.objects[this.linkedNtt].height && player.eyeLevel > this.y) { // if in melee range
      for (let i of currentCell.walls) {
        // checks if there's a wall in the way
        if (intersectCheck([this.x, this.z], [player.x, player.z], [i.x1, i.z1], [i.x2, i.z2]) && i.base < this.y + currentCell.objects[this.linkedNtt].height && i.base + i.height > this.y + 50) {
          this.mode = 'h'
          return false
        }
        else if (i == currentCell.walls[currentCell.walls.length - 1]) {
          // if no walls between AI and player, enter melee
          this.path = []
          this.goal = []
          this.mode = 'm'
          currentCell.objects[this.  linkedNtt].frame = 0
          currentCell.objects[this.linkedNtt].animation = 'a'
          return true
        }
      }
    }
    else {
      this.mode = 'h'
      return false
    }
  }

  meleeCheckNVC() {
    let hyp = dist(this.x, this.z, player.x, player.z)
    if (hyp <= meleeMax && hyp >= meleeMin && player.y < this.y + currentCell.objects[this.linkedNtt].height && player.eyeLevel > this.y) { // if in melee range
      for (let i of currentCell.walls) {
        // checks if there's a wall in the way
        if (intersectCheck([this.x, this.z], [player.x, player.z], [i.x1, i.z1], [i.x2, i.z2]) && i.base < this.y + currentCell.objects[this.linkedNtt].height && i.base + i.height > this.y + 50) {
          return false
        }
        else if (i == currentCell.walls[currentCell.walls.length - 1]) {
          return true
        }
      }
    }
    else {
      return false
    }
  }

  fullPathfinding() {
    switch (this.mode) {
      case 'i':
        currentCell.objects[this.linkedNtt].animation = 'i'
        currentCell.objects[this.linkedNtt].x = this.x
        currentCell.objects[this.linkedNtt].y = this.y
        currentCell.objects[this.linkedNtt].z = this.z
        currentCell.objects[this.linkedNtt].angle = this.angle
        break
      case 'n':
        currentCell.objects[this.linkedNtt].animation = 'i'
        currentCell.objects[this.linkedNtt].x = this.x
        currentCell.objects[this.linkedNtt].y = this.y
        currentCell.objects[this.linkedNtt].z = this.z
        currentCell.objects[this.linkedNtt].angle = this.angle
        break
      case 'h': // hostile
        let finalNode
        if (this.goal.length == 0) { // if the AI has no goal
          finalNode = this.chooseGoal({})
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
        currentCell.objects[this.linkedNtt].frame = 0
        currentCell.objects[this.linkedNtt].animation = 'a'
        console.log(currentCell.objects[this.linkedNtt].frame)
        break;
      case 'a': // attacking
        currentCell.objects[this.linkedNtt].animation = 'a'
        this.attackFrame += 0.25 //move through attack animation
        if (this.attackFrame == this.weapon.dF && this.meleeCheckNVC()) { //when the enemys weapon is at the point of damage
          let opp = this.x - player.x
          let adj = player.z - this.z
          let hyp = dist(this.x, this.z, player.x, player.z)
          let angle
          if (asin(opp / hyp) <= 0) {
            angle = 360 - acos(adj / hyp)
          }
          if (asin(opp / hyp) >= 0) {
            angle = acos(adj / hyp)
          } //working out if the enemy is facing the player
          if (Math.floor(angle) == Math.floor(this.angle)) {
            player.hp -= this.weapon.damage / (1 + (player.armour.defense * (log(player.statBlock.end) + random(0, player.statBlock.lck))))//take health from player
          }
          this.mode = 'a'
        }
        if (this.attackFrame >= this.weapon.aF) {
          this.attackFrame = 0
          currentCell.objects[this.linkedNtt].frame = this.attackFrame
          this.meleeCheck() //reset attack once complete
        }
        currentCell.objects[this.linkedNtt].frame = this.attackFrame
        console.log(currentCell.objects[this.linkedNtt].frame)
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
        currentCell.objects[this.linkedNtt].collisive = false
        currentCell.objects[this.linkedNtt].interactible = 'loot'
        player.xp += this.xp
        universalSwitch(this.onDeath, {})
      }
      currentCell.objects[this.linkedNtt].hp = this.hp
      currentCell.objects[this.linkedNtt].maxHp = this.maxHp
    }
  }

  floorCheck() {
    let finalY = this.y
    for (let i of currentCell.floors) { // check every floor tile
      if (this.y >= i.y - i.catchZone) {
        let relX = this.x - i.x
        let relZ = this.z - i.z
        let rottedX = (relX * cos(i.rotation)) + (relZ * sin(i.rotation))
        // AI coords rotated to align with the tested floor tile
        let rottedZ = -(relX * sin(i.rotation)) + (relZ * cos(i.rotation))
        if (collideRectCircle(i.unrotX1, i.unrotZ1, i.width1, i.width2, rottedX, rottedZ, currentCell.objects[this.linkedNtt].collWidth / 2)) { // checking if AI is on the tile
          finalY = i.y // sets the floor the AI stands on
        }
      }
    }
    this.y = finalY
    this.midVert = -(this.y + (this.height / 2))
  }
}

class cell {
  constructor(walls, trigWalls, floors, objects, AIs, grid, dialogueBg, fogColour, bgMusic) {
    this.walls = walls
    this.floors = floors
    this.trigWalls = trigWalls
    this.objects = objects
    this.AIs = AIs
    this.grid = grid
    this.dialogueBg = dialogueBg
    this.fogColour = fogColour
    this.bgMusic = bgMusic
  }
}

class weapon {
  constructor(name, damage, spriteSheet, aF, dF, spriteSizes, icon, scaleStat, scaleAbility, { swingSound = atkGen }) {
    this.damage = damage
    this.spriteSheet = spriteSheet
    this.aF = aF
    this.dF = dF
    this.spriteSizes = spriteSizes
    this.name = name
    this.icon = icon
    this.scaleStat = scaleStat
    this.scaleAbility = scaleAbility
    this.swingSound = swingSound
  }
}

class apparel {
  constructor(name, defense, icon) {
    this.defense = defense
    this.name = name
    this.icon = icon
  }
}

class consumable {
  constructor(name, func, desc, icon, extraData, { delOnUse = true }) {
    this.name = name
    this.func = func
    this.desc = desc
    this.icon = icon
    this.extraData = extraData
    this.delOnUse = delOnUse
  }

  executeFunc({ data = null }) {
    universalSwitch(this.func, { data: data })
  }
}

class inventory {
  constructor(weapons, apparels, usables) {
    this.weapons = weapons
    this.apparels = apparels
    this.usables = usables
  }
}

class statBlock {
  constructor(str, dex, end, int, lck, vit) {
    this.str = str
    this.dex = dex
    this.end = end
    this.int = int
    this.lck = lck
    this.vit = vit
  }
}

class keyGroup {
  constructor(fwKey, bwKey, lwKey, rwKey, invKey, intKey, statKey, jumpKey, snstvt) {
    this.fwKey = fwKey
    this.bwKey = bwKey
    this.lwKey = lwKey
    this.rwKey = rwKey
    this.invKey = invKey
    this.intKey = intKey
    this.statKey = statKey
    this.jumpKey = jumpKey
    this.snstvt = snstvt
    this.nullRef = 0
  }
}

function beginGame() {
  gameState = 'game'
  requestPointerLock()
}

function sortFunction(a, b) {
  if (a[1] === b[1]) {
    return 0
  }
  else {
    return (a[1] < b[1]) ? -1 : 1
  }
}

function entitySort(a, b) {
  if (dist(a.x, a.z, player.x, player.z) === dist(b.x, b.z, player.x, player.z)) {
    return 0
  }
  else {
    return (dist(a.x, a.z, player.x, player.z) > dist(b.x, b.z, player.x, player.z)) ? -1 : 1
  }
}

function entityUnsort(a, b) {
  if (a.ogIndex === b.ogIndex) {
    return 0
  }
  else {
    return (a.ogIndex < b.ogIndex) ? -1 : 1
  }
}

function floorSort(a, b) {
  if (a.y == b.y) {
    return 0
  }
  else {
    return (a.y < b.y) ? -1 : 1
  }
}

function intersectCheck(l11, l12, l21, l22) {
  let x1 = l21[0]
  let x2 = l22[0]
  let z1 = l21[1]
  let z2 = l22[1]

  let x3 = l11[0]
  let x4 = l12[0]
  let z3 = l11[1]
  let z4 = l12[1]

  let den = (x1 - x2) * (z3 - z4) - (z1 - z2) * (x3 - x4)
  if (den == 0) { return false }
  let t = ((x1 - x3) * (z3 - z4) - (z1 - z3) * (x3 - x4)) / den
  let u = ((x1 - x3) * (z1 - z2) - (z1 - z3) * (x1 - x2)) / den
  if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
    return true
  }
  return false
}

function saveGame() {
  savedWorld = [
    new pc(player.x, player.y, player.z, player.height, player.angleLR, player.angleUD, player.speed, player.currentFloor, player.hp, player.weapon, player.armour, { xp: player.xp, level: player.level }),
    [], currentCellNo
  ]
  let inv
  let weapons = []
  let apparels = []
  let usables = []
  for (let i of player.inventory.weapons) {
    weapons.push(new weapon(i.name, i.damage, i.spriteSheet, i.aF, i.dF, i.spriteSizes, i.icon, i.scaleStat, i.scaleAbility, { swingSound: i.swingSound }))
  }
  weapons = Object.assign({}, weapons)
  weapons = Object.values(weapons)
  for (let i of player.inventory.apparels) {
    apparels.push(new apparel(i.name, i.defense, i.icon))
  }
  apparels = Object.assign({}, apparels)
  apparels = Object.values(apparels)
  for (let i of player.inventory.usables) {
    usables.push(new consumable(i.name, i.func, i.desc, i.icon, i.exrtaData))
  }
  usables = Object.assign({}, usables)
  usables = Object.values(usables)
  inv = new inventory(weapons, apparels, usables)
  savedWorld[0].inventory = inv
  savedWorld[0].hotbar = [player.hotbar[0], player.hotbar[1], player.hotbar[2], player.hotbar[3]]
  savedWorld[0].statBlock = new statBlock(player.statBlock.str, player.statBlock.dex, player.statBlock.end, player.statBlock.int, player.statBlock.lck, player.statBlock.vit)
  for (let i of world) {
    let walls = []
    let trigWalls = []
    let AIs = []
    let objects = []
    let floors = []
    let grid = []
    let dialogueBg = Object.assign({}, i.dialogueBg)
    let fogColour = Object.assign({}, i.fogColour)
    let bgMusic = i.bgMusic
    for (let j of i.walls) {
      walls.push(new boundary(j.x1, j.z1, j.x2, j.z2, j.texture, j.height, j.base))
    }
    walls = Object.assign({}, walls)
    walls = Object.values(walls)
    for (let j of i.trigWalls) {
      trigWalls.push(new triggerWall(j.x1, j.z1, j.x2, j.z2, j.height, j.base, j.event, j.data))
    }
    trigWalls = Object.assign({}, trigWalls)
    trigWalls = Object.values(trigWalls)
    for (let j of i.objects) {
      objects.push(new entity(j.x, j.y, j.z, new spritesheet(j.spriteSheet, j.sWidth, j.sHeight), j.collWidth, j.height, j.interactible, j.useData, j.ogIndex, new inventory(j.inventory.weapons, j.inventory.apparels, j.inventory.usables), { canCollide: j.collisive }))
    }
    objects = Object.assign({}, objects)
    objects = Object.values(objects)
    for (let j of i.AIs) {
      AIs.push(new ai(j.x, j.y, j.z, j.angle, j.speed, j.hp, j.linkedNtt, j.mode, j.weapon, j.xp, { musicOverride: j.music, onDeath: j.onDeath }))
    }
    AIs = Object.assign({}, AIs)
    AIs = Object.values(AIs)
    for (let j of AIs) {
      j.path = []
      j.goal = []
    }
    for (let j of i.floors) {
      floors.push(new floor(j.width1, j.width2, j.x, j.y, j.z, j.rotation, j.texture, { catchZone: j.catchZone }))
    }
    floors = Object.assign({}, floors)
    floors = Object.values(floors)
    for (let j of i.grid) {
      grid.push(new pathNode(j.x, j.z, j.connectedNodes, j.id))
    }
    grid = Object.assign({}, grid)
    grid = Object.values(grid)
    savedWorld[1].push(new cell(walls, trigWalls, floors, objects, AIs, grid, dialogueBg, fogColour, bgMusic))
  }
  savedWorld = Object.assign({}, savedWorld)
}

function loadGame() {
  player = savedWorld[0]
  world = savedWorld[1]
  currentCell = world[savedWorld[2]]
  currentCellNo = savedWorld[2]
  saveGame()
}

//general vars
let keysList = [
  '', '', '', '', '', '', '', '', 'backspace', 'tab', '', '', '', 'enter', '', '', 'shift', 'ctrl', 'alt', 'pause', 'caps lock', '', '', '',
  '', '', '', 'escape', '', '', '', '', 'space', 'page up', 'page down', 'end', 'home', 'left arrow', 'up arrow', 'right arrow', 'down arrow', '',
  '', '', '', 'insert', 'delete', '', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '', '', '', '', '', '', '', 'a', 'b', 'c', 'd', 'e',
  'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'left window key',
  'right window key', 'select key', '', '', 'numpad 0', 'numpad 1', 'numpad 2', 'numpad 3', 'numpad 4', 'numpad 5', 'numpad 6', 'numpad 7',
  'numpad 8', 'numpad 9', 'multiply', 'add', '', 'subtract', 'decimal point', 'divide', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9',
  'f10', 'f11', 'f12', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'num lock', 'scroll lock', '', '', '',
  '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
  '', '', 'semi-colon', 'equal sign', 'comma', 'dash', 'period', 'forward slash', 'grave accent', '', '', '', '', '', '', '', '', '', '', '',
  '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'open bracket', 'back slash', 'close braket', 'single quote'
]
let canvas
let cam;
let uiCam;
let player;
let jumping = false
let jumpHeight = 0
let font
let invertY = false
let invertX = false
let ctrlListens
let changeKey = 'nullRef'
//spritesheets and images
//entity spritesheets
let skeleLeathDagSprite
let skeleLeathDagSpritesheet
let skeleDagSprite
let skeleDagSpritesheet
let skeleSwordSprite
let skeleSwordSpritesheet
let droppedSprite
let droppedSpritesheet
let blankSprite
let blankSpritesheet
let potionSprite
let potionSpritesheet
let corpseSprite
let corpseSpritesheet
let zombieBossSprite
let zombieBossSpritesheet
let npcSprite
let npcSpritesheet
//walls and floors
let stone
let widestone
let largeStone
let gravelled
let wideGravel
let largeGravel
let bark
let trunk
let stoneWDoor
let woodPlanks
let planksWDoor
let darkPlanks
//weapons
let swordSprite
let fistSprite
let axeSprite
let daggerSprite
let spearSprite
//buttons
let crossImg
let beginButt
let settingsButt
let loadButt
let upButton
let downButton
//inventory icons
let swordIcon
let swordIcon2
let punchIcon
let teeIcon
let potionIcon
let bookIcon
let daggerIcon
let spearIcon
//fixed use images
let menuBg
let settingsBg
//audio
let footstepsGravel
let footstepsWood
let atkGen
let atkSword
let atkDag
let atkHit
let defaultMusic
let battleMusic1
let bossMusic1
//more general?
let gameState = 'menu'
let prevState
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
let loreShown
let musicGain = 1
let sfxGain = 1
let allSfx
let allMusic
//cells
let cell1
let cell2
let cell3
let currentCell
let currentCellNo
//weapons
let punch
let defSword
let nmeSword
let battleAxe
let dagger
let spear
//armour
let defArmour
let ironArmour
//consumables
let healthPot
let loreBook1
//general! again!
let world
let savedWorld
let loadButton
let exitButton
let hotbarSelect
let selectedWeapon
let hotbarButts
let invOffset
let xpToNextLevel
let battleQuery

function preload() {
  font = loadFont('assets/fonts/COMIC.ttf')
  blankSprite = loadImage('assets/blank.png')
  //entity spritesheets
  skeleLeathDagSprite = loadImage('assets/spritesheets/entity/skeleLeathDagSprite.png')
  skeleDagSprite = loadImage('assets/spritesheets/entity/skeleDagSprite.png')
  skeleSwordSprite = loadImage('assets/spritesheets/entity/skeleSwordSprite.png')
  droppedSprite = loadImage('assets/spritesheets/entity/droppedSprite.png')
  potionSprite = loadImage('assets/spritesheets/entity/potion.png')
  corpseSprite = loadImage('assets/spritesheets/entity/corpse.png')
  zombieBossSprite = loadImage('assets/spritesheets/entity/zombieBossSprite.png')
  npcSprite = loadImage('assets/spritesheets/entity/npc1Sprite.png')
  //walls and floors
  stone = loadImage('assets/textures/stone.png')
  wideStone = loadImage('assets/textures/wideStone.png')
  largeStone = loadImage('assets/textures/largeStone.png')
  gravelled = loadImage('assets/textures/gravelled.png')
  wideGravel = loadImage('assets/textures/wideGravel.png')
  largeGravel = loadImage('assets/textures/largeGravel.png')
  bark = loadImage('assets/textures/bark.png')
  trunk = loadImage('assets/textures/trunk.png')
  stoneWDoor = loadImage('assets/textures/stoneWDoor.png')
  woodPlanks = loadImage('assets/textures/woodPlanks.png')
  planksWDoor = loadImage('assets/textures/planksWDoor.png')
  darkPlanks = loadImage('assets/textures/darkerPlanks.png')
  //weapons
  swordSprite = loadImage('assets/spritesheets/weapon/sword1.png')
  fistSprite = loadImage('assets/spritesheets/weapon/punch.png')
  axeSprite = loadImage('assets/spritesheets/weapon/axe.png')
  daggerSprite = loadImage('assets/spritesheets/weapon/dagger.png')
  spearSprite = loadImage('assets/spritesheets/weapon/spear.png')
  //buttons
  beginButt = loadImage('assets/buttons/beginButton.png')
  settingsButt = loadImage('assets/buttons/settingsButton.png')
  loadButt = loadImage('assets/buttons/deathButton.png')
  crossImg = loadImage('assets/buttons/exitButton.png')
  upButton = loadImage('assets/buttons/upButton.png')
  downButton = loadImage('assets/buttons/downButton.png')
  //inventory icons
  swordIcon = loadImage('assets/icons/swordIcon.png')
  swordIcon2 = loadImage('assets/icons/swordIcon2.png')
  punchIcon = loadImage('assets/icons/punchIcon.png')
  axeIcon = loadImage('assets/icons/axeIcon.png')
  teeIcon = loadImage('assets/icons/armourIcon.png')
  potionIcon = loadImage('assets/icons/potionIcon.png')
  bookIcon = loadImage('assets/icons/bookIcon.png')
  daggerIcon = loadImage('assets/icons/daggerIcon.png')
  spearIcon = loadImage('assets/icons/spearIcon.png')
  //background images
  menuBg = loadImage('assets/mainMenuUI.png')
  settingsBg = loadImage('assets/settingsBg.png')
  //audio
  userStartAudio()
  soundFormats('mp3')
  footstepsGravel = loadSound('assets/sfx/footstepsGravel')
  footstepsWood = loadSound('assets/sfx/footstepsWood')
  atkGen = loadSound('assets/sfx/atkGen')
  atkSword = loadSound('assets/sfx/atkSword')
  atkDag = loadSound('assets/sfx/atkDag')
  atkHit = loadSound('assets/sfx/atkHit')
  defaultMusic = loadSound('assets/music/Rest_Your_Head_with_Strings')
  battleMusic1 = loadSound('assets/music/Armies_on_the_Ground')
  bossMusic1 = loadSound('assets/music/All_the_Kings_Men')
}

function setup() {
  ctrlListens = new keyGroup(87, 83, 65, 68, 73, 69, 76, 32, 1)
  skeleLeathDagSpritesheet = new spritesheet(skeleLeathDagSprite, 44, 50)
  skeleDagSpritesheet = new spritesheet(skeleDagSprite, 44, 52)
  skeleSwordSpritesheet = new spritesheet(skeleSwordSprite, 90, 67)
  blankSpritesheet = new spritesheet(blankSprite, 1, 1)
  droppedSpritesheet = new spritesheet(droppedSprite, 8, 8)
  potionSpritesheet = new spritesheet(potionSprite, 64, 64)
  corpseSpritesheet = new spritesheet(corpseSprite, 30, 39)
  zombieBossSpritesheet = new spritesheet(zombieBossSprite, 54, 64)
  npcSpritesheet = new spritesheet(npcSprite, 30, 50)
  punch = new weapon('just your fists', 2, fistSprite, 3, 2, [], punchIcon, 'str', 1, {})
  defSword = new weapon('blunt sword', 10, swordSprite, 5, 2, [], swordIcon, 'str', 2, { swingSound: atkSword })
  dagger = new weapon('iron dagger', 5, daggerSprite, 3, 2, [], daggerIcon, 'dex', 3, { swingSound: atkDag })
  nmeSword = new weapon('the sword enemies use', 20, swordSprite, 5, 4, [], swordIcon2, 'dex', 1, {})
  spear = new weapon('winged spear', 50, spearSprite, 7, 5, [], spearIcon, 'dex', 1, {})
  axe = new weapon('battleaxe', 18, axeSprite, 8, 5, [], axeIcon, 'str', 1, { swingSound: atkSword })
  defArmour = new apparel('ragged clothes', 2, teeIcon)
  ironArmour = new apparel('iron armour', 5, teeIcon)
  healthPot = new consumable('health potion', 'heal', 'a bottle of a healing elixir', potionIcon, 25, {})
  loreBook1 = new consumable('old journal', 'loreTrigger', 'a diary found in a cave', bookIcon, ["Hello journal, \n I don't know if anyone will ever see this, but I wanted to say goodbye. \n Somehow the mine has been overrun with monsters, soulless monsters from beyond the grave, whom I fear I am soon to join. \n I found this room to hide in, but I doubt it will be of any use as a hiding place now. Please, if you are reading this, grant me a kind death.", '[the rest is unreadable]'], { delOnUse: false })
  allMusic = [defaultMusic, battleMusic1]
  allSfx = [footstepsGravel, footstepsWood, atkDag, atkGen, atkHit, atkSword]
  canvas = createCanvas(1024, 576, WEBGL);
  canvas.parent('container')
  angleMode(DEGREES);
  textAlign(CENTER, CENTER)
  noStroke();
  rectMode(CENTER)
  mainMenuButts = [
    new menuButton(-83, -100, 166, 56, 'beginGame', beginButt, 166, 56), new menuButton(-83, 45, 166, 56, 'settings', settingsButt, 166, 56)
  ]
  loadButton = new menuButton(-100, 100, 200, 60, 'load', loadButt, 200, 60)
  exitButton = new menuButton(400, -200, 32, 32, 'exitInv', crossImg, 64, 64)
  cam = createCamera();
  uiCam = createCamera();
  setCamera(cam)
  cell1 = new cell([
    //beginning room
    new boundary(0, 2000, 250, 500, largeStone, 2000, 0), new boundary(250, 500, 2000, 0, largeStone, 2000, 0), new boundary(2000, 0, 4000, 0, largeStone, 2000, 0),
    new boundary(4000, 0, 5000, 750, largeStone, 2000, 0), new boundary(5000, 750, 5000, 1500, largeStone, 1500, 500),
    new boundary(5000, 1500, 4750, 2500, largeStone, 2000, 0), new boundary(4750, 2500, 3250, 4000, largeStone, 2000, 0), new boundary(3250, 4000, 1500, 4000, largeStone, 2000, 0),
    new boundary(0, 2000, 1500, 4000, stone, 2000, 0),
    //first corridor
    new boundary(5000, 750, 6500, 750, stone, 500, 0), new boundary(5000, 1500, 6000, 1500, stone, 500, 0), new boundary(6500, 750, 7500, 1750, stone, 700, -200),
    new boundary(6000, 1500, 6875, 3000, stone, 700, -200), new boundary(6875, 3000, 8300, 3200, stone, 800, -300), new boundary(7500, 1750, 8800, 1800, stone, 800, -300),
    new boundary(8300, 3200, 10500, 2500, stone, 700, -350), new boundary(9900, 980, 8800, 1800, stone, 700, -350),
    new boundary(9900, 980, 9900, 480, stone, 750, -400), new boundary(9900, 480, 9500, -1100, stone, 500, -450),
    new boundary(10500, 2500, 10500, 650, stone, 450, -400),
    new boundary(10500, 650, 10500, 350, stoneWDoor, 450, -400), new boundary(10500, 350, 10300, -2200, stone, 500, -450),
    new boundary(10300, -2200, 8700, -2000, stone, 500, -450), new boundary(9500, -1100, 8800, -800, stone, 450, -450),
    new boundary(8700, -2000, 8500, -1250, stone, 450, -500), new boundary(8500, -1250, 7200, 50, stone, 500, -600),
    new boundary(6400, 800, 7200, 50, stone, 450, -600), new boundary(8800, -800, 7500, 300, stone, 450, -600),
    new boundary(7000, 1050, 7500, 300, stone, 450, -600), new boundary(7200, 3150, 7000, 1050, stone, 350, -600),
    new boundary(6400, 800, 6400, 3200, stone, 300, -600), new boundary(6400, 3200, 6200, 3500, stone, 300, -650),
    new boundary(6200, 3500, 5700, 4900, stone, 300, -650), new boundary(7200, 3150, 7500, 3400, stone, 300, -650),
    new boundary(7500, 3400, 7700, 4900, stone, 300, -650),
    // first corridor step edges
    new boundary(6500, 750, 6500, 1500, wideGravel, 50, -50), new boundary(6500, 1500, 6000, 1500, wideGravel, 50, -50),
    new boundary(6195.337, 1845.513, 7104.663, 1320.513, wideGravel, 50, -100), new boundary(6352.513, 2201.041, 7201.041, 1352.513, wideGravel, 50, -150),
    new boundary(6340.381, 2613.173, 7613.173, 1340.381, wideGravel, 50, -200), new boundary(6809.808, 3129.423, 7709.808, 1570.577, wideGravel, 50, -250),
    new boundary(8050, 1700, 8050, 3500, wideGravel, 50, -300), new boundary(8800, 3250, 8800, 1750, wideGravel, 50, -350),
    new boundary(11132.532, 2154.423, 10232.532, 595.577, wideGravel, 50, -400), new boundary(10232.532, 595.577, 8067.468, 1845.577, wideGravel, 50, -400),
    new boundary(10500, -1100, 9500, -1100, wideGravel, 50, -450), new boundary(8500, -2250, 8500, -750, wideGravel, 50, -500),
    new boundary(8500, -750, 9000, -750, wideGravel, 50, -500), new boundary(7216.117, 30.33, 7569.67, 383.883, wideGravel, 50, -550),
    new boundary(6403.59, 633.013, 7096.41, 1033.013, wideGravel, 50, -600), new boundary(6350, 3200, 7350, 3200, wideGravel, 50, -650),
    new boundary(6832.212, 4827.44, 7991.323, 4516.857, wideGravel, 50, -650), new boundary(5200, 10050, 6200, 10050, wideGravel, 50, -650),
    new boundary(3200, 10900, 8200, 10900, wideGravel, 50, -600),
    // first corridor ceiling edges
    new boundary(8603.491, 327.431, 7577.431, 3146.509, wideStone, 50, 350), new boundary(6516.31, 821.074, 5671.074, 2633.69, wideStone, 100, 400),
    new boundary(9500, 2850, 9500, 850, wideStone, 350, 50), new boundary(7950, -1000, 10450, -1000, wideStone, 100, -50),
    new boundary(7743.668, -1461.478, 9385.742, -1021.485, wideStone, 50, -100), new boundary(7433.975, -1616.025, 9166.025, -616.025, wideStone, 50, -150),
    new boundary(7683.013, 216.987, 6816.987, -283.013, wideStone, 100, -250), new boundary(7923.85, 590.114, 6474.961, 201.886, wideStone, 50, -300),
    new boundary(5700, 2500, 7700, 2500, wideStone, 100, -350), new boundary(5700, 4900, 7700, 4900, wideStone, 300, -350),
    new boundary(4800, 5800, 8800, 5800, wideStone, 250, -300), new boundary(5200, 10900, 6200, 10900, wideStone, 50, -250),
    // first corridor log
    new boundary(10000, 2500, 10000, 1000, bark, 150, -350), new boundary(10150, 2500, 10150, 1000, bark, 150, -350), new boundary(10150, 2500, 10000, 2500, trunk, 150, -350),
    new boundary(10000, 1000, 10150, 1000, trunk, 150, -350),
    // corridor split
    new boundary(6800, 4800, 6000, 5800, stone, 350, -650), new boundary(6800, 4800, 7400, 5700, stone, 350, -650),
    new boundary(7900, 5800, 7700, 4900, stone, 350, -650), new boundary(5500, 5800, 5700, 4900, stone, 350, -650),
    new boundary(7400, 5700, 7900, 5800, stoneWDoor, 550, -600),
    // battle room
    new boundary(6000, 5800, 6300, 7000, stone, 600, -650), new boundary(6300, 7000, 6400, 8600, stone, 600, -650),
    new boundary(6400, 8600, 6000, 9500, stone, 600, -650), new boundary(5600, 9500, 4900, 9200, stone, 600, -650),
    new boundary(4900, 9200, 4400, 7800, largeStone, 600, -650), new boundary(4400, 7800, 4500, 6700, stone, 600, -650),
    new boundary(4500, 6700, 5500, 5800, stone, 600, -650), new boundary(6000, 9500, 5600, 9500, stone, 200, -250),
    //after battle room
    new boundary(6000, 9500, 6000, 10600, stone, 400, -650), new boundary(5600, 9500, 5500, 10300, stone, 400, -650),
    new boundary(6000, 10600, 6150, 11200, stone, 400, -600), new boundary(5500, 10300, 5250, 11300, stone, 400, -600),
    new boundary(5250, 11300, 5200, 11800, stone, 400, -600), new boundary(6150, 11200, 5800, 11800, stone, 400, -600),
    new boundary(5200, 11800, 3800, 11900, stone, 350, -550), new boundary(5800, 11800, 6200, 12600, stone, 350, -550),
    new boundary(3800, 11900, 3200, 13000, stone, 350, -550), new boundary(6200, 12600, 6000, 13200, stone, 350, -550),
    new boundary(6000, 13200, 5200, 13700, stone, 350, -550), new boundary(5200, 13700, 3200, 13300, stone, 350, -550),
    new boundary(3200, 13300, 3200, 13000, largeStone, 350, -550),
    //boss room pillar
    new boundary(4800, 12700, 4850, 12700, woodPlanks, 350, -550), new boundary(4850, 12700, 4850, 12750, woodPlanks, 350, -550),
    new boundary(4850, 12750, 4800, 12750, woodPlanks, 350, -550), new boundary(4800, 12750, 4800, 12700, woodPlanks, 350, -550),
    //floor edges there
    new boundary(3200, 13300, 3200, 13000, wideGravel, 0, -550), new boundary(2000, 13000, 2000, 13300, woodPlanks, 50, -500),
    //post boss corridor
    new boundary(3200, 13300, 2000, 13300, stone, 400, -550), new boundary(3200, 13000, 2000, 13000, stone, 400, -550),
    new boundary(2000, 13000, 1000, 14000, stone, 400, -550), new boundary(1000, 14000, 1000, 17000, stone, 400, -550),
    new boundary(2000, 13300, 2000, 17000, stone, 400, -550), new boundary(2000, 17000, 1000, 17000, stone, 400, -550),
    //ceiling edges there
    new boundary(3200, 13300, 3200, 13000, wideStone, 50, -200)
  ], [
    // new triggerWall(6000, 5800, 5500, 5800, 175, -650, 'triggerCombat', [0, 1, 2]),
    // new triggerWall(5200, 11800, 5800, 11800, 175, -550, 'triggerCombat', [3])
  ], [
    //beginning room
    new floor(5000, 4000, 2500, 0, 2000, 0, largeGravel, {}), new floor(5000, 4000, 2500, 2000, 2000, 180, largeStone, {}),
    //first corridor
    new floor(1500, 750, 5750, 0, 1125, 0, gravelled, {}), new floor(1000, 1050, 6400, -50, 1150, 60, gravelled, {}),
    new floor(500, 1200, 6600, -100, 1600, 45, gravelled, {}), new floor(500, 1800, 6800, -150, 1800, 45, gravelled, {}),
    new floor(600, 1800, 7000, -200, 2200, 30, gravelled, {}), new floor(1200, 1800, 7450, -250, 2600, 0, gravelled, {}),
    new floor(750, 1500, 8425, -300, 2500, 0, gravelled, {}), new floor(2500, 1800, 9600, -350, 2000, -30, gravelled, {}),
    new floor(1500, 150, 10075, -200, 1750, 90, bark, {}), new floor(1000, 3000, 10000, -400, 400, 0, gravelled, {}),
    new floor(2000, 1500, 9500, -450, -1500, 0, gravelled, {}), new floor(600, 2000, 8100, -500, -500, 45, gravelled, {}),
    new floor(800, 1000, 7000, -550, 400, 30, gravelled, {}), new floor(1000, 3000, 6850, -600, 1700, 0, gravelled, {}),
    new floor(2000, 2000, 6700, -650, 3900, 0, gravelled, {}), new floor(4000, 6000, 5400, -650, 7900, 0, largeGravel, {}),
    new floor(1200, 1300, 7580, -600, 5300, -15, gravelled, {}),
    //first corridor ceilings
    new floor(2300, 1200, 6150, 500, 1125, 0, stone, {}), new floor(3000, 3000, 9500, 350, 2250, 20, stone, {}),
    new floor(2000, 2000, 7000, 400, 2150, 25, stone, {}), new floor(1000, 4000, 10000, 50, 850, 0, stone, {}),
    new floor(2500, 2000, 9200, -50, -2000, 0, stone, {}), new floor(1700, 500, 8500, -100, -1000, 15, stone, {}),
    new floor(2000, 2000, 7800, -150, -250, 30, stone, {}), new floor(1000, 1000, 7000, -250, 400, 30, stone, {}),
    new floor(1500, 2700, 6850, -300, 1700, 15, stone, {}), new floor(2000, 2400, 6700, -350, 3700, 0, largeStone, {}),
    new floor(4000, 6000, 5400, -50, 7900, 0, largeStone, {}), new floor(4000, 1000, 6800, -300, 5300, 0, stone, {}),
    //after battle room
    new floor(1000, 1500, 5700, -600, 10800, 0, gravelled, {}),
    //ceiling o'th'same
    new floor(1000, 1400, 5700, -250, 10200, 0, stone, {}),
    //boss room
    new floor(5000, 3000, 5700, -550, 12400, 0, largeGravel, {}),
    //boss room ceiling
    new floor(5000, 3000, 5700, -200, 12400, 0, largeStone, {}),
    //post boss room floors
    new floor(1600, 500, 2400, -500, 13150, 0, gravelled, {}), new floor(1000, 4000, 1500, -450, 15000, 0, woodPlanks, { sound: footstepsWood }),
    new floor(1000, 4000, 1500, -150, 15000, 0, largeStone, {})
  ], [
    new entity(10490, -400, 538, blankSpritesheet, 140, 200, 'loadZone', [1, 0, 0, 0, 0], 0, new inventory([], [], []), { canCollide: false }),
    new entity(6000, -650, 7600, skeleLeathDagSpritesheet, 75, 175, false, [], 1, new inventory([dagger], [defArmour], [healthPot]), {}),
    new entity(6000, -650, 7600, skeleSwordSpritesheet, 75, 175, false, [], 2, new inventory([defSword], [ironArmour], []), {}),
    new entity(6000, -650, 7600, skeleDagSpritesheet, 75, 175, false, [], 3, new inventory([defSword], [ironArmour], []), {}),
    new entity(3970, 0, 80, corpseSpritesheet, 88, 100, 'loot', ['', ''], 4, new inventory([dagger], [], []), { canCollide: false }),
    new entity(7650, -600, 5750, blankSpritesheet, 200, 285, 'loadZone', [2, 0, 0, 0, 180], 5, new inventory([], [], []), { canCollide: false }),
    new entity(0, 0, 0, zombieBossSpritesheet, 100, 300, false, [], 6, new inventory([spear], [], []), {}),
    new entity(100, 0, 450, npcSpritesheet, 75, 175, 'dialogue',
      [
        [['never seen'], ['Higher beings: these words are for you alone'], [''], ['']],
        [['What?'], ['Thank you for playing the demo of Broken Legacy: the mortal tombs'], [''], ['']],
        [['What?'], [''], [''], ['']]
      ],
      7, new inventory([dagger], [defArmour], [])
    )
  ], [
    new ai(6000, -650, 7600, 0, 15, 100, 1, 'i', nmeSword, 11, {}), new ai(4500, -650, 7100, 0, 15, 100, 2, 'i', nmeSword, 11, {}),
    new ai(5500, -650, 9200, 0, 15, 100, 3, 'i', nmeSword, 11, {}), new ai(3900, -550, 12250, 0, 20, 1, 6, 'i', nmeSword, 75, { musicOverride: bossMusic1, onDeath: 'boss1end' }),
    new ai(1500, -450, 16900, 0, 15, 50, 7, 'i', dagger, 5, {})
  ], [
    new pathNode(2800, 1100, [1], 0), new pathNode(6000, 1100, [0, 2], 1), new pathNode(6750, 1450, [1, 3], 2),
    new pathNode(6650, 1750, [2, 4], 3), new pathNode(6800, 2000, [3, 5], 4), new pathNode(7200, 2200, [4, 6], 5),
    new pathNode(7850, 2100, [5, 7], 6), new pathNode(8400, 2300, [6, 8], 7), new pathNode(9750, 1800, [7], 8),
    new pathNode(10100, 875, [10], 9), new pathNode(10100, -300, [9, 11], 10), new pathNode(9800, -1800, [10, 12], 11),
    new pathNode(8650, -1050, [11, 13], 12), new pathNode(7700, -150, [12, 14], 13), new pathNode(7100, 400, [13, 15], 14),
    new pathNode(6700, 1300, [14, 16], 15), new pathNode(6700, 4000, [15, 17], 16), new pathNode(5200, 6900, [16, 18], 17),
    new pathNode(5800, 9800, [17, 19], 18), new pathNode(5800, 10500, [18, 20], 19), new pathNode(5600, 12400, [19, 21, 22], 20),
    new pathNode(4800, 13200, [20, 22, 23], 21), new pathNode(4300, 12250, [20, 21], 22), new pathNode(3100, 13200, [21], 23)
  ], stone, dGrey, defaultMusic)
  cell2 = new cell([
    //walls
    new boundary(-150, 100, -150, -900, woodPlanks, 250, 0), new boundary(-150, -900, -600, -900, woodPlanks, 250, 0),
    new boundary(-600, -900, -600, -1900, woodPlanks, 250, 0), new boundary(-600, -1900, 600, -1900, woodPlanks, 250, 0),
    new boundary(600, -1900, 600, -900, woodPlanks, 250, 0), new boundary(600, -900, 100, -900, woodPlanks, 250, 0),
    new boundary(100, -900, 150, 100, woodPlanks, 250, 0), new boundary(150, 100, -150, 100, planksWDoor, 250, 0),
    //table legs
    new boundary(-250, -1625, -225, -1625, darkPlanks, 100, 0), new boundary(-250, -1625, -250, -1600, darkPlanks, 100, 0),
    new boundary(250, -1625, 225, -1625, darkPlanks, 100, 0), new boundary(250, -1625, 250, -1600, darkPlanks, 100, 0),
    new boundary(-250, -1375, -225, -1375, darkPlanks, 100, 0), new boundary(-250, -1375, -250, -1400, darkPlanks, 100, 0),
    new boundary(250, -1375, 225, -1375, darkPlanks, 100, 0), new boundary(250, -1375, 250, -1400, darkPlanks, 100, 0),
    new boundary(-225, -1625, 225, -1625, darkPlanks, 25, 75), new boundary(-250, -1600, -250, -1400, darkPlanks, 25, 75),
    new boundary(-225, -1375, 225, -1375, darkPlanks, 25, 75), new boundary(250, -1400, 250, -1600, darkPlanks, 25, 75)

  ], [

  ], [
    new floor(1200, 2000, 0, 0, -900, 0, woodPlanks, { sound: footstepsWood }), new floor(500, 250, 0, 100, -1500, 0, darkPlanks, {}),
    new floor(1200, 2000, 0, 250, -900, 0, woodPlanks, {})
  ], [
    new entity(0, 0, 90, blankSpritesheet, 140, 200, 'loadZone', [0, 10300, -400, 530, 270], 0, new inventory([], [], []), { canCollide: false }),
    new entity(70, 100, -1420, potionSpritesheet, 64, 64, 'loot', ['delOnEmpty', 'hideOnEmpty'], 1, new inventory([], [], [healthPot]), { canCollide: false }),
    new entity(556, 0, -944, corpseSpritesheet, 88, 100, 'loot', ['', ''], 2, new inventory([defSword], [], [loreBook1]), { canCollide: false })
  ], [
    new ai(556, 0, -944, 0, 5, 20, 2, 'n', nmeSword, 5, {})
  ], [
    new pathNode(0, -1000, [1], 0), new pathNode(400, -1300, [0], 1)
  ], woodPlanks, brown, defaultMusic)
  cell3 = new cell([
    new boundary(-150, -100, 150, -100, stoneWDoor, 450, 0), new boundary(150, -100, 300, 50, stone, 450, 0),
    new boundary(300, 50, 300, 350, stone, 450, 0), new boundary(300, 350, 150, 500, stone, 450, 0),
    new boundary(150, 500, -150, 500, stone, 450, 0), new boundary(-150, 500, -300, 350, stone, 450, 0),
    new boundary(-300, 350, -300, 50, stone, 450, 0), new boundary(-300, 50, -150, -100, stone, 450, 0)
  ], [

  ], [
    new floor(600, 600, 0, 0, 200, 0, woodPlanks, { sound: footstepsWood }), new floor(600, 600, 0, 450, 200, 0, woodPlanks, {})
  ], [
    new entity(0, 0, -100, blankSpritesheet, 140, 200, 'loadZone', [0, 7600, -600, 5600, -30], 0, new inventory([], [], []), { canCollide: false }),
    new entity(100, 0, 450, npcSpritesheet, 75, 175, 'dialogue',
      [
        [['never seen'], ['Hello'], [''], ['']],
        [['Hello', 'Hello?'], ["Oh good, you're human, I was worried I would be trapped forever", "No need to sound like that, I'm not a monster"], ['', ''], ['', '']],
        [['What are you doing here?'], ["I don't remember, but I'm too afraid to leave"], ['', ''], ['', '']],
        [["Do you need help?", "Good luck with that"], ["Yes! Please kill those monsters and let me be free", 'theoretically never seen'], ['', 'talkSkip'], ['', 1]],
        [['Of course', 'Goodbye'], ['', ''], ['', ''], ['', '']]
        //player options, shown responses, triggered event, event data
      ],
      0, new inventory([], [], []), {})
  ], [

  ], [

  ], stone, dGrey, defaultMusic)
  world = [cell1, cell2, cell3]
  for (let i of world) {
    i.floors.sort(floorSort)
    for (let j of i.objects) {
      j.ogIndex = i.objects.indexOf(j)
    }
  }
  currentCell = world[0]
  currentCellNo = 0
  player = new pc(1375, 1, 2750, 175, 225, -45, 8, currentCell.floors[0], 100, 0, defArmour, {})
  player.y = -650
  player.x = 7600
  player.z = 5666
  cam.centerX += player.x
  cam.eyeX += player.x
  cam.centerY -= 175
  cam.eyeY -= 175
  cam.centerZ += player.z
  cam.eyeZ += player.z
  xpToNextLevel = 100
  player.hotbar[0] = axe
  uiCam.ortho()
  battleQuery = false
  textFont(font)
  noStroke()
  saveGame()
  frameRate(30)
  setAttributes('alpha', false);
}

function draw() {
  player.speed = 15 * (30 / frameRate())
  background(0)
  noErase()
  switch (gameState) {
    case 'menu':
      menuUI()
      break
    case 'settings':
      settingsUI()
      break
    case 'game':
      battleQuery = false
      for (let i of currentCell.AIs) {
        if (i.mode == 'h' || i.mode == 'm' || i.mode == 'a') {
          battleQuery = true
          break
        }
      }
      if (battleQuery) {
        if (currentCell.bgMusic.isPlaying()) {
          world[currentCellNo].bgMusic.pause()
        }
        for (let i of currentCell.AIs) {
          if (i.music != false && (i.mode == 'h' || i.mode == 'm' || i.mode == 'a')) {
            if (!i.music.isPlaying()) {
              i.music.play()
              break
            }
          }
          else if (i == currentCell.AIs[currentCell.AIs.length - 1] && !battleMusic1.isPlaying()) {
            battleMusic1.play()
          }
        }
      }
      else if (!currentCell.bgMusic.isPlaying()) {
        battleMusic1.stop()
        for (let i of currentCell.AIs) {
          if (i.music != false) {
            i.music.stop()
          }
        }
        currentCell.bgMusic.play()
      }
      cam.pan(0)
      cam.tilt(0)
      player.controls()
      for (let i of currentCell.walls) {
        i.render()
      }
      for (let i of currentCell.trigWalls) {
        i.collideCheck()
      }
      for (let i of currentCell.floors) {
        i.render()
      }
      for (let i of currentCell.AIs) {
        i.fullPathfinding()
      }
      for (let i = 5000; i > 2400; i -= 200) {
        push()
        fill(currentCell.fogColour[0], currentCell.fogColour[1], currentCell.fogColour[2], 100)
        translate(player.x, -player.eyeLevel, player.z + 500)
        sphere(i)
        pop()
        for (let j of currentCell.objects) {
          if (dist(player.x, player.z, j.x, j.z) <= i && dist(player.x, player.z, j.x, j.z) >= i - 200) {
            j.render()
          }
        }
      }
      currentCell.objects = currentCell.objects.sort(entitySort)
      for (let i of currentCell.objects) {
        if (dist(i.x, i.z, player.x, player.z) <= 2400) {
          i.render()
        }
      }
      currentCell.objects = currentCell.objects.sort(entityUnsort)
      for (let i of currentCell.objects) {
        if (i.interactible == 'loot' && i.useData[0] == 'delOnEmpty' &&
          i.inventory.weapons.length == 0 && i.inventory.apparels.length == 0 && i.inventory.usables.length == 0) {
          i.interactible = false
          if (i.useData[1] == 'hideOnEmpty') {
            i.spriteSheet = blankSprite
          }
          break
        }
      }
      if (keyIsDown(ctrlListens.intKey)) { //interaction check
        interactCheckVariable = player.interactCheck()
        if (interactCheckVariable[0]) {
          if (interactCheckVariable[1].interactible != 'loadZone') {
            gameState = interactCheckVariable[1].interactible
            talkDepth = 0
            talkOption = 0
            mouseWasPressed = true
            invOffset = 0
            droppedInv = new inventory([], [], [])
            exitPointerLock()
          }
          else {
            currentCell.bgMusic.pause()
            currentCell = world[interactCheckVariable[1].useData[0]]
            currentCellNo = interactCheckVariable[1].useData[0]
            player.x = interactCheckVariable[1].useData[1]
            player.y = interactCheckVariable[1].useData[2]
            player.z = interactCheckVariable[1].useData[3]
            player.angleLR = interactCheckVariable[1].useData[4]
            currentCell.bgMusic.play()
          }
        }
      }
      if (!mouseWasPressed && mouseIsPressed && player.attacking == false) {
        player.attacking = true
        player.hotbar[player.weapon].swingSound.play()
      }
      if (player.attacking == true) {
        player.attackFrame += 1
        if (player.attackFrame == player.hotbar[player.weapon].dF) {
          interactCheckVariable = player.attackCheck()
          if (interactCheckVariable != false) {
            interactCheckVariable.hp -= player.damageCalc({})
            if (interactCheckVariable.mode == 'i') {
              interactCheckVariable.mode = 'h'
            }
          }
        }
        if (player.attackFrame > player.hotbar[player.weapon].aF) {
          player.attacking = false
          player.attackFrame = 0
        }
      }
      if (jumping) {
        player.ceilingCheck()
        cam.centerY -= 5 * (30 / frameRate())
        cam.eyeY -= 5 * (30 / frameRate())
        player.y += 5 * (30 / frameRate())
        player.eyeLevel += 5 * (30 / frameRate())
        jumpHeight += 5 * (30 / frameRate())
        if (jumpHeight >= 100) {
          jumping = false
        }
      }
      else if (player.y > player.currentFloor.y) {
        player.y -= 5 * (30 / frameRate())
        cam.centerY += 5 * (30 / frameRate())
        cam.eyeY += 5 * (30 / frameRate())
        player.eyeLevel = player.y + player.height
        if (player.y <= player.currentFloor.y) {
          jumpHeight = 0
          player.y = player.currentFloor.y
          //player.eyeLevel = player.y + player.height
          //cam.eyeY = -player.eyeLevel
          //cam.centerY = player.eyeLevel + tan(player.angleUD)
        }
      }
      ui()
      if (keyIsDown(113)) { //save
        if (player.y > player.currentFloor.y) { //necessary as saving in the air causes problems
          saveFailUI()
        }
        else {
          saveGame()
        }
      }
      if (keyIsDown(120)) { //load
        currentCell.bgMusic.pause()
        loadGame()
        currentCell.bgMusic.play()
      }
      if (player.hp <= 0) {
        gameState = 'death'
        exitPointerLock()
      }
      else if (player.xp >= xpToNextLevel) {
        player.xp -= xpToNextLevel
        player.level += 1
        player.hp = player.maxHp
        xpToNextLevel = 100 + (100 * pow(player.level, 2))
        gameState = 'levelUp'
        exitPointerLock()
      }
      break
    case 'pause':
      for (let i of currentCell.walls) {
        i.render()
      }
      for (let i of currentCell.floors) {
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entitySort)
      for (let i of currentCell.objects) {
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entityUnsort)
      pauseUI()
      break
    case 'dialogue':
      for (let i of currentCell.walls) {
        i.render()
      }
      for (let i of currentCell.floors) {
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entitySort)
      for (let i of currentCell.objects) {
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entityUnsort)
      for (let i of currentCell.objects) {
        i.render()
      }
      dialogueUI(interactCheckVariable[1])
      break
    case 'death':
      deathUI()
      break
    case 'inventory':
      for (let i of currentCell.walls) {
        i.render()
      }
      for (let i of currentCell.floors) {
        i.render()
      }
      // for (let i of currentCell.AIs){
      //   i.fullPathfinding()
      // }
      currentCell.objects = currentCell.objects.sort(entitySort)
      for (let i of currentCell.objects) {
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entityUnsort)
      inventoryUI()
      break
    case 'loot':
      for (let i of currentCell.walls) {
        i.render()
      }
      for (let i of currentCell.floors) {
        i.render()
      }
      // for (let i of currentCell.AIs){
      //   i.fullPathfinding()
      // }
      currentCell.objects = currentCell.objects.sort(entitySort)
      for (let i of currentCell.objects) {
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entityUnsort)
      lootUI(interactCheckVariable[1])
      break
    case 'statView':
      for (let i of currentCell.walls) {
        i.render()
      }
      for (let i of currentCell.floors) {
        i.render()
      }
      // for (let i of currentCell.AIs){
      //   i.fullPathfinding()
      // }
      currentCell.objects = currentCell.objects.sort(entitySort)
      for (let i of currentCell.objects) {
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entityUnsort)
      statsUI()
      break
    case 'levelUp':
      for (let i of currentCell.walls) {
        i.render()
      }
      for (let i of currentCell.floors) {
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entitySort)
      for (let i of currentCell.objects) {
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entityUnsort)
      levelUpUI()
      break
    case 'lore':
      for (let i of currentCell.walls) {
        i.render()
      }
      for (let i of currentCell.floors) {
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entitySort)
      for (let i of currentCell.objects) {
        i.render()
      }
      currentCell.objects = currentCell.objects.sort(entityUnsort)
      loreUI()
      break
  }
  mouseWasPressed = mouseIsPressed
}

// UI functions

function ui() {
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
  rect(0, 250, 170 * player.hp / player.maxHp, 30)
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
  if (player.interactCheck()[0]) {
    textSize(20)
    fill(red)
    text('interact (' + keysList[ctrlListens['intKey']] + ')', 0, 10)
  }
  pop()
}

function menuUI() {
  push()
  setCamera(uiCam)
  uiCam.setPosition(0, 0, 50)
  image(menuBg, -512, -288)
  for (let i of mainMenuButts) {
    i.render()
    i.executeFunc({})
  }
  pop()
}

function settingsUI() {
  let expandedKeyNames = [
    'fwKey', 'forwards', 'bwKey', 'backwards', 'lwKey', 'strafe left', 'rwKey', 'strafe right',
    'jumpKey', 'jump', 'invKey', 'inventory', 'statKey', 'view stats', 'intKey', 'interact'
  ]
  let buttons = [
    //back
    new menuButton(-450, 200, 64, 64, 'return', upButton, 64, 64),
    //controls
    new menuButton(-400, -200, 200, 25, 'fwKey', upButton, 64, 64), new menuButton(-400, -175, 200, 25, 'bwKey', upButton, 64, 64),
    new menuButton(-400, -150, 200, 25, 'lwKey', upButton, 64, 64), new menuButton(-400, -125, 200, 25, 'rwKey', upButton, 64, 64),
    new menuButton(-400, -100, 200, 25, 'jumpKey', upButton, 64, 64), new menuButton(-400, -75, 200, 25, 'invKey', upButton, 64, 64),
    new menuButton(-400, -50, 200, 25, 'statKey', upButton, 64, 64), new menuButton(-400, -25, 200, 25, 'intKey', upButton, 64, 64),
    new menuButton(325, -200, 25, 25, 'musicDn', downButton, 64, 64), new menuButton(350, -200, 25, 25, 'musicUp', upButton, 64, 64),
    new menuButton(325, -175, 25, 25, 'sfxDn', downButton, 64, 64), new menuButton(350, -175, 25, 25, 'sfxUp', upButton, 64, 64),
    new menuButton(50, -200, 25, 25, 'snstvtDn', downButton, 64, 64), new menuButton(75, -200, 25, 25, 'snstvtUp', upButton, 64, 64)
  ]
  let colourBool = 0
  let light = [216, 158, 99]
  let dark = [182, 132, 82]
  push()
  textAlign(CENTER, CENTER)
  setCamera(uiCam)
  uiCam.setPosition(0, 0, 0)
  image(settingsBg, -512, -288)
  textSize(20)
  fill(255)
  text('Key bindings', -300, -225)
  text('Audio volume', 300, -225)
  fill(0)
  if (!mouseWasPressed && mouseIsPressed && changeKey != 'nullRef') {
    changeKey = 'nullRef'
  }
  for (let i of buttons) {
    if (i.func.substring(i.func.length - 3) == 'Key') {
      colourBool = (changeKey == i.func)
      if (colourBool) {
        fill(light)
      }
      else {
        fill(dark)
      }
      rect(i.transX, i.transY, i.w, i.h)
      fill(0)
      text(expandedKeyNames[expandedKeyNames.indexOf(i.func) + 1] + ': ' + keysList[ctrlListens[i.func]], i.transX, i.transY)
      if (i.checkHovered() && !mouseWasPressed && mouseIsPressed) {
        changeKey = i.func
      }
    }
    else {
      i.render()
      i.executeFunc({})
    }
  }
  fill(255)
  textAlign(LEFT, CENTER)
  text('Sensitivity: ' + ctrlListens.snstvt / 10, -100, -195)
  text('Music: ' + musicGain * 10 + '/10', 200, -195)
  text('Sfx: ' + sfxGain * 10 + '/10', 200, -170)
  pop()
}

function pauseUI() {
  push()
  setCamera(uiCam)
  uiCam.setPosition(0, 0, 50)
  for (let i of mainMenuButts) {
    i.render()
    i.executeFunc({})
  }
  pop()
}

function dialogueUI(entity) {
  let reactButtons = []
  for (let i = 0; i < entity.useData[talkDepth + 1][0].length; i++) {
    reactButtons.push(new menuButton(56, 100 * (i - 2), 400, 100, 'advanceTalk' + i, 'noSpriteSheet', 0, 0))
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
  for (let i = 0; i < entity.useData[talkDepth + 1][0].length; i++) {
    text(entity.useData[talkDepth + 1][0][i], 256, 100 * (i - 2) + 10, 400, 400)
  }
  for (let i of reactButtons) {
    i.executeFunc({ data: [entity, entity.useData[talkDepth + 1][3][reactButtons.indexOf(i)]] })
    if (talkDepth == entity.useData.length - 1) {
      break
    }
  }
  if (talkDepth == entity.useData.length - 1) {
    gameState = 'game'
    requestPointerLock()
  }
  pop()
}

function deathUI() {
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

function saveFailUI() {
  push() // auto reverses changes
  setCamera(uiCam) // switches cam
  uiCam.setPosition(0, 0, 0)
  textSize(20)
  textAlign(LEFT, TOP)
  fill(255)
  text('You can not save while jumping or falling', -512, -288)
  pop()
}

function inventoryUI() {
  let hotbarButts = [
    new menuButton(-320, 180, 40, 40, 'unequip', player.hotbar[0].icon, 64, 64), new menuButton(-120, 180, 40, 40, 'unequip', player.hotbar[1].icon, 64, 64),
    new menuButton(80, 180, 40, 40, 'unequip', player.hotbar[2].icon, 64, 64), new menuButton(280, 180, 40, 40, 'unequip', player.hotbar[3].icon, 64, 64)
  ]
  let scrollButts = [new menuButton(-440, -215, 40, 40, 'scrollUp', upButton, 64, 64), new menuButton(-440, 140, 40, 40, 'scrollDown', downButton, 64, 64)]
  let weaponsButtons = []
  if (player.inventory.weapons.length > invOffset * 5) {
    for (let i = invOffset * 5; i < player.inventory.weapons.length && i < (invOffset * 5) + 5; i++) {
      weaponsButtons.push(new menuButton(-400, -175 + (70 * (i - (invOffset * 5))), 800 / 3, 70, 'moveToHotbar', player.inventory.weapons[i], 64, 64))
    }
  }
  let apparelButtons = []
  if (player.inventory.apparels.length > invOffset * 5) {
    for (let i = invOffset * 5; i < player.inventory.apparels.length && i < (invOffset * 5) + 5; i++) {
      apparelButtons.push(new menuButton(-400 / 3, -175 + (70 * (i - (invOffset * 5))), 800 / 3, 70, 'equipRmr', player.inventory.apparels[i], 64, 64))
    }
  }
  let usablesButtons = []
  if (player.inventory.usables.length > invOffset * 5) {
    for (let i = invOffset * 5; i < player.inventory.usables.length && i < (invOffset * 5) + 5; i++) {
      usablesButtons.push(new menuButton(400 / 3, -175 + (70 * (i - (invOffset * 5))), 800 / 3, 70, 'usePot', player.inventory.usables[i], 64, 64))
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
  rect(-800 / 3, 0, 800 / 3, 360)
  rect(800 / 3, 0, 800 / 3, 360)
  rect(0, -195, 800 / 3, 30)
  fill(182, 132, 82)
  rect(0, 0, 800 / 3, 360)
  rect(-800 / 3, -195, 800 / 3, 30)
  rect(800 / 3, -195, 800 / 3, 30)
  textSize(20)
  fill(0)
  text('weapons', -800 / 3, -200)
  text('apparel', 0, -200)
  text('consumables', 800 / 3, -200)
  textAlign(LEFT, TOP)
  for (let i of weaponsButtons) {
    fill(255)
    rect(-384, i.collY + 16, 32, 32)
    image(i.spriteSheet.icon, -400, i.collY, 32, 32, 0, 0, 64, 64)
    fill(0)
    text(i.spriteSheet.name, -366, i.collY)
    text('dmg: ' + i.spriteSheet.damage, -400, i.collY + 34)
    if (i.checkHovered() && !mouseWasPressed && mouseIsPressed && hotbarSelect == false) {
      selectedWeapon = i.spriteSheet
      hotbarSelect = true
    }
  }
  for (let i of apparelButtons) {
    fill(255)
    rect(-352 / 3, i.collY + 16, 32, 32)
    image(i.spriteSheet.icon, -400 / 3, i.collY, 32, 32, 0, 0, 64, 64)
    fill(0)
    text(i.spriteSheet.name, -298 / 3, i.collY)
    text('def: ' + i.spriteSheet.defense, -400 / 3, i.collY + 34)
    if (i.checkHovered() && !mouseWasPressed && mouseIsPressed && hotbarSelect == false) {
      player.def = i.spriteSheet.defense
      player.inventory.apparels.splice(player.inventory.apparels.indexOf(i.spriteSheet), 1)
      player.inventory.apparels.push(player.armour)
      player.armour = i.spriteSheet
    }
  }
  for (let i of usablesButtons) {
    fill(255)
    rect(448 / 3, i.collY + 16, 32, 32)
    image(i.spriteSheet.icon, 400 / 3, i.collY, 32, 32, 0, 0, 64, 64)
    fill(0)
    text(i.spriteSheet.name, 502 / 3, i.collY)
    text(i.spriteSheet.desc, 400 / 3, i.collY + 32)
    if (i.checkHovered() && !mouseWasPressed && mouseIsPressed && hotbarSelect == false) {
      i.spriteSheet.executeFunc({ data: i.spriteSheet.extraData })
      if (i.spriteSheet.delOnUse) {
        player.inventory.usables.splice(usablesButtons.indexOf(i), 1)
      }
    }
  }
  for (let i = 0; i < hotbarButts.length; i++) {
    let j = hotbarButts[i]
    fill(216, 158, 99)
    rect(j.transX, j.transY, 40, 40)
    image(j.spriteSheet, j.collX, j.collY, 40, 40)
    if (hotbarSelect == false) {
      hotbarButts[i].executeFunc({ data: [player.hotbar[i], i] })
    }
  }
  for (let i of scrollButts) {
    i.render()
    i.executeFunc({})
  }
  if (keyIsDown(81) && player.inventory.weapons.length >= 1) {
    droppedInv.weapons.push(player.inventory.weapons[0])
    player.inventory.weapons.shift()
  }
  exitButton.render()
  exitButton.executeFunc({})
  if (hotbarSelect == true) {
    hotbarUI(selectedWeapon)
  }
  pop()
}

function lootUI(lootee) {
  let scrollButts = [new menuButton(-440, -215, 40, 40, 'scrollUp', upButton, 64, 64), new menuButton(-440, 140, 40, 40, 'scrollDown', downButton, 64, 64)]
  let weaponsButtons = []
  for (let i = invOffset * 5; i < lootee.inventory.weapons.length && i < (invOffset * 5) + 5; i++) {
    weaponsButtons.push(new menuButton(-400, -175 + (70 * (i - (invOffset * 5))), 800 / 3, 70, 'giveWpn', lootee.inventory.weapons[i], 64, 64))
  }
  let apparelButtons = []
  for (let i = invOffset * 5; i < lootee.inventory.apparels.length && i < (invOffset * 5) + 5; i++) {
    apparelButtons.push(new menuButton(-400 / 3, -175 + (70 * (i - (invOffset * 5))), 800 / 3, 70, 'giveRmr', lootee.inventory.apparels[i], 64, 64))
  }
  let usablesButtons = []
  for (let i = invOffset * 5; i < lootee.inventory.usables.length && i < (invOffset * 5) + 5; i++) {
    usablesButtons.push(new menuButton(400 / 3, -175 + (70 * (i - (invOffset * 5))), 800 / 3, 70, 'givePot', lootee.inventory.usables[i], 64, 64))
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
  rect(-800 / 3, 0, 800 / 3, 360)
  rect(800 / 3, 0, 800 / 3, 360)
  rect(0, -195, 800 / 3, 30)
  fill(182, 132, 82)
  rect(0, 0, 800 / 3, 360)
  rect(-800 / 3, -195, 800 / 3, 30)
  rect(800 / 3, -195, 800 / 3, 30)
  textSize(20)
  fill(0)
  text('weapons', -800 / 3, -200)
  text('apparel', 0, -200)
  text('consumables', 800 / 3, -200)
  textAlign(LEFT, TOP)
  for (let i of weaponsButtons) {
    fill(255)
    rect(-384, i.collY + 16, 32, 32)
    image(i.spriteSheet.icon, -400, i.collY, 32, 32, 0, 0, 64, 64)
    fill(0)
    text(i.spriteSheet.name, -366, i.collY)
    text('dmg: ' + i.spriteSheet.damage, -400, i.collY + 34)
    if (i.checkHovered() && mouseIsPressed && !mouseWasPressed) {
      lootee.inventory.weapons.splice(weaponsButtons.indexOf(i), 1)
      player.inventory.weapons.push(i.spriteSheet)
    }
  }
  for (let i of apparelButtons) {
    fill(255)
    rect(-352 / 3, i.collY + 16, 32, 32)
    image(i.spriteSheet.icon, -400 / 3, i.collY, 32, 32, 0, 0, 64, 64)
    fill(0)
    text(i.spriteSheet.name, -298 / 3, i.collY)
    text('def: ' + i.spriteSheet.defense, -400 / 3, i.collY + 34)
    if (i.checkHovered() && mouseIsPressed && !mouseWasPressed) {
      lootee.inventory.apparels.splice(apparelButtons.indexOf(i), 1)
      player.inventory.apparels.push(i.spriteSheet)
    }
  }
  for (let i of usablesButtons) {
    fill(255)
    rect(448 / 3, i.collY + 16, 32, 32)
    image(i.spriteSheet.icon, 400 / 3, i.collY, 32, 32, 0, 0, 64, 64)
    fill(0)
    text(i.spriteSheet.name, 502 / 3, i.collY)
    text(i.spriteSheet.desc, 400 / 3, i.collY + 32)
    if (i.checkHovered() && mouseIsPressed && !mouseWasPressed) {
      lootee.inventory.usables.splice(usablesButtons.indexOf(i), 1)
      player.inventory.usables.push(i.spriteSheet)
    }
  }
  for (let i of scrollButts) {
    i.render()
    i.executeFunc({})
  }
  exitButton.render()
  exitButton.executeFunc({})
  pop()
}

function statsUI() {
  let wpn = player.weapon
  push()
  setCamera(uiCam)
  uiCam.setPosition(0, 0, 0)
  fill(216, 158, 99)
  rect(0, 0, 800, 400)
  fill(0)
  textSize(25)
  textAlign(LEFT, CENTER)
  text('Strength: ' + player.statBlock.str, -400, -100)
  text('Dexterity: ' + player.statBlock.dex, -400, -75)
  text('Endurance: ' + player.statBlock.end, -400, -50)
  text('Intelligence: ' + player.statBlock.int, -400, -25)
  text('Luck: ' + player.statBlock.lck, -400, 0)
  text('Vitality: ' + player.statBlock.vit, -400, 25)
  player.weapon = 0
  text('weapon 1: ' + player.damageCalc({ incLuck: false }).toFixed(1), 400 / 3, -100)
  player.weapon = 1
  text('weapon 2: ' + player.damageCalc({ incLuck: false }).toFixed(1), 400 / 3, -75)
  player.weapon = 2
  text('weapon 3: ' + player.damageCalc({ incLuck: false }).toFixed(1), 400 / 3, -50)
  player.weapon = 3
  text('weapon 4: ' + player.damageCalc({ incLuck: false }).toFixed(1), 400 / 3, -25)
  text('health: ' + Math.floor(player.hp) + '/' + Math.floor(player.maxHp), 400 / 3, 0)
  text('armour: ' + player.armour.defense, 400 / 3, 25)
  textAlign(CENTER, CENTER)
  text('xp: ' + player.xp + '/' + xpToNextLevel, 0, -100)
  text('level: ' + player.level, 0, -75)
  exitButton.render()
  exitButton.executeFunc({})
  pop()
  player.weapon = wpn
}

function loreUI() {
  let shownLore = [] //the lore being displayed
  let scrollButts = [new menuButton(-440, -215, 40, 40, 'scrollUp', upButton, 64, 64), new menuButton(-440, 140, 40, 40, 'scrollDownLore', downButton, 64, 64)]
  for (let i = 0; i < 2 && i + (invOffset * 2) < loreShown.length; i++) {
    shownLore.push(loreShown[(2 * invOffset) + i]) //put correct pages to display variable
  }
  push()
  setCamera(uiCam)
  uiCam.setPosition(0, 0, 50)
  fill(216, 158, 99)
  rect(-200, 0, 400, 400)
  fill(182, 132, 82)
  rect(200, 0, 400, 400) //draw background
  fill(0)
  text(shownLore[0], -200, 0, 400, 400) //write left page
  text(shownLore[1], 200, 0, 400, 400) //write right page
  for (let i of scrollButts) {
    i.render()
    i.executeFunc({})
  }
  exitButton.render()
  exitButton.executeFunc({})
  pop()
}

function levelUpUI() {
  let skillButtons = [
    new menuButton(-200, -112.5, 25, 25, 'strUp', upButton, 64, 64),
    new menuButton(-200, -87.5, 25, 25, 'dexUp', upButton, 64, 64),
    new menuButton(-200, -62.5, 25, 25, 'endUp', upButton, 64, 64),
    new menuButton(-200, -37.5, 25, 25, 'intUp', upButton, 64, 64),
    new menuButton(-200, -12.5, 25, 25, 'lckUp', upButton, 64, 64),
    new menuButton(-200, 12.5, 25, 25, 'vitUp', upButton, 64, 64)
  ]
  let wpn = player.weapon
  push()
  setCamera(uiCam)
  uiCam.setPosition(0, 0, 0)
  fill(216, 158, 99)
  rect(0, 0, 800, 400)
  fill(0)
  textSize(25)
  text('Level up', 0, -175)
  textAlign(LEFT, CENTER)
  text('Strength: ' + player.statBlock.str, -400, -100)
  text('Dexterity: ' + player.statBlock.dex, -400, -75)
  text('Endurance: ' + player.statBlock.end, -400, -50)
  text('Intelligence: ' + player.statBlock.int, -400, -25)
  text('Luck: ' + player.statBlock.lck, -400, 0)
  text('Vitality: ' + player.statBlock.vit, -400, 25)
  for (let i of skillButtons) {
    i.render()
    i.executeFunc({})
  }
  player.weapon = 0
  text('weapon 1: ' + player.damageCalc({ incLuck: false }).toFixed(1), 400 / 3, -100)
  player.weapon = 1
  text('weapon 2: ' + player.damageCalc({ incLuck: false }).toFixed(1), 400 / 3, -75)
  player.weapon = 2
  text('weapon 3: ' + player.damageCalc({ incLuck: false }).toFixed(1), 400 / 3, -50)
  player.weapon = 3
  text('weapon 4: ' + player.damageCalc({ incLuck: false }).toFixed(1), 400 / 3, -25)
  text('health: ' + player.hp + '/' + player.maxHp, 400 / 3, 0)
  pop()
  player.weapon = wpn
}

function hotbarUI(weapon) {
  let hotbarButts = [
    new menuButton(-404, -20, 40, 40, 'eqp1', player.hotbar[0].icon, 64, 64), new menuButton(-148, -20, 40, 40, 'eqp2', player.hotbar[1].icon, 64, 64),
    new menuButton(108, -20, 40, 40, 'eqp3', player.hotbar[2].icon, 64, 64), new menuButton(364, -20, 40, 40, 'eqp4', player.hotbar[3].icon, 64, 64)
  ]
  for (let i of hotbarButts) {
    i.render()
    i.executeFunc({ data: weapon })
  }
}

function keyPressed() {
  if (gameState == 'settings') {
    ctrlListens[changeKey] = keyCode
    changeKey = 'nullRef'
  }
}
