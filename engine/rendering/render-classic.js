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