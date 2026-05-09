"use client"

import { useEffect, useState } from "react"

import { useParams } from "next/navigation"

import PuzzleBoard from "@/components/puzzle/puzzleBoard"

import { supabase } from "@/lib/supabase"

export default function PuzzlePage() {
    const params = useParams()

    const [loading, setLoading] =
        useState(true)

    const [puzzle, setPuzzle] =
        useState<any>(null)

    useEffect(() => {
        async function fetchPuzzle() {
            console.log("PARAMS:", params)

            const id = params.id as string

            console.log("FETCHING:", id)

            const { data, error } =
                await supabase
                    .from("puzzles")
                    .select("*")
                    .eq("id", id)
                    .single()

            console.log("DATA:", data)
            console.log("ERROR:", error)

            if (data) {
                setPuzzle(data)
            }

            setLoading(false)
        }

        if (params?.id) {
            fetchPuzzle()
        }
    }, [params])

    if (loading) {
        return (
            <main
                className="
          min-h-screen
          bg-zinc-950
          text-white
          flex items-center justify-center
        "
            >
                Loading puzzle...
            </main>
        )
    }

    if (!puzzle) {
        return (
            <main
                className="
          min-h-screen
          bg-zinc-950
          text-white
          flex items-center justify-center
        "
            >
                Puzzle not found.
            </main>
        )
    }

    return (
        <main
            className="
        min-h-screen
        bg-zinc-950
        flex items-center justify-center
        p-10
      "
        >
            <PuzzleBoard
                imageSrc={puzzle.image_url}
                hiddenMessage={puzzle.hidden_message}
            />
        </main>
    )
}