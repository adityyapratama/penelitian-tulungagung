"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Play, LogIn } from "lucide-react";
import type { GameCardData } from "../../lib/data";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";

interface GameGridProps {
  games: GameCardData[];
}

export function GameGrid({ games }: GameGridProps) {
  const { status } = useSession();
  const router = useRouter();

  const getGameUrl = (game: GameCardData) => {
    const id = game.id.split("-")[1];
    return `/games/stories/${id}`;
  };

  const getDifficultyBadge = (difficulty: string) => {
    switch (difficulty) {
      case "Mudah":
        return { backgroundColor: "#4CAF50", color: "white" };
      case "Sedang":
        return { backgroundColor: "#FFC107", color: "#212121" };
      case "Sulit":
        return { backgroundColor: "#F44336", color: "white" };
      default:
        return { backgroundColor: "#607D8B", color: "white" };
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {games.map((game, index) => {
        const isLocked = false;
        
        const difficulties = ["Mudah", "Sedang", "Sulit"];
        const difficulty = difficulties[index % difficulties.length];
        const badgeStyle = getDifficultyBadge(difficulty);

        const GameButton = (
          <Button
            size="sm"
            className="w-full gap-1 text-xs text-white transition-all duration-300 shadow-lg h-8"
            style={{
              backgroundColor: isLocked ? "#D1D5DB" : "#2957A4",
              boxShadow: isLocked ? "none" : `0 4px 12px #2957A440`,
            }}
            disabled={isLocked}
          >
            <Play className="w-3 h-3" />
            {isLocked ? "Terkunci" : "Mainkan"}
          </Button>
        );

        return (
          <Card
            key={game.id}
            className="relative flex flex-col pt-0 overflow-hidden transition-all duration-500 border-0 group hover:shadow-2xl hover:-translate-y-2 animate-bounce-in"
            style={{
              animationDelay: `${index * 0.1}s`,
              background: "linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)",
              boxShadow: "0 4px 20px rgba(41, 87, 164, 0.1)",
            }}
          >
            <div className="relative flex-shrink-0 w-full overflow-hidden rounded-t-lg h-42">
              <Image
                src={game.image || "/placeholder.svg"}
                alt={game.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute top-2 right-2 flex items-center rounded-full bg-[#FFCC29] px-2 py-1 text-xs font-bold text-[#2957A4] shadow-md">
                <Trophy className="w-3 h-3 mr-1" />
                {game.xp_reward}
              </div>
            </div>

            <div className="flex flex-col flex-grow p-4 space-y-3">
              <div className="flex-grow space-y-2">
                <h3 className="text-sm font-semibold line-clamp-2" style={{ color: "#2957A4" }}>
                  {game.title}
                </h3>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="mr-2 font-medium truncate text-muted-foreground">{game.category}</span>
                <Badge
                  className="px-2 py-1 text-xs"
                  style={{
                    backgroundColor: badgeStyle.backgroundColor,
                    color: badgeStyle.color,
                    border: "none",
                  }}
                >
                  {difficulty}
                </Badge>
              </div>

              {status === 'authenticated' ? (
                <Link href={isLocked ? "#" : getGameUrl(game)} className={isLocked ? "pointer-events-none" : ""}>
                  {GameButton}
                </Link>
              ) : (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    {GameButton}
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Anda Belum Login</AlertDialogTitle>
                      <AlertDialogDescription>
                        Untuk memainkan game, Anda perlu login terlebih dahulu.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Nanti Saja</AlertDialogCancel>
                      <AlertDialogAction onClick={() => router.push('/sign-in')}>
                        <LogIn className="w-4 h-4 mr-2" />
                        Login Sekarang
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}