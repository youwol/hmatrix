import { Vector } from '../math/Vector'

export interface IItem {
    pos(): Vector
    dof(): number
}
