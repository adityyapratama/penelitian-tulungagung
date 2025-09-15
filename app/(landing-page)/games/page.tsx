import { Suspense } from 'react';
import { getAllPuzzlesFormatted, getAllQuizzesFormatted, getAllStoriesFormatted } from './lib/data';
import { GameBrowser } from './_components/game-browser';
import { NavbarDemo } from '@/components/(landing-page)/navbar/navbar';

export default function GamesPage() {
  return (
    <>
      <NavbarDemo />
      <main className="min-h-screen bg-background">
        <div className="p-6 pt-20 md:pt-24">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-bold text-foreground">Pilih Game Favoritmu</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Jelajahi berbagai jenis permainan edukatif yang menarik. Kuis untuk menguji pengetahuan, cerita interaktif untuk petualangan seru, dan puzzle untuk mengasah logika.
              </p>
            </div>

            <Suspense>
              <GamesDataContainer />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  );
}

async function GamesDataContainer() {
  const [puzzles, quizzes, stories] = await Promise.all([
    getAllPuzzlesFormatted(),
    getAllQuizzesFormatted(),
    getAllStoriesFormatted(),
  ]);

  return <GameBrowser puzzles={puzzles} quizzes={quizzes} stories={stories} />;
}
