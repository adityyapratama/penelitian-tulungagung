"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, RotateCcw, Timer } from "lucide-react"
import { CreateProgress, GetLeaderboard } from "@/app/(member)/lib/actions"
import type { PuzzleGameData } from "../[id]/play/page"
import confetti from "canvas-confetti"
import toast from "react-hot-toast"
import { PuzzleCompletionPage } from "./puzzle-completion-page"

interface PuzzlePiece {
  id: number
  correctPosition: number
  currentPosition: number | null
  backgroundPosition: string
}

type DifficultyLevel = "easy" | "normal" | "hard"

type Ranking = {
  member_id: number | null;
  skor: number | null;
  duration: number;
  Member: {
    foto_profil: string | null;
    User: { username: string } | null;
  } | null;
};

const DIFFICULTY_CONFIG = {
  easy: { pieces: 9, cols: 3, rows: 3, label: "Mudah", scoreMultiplier: 1 },
  normal: { pieces: 12, cols: 4, rows: 3, label: "Normal", scoreMultiplier: 1.5 },
  hard: { pieces: 18, cols: 6, rows: 3, label: "Sulit", scoreMultiplier: 2 },
}

export function PuzzleGameClient({
  gameData,
  difficulty: initialDifficulty,
}: {
  gameData: PuzzleGameData
  difficulty: string
}) {
  const router = useRouter()
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [gameCompleted, setGameCompleted] = useState(false)
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const [maxScore, setMaxScore] = useState(0)
  const [leaderboardData, setLeaderboardData] = useState<Ranking[] | null>(null)

  const difficulty = (initialDifficulty in DIFFICULTY_CONFIG ? initialDifficulty : "easy") as DifficultyLevel
  const config = DIFFICULTY_CONFIG[difficulty]

  const initializePuzzles = useCallback(() => {
    const newPieces: PuzzlePiece[] = []
    for (let i = 0; i < config.pieces; i++) {
      const row = Math.floor(i / config.cols)
      const col = i % config.cols
      const bgPosX = (col * 100) / (config.cols - 1)
      const bgPosY = (row * 100) / (config.rows - 1)
      newPieces.push({
        id: i,
        correctPosition: i,
        currentPosition: null,
        backgroundPosition: `${bgPosX}% ${bgPosY}%`,
      })
    }
    const shuffled = [...newPieces].sort(() => Math.random() - 0.5)
    setPieces(shuffled)
    setGameCompleted(false)
    setLeaderboardData(null)
    setElapsedTime(0)
    setStartTime(new Date())
  }, [config.pieces, config.cols, config.rows])

  useEffect(() => {
    initializePuzzles()
  }, [initializePuzzles])

  useEffect(() => {
    if (startTime && !gameCompleted) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000))
      }, 1000)
    } else if (gameCompleted && timerRef.current) {
      clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [startTime, gameCompleted])

  const handleGameCompletion = useCallback(async () => {
    if (!startTime || isSubmitting) return

    setIsSubmitting(true)
    toast.loading("Menyimpan hasil...")

    const baseScore = gameData.xp_reward * config.scoreMultiplier
    const timeBonus = Math.max(0, 180 - elapsedTime)
    const calculatedFinalScore = Math.round(baseScore + timeBonus)
    const calculatedMaxScore = Math.round(gameData.xp_reward * config.scoreMultiplier + 180)

    setFinalScore(calculatedFinalScore)
    setMaxScore(calculatedMaxScore)

    const progressData = {
      contentId: gameData.puzzle_id,
      contentType: "puzzle" as const,
      skor: calculatedFinalScore,
      startedAt: startTime,
    }

    const result = await CreateProgress(null, progressData)
    toast.dismiss();

    if (result?.success) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } })
      toast.success(`${result.success}! Anda mendapatkan ${result.score} XP.`)
      
      try {
        const finalLeaderboardData = await GetLeaderboard(String(gameData.puzzle_id), "puzzle");
        setLeaderboardData(finalLeaderboardData);
      } catch (error) {
        toast.error("Gagal memuat papan peringkat.");
        setLeaderboardData([]);
      }
    } else {
      toast.error(result?.error || "Gagal menyimpan progres.")
      setLeaderboardData([]);
    }

    setIsSubmitting(false)
  }, [startTime, elapsedTime, gameData, config.scoreMultiplier, isSubmitting])

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const handleDragStart = (e: React.DragEvent, piece: PuzzlePiece) => setDraggedPiece(piece)
  const handleDragOver = (e: React.DragEvent) => e.preventDefault()
  const handleDragEnd = () => setDraggedPiece(null)

  const handleDrop = (e: React.DragEvent, targetPosition: number | null) => {
    e.preventDefault();
    if (!draggedPiece) return;
    const pieceInTargetSlot = pieces.find(p => p.currentPosition === targetPosition);

    const updatedPieces = pieces.map(p => {
      if (p.id === draggedPiece.id) {
        return { ...p, currentPosition: targetPosition };
      }
      if (pieceInTargetSlot && p.id === pieceInTargetSlot.id) {
        return { ...p, currentPosition: draggedPiece.currentPosition };
      }
      return p;
    });

    setPieces(updatedPieces);
    setDraggedPiece(null);

    const isCompleted = updatedPieces.every((p) => p.currentPosition === p.correctPosition);
    if (isCompleted) {
      setGameCompleted(true);
      handleGameCompletion();
    }
  };

  const availablePieces = pieces.filter((piece) => piece.currentPosition === null)
  const placedPieces = pieces.filter((piece) => piece.currentPosition !== null)
  const imageUrl = gameData.gambar || "/placeholder.svg"

  if (gameCompleted && leaderboardData) {
    return (
      <PuzzleCompletionPage
        score={finalScore}
        maxScore={maxScore}
        elapsedTime={elapsedTime}
        difficulty={difficulty}
        puzzleTitle={gameData.judul}
        puzzleId={gameData.puzzle_id}
        onPlayAgain={initializePuzzles}
        leaderboardData={leaderboardData}
      />
    )
  }

  if (gameCompleted && !leaderboardData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold text-foreground">Menyiapkan Hasil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-foreground">{gameData.judul}</h1>
            <Badge className="bg-primary text-primary-foreground px-3 py-1 rounded-full">{config.label}</Badge>
          </div>
          <Button
            onClick={() => router.back()}
            className="btn-primary hover:bg-destructive hover:text-destructive-foreground transition-colors"
          >
            <X className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 h-[calc(100vh-200px)]">
          <div className="lg:col-span-2">
            <Card className="game-card h-full">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl text-primary flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  Area Penyusunan Puzzle
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[calc(100%-80px)]">
                <div
                  className="w-full h-full bg-muted/30 border-2 border-dashed border-primary/30 rounded-xl overflow-hidden relative"
                  style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
                    gridTemplateRows: `repeat(${config.rows}, 1fr)`,
                  }}
                >
                  {Array.from({ length: config.pieces }).map((_, index) => {
                    const placedPiece = placedPieces.find((p) => p.currentPosition === index)
                    return (
                      <div
                        key={`board-${index}`}
                        className="border border-border/50 bg-card/50 relative transition-all duration-300 hover:bg-primary/10 hover:border-primary/50 hover:shadow-inner"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        {placedPiece && (
                          <div
                            className={`w-full h-full bg-cover bg-no-repeat cursor-move transition-all duration-300 hover:scale-105 hover:shadow-lg rounded-sm ${
                              draggedPiece?.id === placedPiece.id ? "opacity-50 scale-95" : ""
                            }`}
                            style={{
                              backgroundImage: `url(${imageUrl})`,
                              backgroundPosition: placedPiece.backgroundPosition,
                              backgroundSize: `${config.cols * 100}% ${config.rows * 100}%`,
                            }}
                            draggable
                            onDragStart={(e) => handleDragStart(e, placedPiece)}
                            onDragEnd={handleDragEnd}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="game-card flex-1">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-primary flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-secondary rounded-full"></div>
                    Potongan Puzzle
                  </div>
                  <Badge className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full">
                    {availablePieces.length} tersisa
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-4 bg-muted/20 rounded-xl border-2 border-dashed border-secondary/30 scrollbar-thin scrollbar-thumb-primary/20"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, null)}
                >
                  {availablePieces.map((piece) => (
                    <div
                      key={`piece-${piece.id}`}
                      className="aspect-square bg-cover bg-no-repeat border-2 border-border rounded-lg cursor-move hover:border-primary hover:shadow-lg transition-all duration-300 transform hover:scale-110 hover:-rotate-1 animate-float"
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                        backgroundPosition: piece.backgroundPosition,
                        backgroundSize: `${config.cols * 100}% ${config.rows * 100}%`,
                        animationDelay: `${piece.id * 0.1}s`,
                      }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, piece)}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="game-card">
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-3 text-4xl font-mono font-bold text-primary mb-2">
                    <Timer className="w-8 h-8 text-secondary animate-pulse-glow" />
                    {formatTime(elapsedTime)}
                  </div>
                  <p className="text-muted-foreground text-sm">Waktu Bermain</p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Progress</span>
                    <span>{Math.round(((config.pieces - availablePieces.length) / config.pieces) * 100)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${((config.pieces - availablePieces.length) / config.pieces) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                <Button
                  onClick={initializePuzzles}
                  className="btn-secondary w-full hover:scale-105 transition-transform"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset Puzzle
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}