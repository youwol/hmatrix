/**
 * @category Math
 */
export class Matrix extends Array<Array<number>> {
    private cols_ = 0
    private rows_ = 0

    constructor(rows: number, cols: number) {
        super(rows)
        this.fill(undefined)
        for (let i = 0; i < rows; ++i) this[i] = new Array(cols).fill(0)
        this.rows_ = rows
        this.cols_ = cols
    }

    static clone(m: Matrix): Matrix {
        const self = new Matrix(m.rows, m.cols)
        for (let i = 0; i < m.rows; ++i) {
            self[i] = [...m[i]]
        }
        return self
    }

    exists(row: number, col: number) {
        return row < this.rows_ && col < this.cols_
    }

    get size() {
        return this.rows_ * this.cols_
    }
    get rows() {
        return this.rows_
    }
    get cols() {
        return this.cols_
    }
}
