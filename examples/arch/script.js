const hmat = require('../../dist/@youwol/hmatrix')
const io   = require('../../../io/dist/@youwol/io')
const math = require('../../../math/dist/@youwol/math')
const fs   = require('fs')
const arch = require('/Users/fmaerten/devs/platform/components/arch-node/build/Release/arch')

const model = new arch.Model()
model.setHalfSpace(false)
model.setMaterial(0.25, 1, 2000)

const surf = io.decodeGocadTS( fs.readFileSync('./f_patched.gcd', 'utf8') )[0]
const pos = surf.series['positions']
const newPos = pos.map( p => [p[0]+5000, p[1]-100, p[2]-500] )

const s1 = new arch.Surface(pos.array, surf.series['indices'].array)
s1.setBC('dip'   , 't', 0)
s1.setBC('strike', 't', 0)
s1.setBC('normal', 't', (x,y,z) => 1 )
model.addSurface(s1)

const s2 = new arch.Surface(newPos.array, surf.series['indices'].array)
s2.setBC('dip'   , 't', 0)
s2.setBC('strike', 't', 0)
s2.setBC('normal', 't', (x,y,z) => 1 )
model.addSurface(s2)

const remote = new arch.UserRemote( (x,y,z) => [1,0,0,2,0,3] )
model.addRemote(remote)

const CORES = 10

const solver = new arch.Solver(model)
solver.select('parallel')
solver.setNbCores(CORES)
solver.setMaxIter(2000)
solver.onMessage( msg => console.log("node:", msg) )
solver.onError  ( msg => console.log("node:", msg) )
solver.onWarning( msg => console.log("node:", msg) )
solver.run()



// -----------------------------------------------

class Item {
    x = new hmat.Vector(3)
    isObs = false
    constructor(p, isObs = false) {
        this.x     = p
        this.isObs = isObs
    }
    pos() { return this.x }
    dof() { return 3 }
}

const items = []
surf.series['positions'].forEach( p => items.push(new Item(p)) )

const eps_tree = 1
const eps_ACA  = 0.2
const minItems = 10
const maxDepth = 5
//const N        = 1000

const system = new hmat.System({
    items,
    minItems, 
    maxDepth
})

system.build({eps: eps_tree})

console.log( system.info() )

system.release()