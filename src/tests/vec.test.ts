import { Vector } from '../lib'

test('testing Vector', () => {
    const v = new Vector([1, 2, 3])
    expect(v[0]).toBe(1)
    expect(v[1]).toBe(2)
    expect(v[2]).toBe(3)

    v.add(1)
    expect(v[0]).toBe(2)
    expect(v[1]).toBe(3)
    expect(v[2]).toBe(4)

    v.add([1, 2, 3])
    expect(v[0]).toBe(3)
    expect(v[1]).toBe(5)
    expect(v[2]).toBe(7)

    const w = new Vector([3, 2, 1])
    v.add(w)
    expect(v[0]).toBe(6)
    expect(v[1]).toBe(7)
    expect(v[2]).toBe(8)

    v.add(w).scale(2).sub(10)
    expect(v[0]).toBe(9)
    expect(v[1]).toBe(9)
    expect(v[2]).toBe(9)

    // ... to be continuated ...
})
