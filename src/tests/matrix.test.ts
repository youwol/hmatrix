import { Matrix } from '../lib'

test('testing Vec', () => {
    const m = new Matrix(2,3)
    console.log(m)

    m[0][1] = 0.23
    console.log(m.toString())
})
