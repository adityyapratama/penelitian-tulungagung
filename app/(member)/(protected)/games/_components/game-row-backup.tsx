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

  const getBgColorClass = (type: string) => {
    switch (type) {
      case "puzzle":
        return "bg-red-500";
      case "kuis":
        return "bg-blue-600";
      case "cerita":
        return "bg-green-500";
      default:
        return "bg-blue-600";
    }
  };

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case "Mudah":
        return { label: "Mudah", className: "bg-green-500 hover:bg-green-600 text-white" };
      case "Sedang":
        return { label: "Sedang", className: "bg-yellow-500 hover:bg-yellow-600 text-white" };
      case "Sulit":
        return { label: "Sulit", className: "bg-red-500 hover:bg-red-600 text-white" };
      default:
        return { label: "Normal", className: "bg-gray-500 hover:bg-gray-600 text-white" };
    }
  };

  return (
    <section className="space-y-6 landing-font">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">
          {title}
        </h2>
        <p className="text-muted-foreground text-lg">{description}</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {games.slice(0, 6).map((game, index) => {
          const isLocked = false;
          const difficulties = ["Mudah", "Sedang", "Sulit", "Mudah", "Sedang", "Mudah"];
          const difficulty = difficulties[index % difficulties.length];
          const difficultyConfig = getDifficultyConfig(difficulty);
          const colorClass = getBgColorClass(game.type);

          const GameContent = (
            <Card className="group relative overflow-hidden border-2 border-border/30 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl hover:border-border h-full flex flex-col">
              {/* Image Section */}
              <div className={`relative h-48 overflow-hidden ${colorClass}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
                <div className="relative h-full w-full p-8">
                  <Image
                    src={
                      game.image
                        ? game.image.startsWith("http")
                          ? game.image
                          : `/${game.image.replace(/\\/g, "/").replace(/^\/+/, "")}`
                        : "/placeholder.svg"
                    }
                    alt={game.title}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                {isLocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <span className="text-6xl">🔒</span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-3 flex items-start justify-between gap-2">
                  <h3 className="text-xl font-bold text-foreground leading-tight line-clamp-2 flex-grow">{game.title}</h3>
                  <Badge variant="secondary" className="shrink-0 text-xs">
                    {game.category}
                  </Badge>
                </div>

                <div className="mb-4 flex flex-wrap gap-2 mt-auto">
                  <Badge className={`text-xs font-bold ${difficultyConfig.className}`}>
                    {difficultyConfig.label}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Trophy className="w-3 h-3 mr-1" />
                    {game.xp_reward} XP
                  </Badge>
                </div>

                {status === "authenticated" ? (
                  <Link
                    href={isLocked ? "#" : getGameUrl(game)}
                    className={isLocked ? "pointer-events-none" : ""}
                  >
                    <Button 
                      className={`w-full rounded-full font-bold transition-all ${colorClass} text-white hover:opacity-90 ${
                        isLocked && "opacity-50 cursor-not-allowed"
                      }`}
                      disabled={isLocked}
                    >
                      {isLocked ? "🔒 Terkunci" : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Mulai Main
                        </>
                      )}
                    </Button>
                  </Link>
                ) : (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        className={`w-full rounded-full font-bold transition-all ${colorClass} text-white hover:opacity-90`}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Mulai Main
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Login Diperlukan</AlertDialogTitle>
                        <AlertDialogDescription>
                          Anda harus login terlebih dahulu untuk dapat memainkan game ini.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => router.push("/sign-in")}>
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

          return <div key={game.id}>{GameContent}</div>;
        })}
      </div>
    </section>
  );
}
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
