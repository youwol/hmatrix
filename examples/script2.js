const hmat = require('../dist/@youwol/hmatrix')

const c = 1.1
const a = new hmat.BBox([0, 0], [1, 1])
const b = new hmat.BBox([c, c], [c + 1, c + 1])
console.log(a.distance(b))
