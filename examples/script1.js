const hmat = require('../dist/@youwol/hmatrix')

class Item /* implements IItem */ {
    x = new hmat.Vector(2)

    constructor(x, y) {
        this.x[0] = x
        this.x[1] = y
    }

    pos() {
        return this.x
    }

    dof() {
        return 2
    }

    dist(i) {
        return Math.sqrt((this.x[0] - i.x[0]) ** 2 + (this.x[1] - i.x[1]) ** 2)
    }
}

const N = 100
const items = new Array(N)
    .fill(undefined)
    .map((_, i) => new Item(Math.random(), Math.random()))

// Building a fake matrix
const A = new hmat.Matrix(N, N)
for (let i = 0; i < N; ++i) {
    const source = items[i]
    for (let j = 0; j < N; ++j) {
        const field = items[j]
        A[i][j] = 1 - source.dist(field) ** 3
    }
}
const m = new hmat.Matrix(N, N)
const b = new hmat.Vector(N)
for (let j = 0; j < N; ++j) {
    b[j] = j
}
class MProvider {
    constructor(A) {
        this.A = A
    }
    value(i, j) {
        return this.A[i][j]
    }
}
const provider = new MProvider(A)
let x1
{
    const ca = new hmat.ACA()
    ca.build(N, N, provider, 0.1)
    x1 = new hmat.Vector(N)
    ca.mult(b, x1)
}
let x2
{
    const ca = new hmat.ACA()
    ca.build(N, N, provider, 0.001)
    x2 = new hmat.Vector(N)
    ca.mult(b, x2)
}

x1.forEach((val1, i) => {
    const val2 = x2[i]
    let diff = Math.abs((100 * (val1 - val2)) / val1)
    console.log(
        i,
        ' ',
        (val1.toFixed(5) + '').replace('.', ','),
        ' ',
        (val2.toFixed(5) + '').replace('.', ','),
        ' ',
        (diff.toFixed(5) + '').replace('.', ','),
    )
})

// ==============================

const system = new hmat.System({
    items,
    minItems: 5,
    maxDepth: 5,
})
system.build({ eps: 1.0 })

console.log(system.info())
