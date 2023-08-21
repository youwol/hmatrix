import { BBox } from "../math"
import { IElement } from "./IElement"

export interface IModel {
    forEachElement(cb: (e: IElement, i: number) => void): void
    bbox(): BBox
    dof(): number
}
