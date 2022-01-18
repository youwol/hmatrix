import { Cluster } from './Cluster'
import { IHMatrix } from './interfaces/IHMatrix'

/**
 * @category H-Matrix
 */
export class FullMatrix implements IHMatrix {
    constructor(public cluster: Cluster) {
    }
}
