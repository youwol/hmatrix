# hmatrix

Implementation of the H-Matrix in typescript.

## Description
Basically the code is organized as follow
### Geometrical partition
First, the geometrical information of the model is clusterized
- `IClusterizer` is used to partition the geometry of a model, leading to a tree made of `Cell`. The interface `IClusterizer` can be, for example, a bisection strategy implemented in `BisectionClusterizer`.
- A `Cell` is part of the generated tree structure from `IClusterizer`. A `Cell` contains `IItem` (e.g., `FieldItem` or `SourceItem`) which can be (in the case of **Arch**) triangular elements or observation points.

### Tree of cluster
As soon as the geometrical partition is done, we endup with tree made of cells. Then, non-empty cells are transformed into a `ClusterTree` (made of `Cluster`) to deal with the near and far influence.

    - 

## Documentation
Online documentation can be found [here](https://youwol.github.io/hmatrix/dist/docs/modules.html)
