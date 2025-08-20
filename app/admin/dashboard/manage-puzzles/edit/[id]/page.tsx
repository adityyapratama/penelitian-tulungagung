import { getPuzzleById } from "../../lib/data";
import EditPuzzleForm from "../../_components/edit-form"; 

export default async function EditPuzzlePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const puzzle = await getPuzzleById(id);

  if (!puzzle || "error" in puzzle) {
    return <div className="container mx-auto py-8">Puzzle tidak ditemukan atau terjadi error.</div>;
  }

  return <EditPuzzleForm puzzle={puzzle} />;
}