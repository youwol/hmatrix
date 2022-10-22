import { IHMatrix } from './interfaces/IHMatrix'
import { BBox } from './math/BBox'
import { IItem } from './interfaces/IItem'

/**
 * @category H-Matrix
 */
export class Cluster {
    private sons_ : Array<Cluster> = []
    private items_: Array<IItem>   = []
    private bbox_  = new BBox()
    private level_ = -1

    private matrix: IHMatrix = undefined
    private influencing: IHMatrix[] = []

    constructor(items: IItem[], level: number) {
        this.items_ = [...items]
        this.items_.forEach( item => {
            this.bbox_.grow( item.pos() )
        })
        this.level_ = level
    }

    get hasSons() {return this.sons_.length!==0}
    get sons () {return this.sons_}
    get bbox () {return this.bbox_}
    get items() {return this.items_}
    get level() {return this.level_}

    admissible(c: Cluster, eps: number) {
        const dist = this.bbox.distance(c.bbox)
        const r1 = this.bbox.diameter
        const r2 = c.bbox.diameter
        return (Math.min(r1,r2) < eps * dist)
    }

    visit(cb: Function, ...args) {
        if (cb(this, ...args)) return
        this.sons_.forEach( son => son.visit(cb, ...args) )
    }

    detect(condition: Function, container: Array<Cluster>) {
        if (condition(this)) {
            container.push(this)
            return
        }
        this.sons_.forEach( son => son.detect(condition, container) )
    }

    // used internally but since 'friend' does not exist in TS,
    // this method is public :-(
    clearItems() {
        this.items_ = []
    }

    // Check if c is inside this
    contains(c: Cluster) {
        return  c.bbox.min.reduce( (cur,v,i) => cur && (v >= this.bbox.min[i]), true) &&
                c.bbox.max.reduce( (cur,v,i) => cur && (v <= this.bbox.max[i]), true)
    }
}
