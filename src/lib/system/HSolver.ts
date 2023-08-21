import { Convergence } from "../Convergence"
import { IModel } from "../interfaces"
import { SystemTreeCell } from "./SystemTreeCell"

export type SolverDumpOptions = {
    cells?: boolean,
    blocks?: boolean,
    resume?: boolean
}

export class HSolver {
    private systemTree_: SystemTreeCell = null

    dump({ cells = false, blocks = false, resume = true }: SolverDumpOptions = {}): string {
        return this.systemTree_.dump('\n', { cells, blocks, resume })
    }

    build({
        model,
        minItems = 15,
        hmatEps = 1.2,
        maxDepth = 10
    }: {
        model: IModel,
        minItems?: number,
        hmatEps?: number,
        maxDepth?: number
    }) {
        this.systemTree_ = new SystemTreeCell()
        this.systemTree_.setModel(model)
        this.systemTree_.minItems = minItems
        this.systemTree_.blockEps = hmatEps
        this.systemTree_.maxDepth = maxDepth
        this.systemTree_.initialize(model.bbox())
        this.systemTree_.buildBlocks()
    }

    allocate() {
        this.systemTree_.allocate()
    }

    release() {
        this.systemTree_ = null // force GC (?)
    }

    protected solverPreprocessing() {
        // TODO
    }

    protected solverPostprocessing() {
        // TODO
    }

    protected iterationPreprocessing() {
        // TODO
    }

    protected iterationPostprocessing(c: Convergence) {
        // TODO
    }

    protected oneIteration() {
        // TODO
    }
}
