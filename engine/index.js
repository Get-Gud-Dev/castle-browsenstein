const gameLoop = require('./loop')
const Mapping = require('./mapping')
const GameState = require('./state')
const Settings = require('./settings')
const Renderer = require('./rendering/render-classic')
const util = require('./util')
const input = require('./input')

const Vector3 = require('./types/vector3')

// Load Resources


// Configure a player
GameState.setPosition(15,0,17)
GameState.setDirection(util.north)
GameState.setPixelRatio(0.5)
GameState.setEyePoint(1.85)

// Load the map
Settings.set('resolution', [72, 16])
Settings.set('fov', 70)
Settings.set('view distance', 50)
Settings.set('ray jump', 0.3)
Settings.set('debug', document.getElementById('debug'))
let temporaryMapHeader = {name:"Test map",scale:5}

let temporaryMapData = [ 
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1]
]

let temporaryRoomData = {
    ceiling:"#666666",
    floor:"#BBBBBB",
    wall:"#444466",
    
}

let temporaryMap = {header: temporaryMapHeader, data: temporaryMapData, style: temporaryRoomData}

Mapping.loadMap(temporaryMap)

input.init()
Settings.set('font size',26)

Renderer.init()


gameLoop()