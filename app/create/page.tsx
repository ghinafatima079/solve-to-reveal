"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import PuzzleBoard from "@/components/puzzle/puzzleBoard"

import { supabase } from "@/lib/supabase"

export default function CreatePage() {
    const router = useRouter()

    const [generatedLink, setGeneratedLink] =
        useState("")

    const [imageSrc, setImageSrc] =
        useState<string | null>(null)

    const [message, setMessage] =
        useState("")

    function handleImageUpload(
        e: React.ChangeEvent<HTMLInputElement>
    ) {
        const file = e.target.files?.[0]

        if (!file) return

        const reader = new FileReader()

        reader.onloadend = () => {
            const result = reader.result

            if (typeof result === "string") {
                console.log("BASE64 READY")

                setImageSrc(result)
            }
        }

        reader.readAsDataURL(file)
    }

    async function handleGeneratePuzzle() {
        if (!imageSrc || !message) return

        try {
            /*
              convert base64 → file
            */

            const response = await fetch(imageSrc)

            const blob = await response.blob()

            /*
              unique filename
            */

            const fileName = `${crypto.randomUUID()}.png`

            /*
              upload image
            */

            const { error: uploadError } =
                await supabase.storage
                    .from("puzzle-images")
                    .upload(fileName, blob)

            if (uploadError) {
                console.error("UPLOAD ERROR:", uploadError)
                return
            }

            /*
              get public URL
            */

            const {
                data: { publicUrl },
            } = supabase.storage
                .from("puzzle-images")
                .getPublicUrl(fileName)

            /*
              save puzzle row
            */

            const { data, error } =
                await supabase
                    .from("puzzles")
                    .insert({
                        image_url: publicUrl,
                        hidden_message: message,
                    })
                    .select()
                    .single()

            if (error) {
                console.error("DB ERROR:", error)
                return
            }

            const link =
                `${window.location.origin}/puzzle/${data.id}`

            setGeneratedLink(link)

        } catch (err) {
            console.error(err)
        }
    }

    if (generatedLink) {
        return (
            <main
                className="
        min-h-screen
        bg-zinc-950
        text-white
        flex items-center justify-center
        p-10
      "
            >
                <div
                    className="
          w-full
          max-w-xl
          bg-zinc-900
          border border-zinc-800
          rounded-3xl
          p-8
          space-y-6
          text-center
        "
                >
                    <div className="space-y-2">
                        <h1 className="text-4xl font-bold">
                            Puzzle Created 🎉
                        </h1>

                        <p className="text-zinc-400">
                            Share this link with someone.
                        </p>
                    </div>

                    <div
                        className="
            bg-zinc-950
            border border-zinc-800
            rounded-xl
            p-4
            break-all
            text-sm
            text-zinc-300
          "
                    >
                        {generatedLink}
                    </div>

                    <div
                        className="
            flex gap-4 justify-center
          "
                    >
                        <button
                            onClick={() =>
                                navigator.clipboard.writeText(
                                    generatedLink
                                )
                            }
                            className="
              px-5 py-3
              rounded-xl
              bg-white
              text-black
              font-semibold
            "
                        >
                            Copy Link
                        </button>

                        <button
                            onClick={() =>
                                router.push(
                                    generatedLink
                                )
                            }
                            className="
              px-5 py-3
              rounded-xl
              bg-zinc-800
              hover:bg-zinc-700
            "
                        >
                            Open Puzzle
                        </button>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main
            className="
        min-h-screen
        bg-zinc-950
        text-white
        p-10
      "
        >
            <div
                className="
          max-w-6xl
          mx-auto
          grid
          grid-cols-1 lg:grid-cols-2
          gap-10
        "
            >
                {/* LEFT PANEL */}

                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">
                            Create Puzzle
                        </h1>

                        <p className="text-zinc-400">
                            Upload an image and
                            attach a hidden message.
                        </p>
                    </div>

                    {/* IMAGE */}

                    <div className="space-y-2">
                        <label className="block font-medium">
                            Upload Image
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="
                block w-full
                text-sm
                text-zinc-400
              "
                        />
                    </div>

                    {/* MESSAGE */}

                    <div className="space-y-2">
                        <label className="block font-medium">
                            Hidden Message
                        </label>

                        <textarea
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                            placeholder="
                Write your hidden note...
              "
                            className="
                w-full
                h-40
                rounded-xl
                bg-zinc-900
                border border-zinc-800
                p-4
                resize-none
                outline-none
              "
                        />

                        <button
                            onClick={handleGeneratePuzzle}
                            disabled={!imageSrc || !message}
                            className="
    px-6 py-3
    bg-white
    text-black
    rounded-xl
    font-semibold
    disabled:opacity-50
  "
                        >
                            Generate Puzzle Link
                        </button>
                    </div>
                </div>

                {/* RIGHT PANEL */}

                <div
                    className="
            flex items-center justify-center
          "
                >
                    {imageSrc ? (
                        <PuzzleBoard
                            imageSrc={imageSrc}
                            hiddenMessage={message}
                        />
                    ) : (
                        <div
                            className="
                text-zinc-500
                border border-dashed
                border-zinc-700
                rounded-2xl
                p-20
              "
                        >
                            Upload an image to preview
                            the puzzle.
                        </div>
                    )}
                </div>
            </div>
        </main>
    )
}