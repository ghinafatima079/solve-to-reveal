"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

import { Caveat } from "next/font/google"

const caveat = Caveat({
    subsets: ["latin"],
    weight: ["400", "700"],
})

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────

interface PuzzleBoardProps {
    imageSrc: string
    hiddenMessage: string
}

interface PuzzlePiece {
    id: string

    // Which image slice this piece owns
    correctRow: number
    correctCol: number

    // Where this piece currently sits
    currentRow: number
    currentCol: number
}

interface BoardConfig {
    src: string

    rows: number
    cols: number

    boardWidth: number
    boardHeight: number

    pieceWidth: number
    pieceHeight: number

    pieces: PuzzlePiece[]
}

function getMaxBoardSize() {
    if (typeof window === "undefined") {
        return 680
    }

    return Math.min(
        window.innerWidth * 0.9,
        680
    )
}

// ─────────────────────────────────────────────────────────────
// SHUFFLE
// ─────────────────────────────────────────────────────────────

function shuffleArray<T>(array: T[]): T[] {
    const copy = [...array]

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(
            Math.random() * (i + 1)
        )

            ;[copy[i], copy[j]] = [
                copy[j],
                copy[i],
            ]
    }

    return copy
}

// ─────────────────────────────────────────────────────────────
// PIECES
// ─────────────────────────────────────────────────────────────

function makePieces(
    rows: number,
    cols: number
): PuzzlePiece[] {
    const solved: {
        row: number
        col: number
    }[] = []

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            solved.push({
                row,
                col,
            })
        }
    }

    const shuffled = shuffleArray([
        ...solved,
    ])

    return solved.map((correct, i) => {
        const current = shuffled[i]

        return {
            id: `${correct.row}-${correct.col}`,

            correctRow: correct.row,
            correctCol: correct.col,

            currentRow: current.row,
            currentCol: current.col,
        }
    })
}

// ─────────────────────────────────────────────────────────────
// PORTRAIT
// ─────────────────────────────────────────────────────────────

function buildPortraitConfig(
    src: string,
    naturalWidth: number,
    naturalHeight: number
): BoardConfig {
    const cols = 3
    const rows = 5

    const maxSize = getMaxBoardSize()

    const scale =
        maxSize / naturalHeight

    const boardWidth =
        naturalWidth * scale

    const boardHeight =
        naturalHeight * scale

    const pieceWidth =
        boardWidth / cols

    const pieceHeight =
        boardHeight / rows

    return {
        src,

        rows,
        cols,

        boardWidth,
        boardHeight,

        pieceWidth,
        pieceHeight,

        pieces: makePieces(rows, cols),
    }
}

// ─────────────────────────────────────────────────────────────
// LANDSCAPE
// ─────────────────────────────────────────────────────────────

function buildLandscapeConfig(
    src: string,
    naturalWidth: number,
    naturalHeight: number
): BoardConfig {
    const cols = 5
    const rows = 3

    const maxSize = getMaxBoardSize()

    const scale =
        maxSize / naturalWidth

    const boardWidth =
        naturalWidth * scale

    const boardHeight =
        naturalHeight * scale

    const pieceWidth =
        boardWidth / cols

    const pieceHeight =
        boardHeight / rows

    return {
        src,

        rows,
        cols,

        boardWidth,
        boardHeight,

        pieceWidth,
        pieceHeight,

        pieces: makePieces(rows, cols),
    }
}

// ─────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────

export default function PuzzleBoard({
    imageSrc,
    hiddenMessage,
}: PuzzleBoardProps) {
    const [config, setConfig] =
        useState<BoardConfig | null>(null)

    const [pieces, setPieces] =
        useState<PuzzlePiece[]>([])

    const [selectedId, setSelectedId] =
        useState<string | null>(null)

    const [solved, setSolved] =
        useState(false)

    const [moves, setMoves] =
        useState(0)

    const [seconds, setSeconds] =
        useState(0)

    const src = imageSrc

    const [showMessage, setShowMessage] =
        useState(false)

    const [copied, setCopied] =
        useState(false)

    // ───────────────────────────────────────────────────────────
    // LOAD IMAGE
    // ───────────────────────────────────────────────────────────

    useEffect(() => {
        setConfig(null)

        const img = new window.Image()

        img.src = src

        img.onload = () => {
            const {
                naturalWidth,
                naturalHeight,
            } = img

            let cfg: BoardConfig

            // Portrait
            if (
                naturalHeight > naturalWidth
            ) {
                cfg = buildPortraitConfig(
                    src,
                    naturalWidth,
                    naturalHeight
                )
            }

            // Landscape
            else {
                cfg = buildLandscapeConfig(
                    src,
                    naturalWidth,
                    naturalHeight
                )
            }

            setConfig(cfg)

            setPieces(cfg.pieces)
        }
    }, [src])

    useEffect(() => {
        if (solved) return

        const interval = setInterval(() => {
            setSeconds((prev) => prev + 1)
        }, 1000)

        return () => clearInterval(interval)
    }, [solved])

    useEffect(() => {
        if (solved) {
            const timer = setTimeout(() => {
                setShowMessage(true)
            }, 700)

            return () => clearTimeout(timer)
        } else {
            setShowMessage(false)
        }
    }, [solved])

    // ───────────────────────────────────────────────────────────
    // SWAP LOGIC
    // ───────────────────────────────────────────────────────────

    function checkSolved(
        updatedPieces: PuzzlePiece[]
    ) {
        const complete = updatedPieces.every(
            (piece) =>
                piece.correctRow ===
                piece.currentRow &&
                piece.correctCol ===
                piece.currentCol
        )

        if (complete) {
            setTimeout(() => {
                setSolved(true)
            }, 2000)
        } else {
            setSolved(false)
        }
    }

    function swapPieces(
        firstId: string,
        secondId: string
    ) {
        const first = pieces.find(
            (p) => p.id === firstId
        )

        const second = pieces.find(
            (p) => p.id === secondId
        )

        if (!first || !second) return

        const updated = pieces.map(
            (piece) => {
                if (piece.id === first.id) {
                    return {
                        ...piece,

                        currentRow:
                            second.currentRow,

                        currentCol:
                            second.currentCol,
                    }
                }

                if (piece.id === second.id) {
                    return {
                        ...piece,

                        currentRow:
                            first.currentRow,

                        currentCol:
                            first.currentCol,
                    }
                }

                return piece
            }
        )

        setPieces(updated)

        setMoves((prev) => prev + 1)

        checkSolved(updated)
    }

    function handlePieceClick(id: string) {
        // First click
        if (!selectedId) {
            setSelectedId(id)
            return
        }

        // Same piece clicked again
        if (selectedId === id) {
            setSelectedId(null)
            return
        }

        swapPieces(selectedId, id)

        setSelectedId(null)
    }

    async function handleShare() {
        await navigator.clipboard.writeText(
            window.location.href
        )

        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 2000)
    }

    // ───────────────────────────────────────────────────────────
    // LOADING
    // ───────────────────────────────────────────────────────────

    if (!config) {
        return (
            <div className="text-zinc-500 p-4">
                Loading puzzle...
            </div>
        )
    }

    const {
        boardWidth,
        boardHeight,

        pieceWidth,
        pieceHeight,
    } = config

    // ───────────────────────────────────────────────────────────
    // RENDER
    // ───────────────────────────────────────────────────────────

    const minutes = Math.floor(
        seconds / 60
    )

    const remainingSeconds =
        seconds % 60

    const formattedTime = `
  ${minutes}
  :
  ${remainingSeconds
            .toString()
            .padStart(2, "0")}
`
    return (
        <div className="flex flex-col items-center">
            <div className="mb-6 text-center">
                <p
                    className="
      text-sm
      uppercase
      tracking-[0.3em]
      text-zinc-500
      mb-3
    "
                >
                    Puzzle Reveal
                </p>

                <h1
                    className="
      text-3xl md:text-5xl
      font-bold
      text-white
      mb-3
    "
                >
                    Solve to Reveal
                </h1>

                <p
                    className="
      text-zinc-400
      max-w-md
      mx-auto
      leading-relaxed
    "
                >
                    Rearrange the puzzle pieces
                    to uncover a hidden message.
                </p>
            </div>
            {/* HUD */}
            <div
                className="
    flex items-center gap-6
    mb-5
    text-white
    transition-all duration-500
  "
                style={{
                    opacity: showMessage ? 0 : 1,

                    transform: showMessage
                        ? "translateY(0px)"
                        : "translateY(10px)",
                }}
            >
                <div>
                    Moves:
                    <span className="ml-2 font-bold">
                        {moves}
                    </span>
                </div>

                <div>
                    Time:
                    <span className="ml-2 font-bold">
                        {formattedTime}
                    </span>
                </div>

                <button
                    onClick={() => {
                        if (!config) return

                        setPieces(
                            makePieces(
                                config.rows,
                                config.cols
                            )
                        )

                        setSolved(false)

                        setSelectedId(null)

                        setMoves(0)

                        setSeconds(0)
                    }}
                    className="
          px-5 py-2
          bg-white
          text-black
          rounded-xl
          font-semibold
        "
                >
                    Shuffle
                </button>
            </div>

            {/* PERSPECTIVE */}

            <div
                className="relative"
                style={{
                    perspective: "2000px",
                }}
            >
                {/* ROTATING LAYER */}

                <div
                    className="
          relative
          transition-transform
          duration-700
        "
                    style={{
                        width: boardWidth,
                        height: boardHeight,

                        transformStyle: "preserve-3d",

                        transform: solved
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                    }}
                >
                    {/* FRONT FACE */}

                    <div
                        className="
            absolute inset-0
            border border-zinc-700
            overflow-hidden
            bg-black
          "
                        style={{
                            backfaceVisibility: "hidden",
                        }}
                    >
                        {pieces.map((piece) => {
                            const bgX =
                                -(piece.correctCol * pieceWidth)

                            const bgY =
                                -(piece.correctRow * pieceHeight)

                            return (
                                <motion.div
                                    key={piece.id}
                                    onClick={() => {
                                        handlePieceClick(piece.id)
                                    }}

                                    drag
                                    dragMomentum={false}
                                    dragSnapToOrigin

                                    layout

                                    whileDrag={{
                                        scale: 1.08,
                                        zIndex: 50,

                                        transition: {
                                            duration: 0.15,
                                        },
                                    }}

                                    onDragEnd={(event, info) => {
                                        const dropX =
                                            piece.currentCol * pieceWidth +
                                            info.offset.x

                                        const dropY =
                                            piece.currentRow * pieceHeight +
                                            info.offset.y

                                        const targetCol = Math.round(
                                            dropX / pieceWidth
                                        )

                                        const targetRow = Math.round(
                                            dropY / pieceHeight
                                        )

                                        const targetPiece = pieces.find(
                                            (p) =>
                                                p.currentRow === targetRow &&
                                                p.currentCol === targetCol
                                        )

                                        if (
                                            targetPiece &&
                                            targetPiece.id !== piece.id
                                        ) {
                                            swapPieces(
                                                piece.id,
                                                targetPiece.id
                                            )
                                        }
                                    }}

                                    style={{
                                        position: "absolute",

                                        borderRadius: 6,
                                        boxShadow:
                                            "0 2px 6px rgba(0,0,0,0.25)",

                                        width: pieceWidth - 2,
                                        height: pieceHeight - 2,

                                        left:
                                            piece.currentCol *
                                            pieceWidth,

                                        top:
                                            piece.currentRow *
                                            pieceHeight,

                                        backgroundImage: `url(${config.src})`,

                                        backgroundSize: `
                    ${boardWidth}px
                    ${boardHeight}px
                  `,

                                        backgroundPosition: `
                    ${bgX}px
                    ${bgY}px
                  `,

                                        backgroundRepeat:
                                            "no-repeat",

                                        outline:
                                            selectedId === piece.id
                                                ? "3px solid #22c55e"
                                                : "1px solid rgba(0,0,0,0.25)",

                                        cursor: "pointer",

                                        userSelect: "none",
                                    }}
                                />
                            )
                        })}
                    </div>

                    {/* BACK FACE */}

                    <div
                        className="
            absolute inset-0
            flex items-center justify-center
            bg-white
            rounded-xl
            p-10
            text-center
          "
                        style={{
                            transform: "rotateY(180deg)",

                            backfaceVisibility: "hidden",
                        }}
                    >
                        <div>
                            <p
                                className={`
    text-black
    text-3xl
    leading-relaxed
    ${caveat.className}

    transition-all
    duration-1000
  `}
                                style={{
                                    opacity: solved ? 1 : 0,

                                    transform: solved
                                        ? "translateY(0px)"
                                        : "translateY(10px)",
                                }}
                            >
                                {hiddenMessage}
                            </p>
                        </div>

                    </div>
                </div>
            </div>

            {solved && (
                <div
                    className="
      mt-8
      flex flex-col sm:flex-row
      gap-4
      animate-in
      fade-in
      duration-700
    "
                >
                    <button
                        onClick={handleShare}
                        className="
        px-6 py-3
        rounded-2xl
        bg-white
        text-black
        font-semibold
        hover:scale-105
        transition
      "
                    >
                        {copied
                            ? "Link Copied"
                            : "Copy Puzzle Link"}
                    </button>

                    <Link
                        href="/create"
                        className="
        inline-flex
        items-center justify-center
        px-6 py-3
        rounded-2xl
        border border-zinc-700
        text-white
        font-semibold
        hover:bg-zinc-900
        transition
      "
                    >
                        Make Your Own Puzzle
                    </Link>
                </div>
            )}

        </div>
    )
}