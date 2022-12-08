import { ACA } from './math/ACA'
import { Cluster } from './Cluster'
import { IHMatrix } from './interfaces/IHMatrix'
import { IItem } from './interfaces/IItem'
import { getAllItems } from './visitors'
import { Matrix } from './math/Matrix'

/**
 * @category H-Matrix
 */
export class SparseMatrix implements IHMatrix {
    private aca: ACA = undefined
    private items: IItem[]
    private matrix: Matrix = undefined

    constructor(public cluster: Cluster) {
        this.items = getAllItems({ cluster })
    }

    dof(): number {
        return this.items.reduce((cur, item) => cur + item.dof(), 0)
    }

    build() {
        const n = this.dof()
        this.matrix = new Matrix(n, n)
    }

    release() {
        this.matrix = undefined
    }
}
