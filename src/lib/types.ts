
// export type CountBuilding = () => number

/**
 * @category Contruction
 */
export enum BlockType {
    SUPER,
    FULL,
    SPARSE
}

/**
 * @category Contruction
 */
export enum ItemType {
    SOURCE,
    FIELD,
}

/**
 * @category Contruction
 */
export enum ConstructionMode {
    UNKNOWN,
    SYSTEM,
    OBS
}

export enum ApproximationType {
    ACA,
    ACA_PLUS, // to be done
    HCA1, // to be done
    HCA2 // to be done
}

export class Point extends Array<number> {
    constructor() {
        super(3)
        this.fill(0)
    }
    set(x: number, y: number, z: number) {
        super[0] = x
        super[1] = y
        super[2] = z
    }
}

export type Vector3 = Point // Synonymous...
