import type { GameCardData } from "../lib/data";
import { GameRow } from "./game-row"; 

interface GameSectionsProps {
  puzzles: GameCardData[];
  quizzes: GameCardData[];
  stories: GameCardData[];
}

export function GameSections({ puzzles, quizzes, stories }: GameSectionsProps) {
  return (
    <div className="space-y-12">
      {/* Tampilkan section Puzzle hanya jika ada data puzzle */}
      {puzzles.length > 0 && (
        <GameRow 
          title="Permainan Puzzle" 
          description="Asah logika dan ketajaman visual dengan menyusun gambar."
          games={puzzles}
          href="/games/puzzle"
        />
      )}

      {/* Tampilkan section Kuis hanya jika ada data kuis */}
      {quizzes.length > 0 && (
        <GameRow 
          title="Permainan Kuis"
          description="Uji wawasan dan pengetahuanmu dalam berbagai topik menarik."
          games={quizzes}
          href="/games/quiz"
        />
      )}

      {/* Tampilkan section Cerita hanya jika ada data cerita */}
      {stories.length > 0 && (
        <GameRow 
          title="Cerita Interaktif"
          description="Masuki dunia petualangan di mana pilihanmu menentukan jalan cerita."
          games={stories}
          href="/games/story"
        />
      )}
    </div>
  );
}