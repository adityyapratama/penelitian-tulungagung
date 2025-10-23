import { getPuzzleById } from "@/app/admin/dashboard/manage-puzzles/lib/data";
import { getPuzzleStats } from "../lib/data";
import { notFound } from "next/navigation";
import { PuzzleInfo } from "../_components/puzzle-info";
import { DifficultySelector } from "../_components/difficulty-selector";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function BackButton({ href, text }: { href: string; text: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{text}</span>
    </Link>
  );
}

type PageSearchParams = {
  group_id?: string;
};

export default async function PuzzleDetailPage({
  params,
  searchParams, 
}: {
  params: { id: string }; 
  searchParams: PageSearchParams; 
}) {
  const { id } = params;

  const [puzzle, stats] = await Promise.all([
    getPuzzleById(id),
    getPuzzleStats(id),
  ]);

  if (!puzzle || "error" in puzzle) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="py-12 px-4 sm:px-8 lg:px-24">
        <div className="mx-auto max-w-7xl space-y-8">
          <BackButton href="/games" text="Kembali ke Lobi Game" />
          <PuzzleInfo puzzle={puzzle} stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3 space-y-8">
              <DifficultySelector
                puzzleId={puzzle.puzzle_id}
                groupId={searchParams.group_id}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}