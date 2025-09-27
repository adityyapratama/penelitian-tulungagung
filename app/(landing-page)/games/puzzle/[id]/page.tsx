import { getPuzzleById } from "@/app/admin/dashboard/manage-puzzles/lib/data";
import { GetLeaderboard} from "@/app/(member)/lib/actions";
import { getMemberDetailsByIds} from "@/app/(landing-page)/games/lib/data";
import { getPuzzleStats } from "../lib/data";
import { ContentType } from "@/lib/generated/prisma";
import { notFound } from "next/navigation";
import { PuzzleInfo } from "../_components/puzzle-info";
import { RankingSection } from "../_components/ranking-section";
import { DifficultySelector } from "../_components/difficulty-selector";
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

function BackButton({ href, text }: { href: string; text: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8">
      <ArrowLeft className="w-4 h-4" />
      <span>{text}</span>
    </Link>
  );
}

export default async function PuzzleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [puzzle, leaderboardScores, stats] = await Promise.all([
    getPuzzleById(id),
    GetLeaderboard(id, ContentType.puzzle),
    getPuzzleStats(id)
  ]);

  if (!puzzle || "error" in puzzle) {
    notFound();
  }

  const memberIds = leaderboardScores
    .map(score => score.member_id)
    .filter((id): id is number => id !== null);

  const memberDetails = await getMemberDetailsByIds(memberIds);
  
  const memberDetailsMap = new Map(memberDetails.map(m => [m.member_id, m]));

  const fullLeaderboardData = leaderboardScores.map(score => ({
    ...score,
    Member: score.member_id ? memberDetailsMap.get(score.member_id) || null : null,
  }));

  return (
    <main className="min-h-screen bg-background">
      <div className="py-12 px-4 sm:px-8 lg:px-24"> 
        <div className="mx-auto max-w-7xl space-y-8">
          <BackButton href="/games" text="Kembali ke Lobi Game" />
          <PuzzleInfo puzzle={puzzle} stats={stats} />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <RankingSection rankings={fullLeaderboardData} />
            </div>
            <div className="lg:col-span-2 space-y-8">
              <DifficultySelector puzzleId={puzzle.puzzle_id} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}