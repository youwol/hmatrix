import { BBox } from "./math";

export function insertSpaces(s: string, n: number): string {
    if (n === 0) {
        return s
    }
    for (let i = 0; i < n; ++i) {
        s += '  '
    }
    return s
}

// -------------------------------------------------------

/**
 * @returns The squared distance between a and b if they do not touch
 * or intersect, zero otherwise.
 * 
 * This method is 5x faster than `BBox.distance`. Also, we might have
 * a problem witgh this last method.
 */
export function getDistanceSq(a: BBox, b: BBox) {
    const sqr = (a: number) => a ** 2
    let ibox = intersection(a, b)
    let distSq = 0
    for (let i = 0; i < 3; ++i) {
        if (ibox.min[i] > ibox.max[i]) {
            distSq += sqr(ibox.min[i] - ibox.max[i])
        }
    }
    return distSq
}

function intersection(a: BBox, b: BBox) {
    let res: BBox = new BBox
    for (let i = 0; i < 3; ++i) {
        res.min[i] = Math.max(a.min[i], b.min[i])
        res.max[i] = Math.min(a.max[i], b.max[i])
    }
    return res
}
