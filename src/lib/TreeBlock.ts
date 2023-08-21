import { Block } from "./Block"
import { Cell } from "./Cell"
import { IModel } from "./interfaces"
import { SolverDumpOptions } from "./system"
import { BlockType, ItemType } from "./types"

/**
 * @category Contruction
 */
export abstract class TreeBlock {
    protected model_: IModel = undefined
    protected root_: Block = undefined

    abstract build(model: IModel, root: Cell, eps: number): void
    abstract initialize(): void

    root() { return this.root_ }
    model() { return this.model_ }

    dump(o: string, { blocks = false, resume = true }: SolverDumpOptions = {}): string {
        let s = o
        if (this.root_) {
            if (blocks) {
                s += "\Clusters:\n"
                s = this.root_.dump(s, 0)
            }

            const dense = Math.round(this.model().dof() ** 2 / 1024 / 1024)
            const full = Math.round(this.root_.estimateMemory(BlockType.FULL) / 1024 / 1024)
            const sparse = Math.round(this.root_.estimateMemory(BlockType.SPARSE) / 1024 / 1024)
            const eco = dense - full - sparse

            if (resume) {
                s += `Hierarchy:
    Total super blocks  : ${this.root_.countBlocks(BlockType.SUPER)}
    Total full blocks   : ${this.root_.countBlocks(BlockType.FULL)}
    Total sparse blocks : ${this.root_.countBlocks(BlockType.SPARSE)}
  Instances
    Total influencing   : ${this.root_.countItems(ItemType.SOURCE)}
    Total influenced    : ${this.root_.countItems(ItemType.FIELD)}
  Info
    Model dof           : ${this.model().dof()}
  Memory
    Dense (ref.)        : ${dense} Mo
    Full                : ${full} Mo
    Sparse              : ${sparse} Mo
    Benefit             : ${eco} Mo
`
            }
        }
        return s
    }

    countBlocks(type: BlockType) {
        return this.root_.countBlocks(type)
    }

    blocksOfType(type: BlockType, result: Block[]) {
        this.root_.blocksOfType(type, result)
    }

}