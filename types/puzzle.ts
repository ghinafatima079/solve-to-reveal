export type PuzzlePiece = {
    id: number
    row: number
    col: number
}

export interface PuzzleData {
    id: string
    imageSrc: string
    message: string
    createdAt: number
}