import { Block } from "../Block"
import { Cell } from "../Cell"
import { CountBuilding } from "../CountBuilding"
import { IApproximation, IModel } from "../interfaces"
import { BlockType, ItemType, Vector3 } from "../types"
import { insertSpaces } from "../utils"
import { BlockFactory } from "./BlockFactory"
import { SystemFieldItem } from "./SystemFieldItem"
import { SystemSourceItem } from "./SystemSourceItem"

/**
 * @category System
 */
export abstract class SystemBlock extends Block {
    abstract solve(): void
    abstract dof(): number
    abstract buildHMatrix(cb: CountBuilding)
    abstract mlt(): void

    protected newSuperBlock(field: Cell, source: Cell, eps: number): Block {
        return this.createBlockOfType(BlockFactory.create(BlockType.SUPER), field, source, eps)

    }

    protected newFullBlock(field: Cell, source: Cell, eps: number): Block {
        return this.createBlockOfType(BlockFactory.create(BlockType.FULL), field, source, eps)
    }

    protected newSparseBlock(field: Cell, source: Cell, eps: number): Block {
        return this.createBlockOfType(BlockFactory.create(BlockType.SPARSE), field, source, eps)
    }

    private createBlockOfType(block, field: Cell, source: Cell, eps: number) {
        if (!(field.hasFieldItems() && source.hasSourceItems())) {
            return undefined
        }

        this.newSon(block)
        block.build(this.model, field, source, eps)
        return block
    }
}

// ---------------------------------------------------

declare class ElementSourceItem { }
declare class BaseElementSystemFieldItem { }

// ---------------------------------------------------

/**
 * @category System
 */
export class SystemSuperBlock extends SystemBlock {
    build(model: IModel, c1: Cell, c2: Cell, eps: number): void {
        super.buildSuper(model, c1, c2, eps)
    }

    clone(): Block {
        return new SystemSuperBlock
    }

    type(): BlockType {
        return BlockType.SUPER
    }

    /**
     * \brief Get the influencing and influenced elements for each terminal blocks (full, sparse)
     */
    initialize() {
        this.sons_.forEach((son) => son.initialize())
    }

    dump(o: string, tab: number): string {
        let s = insertSpaces(o, tab)
        s += `[${tab}] Super:`
        if (this.left) {
            s += ` field(${this.left.totalNbFieldItems()}) source(${this.right.totalNbSourceItems()})`
        }
        s += '\n'

        this.sons_.forEach((son) => {
            s = son.dump(s, tab + 1)
        })

        return s
    }

    estimateMemory(type: BlockType) {
        return this.sons_.reduce((acc, son) => acc + son.estimateMemory(type), 0)
    }

    countBlocks(type: BlockType) {
        const nbr = type == BlockType.SUPER ? 1 : 0
        return this.sons_.reduce((acc, son) => acc + son.countBlocks(type), nbr)
    }

    dof(): number {
        return this.sons_.reduce((acc, son) => acc + (son as SystemBlock).dof(), 0)
    }

    buildHMatrix(cb: CountBuilding) {
        this.sons_.forEach((son) => (son as SystemBlock).buildHMatrix(cb))
    }

    solve(): void {
        this.sons_.forEach((son) => (son as SystemBlock).solve())
    }

    mlt(): void {
        this.sons_.forEach((son) => (son as SystemBlock).mlt())
    }
}

// ---------------------------------------------------

/**
 * @category System
 */
export class SystemFullBlock extends SystemBlock {
    ic_matrix_: Array<Array<number>>
    influencing_: SystemSourceItem[] = []
    influenced_: SystemFieldItem[] = []
    sizeInfluencing_ = 0
    sizeInfluenced_ = 0
    vec1_: Vector3
    vec2_: Vector3

    clone(): Block {
        return new SystemFullBlock
    }

    type(): BlockType {
        return BlockType.FULL
    }

    dump(o: string, tab: number): string {
        let s = insertSpaces(o, tab)
        return s + `[${tab}] Full: field(${this.influenced_.length}) source(${this.influencing_.length})\n`
    }

    countBlocks(type: BlockType) {
        return type === BlockType.FULL ? 1 : 0
    }

    countItems(type: ItemType) {
        return type === ItemType.SOURCE ? this.influencing_.length : this.influenced_.length
    }

    dof(): number {
        return this.sizeInfluenced_
    }

    initialize() {
        this.left.terminalFieldItems(this.influenced_)
        this.sizeInfluenced_ = this.influenced_.reduce((acc, i) => acc + i.dof(), 0)

        this.right.terminalSourceItems(this.influencing_)
        this.sizeInfluencing_ = this.influencing_.reduce((acc, i) => acc + i.dof(), 0)

        // TODO more?
    }

    /**
     * @returns The memory in ko (kilo octects)
     */
    estimateMemory(type: BlockType) {
        return type === BlockType.FULL ? this.sizeInfluencing_ * this.sizeInfluenced_ * 8 : 0
    }

    buildHMatrix(cb: CountBuilding) {
        // TODO
    }

    solve(): void {
        // TODO
    }

    mlt(): void {
        // TODO
    }
}

// ---------------------------------------------------

/**
 * @category System
 */
export class SystemSparseBlock extends SystemBlock {
    ic_matrix_: Array<Array<number>>
    influencing_: SystemSourceItem[] = []
    influenced_: SystemFieldItem[] = []
    aca_: IApproximation = undefined
    sizeInfluencing_ = 0
    sizeInfluenced_ = 0
    vec1_: Vector3
    vec2_: Vector3

    clone(): Block {
        return new SystemSparseBlock
    }

    type(): BlockType {
        return BlockType.SPARSE
    }

    dump(o: string, tab: number): string {
        // TODO!!!!: remove this comment
        // const rank = this.aca_.rank()
        const rank = 4
        const real_size = this.sizeInfluenced_ * this.sizeInfluencing_
        const redu_size = rank * (this.sizeInfluenced_ + this.sizeInfluencing_)
        const ratio = real_size / redu_size
        let s = insertSpaces(o, tab)
        return s + `[${tab}] Sparse: rank(${rank}) full(${this.sizeInfluenced_}x${this.sizeInfluencing_} daxpy=${real_size}) sparse(${rank}(${this.sizeInfluenced_}+${this.sizeInfluencing_}) daxpy=${redu_size}) ratio(${ratio}${ratio > 1 ? " ok" : "!!!"})\n`
    }

    /**
     * @returns The memory in ko (kilo octects)
     */
    estimateMemory(type: BlockType) {
        // TODO!!!!: remove this comment
        // const rank = this.aca_.rank()
        const rank = 4
        return type === BlockType.SPARSE ? rank * (this.sizeInfluenced_ + this.sizeInfluencing_) * 8 : 0
    }

    countBlocks(type: BlockType) {
        return type === BlockType.SPARSE ? 1 : 0
    }

    countItems(type: ItemType) {
        return type === ItemType.SOURCE ? this.influencing_.length : this.influenced_.length
    }

    dof(): number {
        return this.sizeInfluenced_
    }

    initialize() {
        this.right.terminalSourceItems(this.influencing_)
        this.sizeInfluencing_ = this.influencing_.reduce((acc, i) => acc + i.dof(), 0)

        this.left.terminalFieldItems(this.influenced_)
        this.sizeInfluenced_ = this.influenced_.reduce((acc, i) => acc + i.dof(), 0)

        // TODO more?
    }

    buildHMatrix(cb: CountBuilding) {
        // TODO
    }

    solve(): void {
        // TODO
    }

    mlt(): void {
        // TODO
    }
}
