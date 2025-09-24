import { Clock, Users, Trophy } from "lucide-react";
import Image from 'next/image'; // Gunakan Image dari Next.js

// Tipe data untuk puzzle, bisa diimpor dari Prisma jika mau
type Puzzle = {
  puzzle_id: number;
  judul: string;
  gambar: string;
  // tambahkan properti lain yang relevan jika ada (pemain, rekor, dll)
}

export function PuzzleInfo({ puzzle }: { puzzle: Puzzle }) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
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
            <h2 className="text-2xl font-bold text-foreground">{puzzle.judul}</h2>
            <p className="text-muted-foreground mt-1">Susun gambar dengan menggeser kotak-kotak ke posisi yang benar</p>
            <div className="flex items-center flex-wrap gap-4 mt-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="w-4 h-4" />
                <span>1,234 pemain</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>Rata-rata 2m 30s</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="w-4 h-4" />
                <span>Rekor: 45s</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-right border-t md:border-t-0 md:border-l pl-0 md:pl-6 pt-4 md:pt-0 mt-4 md:mt-0 w-full md:w-auto">
          <div className="text-sm text-muted-foreground">Personal Best</div>
          <div className="text-2xl font-bold text-foreground">1m 23s</div>
          <div className="text-sm text-muted-foreground">Medium Level</div>
        </div>
      </div>
    </div>
  );
}