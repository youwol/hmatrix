import { BBox } from './math/BBox'
import { Cluster } from './Cluster'
import { IItem } from './interfaces/IItem'

/**
 * @category H-Matrix
 */
export class ClusterTree {
    private maxDepth_ = 5
    private minItems_ = 10
    private root_: Cluster = undefined

    constructor(items: IItem[]) {
        this.root_ = new Cluster(items, 0)
    }

    get minItems() {
        return this.minItems_
    }
    get maxDepth() {
        return this.maxDepth_
    }
    get root() {
        return this.root_
    }

    visit(cb: Function, ...args) {
        this.root_.visit(cb, ...args)
    }

    set maxDepth(depth) {
        this.maxDepth_ = depth
    }

    set minItems(min) {
        this.minItems_ = min
    }

    subdivide() {
        this.subdivideCluster(this.root_, 0)
    }

    private subdivideCluster(c: Cluster, parentLevel: number) {
        if (parentLevel + 1 > this.maxDepth) {
            return
        }
        if (c.items.length <= this.minItems) {
            return
        }

        let id = 0,
            L = 0
        c.bbox.length.forEach((l, i) => {
            if (l > L) {
                L = l
                id = i
            }
        })

        let min = [...c.bbox.min]
        let max = [...c.bbox.max]
        max[id] += 0.5 * (min[id] - max[id])
        const b1 = new BBox(min, max)

        const i1: IItem[] = []
        const i2: IItem[] = []
        c.items.forEach((i) => (b1.contains(i.pos()) ? i1.push(i) : i2.push(i)))

        const c1 = new Cluster(i1, parentLevel + 1)
        const c2 = new Cluster(i2, parentLevel + 1)
        c.sons.push(c1)
        c.sons.push(c2)
        c.clearItems()
        this.subdivideCluster(c1, parentLevel + 1)
        this.subdivideCluster(c2, parentLevel + 1)
    }
}
