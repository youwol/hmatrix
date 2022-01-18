import { Vector } from '../lib'

test('testing Vector', () => {
    const v = new Vector([1,2,3])
    console.log(v)

    v.add(1)
    console.log(v)

    v.add([1,2,3])
    console.log(v)

    const w = new Vector([3,2,1])
    v.add(w)
    console.log(v)

    v.add(w).scale(2).sub(10)
    console.log(v)
})
