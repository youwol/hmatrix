import { BBox } from '../lib'

test('testing BBox', () => {
    const b = new BBox()
    expect(b.diameter).toEqual(0)
    
    b.grow([1,1,1])
    expect(b.diameter).toEqual(0)
    expect(b.min[0]).toEqual(1)
    expect(b.min[1]).toEqual(1)
    expect(b.min[2]).toEqual(1)
    expect(b.max[0]).toEqual(1)
    expect(b.max[1]).toEqual(1)
    expect(b.max[2]).toEqual(1)

    b.grow([1,1,-1])
    expect(b.diameter).toEqual(2)
    expect(b.min[0]).toEqual(1)
    expect(b.min[1]).toEqual(1)
    expect(b.min[2]).toEqual(-1)
    expect(b.max[0]).toEqual(1)
    expect(b.max[1]).toEqual(1)
    expect(b.max[2]).toEqual(1)

    b.scale(2)
    expect(b.diameter).toEqual(4)
    expect(b.min[0]).toEqual(2)
    expect(b.min[1]).toEqual(2)
    expect(b.min[2]).toEqual(-2)
    expect(b.max[0]).toEqual(2)
    expect(b.max[1]).toEqual(2)
    expect(b.max[2]).toEqual(2)
})

test('testing distance', () => {
    if (1) {
        const c = 2
        const a = new BBox([0,0], [1,1])
        const b = new BBox([c,c], [c+1,c+1])
        expect(a.distance(b)).toBeCloseTo(Math.sqrt(2))
    }
})
