import { Block } from "../Block"
import { BlockType } from "../types"
import { SystemFullBlock, SystemSparseBlock, SystemSuperBlock } from "./SystemBlock"

// Simple factory
export namespace BlockFactory {
    export function create(type: BlockType): Block {
        switch (type) {
            case BlockType.SUPER: return new SystemSuperBlock
            case BlockType.FULL: return new SystemFullBlock
            case BlockType.SPARSE: return new SystemSparseBlock
            default: throw new Error('never reach this point')
        }
    }
}
