import { BBox } from '../lib'

test('testing BBox', () => {
    const b = new BBox()
    expect(b.diameter).toBe(0)

    b.grow([1, 1, 1])
    expect(b.diameter).toBe(0)
    expect(b.min[0]).toBe(1)
    expect(b.min[1]).toBe(1)
    expect(b.min[2]).toBe(1)
    expect(b.max[0]).toBe(1)
    expect(b.max[1]).toBe(1)
    expect(b.max[2]).toBe(1)

    b.grow([1, 1, -1])
    expect(b.diameter).toBe(2)
    expect(b.min[0]).toBe(1)
    expect(b.min[1]).toBe(1)
    expect(b.min[2]).toEqual(-1)
    expect(b.max[0]).toBe(1)
    expect(b.max[1]).toBe(1)
    expect(b.max[2]).toBe(1)

    b.scale(2)
    expect(b.diameter).toBe(4)
    expect(b.min[0]).toBe(2)
    expect(b.min[1]).toBe(2)
    expect(b.min[2]).toEqual(-2)
    expect(b.max[0]).toBe(2)
    expect(b.max[1]).toBe(2)
    expect(b.max[2]).toBe(2)
})

test('testing distance', () => {
    const c = 2
    const a = new BBox([0, 0], [1, 1])
    const b = new BBox([c, c], [c + 1, c + 1])
    expect(a.distance(b)).toBeCloseTo(Math.sqrt(2))
})
