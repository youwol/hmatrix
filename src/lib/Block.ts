import { Cell } from './Cell'
import { IModel } from './interfaces/IModel'
import { BlockType, ItemType } from './types'
import { insertSpaces } from './utils'

/**
 * \brief  A Block is used to create admissible clusters
 *  in order to create HMatrices
 * @category Contruction
 */
export abstract class Block {
    protected c1_: Cell = undefined
    protected c2_: Cell = undefined
    protected sons_: Block[] = []
    protected model_: IModel = undefined

    abstract clone(): Block
    abstract initialize(): void
    abstract type(): BlockType
    protected abstract newSuperBlock(c1: Cell, c2: Cell, eps: number): Block
    protected abstract newFullBlock(c1: Cell, c2: Cell, eps: number): Block
    protected abstract newSparseBlock(c1: Cell, c2: Cell, eps: number): Block

    get model() {
        return this.model_
    }

    get left() {
        return this.c1_
    }

    get right() {
        return this.c2_
    }

    build(model: IModel, c1: Cell, c2: Cell, _eps: number): void {
        this.c1_ = c1
        this.c2_ = c2
        this.model_ = model
    }

    release() { // force GC
        this.sons_ = []
        this.c1_ = undefined
        this.c2_ = undefined
    }

    blocksOfType(type: BlockType, result: Block[]) {
        this.sons_.forEach((son) => son.blocksOfType(type, result))
    }

    getFullBlocks(result: Block[]) {
        if (this.type() === BlockType.FULL) {
            result.push(this)
        }
        this.sons_.forEach((son) => son.getFullBlocks(result))
    }

    getSparseBlocks(result: Block[]) {
        if (this.type() === BlockType.SPARSE) {
            result.push(this)
        }
        this.sons_.forEach((son) => son.getSparseBlocks(result))
    }

    buildSuper(model: IModel, c1: Cell, c2: Cell, eps: number) {
        // console.log('build super')
        this.model_ = model
        this.c1_ = c1
        this.c2_ = c2

        if (c1.hasFieldItems() && c2.hasSourceItems()) {
            if (Block.admissible(c1, c2, eps)) {
                this.newSparseBlock(c1, c2, eps)
                // console.log('  newSparseBlock c1, c2')
                return
            }
        }

        if (c2.hasFieldItems() && c1.hasSourceItems()) {
            if (Block.admissible(c2, c1, eps)) {
                this.newSparseBlock(c2, c1, eps)
                // console.log('  newSparseBlock c2, c1')
                return
            }
        }

        this.buildNonAdmissible(c1, c2, eps)
    }

    // Here, c1 and c2 can be either source or field cells.
    //
    buildNonAdmissible(c1: Cell, c2: Cell, eps: number) {
        // console.log('build non-admin')
        if (c1.hasSons()) {
            // console.log('build non-admin left & right sons')
            this.buildNonAdmissibleSons(c1.leftSon(), c2, eps)
            this.buildNonAdmissibleSons(c1.rightSon(), c2, eps)
        }
        else {
            // console.log('build non-admin')
            this.buildNonAdmissibleSons(c1, c2, eps)
        }
    }

    // Here, field is a field cell, and source is a source cell.
    //
    buildNonAdmissibleSons(field: Cell, source: Cell, eps: number) {
        //   i)   Check source and field items
        //   ii)  Creation of a new block if necessary
        //   iii) Recursive building
        if (source.hasSons()) {
            // console.log('  new super left & right')
            this.newSuperBlock(field, source.leftSon(), eps);
            this.newSuperBlock(field, source.rightSon(), eps);
        }
        else {
            // console.log('  new full')
            this.newFullBlock(field, source, eps)
        }
    }

    newSon(son: Block) {
        this.sons_.push(son)
    }

    dump(o: string, tab: number): string {
        let s = insertSpaces(o, tab)
        s += `[${tab}] `
        return this.sons_.reduce((acc, son) => son.dump(acc, tab + 1), s)
    }

    estimateMemory(type: BlockType) {
        return this.sons_.reduce((acc, son) => acc + son.estimateMemory(type), 0)
    }

    countBlocks(type: BlockType): number {
        return this.sons_.reduce((acc, son) => acc + son.countBlocks(type), 0)
    }

    countItems(type: ItemType) {
        return this.sons_.reduce((acc, son) => acc + son.countItems(type), 0)
    }

    hasSons(c: Cell) {
        return c.hasSons()
    }

    hasFields(c: Cell) {
        return c.hasFieldItems()
    }

    hasSources(c: Cell) {
        return c.hasSourceItems()
    }

    hasLeftFields(c: Cell) {
        return c.leftSon() !== undefined && c.leftSon().hasFieldItems()
    }

    hasLeftSources(c: Cell) {
        return c.leftSon() !== undefined && c.leftSon().hasSourceItems()
    }

    hasRightFields(c: Cell) {
        return c.rightSon() !== undefined && c.rightSon().hasFieldItems()
    }

    hasRightSources(c: Cell) {
        return c.rightSon() !== undefined && c.rightSon().hasSourceItems()
    }

    static admissible(c1: Cell, c2: Cell, eps: number): boolean {
        const dist = Cell.distance(c1, c2)
        const r1 = c1.diameter2()
        const r2 = c2.diameter2()
        // console.log(`--> Block.admissible: min(${r1}, ${r2}) < ${eps * dist}`)
        return Math.min(r1, r2) < eps * dist
    }
}
