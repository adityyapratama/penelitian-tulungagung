import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getPuzzleById } from "@/app/admin/dashboard/manage-puzzles/lib/data";
import { PuzzleGameClient } from "../../_components/puzzle-game-client";

export default async function PuzzlePlayPage({ params, searchParams }: {
  params: { id: string };
  searchParams: { difficulty: string };
}) {
  return <GameLoader params={params} searchParams={searchParams} />;
}

async function GameLoader({ params, searchParams }: {
  params: { id: string };
  searchParams: { difficulty: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const puzzle = await getPuzzleById(params.id);
  const difficulty = searchParams.difficulty || 'easy';

  if (!puzzle || "error" in puzzle) {
    notFound();
  }

  const gameData: PuzzleGameData = {
    puzzle_id: puzzle.puzzle_id,
    judul: puzzle.judul,
    gambar: puzzle.gambar,
    xp_reward: puzzle.xp_reward,
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <PuzzleGameClient 
        gameData={gameData} 
        difficulty={difficulty}
      />
    </main>
  );
}

export type PuzzleGameData = {
  puzzle_id: number;
  judul: string;
  gambar: string;
  xp_reward: number;
};