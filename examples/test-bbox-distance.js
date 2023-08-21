const hmat = require('../dist/@youwol/hmatrix')

// function method1(c1, c2) {
//     let d = 1e34;
//     for (let i = 0; i < 8; ++i) {
//         for (let j = 0; j < 8; ++j) {
//             const dx = c1.points_[i][0] - c2.points_[j][0]
//             const dy = c1.points_[i][1] - c2.points_[j][1]
//             const dz = c1.points_[i][2] - c2.points_[j][2]
//             const D = dx * dx + dy * dy + dz * dz
//             if (D < d) {
//                 d = D
//             }
//         }
//     }
//     return d
// }

function method1(c1, c2) {
    return c1.distance(c2)
}

function method2(c1, c2) {
    return hmat.getDistanceSq(c1, c2)
}

function perform(n, method) {
    let arr = new Array(n)
    const start = Date.now()
    for (let i=0; i<n; ++i) {
        arr[i] = method(c1, c2)
    }
    const stop = Date.now()
    console.log((stop-start)/1e3)
    return stop-start
}

const n = 10000000
const c1 = new hmat.BBox([0,0,0, 1,1,1])
const c2 = new hmat.BBox([2,2,2, 3,3,3])
const t1 = perform(n, method1)
const t2 = perform(n, method2)
console.log(t1/t2)
