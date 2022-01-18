import { BBox } from '../lib'

test('testing BBox', () => {
    const b = new BBox()
    console.log(b)
    
    b.grow([1,1,1])
    console.log(b)

    b.grow([1,1,-1])
    console.log(b)

    b.scale(2)
    console.log(b)
})

test('testing distance', () => {
    if (1) {
        const c = 2
        const a = new BBox([0,0], [1,1])
        const b = new BBox([c,c], [c+1,c+1])
        console.log(a.distance(b))
    }
    if (0) {
        const c = 0
        const a = new BBox([0], [1])
        const b = new BBox([c], [c+1])
        console.log(a.distance(b))
    }
})
