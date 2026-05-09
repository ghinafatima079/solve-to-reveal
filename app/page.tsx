import Link from "next/link"

export default function Home() {
  return (
    <main
      className="
        min-h-screen
        bg-zinc-950
        text-white
        overflow-hidden
      "
    >
      {/* HERO */}

      <section
        className="
          min-h-screen
          flex flex-col
          items-center justify-center
          text-center
          px-6
        "
      >
        <div className="max-w-4xl">
          <p
            className="
              text-zinc-400
              mb-4
              tracking-[0.3em]
              uppercase
              text-sm
            "
          >
            Puzzle Reveal Experience
          </p>

          <h1
            className="
              text-6xl md:text-8xl
              font-black
              leading-none
              mb-6
            "
          >
            Hide a
            <br />
            message
            <br />
            inside a
            <br />
            puzzle.
          </h1>

          <p
            className="
              text-zinc-400
              text-lg md:text-xl
              max-w-2xl
              mx-auto
              mb-10
            "
          >
            Upload an image,
            attach a hidden note,
            and share a puzzle
            someone must solve
            to reveal it.
          </p>

          <div
            className="
              flex flex-col sm:flex-row
              gap-4
              justify-center
            "
          >
            <Link
              href="/create"
              className="
                px-8 py-4
                rounded-2xl
                bg-white
                text-black
                font-semibold
                text-lg
              "
            >
              Create Puzzle
            </Link>

            <a
              href="#how"
              className="
                px-8 py-4
                rounded-2xl
                border border-zinc-700
                hover:bg-zinc-900
                transition
              "
            >
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}

      <section
        id="how"
        className="
          px-6
          pb-32
        "
      >
        <div
          className="
            max-w-6xl
            mx-auto
            grid
            grid-cols-1 md:grid-cols-3
            gap-6
          "
        >
          <div
            className="
              border border-zinc-800
              rounded-3xl
              p-8
              bg-zinc-900/50
            "
          >
            <div className="text-4xl mb-4">
              🖼️
            </div>

            <h3 className="text-2xl font-bold mb-3">
              Upload
            </h3>

            <p className="text-zinc-400">
              Choose any image —
              portrait or landscape.
            </p>
          </div>

          <div
            className="
              border border-zinc-800
              rounded-3xl
              p-8
              bg-zinc-900/50
            "
          >
            <div className="text-4xl mb-4">
              💌
            </div>

            <h3 className="text-2xl font-bold mb-3">
              Hide Message
            </h3>

            <p className="text-zinc-400">
              Attach a secret note
              behind the puzzle.
            </p>
          </div>

          <div
            className="
              border border-zinc-800
              rounded-3xl
              p-8
              bg-zinc-900/50
            "
          >
            <div className="text-4xl mb-4">
              🧩
            </div>

            <h3 className="text-2xl font-bold mb-3">
              Share & Reveal
            </h3>

            <p className="text-zinc-400">
              Send the puzzle link
              for someone to solve.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}