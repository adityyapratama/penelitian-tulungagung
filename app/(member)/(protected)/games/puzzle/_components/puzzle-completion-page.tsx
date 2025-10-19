"use client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trophy, Clock, Star, RotateCcw, Home } from "lucide-react"
import { RankingSection } from "./ranking-section" 

type Ranking = {
  skor: number | null;
  duration: number;
  Member: {
    foto_profil: string | null;
    User: { username: string } | null;
  } | null;
};

interface CompletionPageProps {
  score: number
  maxScore: number
  elapsedTime: number
  difficulty: string
  puzzleTitle: string
  puzzleId: number
  onPlayAgain: () => void
  leaderboardData: Ranking[] // 2. Terima data leaderboard asli sebagai props
}

export function PuzzleCompletionPage({
  score,
  maxScore,
  elapsedTime,
  difficulty,
  puzzleTitle,
  puzzleId,
  onPlayAgain,
  leaderboardData, 
}: CompletionPageProps) {
  const router = useRouter()

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getScoreColor = () => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-orange-600"
  }

  const getPerformanceText = () => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return "Luar biasa! Performa sempurna dalam menyelesaikan puzzle ini."
    if (percentage >= 80) return "Bagus sekali! Anda berhasil menyelesaikan puzzle dengan baik."
    if (percentage >= 60) return "Cukup baik! Masih ada ruang untuk peningkatan performa."
    return "Terus berlatih! Anda bisa melakukan lebih baik lagi."
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Trophy className="w-8 h-8 text-secondary" />
            <h1 className="text-3xl font-bold text-foreground">Puzzle Selesai!</h1>
            <Badge className="bg-primary text-primary-foreground px-3 py-1 rounded-full capitalize">{difficulty}</Badge>
          </div>
          <Button onClick={() => router.push("/games")} className="btn-primary">
            <Home className="w-4 h-4 mr-2" />
            Lobi Game
          </Button>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* 3. Gunakan komponen RankingSection di sini */}
          <div className="lg:col-span-2">
            <RankingSection rankings={leaderboardData} />
          </div>

          {/* Score Section */}
          <div className="lg:col-span-3">
            <Card className="game-card h-fit">
              <CardContent className="p-12 text-center space-y-8">
                {/* Score Display */}
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <Trophy className="w-16 h-16 text-secondary animate-bounce-in" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary mb-4">Skor Anda</h2>
                  <div className={`text-8xl font-bold ${getScoreColor()} mb-4`}>
                    {score}
                  </div>
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-6 max-w-md mx-auto mb-8">
                    <div className="text-center p-4 bg-muted/30 rounded-xl">
                      <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">{formatTime(elapsedTime)}</p>
                      <p className="text-sm text-muted-foreground">Waktu</p>
                    </div>
                    <div className="text-center p-4 bg-muted/30 rounded-xl">
                      <Star className="w-6 h-6 text-secondary mx-auto mb-2" />
                      <p className="text-2xl font-bold text-foreground">{Math.round((score / maxScore) * 100)}%</p>
                      <p className="text-sm text-muted-foreground">Performa</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="max-w-2xl mx-auto">
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {getPerformanceText()}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                  <Button onClick={onPlayAgain} className="btn-primary flex-1 hover:scale-105 transition-transform">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Main Lagi
                  </Button>
                  <Button
                    onClick={() => router.push(`/games/puzzle/${puzzleId}`)}
                    className="btn-secondary flex-1 hover:scale-105 transition-transform"
                    variant="outline"
                  >
                    Kembali ke Detail
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}