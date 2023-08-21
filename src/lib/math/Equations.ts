import { Cluster } from '../Cluster'
import { FullMatrix } from './FullMatrix'
import { getInflluencing, getAllItems, ConstraintFunction } from '../visitors'
import { IHMatrix } from '../interfaces/IHMatrix'

/**
 * An Equations represents, for a given cluster, the influencing clusters matrices
 * @category Math
 */
export class Equations {
    private sources: IHMatrix[] = undefined
    private fields: IHMatrix = undefined

    constructor(private cluster: Cluster) { }

    construct({
        root,
        constraint = undefined,
        eps,
    }: {
        root: Cluster
        constraint?: ConstraintFunction
        eps: number
    }) {
        this.fields = new FullMatrix(this.cluster)

        // Will detect Sparse and Full matrices from the root
        this.sources = getInflluencing({
            cluster: this.cluster,
            root,
            eps,
            constraint,
        })
    }

    release() {
        this.sources.forEach((s) => s.release())
        this.fields.release()
    }

    info() {
        let nbSparse = 0
        let nbFull = 0
        this.sources.forEach((matrix) => {
            const _items = getAllItems({
                cluster: matrix.cluster,
                constraint: undefined,
            })
            if (matrix instanceof FullMatrix) {
                nbFull++ // = items.length
            } else {
                nbSparse++ // = items.length
            }
        })

        return {
            dof_field: this.fields.dof(),
            //dof_source    : this.sources.reduce( (cur, s) => cur+s.dof(), 0),
            field_items: this.fields.cluster.items.length,
            source_sparse: nbSparse,
            source_full: nbFull,
        }
    }
}
