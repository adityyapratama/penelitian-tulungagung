"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Play, RotateCcw, Trophy, Timer, XCircle } from "lucide-react"

interface PuzzlePiece {
  id: number
  correctPosition: number
  currentPosition: number | null
  backgroundPosition: string
}

interface PuzzleDemoProps {
  imageUrl: string
  onClose: () => void
}

type DifficultyLevel = "easy" | "normal" | "hard"

const DIFFICULTY_CONFIG = {
  easy: { pieces: 9, cols: 3, rows: 3, label: "Mudah" },
  normal: { pieces: 12, cols: 4, rows: 3, label: "Normal" },
  hard: { pieces: 18, cols: 6, rows: 3, label: "Sulit" },
}

const GAME_DURATION_SECONDS = 60; 

export default function PuzzleDemo({ imageUrl, onClose }: PuzzleDemoProps) {
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy")
  const [pieces, setPieces] = useState<PuzzlePiece[]>([])
  const [gameStarted, setGameStarted] = useState(false)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameFailed, setGameFailed] = useState(false) 
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null)
  
  const [remainingTime, setRemainingTime] = useState(GAME_DURATION_SECONDS)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

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
    setGameStarted(false)
    setGameCompleted(false)
    setGameFailed(false)
    setRemainingTime(GAME_DURATION_SECONDS)
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }, [config.pieces, config.cols, config.rows])

  useEffect(() => {
    initializePuzzles()
  }, [difficulty, initializePuzzles])

  useEffect(() => {
    if (gameStarted && !gameCompleted && !gameFailed) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prev) => {
          if (prev <= 1) {
            setGameFailed(true);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (gameCompleted || gameFailed) {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    };
  }, [gameStarted, gameCompleted, gameFailed]);

  const startGame = () => {
    setGameStarted(true)
    setRemainingTime(GAME_DURATION_SECONDS)
  }

  const resetGame = () => {
    initializePuzzles()
  }

  const handleDragStart = (e: React.DragEvent, piece: PuzzlePiece) => {
    setDraggedPiece(piece)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetPosition: number | null) => {
    e.preventDefault()
    if (!draggedPiece) return

    const occupiedPiece = targetPosition !== null ? pieces.find((p) => p.currentPosition === targetPosition) : null

    const updatedPieces = pieces.map((piece) => {
      if (piece.id === draggedPiece.id) {
        return { ...piece, currentPosition: targetPosition }
      }
      
      if (occupiedPiece && piece.id === occupiedPiece.id) {
        return { ...piece, currentPosition: draggedPiece.currentPosition }
      }

      return piece
    })
    
    setPieces(updatedPieces)
    setDraggedPiece(null)

    const allPiecesOnBoard = updatedPieces.every(p => p.currentPosition !== null);
    if(allPiecesOnBoard) {
        const allCorrect = updatedPieces.every((p) => p.correctPosition === p.currentPosition)
        if (allCorrect) {
          setGameCompleted(true)
        }
    }
  }

  const handleDragEnd = () => {
    setDraggedPiece(null)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const availablePieces = pieces.filter((piece) => piece.currentPosition === null)
  const placedPieces = pieces.filter((piece) => piece.currentPosition !== null)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Play className="w-5 h-5" />
              Demo Puzzle
            </CardTitle>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline">
                Level: {config.label} ({config.pieces} pieces)
              </Badge>
              {gameStarted && !gameCompleted && !gameFailed && (
                <Badge className="min-w-[100px] justify-center" variant={remainingTime <= 10 ? "destructive" : "secondary"}>
                  <Timer className="w-4 h-4 mr-1" />
                  {formatTime(remainingTime)}
                </Badge>
              )}
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Tampilan sebelum game dimulai */}
          {!gameStarted && !gameCompleted && !gameFailed && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Pilih Level Kesulitan:</label>
                <Select value={difficulty} onValueChange={(value: DifficultyLevel) => setDifficulty(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Mudah (9 pieces)</SelectItem>
                    <SelectItem value="normal">Normal (12 pieces)</SelectItem>
                    <SelectItem value="hard">Sulit (18 pieces)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={startGame} className="w-full">
                <Play className="w-4 h-4 mr-2" />
                Mulai Bermain
              </Button>
            </div>
          )}

          {/* Tampilan saat game berjalan */}
          {gameStarted && !gameCompleted && !gameFailed && (
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Area Puzzle</h3>
                  <Button variant="outline" size="sm" onClick={resetGame}>
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset
                  </Button>
                </div>
                <div
                  className="relative bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
                  style={{
                    aspectRatio: `${config.cols}/${config.rows}`,
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
                        className="border border-gray-300 bg-gray-50 relative transition-colors hover:bg-gray-100"
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                      >
                        {placedPiece && (
                          <div
                            className={`w-full h-full bg-cover bg-no-repeat cursor-move ${draggedPiece?.id === placedPiece.id ? "opacity-50" : ""}`}
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
              </div>
              
              <div className="space-y-4">
                <h3 className="font-semibold">Potongan Puzzle</h3>
                <div 
                    className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto p-2 bg-gray-50 rounded-lg border"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, null)}
                >
                  {availablePieces.map((piece) => (
                    <div
                      key={`piece-${piece.id}`}
                      className="aspect-square bg-cover bg-no-repeat border-2 border-gray-300 rounded cursor-move hover:border-blue-400 transition-colors"
                      style={{
                        backgroundImage: `url(${imageUrl})`,
                        backgroundPosition: piece.backgroundPosition,
                        backgroundSize: `${config.cols * 100}% ${config.rows * 100}%`,
                      }}
                      draggable
                      onDragStart={(e) => handleDragStart(e, piece)}
                      onDragEnd={handleDragEnd}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tampilan saat game selesai (menang) */}
          {gameCompleted && (
            <div className="text-center space-y-4 p-6 bg-green-50 rounded-lg border border-green-200">
              <Trophy className="w-12 h-12 text-yellow-500 mx-auto" />
              <h3 className="text-xl font-bold text-green-800">Selamat! 🎉</h3>
              <p className="text-green-700">Anda berhasil menyelesaikan puzzle tepat waktu!</p>
              <Button onClick={resetGame} variant="outline">Main Lagi</Button>
            </div>
          )}
          
          {/* Tampilan saat game selesai (kalah) */}
          {gameFailed && (
            <div className="text-center space-y-4 p-6 bg-red-50 rounded-lg border border-red-200">
              <XCircle className="w-12 h-12 text-red-500 mx-auto" />
              <h3 className="text-xl font-bold text-red-800">Waktu Habis! ⌛</h3>
              <p className="text-red-700">Anda tidak berhasil menyelesaikan puzzle. Coba lagi!</p>
              <Button onClick={resetGame} variant="outline">Coba Lagi</Button>
            </div>
          )}

        </CardContent>
      </Card>
    </div>
  )
}