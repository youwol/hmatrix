import { Matrix } from '../lib'

test('testing Vec', () => {
    const m = new Matrix(2,3)
    m[0][1] = 0.23

    expect(m[0][1]).toEqual(0.23)

    // ... to be continuated ...
})
