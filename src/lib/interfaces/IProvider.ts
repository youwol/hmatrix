
/**
 * A provider allows to get component of an evaluated tensor.
 * This can be, for example, traction influence tensor, displacement
 * influence tensor, stress influence tensor or strain influence tensor.
 */
export interface IProvider {
    value(i: number, j: number): number
}
