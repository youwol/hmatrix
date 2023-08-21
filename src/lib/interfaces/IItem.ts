import { BBox } from '../math'
import { Point } from '../types'

export interface IItem {
    pos(): Point
    dof(): number
    bbox(): BBox
    setBBox(b: BBox): void
}
