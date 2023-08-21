import { Cell } from "../Cell"
import { IModel } from "../interfaces/IModel"
import { SystemBlock, SystemFullBlock, SystemSuperBlock } from "./SystemBlock"
import { TreeBlock } from "../TreeBlock"
import { CountBuilding } from "../CountBuilding"

/**
 * @category System
 */
export class SystemTreeBlock extends TreeBlock {
    build(model: IModel, root: Cell, eps: number) {
        this.model_ = model
        this.root_ = undefined

        if (root.leftSon()) {
            this.root_ = new SystemSuperBlock
        }
        else {
            this.root_ = new SystemFullBlock
        }

        this.root_.build(model, root, root, eps)
    }

    initialize() {
        this.root_.initialize()
    }

    buildHMatrix(cb: CountBuilding) {
        (this.root_ as SystemBlock).buildHMatrix(cb)// SystemBlock
    }

    solve() {

    }

    mlt() {

    }
}
