import { Convergence } from "../Convergence"
import { FieldItem } from "../FieldItem"
import { IElement, IModel } from "../interfaces"
import { Vector } from "../math"

export class SystemFieldItem extends FieldItem {
    private ainv_: Vector
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
        // TODO
    }

    affect(c: Convergence): void {
        // TODO
    }

    dof(): number {
        return this.e_.dof()
    }

    protected userVec3Affect(b: Vector, startIndex: number): number {
        // TODO
        return 0
    }
}
