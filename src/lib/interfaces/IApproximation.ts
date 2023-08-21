import { Vector } from '../math/Vector'
import { IProvider } from './IProvider'

/**
 * Approximation strategy. Client class can be ACA, ACA+...
 * @see [[ACA]]
 */
export interface IApproximation {
    build(n: number, m: number, provider: IProvider, eps: number): void
    mult(B: Vector, C: Vector): void
    multAdd(B: Vector, C: Vector): void
    rank(): number

    /**
     * @brief Operate a summation of the columns values for each row.
     * Mostly used for calculation of traction, stress, strain and displacement
     * at observation points.
     */
    summation(C: Vector): void
}
