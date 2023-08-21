const hmat = require('../dist/@youwol/hmatrix')
const arch = require('../../../../C++/bin/arch-node')
const io   = require('@youwol/io')
const fs   = require('fs')


const filename = '/Users/fmaerten/data/arch/santos/test/all_diapirs.ts'

// -------------------------------------------

class HModel {
    constructor(filename) {
        this.model = new arch.Model()
        const surfs = io.decodeGocadTS( fs.readFileSync(filename, 'utf8') )
        surfs.forEach( surf => {
            const surface = new arch.Surface(
                surf.series.positions.array,
                surf.series.indices.array
            )
            surface.setBC('dip'   , 't', 0)
            surface.setBC('strike', 't', 0)
            surface.setBC('normal', 't', 0)
            this.model.addSurface(surface)
        })
        console.log(`model nb dof: ${this.model.nbDof()}`)
    }

    bbox() {
        const b = this.model.bounds()
        return new hmat.BBox([b[0], b[1], b[2]], [b[3], b[4], b[5]])
    }
    forEachElement(cb) {
        this.model.forEachTriangle(cb)
    }

    dof() {
        return this.model.nbDof()
    }
}

// -------------------------------------------

const model = new HModel(filename)
const h = new hmat.HSolver()
h.build({
    model,
    maxDepth: 3,
    minItems: 15,
    hmatEps: 1.2,
})
console.log(h.dump({
    cells: false,
    block: false,
    resume: true
}))

// -------------------------------------------
