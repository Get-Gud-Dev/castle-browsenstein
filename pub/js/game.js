(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const input = require('../input')
const state = require('../state')
const util = require('../util')
const mapping = require('../mapping')

const Vector3 = require('../types/vector3')

var velocity = new Vector3(0,0,0)

module.exports.applyMotion = (delta) => {
    let inputState = input.getState()
    
    //let normal = util.getNormal(state.getDirection())
    state.setDirection(state.getDirection() + (0.01 * inputState.delta_mouse_x))

    velocity.x *= Math.min(1 - Math.abs(inputState.delta_mouse_x * 0.1), 0.6 )
    velocity.z *= Math.min(1- Math.abs(inputState.delta_mouse_x * 0.1), 0.6 )

    // 2d normal of the player's direction
    let normal2d = util.getNormal(state.getDirection())
    let rightNormal2d = util.getNormal(state.getDirection() - (Math.PI/2) )
    //The player's position
    let position = state.getPosition()
        let inputVectorX
        let inputVectorZ
        
        if(inputState.horizontal != 0 && inputState.vertical != 0)
        {
            inputVectorX = 0.70710678119 * Math.sign(inputState.horizontal)
            inputVectorZ = 0.70710678119 * Math.sign(inputState.vertical)
        }
        else if(inputState.horizontal == 0 && inputState.vertical == 0){
            velocity.x = 0
            velocity.z = 0
            inputVectorZ = 0
            inputVectorX = 0
        }
        else
        {
            inputVectorX = inputState.horizontal
            inputVectorZ = inputState.vertical
        }
        let HVectorX = rightNormal2d.x * inputVectorX
        let HVectorZ = rightNormal2d.y * inputVectorX

        let VVectorX = normal2d.x * inputVectorZ
        let VVectorZ = normal2d.y * inputVectorZ

        let projectedHXV = (HVectorX * state.getRunSpeed() * delta/1000)
        let projectedHZV = (HVectorZ * state.getRunSpeed() * delta/1000)
        let projectedVXV = (VVectorX * state.getRunSpeed() * delta/1000)
        let projectedVZV = (VVectorZ * state.getRunSpeed() * delta/1000)


        let squareMag = ( (velocity.x + projectedHXV + projectedVXV) ** 2 ) + ((velocity.z + projectedHZV + projectedVZV ) ** 2)
        if(  Math.sqrt(squareMag) <= state.getMaxSpeed() * delta/1000){
            velocity.x += projectedHXV + projectedVXV
            velocity.z += projectedHZV + projectedVZV
        }


        // 

        


    
    let targetX = position.x + velocity.x
    let targetY = position.y
    let targetZ = position.z + velocity.z

    if(!mapping.collisionCheck(targetX, targetZ, position)){
        state.setPosition(targetX, targetY, targetZ )

    }

}
},{"../input":3,"../mapping":5,"../state":8,"../types/vector3":11,"../util":12}],2:[function(require,module,exports){
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
},{"./input":3,"./loop":4,"./mapping":5,"./rendering/render-classic":6,"./settings":7,"./state":8,"./types/vector3":11,"./util":12}],3:[function(require,module,exports){
const state = require('../state')
const util = require('../util')

var inputState = {
    vertical:0,
    horizontal:0,
    mouse_x:0,
    mouse_y:0,
    last_mouse_x:0,
    last_mouse_y:0,
    delta_mouse_x:0,
    delta_mouse_y:0,
}

var timer

module.exports.getState = () => {
    return inputState
}

module.exports.init = () => {

document.addEventListener('keydown', keyDown)

function keyDown(e) {
    if(e.code == 'KeyW'){
        inputState.vertical = 1
    }
    if(e.code == 'KeyS'){
        inputState.vertical = -1
    }
    if(e.code == 'KeyA'){
        inputState.horizontal = 1
    }
    if(e.code == 'KeyD'){
        inputState.horizontal = -1
    }
}

document.addEventListener('keyup', keyUp)
    function keyUp(e) {
        if(e.code == 'KeyW'){
                inputState.vertical = 0
        }
        if(e.code == 'KeyS'){
                inputState.vertical = 0
        }
        if(e.code == 'KeyA'){
                inputState.horizontal = 0
        }
        if(e.code == 'KeyD'){
                inputState.horizontal = 0
        }
    }

    document.addEventListener("mousemove", function(ev){
        inputState.last_mouse_x = inputState.mouse_x
        inputState.last_mouse_y = inputState.mouse_y

        inputState.mouse_x = ev.screenX
        inputState.mouse_y = ev.screenY

        inputState.delta_mouse_x = inputState.mouse_x - inputState.last_mouse_x
        inputState.delta_mouse_y = inputState.mouse_y - inputState.last_mouse_y

        clearTimeout(timer)
        timer=setTimeout(mouseStopped,30)

    }, false);

    function mouseStopped(){
        inputState.last_mouse_x = inputState.mouse_x
        inputState.last_mouse_y = inputState.mouse_y

        inputState.delta_mouse_x = inputState.mouse_x - inputState.last_mouse_x
        inputState.delta_mouse_y = inputState.mouse_y - inputState.last_mouse_y        
    }
}

},{"../state":8,"../util":12}],4:[function(require,module,exports){
var request
const state = require('./state')
const mapping =  require('./mapping')
const rendering = require('./rendering/render-classic')
const settings = require ('./settings')
const inputs = require('./input')
const control = require('./control')
const util = require('./util')

const ClassicCast = require('./types/classicCast')


var framer = 0

var lastFrame

module.exports = () => {


    const performAnimation = (timestamp) => {
        let delta = timestamp - lastFrame

        request = requestAnimationFrame(performAnimation)
        if(framer == 0){
            framer++ 
        }else{
            control.applyMotion(delta)

            //Get player position from local state
            let position = state.getPosition()
            let orientation = state.getDirection()
            //Get the number of rays to cast from the settings
            //Get the field of view to determine what our range of angles are
            let reso = settings.get('resolution')
            let fov = settings.get('fov')
            let viewDist = settings.get('view distance')
    
            //One half of the FOV in radians - used to add and subtract from player orientation
            let halfFov = fov/2
    
            //Lower and upper angles that we scan between
            let lowerAngle = orientation - halfFov
            let upperAngle = orientation + halfFov

  
            //Retrieve the angle that is going to be scanned
            function getAngle(i){
                return (((upperAngle - lowerAngle) / reso[0]) * i ) + lowerAngle
            }
    
            let hits = []
    
            for(var i = 0; i < reso[0]; i++){
                colData = ClassicCast(position, getAngle(i), viewDist)
                
                rendering.renderColumn(i, colData)
            }
            
            framer++
            if(framer > 1000)
                framer = 0
            lastFrame = timestamp
        }
    }
    
    requestAnimationFrame(performAnimation)
}
},{"./control":1,"./input":3,"./mapping":5,"./rendering/render-classic":6,"./settings":7,"./state":8,"./types/classicCast":9,"./util":12}],5:[function(require,module,exports){
const Raycast = require('../types/columnCast')
const util = require('../util')
const State = require('../state')
const settings = require('../settings')

var mapLoaded = false

var mapHeader
var blockData
var heightMap
var mapCharacters
var mapEntities

/**Loads a map into memory for the game engine to calculate against
 * 
 */
module.exports.loadMap = (data) => {
    mapHeader = data.header
    heightMap = data.data
    blockData = data.style
    mapLoaded = true
}

module.exports.mapScale = () => {return blockData.scale}

module.exports.wall = () => {return blockData.wall}
module.exports.floor = () => {return blockData.floor}
module.exports.ceiling = () => {return blockData.ceiling}


module.exports.checkForCharacterHit = (x, y) => {
    for(var characterIndex in chars)
    {
        let char = chars[characterIndex]
        if(pointInCircle( char.position[0], char.position[1], 0.75, x, y ))
        {
            return char
        }
    }
}


module.exports.checkForHit = (x, y) =>{
    //first see if we hit any objects
    let roundedCoordinates = [Math.floor(x/mapHeader.scale), Math.floor(y/mapHeader.scale)]

    if(heightMap[roundedCoordinates[0]] != null){
        let blockValue = heightMap[roundedCoordinates[0]][roundedCoordinates[1]]
        
        return blockValue

    }
    else return null
}

module.exports.collisionCheck = (x, y) => {
    let position = State.getPosition()
    
    let oldBlock = [Math.floor(position.x/mapHeader.scale), Math.floor(position.z/mapHeader.scale)]

    let roundedCoordinates = [Math.floor(x/mapHeader.scale), Math.floor(y/mapHeader.scale)]



    if(oldBlock[0] == roundedCoordinates[0] && oldBlock[1] == roundedCoordinates[1])
        return false
    else{
        let blockValue = heightMap[roundedCoordinates[0]][roundedCoordinates[1]]
        if(blockValue == 0)
            return false
        
        else
            return true
    }

    
}

module.exports.getGroundLevel = (position) => {
    return 0
}

function pointInCircle(cX, cY, radius, x, y) {
    let squareDistance = (cX - x) ** 2 + (cY - y) ** 2
    return squareDistance <= radius ** 2
}
},{"../settings":7,"../state":8,"../types/columnCast":10,"../util":12}],6:[function(require,module,exports){
const settings = require('../settings')
const util = require('../util')
const mapping = require('../mapping')

let Renderer = require('retro-render')
const sprites = require('retro-render/src/sprite')
 
var gameRenderer

var monsters = {
    zombie:null
}

var weapons = {
    pumpshot:null
}

var pickups = null

module.exports.init = () => {
    let resolution = settings.get('resolution')

    gameRenderer = Renderer.new('game')
    gameRenderer.generateScreen(resolution[0], resolution[1])

    
    //Zombie Sprite an animation registration
    sprites.register([16,32],[8,5],'../img/zombie.png', (id) =>{
        monsters.zombie = id
        //Idle animations for Zombie
        sprites.defineAnimation(monsters.zombie, "IdleF", [], 4, true)
        sprites.defineAnimation(monsters.zombie, "IdleB", [], 4, true)
        sprites.defineAnimation(monsters.zombie, "IdleL", [], 4, true)
        sprites.defineAnimation(monsters.zombie, "IdleR", [], 4, true)

        //Walk animations for Zombie
        sprites.defineAnimation(monsters.zombie, "WalkF", [], 4, true)
        sprites.defineAnimation(monsters.zombie, "WalkB", [], 4, true)
        sprites.defineAnimation(monsters.zombie, "WalkL", [], 4, true)
        sprites.defineAnimation(monsters.zombie, "WalkR", [], 4, true)

        //Attack animations for Zombie
        sprites.defineAnimation(monsters.zombie, "MeleeF", [], 4, false)
        sprites.defineAnimation(monsters.zombie, "MeleeB", [], 4, false)
        sprites.defineAnimation(monsters.zombie, "MeleeL", [], 4, false)
        sprites.defineAnimation(monsters.zombie, "MeleeR", [], 4, false)

        //Death animations for Zombie
        sprites.defineAnimation(monsters.zombie, "DeathF", [], 4, false)
        sprites.defineAnimation(monsters.zombie, "DeathB", [], 4, false)
        sprites.defineAnimation(monsters.zombie, "DeathL", [], 4, false)
        sprites.defineAnimation(monsters.zombie, "DeathR", [], 4, false)

    })

    sprites.register([64,64],[3,4],'../img/pumpshot.png', (id) => {
        weapons.pumpshot = id

        sprites.defineAnimation(weapons.pumpshot, "Fire", [3,4,5,6,7,8,9,10,11], 4, true )
        sprites.defineAnimation(weapons.pumpshot, "Idle", [0], 4, true )
        sprites.defineAnimation(weapons.pumpshot, "Walk", [0], 4, true )
        sprites.defineAnimation(weapons.pumpshot, "TurnL", [1], 4, true )
        sprites.defineAnimation(weapons.pumpshot, "TurnR", [2], 4, true )
    })

    sprites.register([16,16],[3,3],'../img/items.png', (id) => {
        pickups = id

        sprites.defineAnimation(pickups, "Bandage", [], 0, false)
        sprites.defineAnimation(pickups, "Toilet Paper", [], 0, false)
    })
}

module.exports.renderColumn = (column, columnData) => {
    let resolution = settings.get('resolution')

    let wallHeight = Math.max(0, Math.floor( ((resolution[1])/columnData) ))  


    for (let i = 0; i < (resolution[1]/2); i++) {
        const pixel = gameRenderer.screen.columnPixels[column][i].firstChild
        const farPixel = gameRenderer.screen.columnPixels[column][resolution[1] - 1 - i ].firstChild

        pixel.style.color = "#FFFFFF"
        farPixel.style.color = "#FFFFFF"

        if(i >= (Math.floor(resolution[1]/2) - wallHeight) ){
            pixel.style.color = util.changeColor(mapping.wall(),  -(Math.min(51,columnData ** 2)))
            farPixel.style.color = util.changeColor( mapping.wall(), -(Math.min(51,columnData ** 2)))
        }
        else if(i == Math.floor(resolution[1]/2) - 1 && wallHeight ==0){         
            pixel.style.color = util.changeColor(mapping.wall(),  -(Math.min(51,columnData ** 2)))
            farPixel.style.color = util.changeColor(mapping.floor(), -(35 * (2 * i))/resolution[1])
        }
        else
        {
            farPixel.style.color = util.changeColor(mapping.floor(), -(35 * (2 * i))/resolution[1])
            pixel.style.color = util.changeColor(mapping.ceiling(), -(35 * (2 * i))/resolution[1])

        }


        
    }
}
},{"../mapping":5,"../settings":7,"../util":12,"retro-render":13,"retro-render/src/sprite":14}],7:[function(require,module,exports){
const Utility = require('../util')
const state = require('../state')
var settings = {}
var game = document.getElementById('game')
module.exports.load = () => {

}

module.exports.set = (key, value) =>{
    switch(key){
        case 'view distance':
            settings[key] = value
        case 'resolution':
            settings[key] = value
            state.setBlockScales()
        break;
        case 'font size':
            game.style.fontSize = value
            game.style.width = 
            document.documentElement.style.setProperty('--pixel-height', value +'px')
            document.documentElement.style.setProperty('--pixel-width', value * state.getPixelRatio() + 'px')
            document.documentElement.style.setProperty('--window-width',settings['resolution'][0] * value * state.getPixelRatio() + 'px')
        break;
        case "fov":
            settings[key] = Utility.degreesToRadians(value)
            state.setBlockScales()
        break;
        default:
            settings[key] = value
        break;
    }
}

module.exports.get = (key) => {
    return settings[key]
}
},{"../state":8,"../util":12}],8:[function(require,module,exports){
const Vector3 = require('../types/vector3')
const settings = require('../settings')
const mapping = require('../mapping')

var playerState = {
    position:new Vector3(0,0,0),
    orientation:null,
    eyepoint:0,
    pixelRatio:null,
    grounded: true,

    runSpeed:2,
    maxSpeed:5,
    stepHeight:0.6,

    rayDistances:[],

    eyeCoordinate:0,

    blockScale:[0,0]
}

var characters = []
var items


module.exports.load = (data) => {

}

module.exports.getEyePoint = () => {
    return playerState.eyepoint
}

module.exports.getEyeCoordinate = () => {
    return playerState.eyeCoordinate
}

module.exports.setGrounded = (value) => {
    playerState.grounded = value
}

module.exports.isGrounded = () => {
    return playerState.grounded
}

module.exports.setEyePoint = (value) => {
    playerState.eyepoint = value
    setEyeCoordinate()
}

module.exports.getPosition = () => {
    return playerState.position
}

module.exports.setPosition = (x, y, z) => {
    playerState.position.x = x
    playerState.position.y = y
    playerState.position.z = z
    setEyeCoordinate()
    updateGroundPoint()
}

function updateGroundPoint(){
    playerState.groundLevel = mapping.getGroundLevel(playerState.position)
    
}

module.exports.getGroundLevel = () => {
    return playerState.groundLevel
}

function setEyeCoordinate(){
    if(playerState.position != null && playerState.eyepoint != null){

        playerState.eyeCoordinate = playerState.eyepoint + playerState.position.y
    }

}

module.exports.setBlockScales = () => {
    let res = settings.get('resolution')
    if(res == null)
        return

    
    let calibrationDistance = playerState.eyepoint

    let yScale = calibrationDistance / (res[1]/2)
    
    playerState.blockScale = yScale
}

module.exports.getBlockScale = () => {
    return playerState.blockScale
}

module.exports.addCharacter = ( character ) => {
    characters.push( character )
}

module.exports.getCharacters = ( ) => {
    return characters
}

module.exports.setDirection = (orientation) => {
    playerState.orientation = orientation
}

module.exports.getDirection = () => {
    return playerState.orientation
}

module.exports.setPixelRatio = (data) => {
    playerState.pixelRatio = data
    module.exports.setBlockScales()
}

module.exports.getPixelRatio = () => {
    return playerState.pixelRatio
}

module.exports.getRunSpeed = () => {
    return playerState.runSpeed
}

module.exports.getMaxSpeed = () => {
    return playerState.maxSpeed
}

module.exports.getStepHeight = () => {
    return playerState.stepHeight
}

module.exports.setStepHeight = (data) => {
    playerState.stepHeight = data
}


},{"../mapping":5,"../settings":7,"../types/vector3":11}],9:[function(require,module,exports){
const Mapping = require('../mapping')
const Settings = require('../settings')


module.exports = (position, direction, length) => {
    let culled = false
    let distance = 0.001

    let v = util.getNormal(direction)

    let hitList = []
    let hitDistances = []

    while(distance <= length || !culled)
    {
        let rayX = position.x + (distance * v.x)
        let rayY = position.z + (distance * v.y)
        
        let blockHit = Mapping.checkForHit(rayX, rayY)
        

        if(blockHit == null)
            culled = true
        else if(blockHit == 1)
        {
            
            return distance
        }
        distance += Settings.get('ray jump')
    }

    if(distance >= length){
        return distance
    }

}
},{"../mapping":5,"../settings":7}],10:[function(require,module,exports){
const Mapping = require('../mapping')
const Settings = require('../settings')
const state = require('../state')
 util = require('../util')

module.exports = (position, direction, length) => {
    let culled = false
    let distance = 1

    let v = util.getNormal(direction)

    /** What is the cast stack? 
     * 
     * A cast stack is a list of objects that a ray hits, sorted
     * front to back.
     * 
     * The ray casts out until it hits a space the player can't see into
     * or until it reaches the end of its allowable distance. It then reports
     * returns an array of elements it passed through.
     */
    let blockStack = []
    let characterStack = []

    let lastBlockHit
    let lastCharHit

    while(distance <= length || !culled)
    {
        let rayX = position.x + (distance * v.x)
        let rayY = position.z + (distance * v.y)

        let charHit = null // Mapping.checkForCharacterHit(rayX, rayY)
        let blockHit = Mapping.heightMapPoint(rayX, rayY)
        distance += Settings.get('ray jump')

        if(charHit != null)
        {
            if(charHit.id != lastCharHit.id)
                characterStack.unshift({hit:charHit, distance:distance})
        }

        if(blockHit == null)
        {
            culled = true
        }
        else
        {
            blockStack.push(blockHit)
        }
        lastCharHit = charHit
        lastBlockHit = blockHit
    }
    return blockStack
}
},{"../mapping":5,"../settings":7,"../state":8,"../util":12}],11:[function(require,module,exports){
module.exports = function(x, y, z) {
    this.x = x
    this.y = y
    this.z = z
    
    this.length = () => {
        return Math.sqrt(this.x**2 + this.y**2 + this.z**2) 
    }

    this.multiply = (val) => {
        this.x = this.x*val
        this.y = this.y*val
        this.z = this.z*val
        return this
    }

    this.normalized = () => {
        let length = this.length()
        this.x = this.x / length
        this.y = this.y / length
        this.z = this.z / length
        return this
    }
    
}
},{}],12:[function(require,module,exports){
module.exports.degreesToRadians = (deg) => {

    return (deg * Math.PI)/180
}

module.exports.north = this.degreesToRadians(90)

module.exports.west = this.degreesToRadians(180)

module.exports.south = this.degreesToRadians(270)

module.exports.east = this.degreesToRadians(0)

module.exports.calculateApparentSize = (normalSize, distance) => {
    return normalSize / distance
}

module.exports.getNormal = (direction) => {
    let v = {}
    v.x = Math.cos(direction)
    v.y = Math.sin(direction)
    return v
}

module.exports.changeColor = (col, amt) => {
  
    var usePound = false;
  
    if (col[0] == "#") {
        col = col.slice(1);
        usePound = true;
    }
 
    var num = parseInt(col,16);
 
    var r = (num >> 16) + amt;
 
    if (r > 255) r = 255;
    else if  (r < 0) r = 0;
 
    var b = ((num >> 8) & 0x00FF) + amt;
 
    if (b > 255) b = 255;
    else if  (b < 0) b = 0;
 
    var g = (num & 0x0000FF) + amt;
 
    if (g > 255) g = 255;
    else if (g < 0) g = 0;
 
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
  
}
},{}],13:[function(require,module,exports){
const tags = require('./tags')

module.exports.sprite = require('./src/sprite')

module.exports.new = function(tagName) {
    this.viewport = document.getElementById(tagName)

    this.screen = {
        columnCount: 0,
        rowCount: 0,

        columnPixels: [],
        rowPixels: [],
        rows: [],

        matrix: [[]]
    }

    /** Generate a pixel array to draw on
     * 
     */
    this.generateScreen = (resolutionX, resolutionY, options) => {

        this.viewport.innerHTML = ""

        this.screen.columnCount = resolutionX
        this.screen.rowCount = resolutionY

        let totalScreenPixels = resolutionY * resolutionX

        for (let i = 0; i < totalScreenPixels; i++) {

            let column = i % resolutionX
            let row = Math.floor(i / resolutionX)
            
            //While establishing the first row of pixels
            //create a new array for each column both in
            //the columns and the matrix
            if (row == 0){
                this.screen.columnPixels[column] = []
                this.screen.matrix.push([])
            }

            //While establishing the first column on every row
            if (column == 0) {
                //Create a new list for that row's pixels
                this.screen.rowPixels[row] = []

                //Generate the row tag and add it to the rows
                //set
                let newRow = tags.row()
                this.screen.rows.push(newRow)

                //Add the new row to viewport
                this.viewport.appendChild(newRow)
            }

            //Create a new Pixel, initialize it with a block
            let pixelContainer =  tags.pixel()
            let pixel = pixelContainer.childNodes[0]
            
            pixel.innerHTML = '█'

            //Screen Housekeeping
            this.screen.columnPixels[column].push(pixelContainer)
            this.screen.rowPixels[row].push(pixelContainer)
            this.screen.matrix[column][row] = pixelContainer

            //Add the pixel to the screen
            this.screen.rows[row].appendChild(pixelContainer)

            if(options == null || options.useSubPixels == true){
                let newSubPixel = tags.subPixel()
                pixelContainer.appendChild(newSubPixel)
            }

        }

    }



    return this
}
},{"./src/sprite":14,"./tags":15}],14:[function(require,module,exports){
var spriteIndex = []

var loadedSprites = []
var activeSprites = []

module.exports.register = function(tileSize, atlasDimensions, src, callback){
    

    let newSprite = {
        image: new Image(),
        tileSize: tileSize,
        atlasDimensions: atlasDimensions,
        frames:[],
        animations:{}
    }

    newSprite.image.src = src
    newSprite.image.onload = function(){
        let id = spriteIndex.push(newSprite)
        for (let i = 0; i < atlasDimensions[0] * atlasDimensions[1]; i++) {
            newSprite.frames.push(calculateFrameBounds(tileSize, atlasDimensions, i))
        }
        callback(id - 1)
    }
    
}

module.exports.defineAnimation = (sprite, animationName, animationFrames, frameRate, looping) => {
    
    spriteIndex[sprite].animations[animationName] = {
        frameRate:frameRate,
        looping:looping,
        frames:animationFrames
    }
}

module.exports.create = function(id, parent) {
    let sprite = spriteIndex[id]
    
    this.id = loadedSprites.push(this)

    if(sprite == null){
        console.log("Couldn't find sprite with id"  +  id)
        return
    }
    
    let newCanvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')

    this.timeline = {
        frameRate: 5,
        playing: 0,
        currentFrame: 0,
        currentAnimation: null,
        lastFrameTime: null
    }
    
    this.canvas = newCanvas
    this.context =  ctx

    function drawFrame ( frameNumber ){
        let frame = this.frames[frameNumber]
        this.context.drawImage(sprite.image, frame[0], frame[1], frame[2], frame[3], frame[4], frame[5], frame[6], frame[7], frame[8] )
    }

    this.play = (animation, frameNumber) => {
        frameNumber = frameNumber || 0
        //set the frame to the first frame
        if( frame < 0 || frameNumber >= sprite.animations[animation].length )
        {
            frameNumber = Math.abs(frame%sprite.animations[animation.length])
        }
        
        

        this.timeline.playing = true
        this.timeline.lastFrameTime = performance.now()
        this.timeline.currentAnimation = sprite.animations[animation]
        this.timeline.currentFrame = frameNumber

        let frame = sprite.animations[frameNumber]
        drawFrame(frame)
        
    }

    this.update = () => {
        if(this.timeline.playing)
        {
            let delta = performance.now() - this.timeline.lastFrameTime

            if(delta/1000 >= 60/this.timeline.frameRate ){
                this.timeline.currentFrame += 1
                drawFrame( this.timeline.currentAnimation[this.timeline.currentFrame] )
                this.timeline.lastFrameTime = performance.now()
            }

        }
    }

    this.setActive = (status) => {
        
        activeSprites = activeSprites.filter
        
        if(status){
            this.canvas.style.display = 'block'
            activeSprites.push(this)

        }
        else{
            this.canvas.style.display = 'none'
            activeSprites = activeSprites.filter(sprite => sprite.id == this.id)
        }


    }

    this.setPosition = (x, y, o) =>{
        if( o == null){
            // By default we go by screen coordinates to the top left
            
        }
    }

    this.setScale = (w, h) => {

    }


    return this
}

function calculateFrameBounds(tileSize, atlasDimensions, number) {

    let row = Math.floor(number / atlasDimensions[0])
    let column = Math.floor(number%atlasDimensions[1])

    let sx = column * tileSize[0]
    let sy = row * tileSize[1]

    let sWidth = tileSize[0]
    let sHeight = tileSize[1]

    let dx = 0
    let dy = 0

    let dWidth = tileSize
    let dHeight = tileSize
    

    return [sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight]
  }
},{}],15:[function(require,module,exports){
module.exports.row = () => {
    let newRow = document.createElement('span')
    newRow.classList.add('row')

    return newRow
}

module.exports.pixel = () => {
    let newPixelContainer = document.createElement('span')
    newPixelContainer.classList.add('pixel-container')

    let newPixel = document.createElement('span')
    newPixel.classList.add('pixel')

    newPixelContainer.appendChild(newPixel)

    return newPixelContainer
}

module.exports.subPixel = () => {
    let newSubPixelContainer = document.createElement('span')
    newSubPixelContainer.classList.add('subpixel-container')

    let subPixel0 = document.createElement('span')
    let subPixel1 = document.createElement('span')
    let subPixel2 = document.createElement('span')
    let subPixel3 = document.createElement('span')

    subPixel0.classList.add('subpixel')
    subPixel1.classList.add('subpixel')
    subPixel2.classList.add('subpixel')
    subPixel3.classList.add('subpixel')

    subPixel0.classList.add('subpixel0')
    subPixel1.classList.add('subpixel1')
    subPixel2.classList.add('subpixel2')
    subPixel3.classList.add('subpixel3')

    newSubPixelContainer.appendChild(subPixel0)
    newSubPixelContainer.appendChild(subPixel1)
    newSubPixelContainer.appendChild(subPixel2)
    newSubPixelContainer.appendChild(subPixel3)

    return newSubPixelContainer
}
},{}]},{},[2]);
