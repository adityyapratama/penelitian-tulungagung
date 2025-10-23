import { notFound, redirect } from "next/navigation"
import { auth } from "@/auth"
import { getPuzzleById } from "@/app/admin/dashboard/manage-puzzles/lib/data"
import { PuzzleGameClient } from "../../_components/puzzle-game-client"

export default async function PuzzlePlayPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ difficulty: string; group_id?: string }>;
}) {
  const [{ id }, searchParamsObj] = await Promise.all([params, searchParams])
  return <GameLoader id={id} searchParams={searchParamsObj} />
}

async function GameLoader({
  id,
  searchParams,
}: {
  id: string
  searchParams: { difficulty: string; group_id?: string }
}) {
  const session = await auth()
  if (!session?.user) {
    redirect("/login")
  }

  const puzzle = await getPuzzleById(id)
  const difficulty = searchParams.difficulty || "easy"
  const groupId = searchParams.group_id;

  if (!puzzle || "error" in puzzle) {
    notFound()
  }

  const gameData: PuzzleGameData = {
    puzzle_id: puzzle.puzzle_id,
    judul: puzzle.judul,
    gambar: puzzle.gambar,
    xp_reward: puzzle.xp_reward,
  }

  return <PuzzleGameClient gameData={gameData} difficulty={difficulty} groupId={groupId}/>
}

export type PuzzleGameData = {
  puzzle_id: number
  judul: string
  gambar: string
  xp_reward: number
}
