/**
 * @category Math
 */
export class Vector extends Array<number> {
    constructor(size: number | number[]) {
        super()
        if (Vector.isArray(size)) {
            size.forEach((v) => Array.prototype.push.call(this, v))
        } else {
            for (let i = 0; i < size; ++i) {
                Array.prototype.push.call(this, 0)
            }
        }
    }

    get size() {
        return this.length
    }

    set(value: number | number[]): Vector {
        if (Array.isArray(value)) {
            for (let i = 0; i < this.length; ++i) {
                this[i] = value[i]
            }
        } else if (typeof value === 'number') {
            for (let i = 0; i < this.length; ++i) {
                this[i] = value
            }
        }
        return this
    }

    add(value: number | number[]): Vector {
        if (Array.isArray(value)) {
            for (let i = 0; i < this.length; ++i) {
                this[i] += value[i]
            }
        } else if (typeof value === 'number') {
            for (let i = 0; i < this.length; ++i) {
                this[i] += value
            }
        }
        return this
    }

    sub(value: number | number[]): Vector {
        const self = this.clone()
        if (Array.isArray(value)) {
            for (let i = 0; i < self.length; ++i) {
                self[i] -= value[i]
            }
        } else if (typeof value === 'number') {
            for (let i = 0; i < self.length; ++i) {
                self[i] -= value
            }
        }
        return self
    }

    scale(value: number | number[]): Vector {
        const self = this.clone()
        if (Array.isArray(value)) {
            for (let i = 0; i < self.length; ++i) {
                self[i] *= value[i]
            }
        } else if (typeof value === 'number') {
            for (let i = 0; i < self.length; ++i) {
                self[i] *= value
            }
        }
        return self
    }

    norm2(): number {
        return this.reduce((acc, value) => acc + value ** 2, 0)
    }

    norm(): number {
        return Math.sqrt(this.norm2())
    }

    normalize(): Vector {
        const l = this.norm()
        for (let i = 0; i < this.length; ++i) {
            this[i] /= l
        }
        return this
    }

    normalized(): Vector {
        return this.clone().normalize()
    }

    clone(): Vector {
        return new Vector(this)
    }

    // --> Forbidden
    push(..._items: number[]): number {
        throw new Error(
            `Cannot push items in Vec because of the fixed size (here ${this.length})`,
        )
    }

    pop(): number {
        throw new Error(
            `Cannot pop in Vec because of the fixed size (here ${this.length})`,
        )
    }

    shift(): number {
        throw new Error(
            `Cannot shift in Vec because of the fixed size (here ${this.length})`,
        )
    }

    unshift(): number {
        throw new Error(
            `Cannot unshift in Vec because of the fixed size (here ${this.length})`,
        )
    }
    splice(
        _start: number,
        _deleteCount?: number,
        ..._items: number[]
    ): number[] {
        throw new Error(
            `Cannot splice in Vec because of the fixed size (here ${this.length})`,
        )
    }
}
