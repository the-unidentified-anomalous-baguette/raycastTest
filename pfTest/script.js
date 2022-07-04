class ai{
  constructor(x, z, path, goal){
    this.x = x
    this.z = z
    this.path = path
    this.goal = goal
  }

  chooseGoal(){
    let foundGoal = false
    while (foundGoal == false){
      let nodes = []
      this.goal = [random(50, 300), random(50, 350)]
      for (let i of grid){
        nodes.push([i, dist(i.x, i.z, this.goal[0], this.goal[1])])
      }
      nodes.sort(sortFunction)
      while (nodes.length >= 1){
        for (let i of walls){
          if (intersectCheck([nodes[0][0].x, nodes[0][0].z], this.goal, [i.x1, i.z1], [i.x2, i.z2])){
            nodes.shift()
            break
          }
          else if (i == walls[walls.length - 1]){
            return nodes[0][0]
          }
        }
      }
    }
  }

  findFirstNode(){
    let nodes = []
    for (let i of grid){
      nodes.push([i, dist(this.x, this.z, i.x, i.z)])
    }
    nodes.sort(sortFunction)
    for (let i of walls){
      if (intersectCheck([this.x, this.z], [nodes[0][0].x, nodes[0][0].z], [i.x1, i.z1], [i.x2, i.z2])){
        nodes.shift()
        break
      }
      else {
        return nodes[0][0]
      }
    }
  }

  findPath(dest){
    let paths = [[[this.path[0]]]]
    let pathFound = 0
    let whichNode = 0
    let pathNodes = []
    let onDupe = false
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
let ai1

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
  for (let i of grid){
    strokeWeight(2)
    stroke(0, 255, 0)
    fill(255)
    for (let j of i.connectedNodes){
      line(i.x, i.z, grid[j].x, grid[j].z)
    }
    circle(i.x, i.z, 10)
    fill(0, 0, 255)
    text(i.id, i.x, i.z)
  }
  circle(ai1.x, ai1.z, 20)
  fill(255, 0, 0)
  noStroke()
  circle(ai1.goal[0], ai1.goal[1], 10)
}

function fullPathfinding(AI){
  if (AI.goal.length == 0){
    finalNode = AI.chooseGoal()
    AI.path.push(AI.findFirstNode())
    //AI.findPath(finalNode)
    console.log(AI.path[0])
  }
}

function setup(){
  createCanvas(1024, 576)
  angleMode(DEGREES)
  textSize(20)
  grid = [
    new pathNode(100, 100, [1, 2, 3], 'a'), new pathNode(200, 80, [0], 'b'), 
    new pathNode(100, 200, [0, 3, 4], 'c'), new pathNode(200, 200, [0, 2, 4, 5], 'd'), 
    new pathNode(250, 125, [3, 2], 'e'), new pathNode(225, 270, [3, 6, 7], 'f'), new pathNode(140, 260, [5, 7], 'g'),
    new pathNode(230, 320, [5, 6], 'h')
  ]
  walls = [
    new boundary(50, 50, 250, 50), new boundary(250, 50, 250, 100), new boundary(250, 100, 150, 125),
    new boundary(250, 100, 300, 200), new boundary(300, 200, 250, 250), new boundary(200, 250, 80, 220), new boundary(80, 220, 50, 50),
    new boundary(250, 250, 250, 300), new boundary(250, 300, 300, 325), new boundary(300, 325, 250, 350), new boundary (250, 350, 200, 340),
    new boundary(200, 340, 80, 220), new boundary(150, 125, 180, 140), new boundary(180, 140, 200, 112.5)
  ]
  ai1 = new ai(52, 52, [], [])
  fill(255)
  stroke(255)
  background(0)
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
  fullPathfinding(ai1)
  renderWorld()
}