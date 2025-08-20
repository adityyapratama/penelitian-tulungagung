import prisma from "@/lib/prisma";
import { TPuzzle } from "../_components/columns";

export async function getPuzzle() {
  try {
    const puzzles = await prisma.puzzle.findMany({});

    const response: TPuzzle[] = puzzles.map((puzzle) => {
      return {
        puzzle_id: puzzle.puzzle_id,
        judul: puzzle.judul,
        gambar: puzzle.gambar,
        kategori: puzzle.kategori,
        xp_reward: puzzle.xp_reward,
        created_by: puzzle.created_by!,
        created_at: puzzle.created_at,
      };
    });

    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function getPuzzleById(id: string) {
  try {
    const puzzle = await prisma.puzzle.findFirst({
      where: {
        puzzle_id: parseInt(id),
      },
    });

    return puzzle;
  } catch (error) {
    console.log(error);
    return { error: error };
  }
}
