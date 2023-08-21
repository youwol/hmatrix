import { Convergence } from "../Convergence"
import { FieldItem } from "../FieldItem"
import { IElement, IModel } from "../interfaces"
import { BBox, Vector } from "../math"
import { Point } from "../types"

export class SystemSetFieldItem extends FieldItem {
    private ainv_: Vector
    private es_: IElement[] = []

    constructor(es: IElement[]) {
        super(es.reduce((cur, e) => [cur[0] + e.center()[0], cur[1] + e.center()[1], cur[2] + e.center()[2]], [0, 0, 0]) as Point)
        this.es_ = [...es]
        const bbox = new BBox()
        es.forEach((e) => bbox.grow(e.bbox()))
        this.setBBox(bbox)
    }

    elements(): IElement[] {
        return this.es_
    }

    initialize(model: IModel): void {
        // TODO
    }

    affect(c: Convergence): void {
        // TODO
    }

    dof(): number {
        return this.es_.reduce((cur, e) => cur + e.dof(), 0)
    }

    protected userVec3Affect(b: Vector, startIndex: number): number {
        // TODO
        return 0
    }
}
