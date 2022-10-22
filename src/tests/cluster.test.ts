import { IItem, Vector, ClusterTree } from '../lib'

class Point implements IItem {
    x = new Vector(2)
    constructor(x: number, y: number) {
        this.x[0] = x
        this.x[1] = y
    }
    pos() {
        return this.x
    }
    dof() {
        return 2
    }
}

test('testing cluster', () => {
    const N = 100
    const items = new Array(10).fill(undefined).map( (_,i) => new Point(i/(N-1), i/(N-1)))
    const tree = new ClusterTree(items)
    tree.maxDepth = 3
    tree.minItems = 10
    tree.subdivide()
    // console.log(tree)

    // ... to be continuated ...
})
