import { Convergence } from './Convergence'
import { IItem } from './interfaces'
import { IModel } from './interfaces/IModel'
import { BBox } from './math'
import { Point } from './types'

/**
 * @category Contruction
 */
export class FieldItem implements IItem {
    pt_: Point = undefined
    bbox_: BBox = undefined

    constructor(pos: Point) {
        this.pt_ = pos
    }

    setBBox(b: BBox | number[]): void {
        if (Array.isArray(b)) {
            this.bbox_ = new BBox(b)
        } else {
            this.bbox_ = b
        }
        // console.log(this.bbox_)
    }

    pos() {
        return this.pt_
    }

    bbox() {
        return this.bbox_
    }

    dof(): number {
        return 0
    }

    initialize(_model: IModel) {
        // TODO
    }

    affect(_conv: Convergence) {
        // TODO
    }
}
