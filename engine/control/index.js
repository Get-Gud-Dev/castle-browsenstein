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