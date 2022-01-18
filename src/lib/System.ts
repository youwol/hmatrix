import { ClusterTree } from './ClusterTree'
import { ConstraintFunction, getLeafs } from './visitors'
import { IItem } from './interfaces/IItem'
import { Cluster } from './Cluster'
import { Equations } from './Equations'

/**
 * @category H-Matrix
 */
export class System {
    private equations: Equations[]
    private leafs    : Cluster[]
    private root     : Cluster = undefined
    private eps      = 0
    private maxDepth = 4
    private minItems = 10

    /**
     * Setup the HMatrix system by splitting geometrically
     */
    constructor(
        {items, constraint = undefined, maxDepth=4, minItems=10}:
        {items: IItem[], constraint?: ConstraintFunction, maxDepth?: number, minItems?: number}
    ) {
        const tree = new ClusterTree(items)
        tree.maxDepth = maxDepth
        tree.minItems = minItems
        tree.subdivide()
        this.maxDepth = maxDepth
        this.minItems = minItems

        this.root = tree.root
        this.leafs = getLeafs({
            cluster: this.root,
            constraint: constraint
        })
    }

    /**
     * Build the HMatrix system
     */
    build(
        {eps = 0.1, constraint = undefined}:
        {eps?: number, constraint?: ConstraintFunction}
    ) {
        this.eps = eps
        
        // Equations start from the leaf nodes
        this.equations = this.leafs.map( cluster => new Equations(cluster))
        this.equations.forEach( equation => equation.construct({
            root: this.root,
            constraint: constraint,
            eps
        }))
    }

    info() {
        let n = 0
        this.leafs.forEach(c=> n+= c.items.length)
        return {
            items: n,
            clusterLeafs: this.leafs.length,
            eps: this.eps,
            maxDepth: this.maxDepth,
            minItems: this.minItems,
            equations: this.equations.map( equation => equation.info())
        }
    }
}
