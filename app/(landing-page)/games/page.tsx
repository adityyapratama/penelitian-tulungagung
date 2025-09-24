import { Suspense } from "react"
import { getAllPuzzlesFormatted, getAllQuizzesFormatted, getAllStoriesFormatted } from "./lib/data"
import { GameBrowser } from "./_components/game-browser"
import { NavbarDemo } from "@/components/(landing-page)/navbar/navbar"

export default function GamesPage() {
  return (
    <>
      <NavbarDemo />
      <main className="min-h-screen bg-background">
        <div className="p-6 pt-20 md:pt-24">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold text-primary text-balance animate-fade-in">
                Pilih Game Favoritmu
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Jelajahi berbagai jenis permainan edukatif yang menarik. Kuis untuk menguji pengetahuan, cerita
                interaktif untuk petualangan seru, dan puzzle untuk mengasah logika.
              </p>
            </div>

            <Suspense
              fallback={
                <div className="flex items-center justify-center py-20">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              }
            >
              <GamesDataContainer />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  )
}

async function GamesDataContainer() {
  const [puzzles, quizzes, stories] = await Promise.all([
    getAllPuzzlesFormatted(),
    getAllQuizzesFormatted(),
    getAllStoriesFormatted(),
  ])

  return <GameBrowser puzzles={puzzles} quizzes={quizzes} stories={stories} />
}
