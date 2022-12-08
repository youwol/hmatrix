import { Vector } from './Vector'

/**
 * @category Math
 */
export class BBox {
    min: Vector
    max: Vector
    diameter = 0

    constructor(min: number[] = undefined, max: number[] = undefined) {
        if (min !== undefined) {
            this.min = new Vector(min)
            if (max !== undefined) {
                this.max = new Vector(max)
                if (this.max.length !== this.min.length) {
                    throw new Error('min and max are not in the same dimension')
                }
                this.update()
            }
        }
    }

    grow(v: number[]) {
        this.init(v.length)

        if (v.length !== this.min.length) {
            throw new Error('length mistmatch')
        }
        v.forEach((x, i) => {
            if (x < this.min[i]) this.min[i] = x
            if (x > this.max[i]) this.max[i] = x
        })
        this.update()
    }

    scale(s: number) {
        if (this.min !== undefined) {
            this.min = new Vector(this.min.map((x) => x * s))
            this.max = new Vector(this.max.map((x) => x * s))
            this.update()
        }
    }

    contains(v: number[]): boolean {
        this.init(v.length)
        return v.reduce(
            (cur, x, i) => cur && x >= this.min[i] && x <= this.max[i],
            true,
        )
    }

    distance(b2: BBox) {
        const dim = this.min.length
        const d = D[dim - 2]
        const c1 = [...this.min, ...this.max]
        const c2 = [...b2.min, ...b2.max]

        let L = Number.POSITIVE_INFINITY
        d.forEach((coord1) => {
            d.forEach((coord2) => {
                let l = 0
                for (let i = 0; i < dim; ++i)
                    l += (c1[coord1[i]] - c2[coord2[i]]) ** 2
                if (l < L) L = l
            })
        })

        return Math.sqrt(L)
    }

    get dim() {
        if (this.min === undefined) return undefined
        return this.min.length
    }

    get length() {
        if (this.min === undefined) return undefined
        return this.min.map((m, i) => this.max[i] - m)
    }

    get center() {
        if (this.min === undefined) return undefined
        return this.min.map((m, i) => (this.max[i] + m) / 2)
    }

    private init(n: number) {
        if (this.min === undefined) {
            this.min = new Vector(n).fill(Number.POSITIVE_INFINITY)
            this.max = new Vector(n).fill(Number.NEGATIVE_INFINITY)
        }
    }

    private update() {
        this.diameter = new Vector(this.length).norm() //this.min.sub(this.max).norm()
    }
}

const D = [
    [
        [0, 1],
        [0, 3],
        [2, 1],
        [2, 3],
    ],
    [
        [0, 1, 2],
        [0, 1, 5],
        [0, 4, 2],
        [0, 4, 5],
        [3, 1, 2],
        [3, 1, 5],
        [3, 4, 2],
        [3, 4, 5],
    ],
]
