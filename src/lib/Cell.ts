import { Convergence } from './Convergence'
import { FieldItem } from './FieldItem'
import { IModel, IItem } from './interfaces'
import { BBox, Vector } from './math'
import { SourceItem } from './SourceItem'
import { Point } from './types'
import { getDistanceSq, insertSpaces } from './utils'

/**
 * @category Contruction
 */
export type FieldItems = FieldItem[]

/**
 * @category Contruction
 */
export type SourceItems = SourceItem[]

/**
 * @category Contruction
 */
export class Cell {
    private points_: Point[] = new Array(8)
    private min_ = new Point()
    private max_ = new Point()
    private bbox_ = new BBox
    private radius2_ = 0
    private depth_ = 0
    private parent_: Cell = undefined
    private left_: Cell = undefined
    private right_: Cell = undefined
    private fieldItems_: FieldItems = []
    private sourceItems_: SourceItems = []
    private number_of_field_items_ = 0
    private number_of_source_items_ = 0

    constructor(depth: number, parent: Cell) {
        this.parent_ = parent
        this.depth_ = depth
        this.points_ = this.points_.fill(new Point)
    }

    get bbox() {
        return this.bbox_
    }

    get min() {
        return this.min_
    }

    get max() {
        return this.max_
    }

    parent() {
        return this.parent_
    }

    hasSons() {
        return (this.left_ != undefined)
    }

    hasFieldItems() {
        return this.number_of_field_items_ > 0
    }

    hasSourceItems() {
        return this.number_of_source_items_ > 0
    }

    leftSon() {
        return this.left_
    }

    rightSon() {
        return this.right_
    }

    depth() {
        return this.depth_
    }

    nbItems() {
        return this.number_of_field_items_ + this.number_of_source_items_
    }

    nbFieldItems() {
        return this.number_of_field_items_
    }

    nbSourceItems() {
        return this.number_of_source_items_
    }

    diameter2(): number {
        return this.radius2_
    }

    // ----------------------------------------------------

    initialize(model: IModel) {
        this.update()
        if (this.left_) {
            this.left_.initialize(model)
            this.right_.initialize(model)
            console.assert(this.fieldItems_.length === 0)
            console.assert(this.sourceItems_.length === 0)
        }
        else {
            this.fieldItems_.forEach((f) => f.initialize(model))
        }
    }

    affect(conv: Convergence) {
        if (!this.left_) {
            this.fieldItems_.forEach((f) => f.affect(conv))
        }
        else {
            this.left_.affect(conv)
            this.right_.affect(conv)
        }
    }

    update() {
        this.points_[0].set(this.max_[0], this.min_[1], this.min_[2])
        this.points_[1].set(this.max_[0], this.max_[1], this.min_[2])
        this.points_[2].set(this.min_[0], this.max_[1], this.min_[2])
        this.points_[3].set(this.min_[0], this.min_[1], this.min_[2])
        this.points_[4].set(this.max_[0], this.min_[1], this.max_[2])
        this.points_[5].set(this.max_[0], this.max_[1], this.max_[2])
        this.points_[6].set(this.min_[0], this.max_[1], this.max_[2])
        this.points_[7].set(this.min_[0], this.min_[1], this.max_[2])
        const dx = this.max_[0] - this.min_[0]
        const dy = this.max_[1] - this.min_[1]
        const dz = this.max_[2] - this.min_[2]
        this.radius2_ = dx * dx + dy * dy + dz * dz
    }

    dump(o: string, tab: number): string {
        let s = insertSpaces(o, tab)
        if (this.left_) {
            s += `[F=${this.totalNbFieldItems()}, S=${this.totalNbSourceItems()}]\n`
            s = this.left_.dump(s, tab + 1)
            s = this.right_.dump(s, tab + 1)
            return s
        }
        else {
            return s + `[F=${this.nbFieldItems()}] [S=${this.nbSourceItems()}]\n`
        }
    }

    totalNbItems() {
        if (this.left_) {
            return this.left_.totalNbItems() + this.right_.totalNbItems()
        }
        else {
            return this.nbItems()
        }
    }

    totalNbFieldItems() {
        if (this.left_) {
            return this.left_.totalNbFieldItems() + this.right_.totalNbFieldItems()
        }
        else {
            return this.nbFieldItems()
        }
    }

    totalNbSourceItems() {
        if (this.left_) {
            return this.left_.totalNbSourceItems() + this.right_.totalNbSourceItems()
        }
        else {
            return this.nbSourceItems()
        }
    }

    addFieldItem(i: FieldItem): IItem {
        this.fieldItems_.push(i)
        this.number_of_field_items_++
        this.computeMinMax(i)
        return i
    }

    addSourceItem(i: SourceItem): IItem {
        this.sourceItems_.push(i)
        this.number_of_source_items_++
        this.computeMinMax(i)
        return i
    }

    computeMinMax(i: IItem) {
        const bbox = i.bbox()
        if (!bbox.isEmpty) {
            const m = bbox.min
            const M = bbox.max
            for (let j = 0; j < 3; ++j) {
                if (m[j] < this.min_[j]) {
                    this.min_[j] = m[j]
                }
                if (m[j] > this.max_[j]) {
                    this.max_[j] = m[j]
                }
                if (M[j] < this.min_[j]) {
                    this.min_[j] = M[j]
                }
                if (M[j] > this.max_[j]) {
                    this.max_[j] = M[j]
                }
            }
        }
        else {
            const p = i.pos()
            for (let j = 0; j < 3; ++j) {
                if (p[j] < this.min_[j]) {
                    this.min_[j] = p[j]
                }
                if (p[j] > this.max_[j]) {
                    this.max_[j] = p[j]
                }
            }
        }
        this.bbox_.set(this.min_ as Vector, this.max_ as Vector)
    }

    terminalFieldItems(l: FieldItem[]) {
        if (!this.left_) {
            this.fieldItems_.forEach((i) => l.push(i))
        }
        else {
            this.left_.terminalFieldItems(l)
            this.right_.terminalFieldItems(l)
        }
    }

    terminalSourceItems(l: SourceItem[]) {
        if (!this.left_) {
            this.sourceItems_.forEach((i) => l.push(i))
        }
        else {
            this.left_.terminalSourceItems(l)
            this.right_.terminalSourceItems(l)
        }
    }

    findSplitPlane() {
        let splitCoord = 0
        let coordOfSubdivision = 0

        const min = [1e34, 1e34, 1e34]
        const max = [- 1e34, -1e34, -1e34]
        const sum = [0., 0., 0.]

        this.fieldItems_.forEach((cur_item) => {
            const cur_pt = cur_item.pos()
            for (let i = 0; i < 3; ++i) {
                if (cur_pt[i] < min[i]) {
                    min[i] = cur_pt[i]
                }
                if (cur_pt[i] > max[i]) {
                    max[i] = cur_pt[i]
                }
                sum[i] += cur_pt[i]
            }
        })

        this.sourceItems_.forEach((cur_item) => {
            const cur_pt = cur_item.pos()
            for (let i = 0; i < 3; ++i) {
                if (cur_pt[i] < min[i]) {
                    min[i] = cur_pt[i]
                }
                if (cur_pt[i] > max[i]) {
                    max[i] = cur_pt[i]
                }
                sum[i] += cur_pt[i]
            }
        })


        let max_diff = -1
        for (let i = 0; i < 3; ++i) {
            const cur_diff = max[i] - min[i]
            if (cur_diff > max_diff) {
                max_diff = cur_diff
                coordOfSubdivision = i
            }
        }

        splitCoord = sum[coordOfSubdivision] / this.nbItems()

        return {
            splitCoord,
            coordOfSubdivision
        }
    }

    subdivide(minItems: number, maxDepth: number) {
        if ((this.nbItems() <= minItems) || this.depth_ >= maxDepth) {
            return
        }

        // Getting a split plane...
        //
        const { splitCoord, coordOfSubdivision } = this.findSplitPlane()

        // Subdividing the cell...
        //
        this.left_ = new Cell(this.depth_ + 1, this);
        this.right_ = new Cell(this.depth_ + 1, this);

        // Dispatching items in children...
        //
        this.fieldItems_.forEach((cur_item) => {
            const cur_pt = cur_item.pos()
            const child = this.getChildContaining(splitCoord, coordOfSubdivision, cur_pt) // left() or right()
            child.addFieldItem(cur_item)
        })
        this.fieldItems_ = []

        this.sourceItems_.forEach((cur_item) => {
            const cur_pt = cur_item.pos()
            const child = this.getChildContaining(splitCoord, coordOfSubdivision, cur_pt) // left() or right()
            child.addSourceItem(cur_item)
        })
        this.sourceItems_ = []

        // Continuing subdivision...
        //
        this.left_.subdivide(minItems, maxDepth)
        this.right_.subdivide(minItems, maxDepth)
    }

    getChildContaining(split_coord: number, coord_of_subdivision: number, pt: Point) {
        return pt[coord_of_subdivision] < split_coord ? this.left_ : this.right_
    }

    static distance(c1: Cell, c2: Cell): number {
        // TODO: Optimization !!!!!!!!!!!!!!
        // Since we have 64*3 multiplications and additions and 64*6 subtractions
        let d = 1e34
        for (let i = 0; i < 8; ++i) {
            for (let j = 0; j < 8; ++j) {
                const dx = c1.points_[i][0] - c2.points_[j][0]
                const dy = c1.points_[i][1] - c2.points_[j][1]
                const dz = c1.points_[i][2] - c2.points_[j][2]
                const D = dx * dx + dy * dy + dz * dz
                if (D < d) {
                    d = D
                }
            }
        }
        return d

        // return getDistanceSq(c1.bbox, c2.bbox) // This one should work
        // return Math.sqrt(c1.bbox.distance(c2.bbox))
    }
}
