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