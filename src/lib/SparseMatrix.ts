import { ACA } from './math/ACA'
import { Cluster } from './Cluster'
import { IHMatrix } from './interfaces/IHMatrix'

/**
 * @category H-Matrix
 */
export class SparseMatrix implements IHMatrix {
    private aca: ACA = undefined
    constructor(public cluster: Cluster) {        
    }
}
