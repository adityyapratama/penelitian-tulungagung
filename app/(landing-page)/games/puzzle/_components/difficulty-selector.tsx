"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Target, Flame, Play, Clock, Users, Grid3X3 } from "lucide-react";
import Link from "next/link";

type Difficulty = "easy" | "medium" | "hard";

const difficulties = [
  {
    id: "easy" as Difficulty,
    label: "EASY",
    description: "Puzzle 3x3 untuk pemula",
    icon: Zap,
    color: "bg-green-500 text-white",
    stats: { grid: "3x3", avgTime: "2m 30s", players: "1,234" },
  },
  {
    id: "medium" as Difficulty,
    label: "MEDIUM",
    description: "Puzzle 4x3 untuk tantangan menengah",
    icon: Target,
    color: "bg-yellow-500 text-white",
    stats: { grid: "4x3", avgTime: "5m 15s", players: "856" },
  },
  {
    id: "hard" as Difficulty,
    label: "HARD",
    description: "Puzzle 6x3 untuk ahli puzzle",
    icon: Flame,
    color: "bg-red-500 text-white",
    stats: { grid: "6x3", avgTime: "12m 45s", players: "342" },
  },
];

export function DifficultySelector({ puzzleId }: { puzzleId: number }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);

  return (
    <div className="w-full space-y-6">
      <div className="text-left mb-6">
        <h2 className="text-3xl font-bold text-foreground">Pilih Tingkat Kesulitan</h2>
        <p className="text-muted-foreground mt-1">Sesuaikan ukuran puzzle dengan kemampuan Anda.</p>
      </div>

      <div className="space-y-4">
        {difficulties.map((difficulty) => {
          const IconComponent = difficulty.icon;
          const isSelected = selectedDifficulty === difficulty.id;

          return (
            <Card
              key={difficulty.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                isSelected ? "border-primary shadow-lg bg-primary/5" : "border-border hover:border-primary/50"
              }`}
              onClick={() => setSelectedDifficulty(difficulty.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${difficulty.color}`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground mb-1">{difficulty.label}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{difficulty.description}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Grid3X3 className="w-3 h-3" />
                        {difficulty.stats.grid}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {difficulty.stats.avgTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {difficulty.stats.players} pemain
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {selectedDifficulty && (
        <Button
          size="lg"
          className="w-full mt-8 text-lg font-semibold py-6 bg-primary hover:bg-primary/90 text-primary-foreground"
          asChild
        >
          <Link href={`/games/puzzle/${puzzleId}/play?difficulty=${selectedDifficulty}`}>
            <Play className="w-5 h-5 mr-2" />
            Mulai Puzzle {difficulties.find((d) => d.id === selectedDifficulty)?.label}
          </Link>
        </Button>
      )}
    </div>
  );
}