"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Play, ArrowRight, Puzzle, LogIn } from "lucide-react";
import type { GameCardData } from "../lib/data";
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

interface GameRowProps {
  title: string;
  description: string;
  games: GameCardData[];
  href: string;
}

export function GameRow({ title, description, games, href }: GameRowProps) {
  const { status } = useSession();
  const router = useRouter();

  const getGameUrl = (game: GameCardData) => {
    const id = game.id.split("-")[1];
    let baseUrl = "";
    
    if (game.type === "kuis") baseUrl = `/games/quiz/${id}`;
    else if (game.type === "cerita") baseUrl = `/games/stories/${id}`;
    else baseUrl = `/games/puzzle/${id}`;

    if (game.groupId) {
      return `${baseUrl}?group_id=${game.groupId}`;
    }

    return baseUrl;
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "puzzle":
        return "#F44336";
      case "kuis":
        return "#2957A4";
      case "cerita":
        return "#4CAF50";
      default:
        return "#2957A4";
    }
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
    <section className="space-y-6 landing-page">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="flex items-center justify-center w-10 h-10 shadow-lg rounded-xl animate-bounce-in"
              style={{
                backgroundColor: getBadgeColor(games[0]?.type || "puzzle"),
                boxShadow: `0 4px 20px ${getBadgeColor(
                  games[0]?.type || "puzzle"
                )}40`,
              }}
            >
              <Puzzle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold" style={{ color: "#2957A4" }}>
              {title}
            </h2>
          </div>
          <Button
            asChild
            variant="ghost"
            className="text-sm hover:text-primary"
          >
            <Link href={href}>
              Lihat Semua
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {games.slice(0, 4).map((game, index) => {
          const isLocked = false;
          const difficulties = ["Mudah", "Sedang", "Sulit", "Mudah"];
          const difficulty = difficulties[index % difficulties.length];
          const badgeStyle = getDifficultyBadge(difficulty);

          const GameButton = (
            <Button
              size="sm"
              className={`w-full gap-1 transition-all duration-300 text-xs h-8 text-white shadow-lg ${
                isLocked ? "bg-gray-300 text-gray-600 cursor-not-allowed" : ""
              }`}
              style={{
                backgroundColor: isLocked ? "#D1D5DB" : "#2894E4",
                boxShadow: isLocked ? "none" : `0 4px 12px #2957A440`,
              }}
              disabled={isLocked}
            >
              <Play className="w-3 h-3 landing-page" />
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
                  src={
                    game.image
                      ? game.image.startsWith("http")
                        ? game.image
                        : `/${game.image
                            .replace(/\\/g, "/")
                            .replace(/^\/+/, "")}`
                      : "/placeholder.svg"
                  }
                  alt={game.title}
                  fill
                />
                <div
                  className="absolute flex items-center px-2 py-1 text-xs font-bold rounded-full shadow-md top-2 right-2"
                  style={{ backgroundColor: "#FFCC29", color: "#2957A4" }}
                >
                  <Trophy className="w-3 h-3 mr-1" />
                  {game.xp_reward}
                </div>
              </div>

              <div className="flex flex-col flex-grow p-4 space-y-3">
                <div className="flex-grow space-y-2">
                  <h3
                    className="text-sm font-semibold line-clamp-2"
                    style={{ color: "#2957A4" }}
                  >
                    {game.title}
                  </h3>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="mr-2 font-medium truncate text-muted-foreground">
                    {game.category}
                  </span>
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

                {status === "authenticated" ? (
                  <Link
                    href={isLocked ? "#" : getGameUrl(game)}
                    className={isLocked ? "pointer-events-none" : ""}
                  >
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
                          Untuk memainkan game, Anda perlu login terlebih
                          dahulu.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Nanti Saja</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => router.push("/sign-in")}
                        >
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
    </section>
  );
}
