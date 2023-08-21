import { Cell } from "./Cell"
import { IModel } from "./interfaces"
import { BBox } from "./math"
import { BlockType } from "./types"

/**
 * @category Contruction
 */
export abstract class TreeCell {
    private root_: Cell = undefined
    private bbox_: BBox = undefined
    private model_: IModel = undefined
    private blockEps_ = 1.2
    private minItems_ = 15
    private maxDepth_ = 10

    get blockEps() {
        return this.blockEps_
    }
    set blockEps(e: number) {
        this.blockEps_ = e
    }

    get minItems() {
        return this.minItems_
    }
    set minItems(e: number) {
        this.minItems_ = e
    }

    get maxDepth() {
        return this.maxDepth_
    }
    set maxDepth(e: number) {
        this.maxDepth_ = e
    }

    setModel(model: IModel) {
        this.model_ = model
    }

    abstract buildBlocks(): void
    abstract allocate(): void
    abstract count(type: BlockType)

    root() {
        return this.root_
    }
    bbox() {
        return this.bbox_
    }
    model() {
        return this.model_
    }

    dump(s: string): string {
        return this.root_.dump(s, 0)
    }

    protected setBBox(bbox: BBox) {
        this.bbox_ = bbox
    }

    protected setRoot(root: Cell) {
        this.root_ = root
    }

}