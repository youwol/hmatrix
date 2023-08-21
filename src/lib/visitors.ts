import { IHMatrix } from './interfaces/IHMatrix'
import { FullMatrix } from './math/FullMatrix'
import { SparseMatrix } from './math/SparseMatrix'
import { Cluster } from './Cluster'
//import { admissible } from "./math/admissible"

export type ConstraintFunction = (c: Cluster) => boolean

// ----------------------------------------------------------------------

/**
 * Get all leafs under a specific constraint (if defined) starting from
 * cluster
 * @category Visitors
 */
export function getLeafs({
    cluster,
    constraint = undefined,
}: {
    cluster: Cluster
    constraint?: ConstraintFunction
}) {
    if (!cluster.hasSons) {
        return [cluster]
    }

    const leafs = []
    cluster.visit((c) => {
        if (!c.hasSons && (constraint ? constraint(c) : true)) {
            leafs.push(c)
        }
    })
    return leafs
}

// ----------------------------------------------------------------------

/**
 * Get recursively all items starting from cluster under a specific constraint
 * (if defined)
 * @category Visitors
 */
export function getAllItems({
    cluster,
    constraint = undefined,
}: {
    cluster: Cluster
    constraint?: ConstraintFunction
}) {
    if (!cluster.hasSons) {
        return cluster.items
    }

    const leafs = []
    cluster.visit((c) => {
        if (!c.hasSons && (constraint ? constraint(c) : true)) {
            leafs.push(...c.items)
        }
    })

    return leafs
}

// ----------------------------------------------------------------------

/**
 * Get all influcing matrices of a given cluster, starting at root and under
 * a specific constraint (if specified)
 * @category Visitors
 */
export function getInflluencing({
    root,
    cluster,
    constraint = undefined,
    eps = 0.1,
}: {
    root: Cluster
    cluster: Cluster
    constraint?: ConstraintFunction
    eps?: number
}) {
    if (!cluster || cluster.hasSons) {
        throw new Error('cluster c must be defined and be a leaf')
    }
    if (!root) {
        throw new Error('root is undefined')
    }

    const r: IHMatrix[] = []

    root.visit((c) => {
        const cond = constraint ? constraint(c) : true
        if (c.sons.length === 0 && cond) {
            r.push(new FullMatrix(c))
            return true
        } else if (cond && cluster.admissible(c, eps)) {
            r.push(new SparseMatrix(c))
            return true
        }
        return false
    })

    return r
}

// ----------------------------------------------------------------------
