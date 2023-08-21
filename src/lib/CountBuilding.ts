import { IModel } from "./interfaces"

let count_ = 0

export class CountBuilding {

    step_ = 10
    nbr_ = 0
    cur_nbr_full_ = 0
    cur_nbr_approx_ = 0
    cur_nbr_ = 0
    cur_ = 0
    int_step_ = 0
    model_: IModel = undefined
    start_ = 0

    constructor(model: IModel, nbr: number, step: number) {
        this.model_ = model
        this.step_ = nbr / step
        this.nbr_ = nbr
        this.cur_nbr_full_ = 0
        this.cur_nbr_approx_ = 0
        this.cur_nbr_ = 0
        this.cur_ = 0
        this.int_step_ = step
        ++count_
    }

    start() {
        this.start_ = Date.now()
    }

    tickFull(nbr: number) {
        this.cur_nbr_full_ += nbr
        this.cur_nbr_ += nbr
        this.display()
    }

    tickSparse(nbr: number) {
        this.cur_nbr_approx_ += nbr
        this.cur_nbr_ += nbr
        this.display()
    }

    stop(): string {
        const time = Date.now()
        return `Progress: f=${Math.sqrt(this.cur_nbr_full_)} a=%${Math.sqrt(this.cur_nbr_approx_)} t=${(time - this.start_) / 1000000}s")`
    }

    protected display() {
        let a = this.cur_nbr_ / this.step_
        if (a > this.cur_) {
            let time = Date.now()
            if (this.model_) {
                console.log(`Progress: ${a * this.int_step_}%: f=${Math.sqrt(this.cur_nbr_full_)} a=${Math.sqrt(this.cur_nbr_approx_)}).`)
            }
            this.start_ = Date.now()
            this.cur_ = a
        }
    }
}
