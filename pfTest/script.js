class ai{
  constructor(x, z, path, goal, speed){
    this.x = x
    this.z = z
    this.path = path
    this.goal = goal
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

class pathNode{
  constructor(x, z, connectedNodes, id){
    this.x = x
    this.z = z
    this.connectedNodes = connectedNodes
    this.id = id
  }
}

class boundary{
  constructor(x1, z1, x2, z2){
    this.x1 = x1
    this.z1 = z1
    this.x2 = x2
    this.z2 = z2
  }
}

let grid
let walls
let ais

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

function renderWorld(){
  background(0)
  strokeWeight(3)
  stroke(255)
  for (let i of walls){
    line(i.x1, i.z1, i.x2, i.z2)
  }
  // for (let i of grid){
  //   strokeWeight(2)
  //   stroke(0, 255, 0)
  //   fill(255)
  //   for (let j of i.connectedNodes){
  //     line(i.x, i.z, grid[j].x, grid[j].z)
  //   }
  //   circle(i.x, i.z, 10)
  //   fill(0, 0, 255)
  //   text(i.id, i.x, i.z)
  // }
  for (let ai1 of ais){
    strokeWeight(2)
    stroke(0, 255, 0)
    fill(0, 0, 255)
    circle(ai1.x, ai1.z, 20)
	fill(255, 0, 0)
	noStroke()
	circle(ai1.goal[0], ai1.goal[1], 10)
  }
}

function fullPathfinding(AI){
  if (AI.goal.length == 0){ // if the AI has no goal
    finalNode = AI.chooseGoal() 
    // run goal finding algorithm (chooses goal and finds nearest node to it)
    for (let i of walls){ // override for goal with unobstructed path
      if (intersectCheck([AI.x, AI.z], AI.goal, [i.x1, i.z1], [i.x2, i.z2])){
        break
      }
      else if (i == walls[walls.length - 1]){ 
        // if no walls between AI and goal, skip pathfinding
        AI.path = [AI.goal]
      }
    }
    if (AI.path.length == 0){ // pathFinding
      AI.path.push(AI.findFirstNode()) // find first node
      AI.findPath(finalNode) // find path from there to goal's nearest node
      AI.path.push(AI.goal) // add final goal to end of instructions
    }
  }
  // if it has a path, follow it
  AI.followPath()
}

function setup(){
  createCanvas(1024, 576)
  angleMode(DEGREES)
  textSize(20)
  grid = [
    new pathNode(100, 100, [1, 2, 3], 'a'), new pathNode(200, 80, [0], 'b'), 
    new pathNode(100, 200, [0, 3, 4], 'c'), new pathNode(200, 200, [0, 2, 4, 5], 'd'), 
    new pathNode(250, 125, [3, 2, 8, 5], 'e'), new pathNode(225, 270, [3, 6, 7, 4], 'f'), new pathNode(140, 260, [5, 7], 'g'),
    new pathNode(230, 320, [5, 6], 'h'), new pathNode(330, 140, [4, 9], 'i'), new pathNode(390, 220, [8], 'j')
  ]
  walls = [
    new boundary(50, 50, 250, 50), new boundary(250, 50, 250, 100), new boundary(250, 100, 150, 125),
    new boundary(250, 100, 300, 90), new boundary(300, 200, 250, 250), new boundary(200, 250, 80, 220), new boundary(80, 220, 50, 50),
    new boundary(250, 250, 250, 300), new boundary(250, 300, 300, 325), new boundary(300, 325, 250, 350), new boundary (250, 350, 200, 340),
    new boundary(200, 340, 80, 220), new boundary(150, 125, 180, 140), new boundary(180, 140, 200, 112.5), new boundary(300, 200, 280, 150),
    new boundary(280, 150, 350, 190), new boundary(350, 190, 310, 205), new boundary(310, 205, 340, 250), new boundary(340, 250, 400, 250),
    new boundary(400, 250, 430, 210), new boundary(430, 210, 390, 160), new boundary(390, 160, 365, 160), new boundary(365, 160, 370, 100),
    new boundary(370, 100, 300, 90), new boundary(370, 100, 300, 120)
  ]
  ais = [new ai(200, 100, [], [], 4)]
  fill(255)
  stroke(255)
  background(0)
  frameRate(30)
}

function draw(){
  /** how to pathfinding:
   * choose destination coordinates
   * find the nearest node that it can be reached from
   * or choose new coords if unreachable
   * add the direction vector at end of ai.path
   * find nearest node to ai current position
   * add direction there at front of ai.path
   * run search to get rest of directions
   * store each vector of found path
   * execute
   */
  for (let i of ais){
	fullPathfinding(i)
  }
  renderWorld()
  // text(ai1.followPath(), 512, 288)
}
