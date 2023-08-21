import { Convergence } from "../Convergence"
import { IElement, IModel } from "../interfaces"
import { SourceItem } from "../SourceItem"

export class SystemSourceItem extends SourceItem {
    private e_: IElement = undefined

    constructor(e: IElement) {
        super(e.center())
        this.e_ = e
        this.setBBox(e.bbox())
    }

    element(): IElement {
        return this.e_
    }

    initialize(model: IModel): void {
        // TODO ?
    }

    affect(c: Convergence): void {
        // TODO ?
    }

    dof(): number {
        return this.e_.dof()
    }
}
