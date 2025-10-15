"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Target, Flame, Play, Check } from "lucide-react";
import Link from "next/link";

type Difficulty = "easy" | "normal" | "hard";

const difficulties = [
  {
    id: "easy" as Difficulty,
    label: "MUDAH",
    description: "Puzzle 3x3 untuk pemula",
    icon: Zap,
    color: "bg-green-500 text-green-50",
    stats: { grid: "3x3", avgTime: "2m 30s", players: "1,234" },
  },
  {
    id: "normal" as Difficulty,
    label: "MENENGAH",
    description: "Puzzle 4x3 untuk tantangan menengah",
    icon: Target,
    color: "bg-yellow-500 text-yellow-50",
    stats: { grid: "4x3", avgTime: "5m 15s", players: "856" },
  },
  {
    id: "hard" as Difficulty,
    label: "SULIT",
    description: "Puzzle 6x3 untuk ahli puzzle",
    icon: Flame,
    color: "bg-red-500 text-red-50",
    stats: { grid: "6x3", avgTime: "12m 45s", players: "342" },
  },
];

export function DifficultySelector({ puzzleId }: { puzzleId: number }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("easy");

  return (
    <div className="w-full space-y-6">
      <div className="text-left">
        <h2 className="text-3xl font-bold text-foreground">Pilih Tingkat Kesulitan</h2>
        <p className="text-muted-foreground mt-1">Sesuaikan ukuran puzzle dengan kemampuan Anda.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {difficulties.map((difficulty) => {
          const IconComponent = difficulty.icon;
          const isSelected = selectedDifficulty === difficulty.id;

          return (
            <Card
              key={difficulty.id}
              className={`cursor-pointer transition-all duration-300 text-center p-4 space-y-3 flex flex-col items-center justify-center border-2 ${
                isSelected ? "border-primary shadow-lg bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedDifficulty(difficulty.id)}
            >
              <div className={`p-3 rounded-full ${difficulty.color}`}>
                <IconComponent className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-foreground">{difficulty.label}</h3>
              <p className="text-sm text-muted-foreground">{difficulty.stats.grid}</p>
              
              {/* Checkmark untuk yang terpilih */}
              <div className="h-6 mt-2">
                {isSelected && (
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <Button
        size="lg"
        className="w-full mt-4 text-lg font-semibold py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
        asChild
      >
        <Link href={`/games/puzzle/${puzzleId}/play?difficulty=${selectedDifficulty}`}>
          <Play className="w-5 h-5 mr-2" />
          Mulai Puzzle {difficulties.find((d) => d.id === selectedDifficulty)?.label}
        </Link>
      </Button>
    </div>
  );
}