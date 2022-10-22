const A = [
    [0.431, 0.354, 0.582, 0.417, 0.455],
    [0.491, 0.396, 0.674, 0.449, 0.427], 
    [0.446, 0.358, 0.583, 0.413, 0.441], 
    [0.380, 0.328, 0.557, 0.372, 0.349], 
    [0.412, 0.340, 0.516, 0.375, 0.370]
]

const a = [
    [0.582,  0.674,  0.583,  0.557,  0.516],
    [0    , -0.1  , -0.014, -0.087, -0.034],
    [0    , 0     ,  0.016, -0.02 ,  0.032]
]
const b = [
    [ 0.431,  0.354, 0.582,  0.417,  0.455],
    [-0.008, -0.014, 0    , -0.033, -0.1  ],
    [ 0.016,  0.005, 0    ,  0    ,  0    ]
]
const  c = [0.582, -0.1, 0.016]


const N = a[0].length
const M = new Array(N).fill(undefined).map( _ => new Array(N).fill(0) ) 

a.forEach( (v,k) => {
    const w = b[k]
    for (let i=0; i<N; ++i) {
        for (let j=0; j<N; ++j) {
            M[i][j] += v[i]*w[j]/c[k]
        }
    }
})

// checking

const P = new Array(N).fill(undefined).map( _ => new Array(N).fill(0) ) 
for (let i=0; i<N; ++i) {
    for (let j=0; j<N; ++j) {
        P[i][j] = Math.abs(M[i][j]-A[i][j])/A[i][j]*100
    }
}

console.log(P)