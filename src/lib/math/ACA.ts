import { IApproximation } from '../interfaces/IApproximation'
import { IProvider } from '../interfaces/IProvider'
import { Vector } from './Vector'

/**
 * @category Math
 */
export class ACA implements IApproximation {
    private n_ = 0
    private m_ = 0
    private k_ = 0
    private a_: Vector[] = []
    private b_: Vector[] = []

    build(m: number, n: number, provider: IProvider, eps = 0.1) {
        this.n_ = m
        this.m_ = n

        let sum_err = 0
        let i0 = 0 //Math.trunc(Math.random()*this.n_) // Starting pivot index i*
        let j0 = -1
        let k = 1
        let norm = Number.POSITIVE_INFINITY
        let norm_init = Number.POSITIVE_INFINITY

        const a = new Vector(this.n_)
        const b = new Vector(this.m_)

        do {
            // Compute the entries of b
            this.getB(provider, i0, b)

            // Find pivot index j* that maximize the newly created b
            j0 = this.getPivot(b)

            // Compute the entries of a
            this.getA(provider, j0, b[j0], a)

            // Determine the next pivot i*(iter+1)<>i*(iter) that maximize the newly created a
            i0 = this.getOptimPivot(a, i0)

            // Compute the norm
            const R = this.frobeniusNorm(k, a, b, sum_err)
            sum_err = R.sumError
            if (k > 1) {
                norm = R.norm
            } else {
                norm_init = R.norm
            }

            this.a_.push(a.clone())
            this.b_.push(b.clone())
            ++k
        } while (norm > eps * norm_init)
        this.k_ = k - 1

        // console.log(
        //     'REACHED the user precision. STOP the approximation with rank=',
        //     k,
        // )
        // console.log('Usual  numbers: ', this.n_ * this.m_)
        // console.log('Approx numbers: ', this.k_ * (this.n_ + this.m_))
        // console.log(
        //     'Ratio         : ',
        //     ((this.n_ * this.m_) / (this.k_ * (this.n_ + this.m_))).toFixed(2),
        // )
        // const percent = (
        //     100 -
        //     ((this.k_ * (this.n_ + this.m_)) / (this.n_ * this.m_)) * 100
        // ).toFixed(2)
        // console.log('percent redux : ', percent)
    }

    mult(B: Vector, C: Vector) {
        const v = new Array(1000)
        let id = 0
        this.b_.forEach((b) => {
            let val = 0
            for (let j = 0; j < this.m_; ++j) {
                val += b[j] * B[j]
            }
            v[id++] = val
        })

        for (let i = 0; i < this.n_; ++i) {
            let val = 0
            id = 0
            this.a_.forEach((a) => {
                val += a[i] * v[id++]
            })
            C[i] = val
        }
    }

    multAdd(B: Vector, C: Vector) {
        const v = new Vector(this.k_)

        this.b_.forEach((b, id) => {
            let val = 0
            for (let j = 0; j < this.m_; ++j) {
                val += b[j] * B[j]
            }
            v[id] = val
        })

        for (let i = 0; i < this.n_; ++i) {
            let val = 0
            this.a_.forEach((a, id) => {
                val += a[i] * v[id]
            })
            C[i] += val
        }
    }

    summation(C: Vector) {
        /*
         * Operate a summation of the columns values for each row.
         * Mostly used for calculation of traction, stress, strain and displacement
         * at observation points.
         */
        const v = new Vector(this.k_)

        this.b_.forEach((b, id) => {
            let val = 0
            for (let j = 0; j < this.m_; ++j) {
                val += b[j]
            }
            v[id] = val
        })

        for (let i = 0; i < this.n_; ++i) {
            let val = 0
            this.a_.forEach((a, id) => {
                val += a[i] * v[id]
            })
            C[i] = val
        }
    }

    n() {
        return this.n_
    }

    m() {
        return this.m_
    }
    rank() {
        return this.k_
    }

    private getA(provider: IProvider, j0: number, b_j0: number, a: Vector) {
        for (let i = 0; i < this.n_; ++i) {
            let val = provider.value(i, j0) //M[i][j0]
            this.a_.forEach((aa, index) => {
                val -= aa[i] * this.b_[index][j0]
            })
            a[i] = val / b_j0
        }
    }

    private getB(provider: IProvider, i0: number, b: Vector) {
        for (let j = 0; j < this.m_; ++j) {
            let val = provider.value(i0, j) //M[i0][j]
            this.a_.forEach((a, index) => {
                val -= a[i0] * this.b_[index][j]
            })
            b[j] = val
        }
    }

    private getPivot(b: Vector) {
        let j0 = 0
        let val_max = -1e32
        for (let j = 0; j < this.m_; ++j) {
            const val = Math.abs(b[j])
            if (val > val_max) {
                val_max = val
                j0 = j
            }
        }
        return j0
    }

    private getOptimPivot(a: Vector, i0: number) {
        let new_i0 = -1
        let val_max = -1e32
        for (let i = 0; i < this.n_; ++i) {
            const val = Math.abs(a[i])
            if (val > val_max && i != i0) {
                val_max = val
                new_i0 = i
            }
        }
        return new_i0
    }

    private frobeniusNorm(k: number, a: Vector, b: Vector, sum_err: number) {
        let err_a = 0
        for (let i = 0; i < this.n_; ++i) {
            err_a += a[i] ** 2
        }
        err_a = Math.sqrt(err_a)

        let err_b = 0
        for (let i = 0; i < this.m_; ++i) {
            err_b += b[i] ** 2
        }

        err_b = Math.sqrt(err_b)
        const err2 = err_a * err_b
        sum_err += err2
        const euclidean_err = k * err2
        return {
            norm: euclidean_err / Math.sqrt(sum_err),
            sumError: sum_err,
        }
    }

    // private buildFull(matrix: Matrix, eps: number) {
    //     const M = Matrix.clone(matrix)
    //     this.n_ = M.rows
    //     this.m_ = M.cols
    //     let sum_err = 0.
    //     let k = 0
    //     let norm      = 1.e38
    //     let norm_init = 1.e38

    //     do {
    //         let i0=-1, j0=-1
    //         let delta = 1
    //         {
    //             let val_max = -1.e32
    //             for (let i=0; i<this.n_; ++i) {
    //                 for (let j=0; j<this.m_; ++j) {
    //                     if (Math.abs(M[i][j])> val_max) {
    //                         delta = M[i][j]
    //                         val_max = Math.abs(delta)
    //                         i0 = i
    //                         j0 = j
    //                     }
    //                 }
    //             }
    //             if (delta == 0.0) {
    //                 break
    //             }
    //         }

    //         this.a_.push(new Vec(this.n_))
    //         this.b_.push(new Vec(this.m_))
    //         let a = this.a_[this.a_.length-1]
    //         let b = this.b_[this.b_.length-1]

    //         // Update a
    //         //
    //         for (let i=0; i<this.n_; ++i) {
    //             const v = M[i][j0]
    //             a[i] = Math.abs(v)<1e-10?0:v
    //         }

    //         // Update a
    //         //
    //         for (let j=0; j<this.m_; ++j) {
    //             let v = M[i0][j]/delta
    //             b[j] = Math.abs(v)<1e-10?0:v
    //         }

    //         // Update M
    //         //
    //         for (let i=0; i<this.n_; ++i) {
    //             for (let j=0; j<this.m_; ++j) {
    //                 M[i][j] -= a[i] * b[j]
    //             }
    //         }

    //         const R = this.frobeniusNorm(k, a, b, sum_err)
    //         sum_err   = R.sumError
    //         if (k>1) {
    //             norm = R.norm
    //         }
    //         else {
    //             norm_init = R.norm
    //         }

    //         ++k ;
    //     } while (norm > eps/10.*norm_init)

    //     this.k_ = k-1

    //     // Full   numbers: n_*m_
    //     // Approx numbers: k_*(n_+m_)
    //     // Ratio         : (n_*m_) / (k_*(n_+m_))
    // }
}
