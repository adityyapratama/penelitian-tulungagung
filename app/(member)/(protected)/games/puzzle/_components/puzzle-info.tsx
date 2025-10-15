import { Card } from "@/components/ui/card";
import { Clock, Users, Trophy } from "lucide-react";
import Image from 'next/image';

type Puzzle = {
  puzzle_id: number;
  judul: string;
  gambar: string;
}

type PuzzleStats = {
  playerCount: number;
  averageTime: number;
  recordTime: number;
  personalBest: number | null;
}

function formatDuration(seconds: number): string {
  if (seconds === 0) return "-";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
}

export function PuzzleInfo({ puzzle, stats }: { puzzle: Puzzle, stats: PuzzleStats }) {
  return (
    <Card className="bg-primary rounded-lg p-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 relative rounded-lg overflow-hidden border-2 border-secondary/30 flex-shrink-0">
            <Image 
              src={puzzle.gambar || "/placeholder.svg"} 
              alt={puzzle.judul} 
              fill 
              className="object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">{puzzle.judul}</h2>
            <p className="text-white mt-1">Susun gambar dengan menggeser kotak-kotak ke posisi yang benar</p>
            <div className="flex items-center flex-wrap gap-4 mt-3">
              <div className="flex items-center gap-2 text-sm text-white">
                <Users className="w-4 h-4" />
                <span>{stats.playerCount.toLocaleString()} pemain</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white">
                <Clock className="w-4 h-4" />
                <span>Rata-rata {formatDuration(stats.averageTime)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white">
                <Trophy className="w-4 h-4" />
                <span>Rekor: {formatDuration(stats.recordTime)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right border-t md:border-t-0 md:border-l pl-0 md:pl-6 pt-4 md:pt-0 mt-4 md:mt-0 w-full md:w-auto">
          <div className="text-sm text-white">Personal Best</div>
          <div className="text-2xl font-bold text-white">
            {stats.personalBest ? formatDuration(stats.personalBest) : "-"}
          </div>
        </div>
      </div>
    </Card>
  );
}