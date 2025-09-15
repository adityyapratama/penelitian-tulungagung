import { getPuzzle } from "@/app/admin/dashboard/manage-puzzles/lib/data";
import { getQuizzes } from "@/app/admin/dashboard/manage-quiz/lib/data";
import { GetStories } from "@/app/admin/dashboard/manage-stories/lib/data";

export type GameCardData = {
  id: string;
  type: 'puzzle' | 'kuis' | 'cerita';
  title: string;
  description: string;
  image: string;
  category: string;
  xp_reward: number;
  createdAt: Date;
};

export async function getAllPuzzlesFormatted(): Promise<GameCardData[]> {
  const puzzles = await getPuzzle();
  if (!Array.isArray(puzzles)) return [];
  
  return puzzles.map(p => ({
    id: `puzzle-${p.puzzle_id}`,
    title: p.judul,
    type: 'puzzle',
    image: p.gambar || "/placeholder.svg",
    description: `Susun gambar ${p.judul} untuk mengasah logikamu.`,
    category: p.kategori?.replace("_", " ") || "Umum",
    xp_reward: p.xp_reward,
    createdAt: p.created_at, 
  }));
}

export async function getAllQuizzesFormatted(): Promise<GameCardData[]> {
  const quizzes = await getQuizzes();
  if (!Array.isArray(quizzes)) return [];

  return quizzes.map(q => ({
    id: `quiz-${q.kuis_id}`,
    title: q.judul,
    type: 'kuis',
    image: q.thumbnail || "/placeholder.svg",
    description: q.deskripsi || "Kuis ini tidak memiliki deskripsi.",
    category: q.KategoriKuis?.nama_kategori || 'Tidak ada kategori',
    xp_reward: q.xp_reward,
    createdAt: q.created_at,
  }));
}

export async function getAllStoriesFormatted(): Promise<GameCardData[]> {
  const stories = await GetStories();
  if (!Array.isArray(stories)) return [];

  return stories.map(s => ({
    id: `story-${s.cerita_id}`,
    title: s.judul,
    type: 'cerita',
    image: s.thumbnail || "/placeholder.svg",
    description: s.deskripsi || "Cerita ini tidak memiliki deskripsi.",
    category: s.kategori || 'Tidak ada kategori',
    xp_reward: s.xp_reward,
    createdAt: s.created_at || new Date(), 
  }));
}