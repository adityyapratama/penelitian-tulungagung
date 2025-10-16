import { getAllStoriesFormatted } from "../lib/data";
import { GameGrid } from "./_components/game-grid";

export default async function StoriesListPage() {
  const stories = await getAllStoriesFormatted();

  return (
    <main className="container mx-auto py-8">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-[#2957A4] sm:text-5xl">
          Jelajahi Dunia Cerita
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600">
          Pilih petualanganmu dan tentukan jalan ceritamu sendiri.
        </p>
      </div>
      <GameGrid games={stories} />
    </main>
  );
}