import { Cluster } from '../Cluster'

export interface IHMatrix {
    cluster: Cluster
    dof(): number
    build(): void
    release(): void
}
