import { Vector } from '../lib'

test('testing Vector', () => {
    const v = new Vector([1, 2, 3])
    expect(v[0]).toEqual(1)
    expect(v[1]).toEqual(2)
    expect(v[2]).toEqual(3)

    v.add(1)
    expect(v[0]).toEqual(2)
    expect(v[1]).toEqual(3)
    expect(v[2]).toEqual(4)

    v.add([1, 2, 3])
    expect(v[0]).toEqual(3)
    expect(v[1]).toEqual(5)
    expect(v[2]).toEqual(7)

    const w = new Vector([3, 2, 1])
    v.add(w)
    expect(v[0]).toEqual(6)
    expect(v[1]).toEqual(7)
    expect(v[2]).toEqual(8)

    v.add(w).scale(2).sub(10)
    expect(v[0]).toEqual(9)
    expect(v[1]).toEqual(9)
    expect(v[2]).toEqual(9)

    // ... to be continuated ...
})
