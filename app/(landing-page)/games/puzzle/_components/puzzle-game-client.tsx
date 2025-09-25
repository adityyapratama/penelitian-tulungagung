"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Play, RotateCcw, Trophy, Timer, XCircle, Loader2 } from "lucide-react";
import { CreateProgress } from "@/app/(member)/lib/actions";
import { PuzzleGameData } from "../[id]/play/page";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";

interface PuzzlePiece {
  id: number;
  correctPosition: number;
  currentPosition: number | null;
  backgroundPosition: string;
}
type DifficultyLevel = "easy" | "normal" | "hard";

const DIFFICULTY_CONFIG = {
  easy: { pieces: 9, cols: 3, rows: 3, label: "Mudah", scoreMultiplier: 1 },
  normal: { pieces: 12, cols: 4, rows: 3, label: "Normal", scoreMultiplier: 1.5 },
  hard: { pieces: 18, cols: 6, rows: 3, label: "Sulit", scoreMultiplier: 2 },
};

export function PuzzleGameClient({ gameData, difficulty: initialDifficulty }: { gameData: PuzzleGameData; difficulty: string; }) {
  const router = useRouter();
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<PuzzlePiece | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const difficulty = (initialDifficulty in DIFFICULTY_CONFIG ? initialDifficulty : 'easy') as DifficultyLevel;
  const config = DIFFICULTY_CONFIG[difficulty];

  const initializePuzzles = useCallback(() => {
    const newPieces: PuzzlePiece[] = [];
    for (let i = 0; i < config.pieces; i++) {
      const row = Math.floor(i / config.cols);
      const col = i % config.cols;
      const bgPosX = (col * 100) / (config.cols - 1);
      const bgPosY = (row * 100) / (config.rows - 1);
      newPieces.push({
        id: i,
        correctPosition: i,
        currentPosition: null,
        backgroundPosition: `${bgPosX}% ${bgPosY}%`,
      });
    }
    const shuffled = [...newPieces].sort(() => Math.random() - 0.5);
    setPieces(shuffled);
    setGameCompleted(false);
    setElapsedTime(0);
    setStartTime(new Date());
  }, [config.pieces, config.cols, config.rows]);

  useEffect(() => {
    initializePuzzles();
  }, [initializePuzzles]);

  useEffect(() => {
    if (startTime && !gameCompleted) {
      timerRef.current = setInterval(() => {
        setElapsedTime(Math.floor((new Date().getTime() - startTime.getTime()) / 1000));
      }, 1000);
    } else if (gameCompleted && timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTime, gameCompleted]);

  const handleGameCompletion = useCallback(async () => {
    if (!startTime || isSubmitting) return;

    setIsSubmitting(true);
    toast.loading("Menyimpan hasil...");

    const baseScore = gameData.xp_reward * config.scoreMultiplier;
    const timeBonus = Math.max(0, 180 - elapsedTime);
    const finalScore = Math.round(baseScore + timeBonus);

    const progressData = {
      contentId: gameData.puzzle_id,
      contentType: "puzzle" as const,
      skor: finalScore,
      startedAt: startTime,
    };

    const result = await CreateProgress(null, progressData);
    
    toast.dismiss();
    if (result?.success) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      toast.success(`${result.success}! Anda mendapatkan ${result.score} XP.`);
    } else {
      toast.error(result?.error || "Gagal menyimpan progres.");
    }
  }, [startTime, elapsedTime, gameData, config.scoreMultiplier, isSubmitting]);
  
  useEffect(() => {
    if (gameCompleted) {
      handleGameCompletion();
    }
  }, [gameCompleted, handleGameCompletion]);

  const handleDrop = (e: React.DragEvent, targetPosition: number | null) => {
    e.preventDefault();
    if (!draggedPiece || gameCompleted) return;

    const occupiedPiece = targetPosition !== null ? pieces.find((p) => p.currentPosition === targetPosition) : null;
    const updatedPieces = pieces.map((piece) => {
      if (piece.id === draggedPiece.id) return { ...piece, currentPosition: targetPosition };
      if (occupiedPiece && piece.id === occupiedPiece.id) return { ...piece, currentPosition: draggedPiece.currentPosition };
      return piece;
    });
    
    setPieces(updatedPieces);
    setDraggedPiece(null);

    const allPiecesOnBoard = updatedPieces.every(p => p.currentPosition !== null);
    if (allPiecesOnBoard) {
      const allCorrect = updatedPieces.every((p) => p.correctPosition === p.currentPosition);
      if (allCorrect) {
        setGameCompleted(true);
      }
    }
  };
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
  };
  
  const handleDragStart = (e: React.DragEvent, piece: PuzzlePiece) => { setDraggedPiece(piece); };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); };
  const handleDragEnd = () => { setDraggedPiece(null); };

  const availablePieces = pieces.filter((piece) => piece.currentPosition === null);
  const placedPieces = pieces.filter((piece) => piece.currentPosition !== null);

  const imageUrl = gameData.gambar || "/placeholder.svg";

  return (
    <Card className="w-full max-w-6xl max-h-[95vh] overflow-y-auto">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="flex items-center gap-2">{gameData.judul}</CardTitle>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline">Level: {config.label}</Badge>
            <Badge className="min-w-[100px] justify-center" variant="secondary">
              <Timer className="w-4 h-4 mr-1" />
              {formatTime(elapsedTime)}
            </Badge>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <X className="w-4 h-4 mr-2" />
          Keluar
        </Button>
      </CardHeader>

      <CardContent>
        {gameCompleted ? (
          <div className="text-center space-y-4 p-6 flex flex-col items-center justify-center min-h-[400px]">
            <Trophy className="w-16 h-16 text-yellow-500" />
            <h3 className="text-2xl font-bold text-green-700">Puzzle Selesai! 🎉</h3>
            <p className="text-muted-foreground">Hasil permainanmu sedang disimpan...</p>
            <div className="flex gap-4 mt-4">
              <Button onClick={initializePuzzles} disabled={isSubmitting}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Main Lagi
              </Button>
              <Button onClick={() => router.push(`/games/puzzle/${gameData.puzzle_id}`)}>Kembali ke Detail</Button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-semibold">Area Puzzle</h3>
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
                  const placedPiece = placedPieces.find((p) => p.currentPosition === index);
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
                  );
                })}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Potongan Puzzle</h3>
              <div 
                  className="grid grid-cols-3 gap-2 max-h-96 overflow-y-auto p-2 bg-muted/10 rounded-lg border"
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, null)}
              >
                {availablePieces.map((piece) => (
                  <div
                    key={`piece-${piece.id}`}
                    className="aspect-square bg-cover bg-no-repeat border-2 border-border rounded cursor-move hover:border-primary transition-colors"
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
      </CardContent>
    </Card>
  );
}