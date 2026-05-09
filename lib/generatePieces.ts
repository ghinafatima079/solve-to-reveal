import { PuzzlePiece } from "@/types/puzzle"

type GeneratePiecesParams = {
    rows: number
    cols: number
}

export function generatePieces({
    rows,
    cols,
}: GeneratePiecesParams): PuzzlePiece[] {
    const pieces: PuzzlePiece[] = []

    let id = 0

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            pieces.push({
                id,
                row,
                col,
            })

            id++
        }
    }

    return pieces
}