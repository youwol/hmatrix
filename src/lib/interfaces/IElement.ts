import { BBox } from "../math"
import { Point, Vector3 } from "../types"

export interface IElement {
    center(): Point
    b(): Vector3 // in the form [x, y, z]
    bc(): Vector3 // in the form [x, y, z]
    bcType(): Vector3 // in the form [x, y, z]
    dof(): number
    bbox(): number[] // in the form [mx, my, mz, Mx, My, Mz]

    getUserVec3(): Vector3 // in the form [x, y, z]
    setUserVec3(v: Vector3): void
}
