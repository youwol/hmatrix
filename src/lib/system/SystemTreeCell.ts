import { Convergence } from "../Convergence"
import { BBox } from "../math"
import { SystemTreeBlock } from "./SystemTreeBlock"
import { TreeCell } from "../TreeCell"
import { BlockType } from "../types"
import { Cell } from "../Cell"
import { SystemSourceItem } from "./SystemSourceItem"
import { SystemFieldItem } from "./SystemFieldItem"
import { CountBuilding } from "../CountBuilding"
import { SolverDumpOptions } from "./HSolver"

/**
 * @category System
 */
export class SystemTreeCell extends TreeCell {
    protected treeBlock_: SystemTreeBlock = undefined

    dump(o: string, { cells = false, blocks = false, resume = true }: SolverDumpOptions = {}): string {
        let s = o

        if (cells) {
            s += 'Partition (F=Field, S=Source):\n'
            s = super.dump(s)
        }

        if (this.treeBlock_) {
            s = this.treeBlock_.dump(s, { blocks, resume })
        }

        return s
    }

    count(type: BlockType) {
        if (this.treeBlock_) {
            return this.treeBlock_.countBlocks(type)
        }
        return 0
    }

    initialize(bbox: BBox) {
        this.setRoot(new Cell(0, undefined))
        this.model().forEachElement((e) => this.root().addSourceItem(new SystemSourceItem(e)))
        this.model().forEachElement((e) => this.root().addFieldItem(new SystemFieldItem(e)))
        this.root().subdivide(this.minItems, this.maxDepth)
        this.root().initialize(this.model())
    }

    newTreeBlock() {
        return new SystemTreeBlock
    }

    allocate() {
        const total_nbr_items = this.root().totalNbFieldItems() * this.root().totalNbSourceItems()
        const cb = new CountBuilding(this.model(), total_nbr_items, 10)
        cb.start()
        const start = Date.now()
        this.treeBlock_.buildHMatrix(cb)
        const stop = Date.now()
        console.log(`Time for system initialization: ${(stop - start) / 1e6}s`)
    }

    buildBlocks() {
        this.setNewTreeBlock(this.newTreeBlock())
        this.treeBlock().build(this.model(), this.root(), this.blockEps)
        this.treeBlock().initialize()
    }

    oneIteration() {

    }

    affect(conv: Convergence) {

    }

    treeBlock() {
        return this.treeBlock_
    }

    protected freeTreeBlock() {
        this.treeBlock_ = undefined
    }

    protected setNewTreeBlock(s: SystemTreeBlock) {
        this.treeBlock_ = s
    }
}
