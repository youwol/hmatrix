const hmat = require('../dist/@youwol/hmatrix')
const fs = require('fs')
const process = require('process')

class Item {
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

const eps = 0.2
const N = 1000
const items = new Array(N)
    .fill(undefined)
    .map((_, i) => new Item(Math.random(), Math.random()))

let B, E

const A = new hmat.Matrix(N, N)
for (let i = 0; i < N; ++i) {
    const source = items[i]
    for (let j = 0; j < N; ++j) {
        const field = items[j]
        A[i][j] = 1 - source.dist(field) ** 3
    }
}
B = process.cpuUsage()
const m = new hmat.Matrix(N, N)
E = process.cpuUsage(B)
console.log('Building a fake matrix A:', E)

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

let x1 = new hmat.Vector(N)
const ca = new hmat.ACA()
B = process.cpuUsage()
ca.build(N, N, provider, eps)
E = process.cpuUsage(B)
console.log('building aca:', E)

B = process.cpuUsage()
ca.mult(b, x1)
E = process.cpuUsage(B)
console.log('Approx solution:', E)

B = process.cpuUsage()
let x2 = new hmat.Vector(N)
{
    for (let i = 0; i < N; ++i) {
        let value = 0
        for (let j = 0; j < N; ++j) {
            value += A[i][j] * b[j]
        }
        x2[i] = value
    }
}
E = process.cpuUsage(B)
console.log('Exact solution:', E)

// let s = ''
let min = 0
let cum = 0
x1.forEach((val1, i) => {
    const val2 = x2[i]
    let percent = Math.abs((100 * (val1 - val2)) / val1)
    if (percent > min) {
        min = percent
    }
    cum += percent

    // s += i + " " + (val2.toFixed(5)+'').replace('.',',') + " " +
    //     (val1.toFixed(5)+'').replace('.',',') + " " + (percent.toFixed(5)+'').replace('.',',') + '\n'
})
//fs.writeFileSync('result.txt', s, 'utf8', err => {})

const approx = ca.rank * (ca.n + ca.m)
const mean = cum / N

console.log('mem full          :', (25000000 * 8) / 1024 / 1024, 'Mo')
console.log('mem approx        :', (approx * 8) / 1024 / 1024, 'Mo')
console.log('max percent error :', min)
console.log('mean percent error:', mean.toFixed(2))
