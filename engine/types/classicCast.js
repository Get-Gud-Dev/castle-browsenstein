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