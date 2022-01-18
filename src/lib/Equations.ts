import { Cluster } from './Cluster'
import { ConstraintFunction } from '.'
import { FullMatrix } from './FullMatrix'
import { getAllItems } from './visitors'
import { getInflluencing } from './visitors'
import { IHMatrix } from "./interfaces/IHMatrix"

/**
 * An Equations represents, for a given cluster, the influencing clusters matrices
 * @category H-Matrix
 */
export class Equations {
    private sources: IHMatrix[] = undefined
    private fields : IHMatrix   = undefined

    constructor(private cluster: Cluster) {
    }

    construct(
        {root, constraint = undefined, eps}:
        {root: Cluster, constraint?: ConstraintFunction, eps: number}
    ) {
        this.fields = new FullMatrix(this.cluster)

        // Will detect Sparse and Full matrices form the root
        this.sources = getInflluencing({
            cluster: this.cluster,
            root,
            eps,
            constraint
        })
    }

    info() {
        let nbSparse = 0
        let nbFull   = 0
        this.sources.forEach( matrix => {
            const items = getAllItems({
                cluster   : matrix.cluster,
                constraint: undefined
            })
            if (matrix instanceof FullMatrix ) {
                nbFull += items.length
            }
            else {
                nbSparse += items.length
            }
        })

        return {
            field: this.fields.cluster.items.length,
            sourceSparse: nbSparse,
            sourceFull  : nbFull
        }
    }
}
