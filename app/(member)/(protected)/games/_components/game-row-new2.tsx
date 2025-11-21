"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Play, LogIn } from "lucide-react";
import type { GameCardData } from "../lib/data";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { FollowerPointerCard } from "@/components/ui/following-pointer";
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
        return "bg-primary";
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

  const TitleComponent = ({ title, category }: { title: string; category: string }) => (
    <div className="flex items-center space-x-2">
      <Badge variant="secondary" className="text-xs">
        {category}
      </Badge>
      <p className="text-sm font-medium">{title}</p>
    </div>
  );

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
            <FollowerPointerCard
              title={<TitleComponent title={game.title} category={game.category} />}
            >
              <div className="group relative h-full overflow-hidden rounded-2xl border border-zinc-100 bg-white transition duration-200 hover:shadow-xl">
                {/* Image Section */}
                <div className={`relative aspect-[16/10] w-full overflow-hidden rounded-tl-lg rounded-tr-lg ${colorClass}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
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
                    className="object-cover transform transition duration-200 group-hover:scale-95 group-hover:rounded-2xl p-8"
                  />
                  {isLocked && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                      <span className="text-6xl">🔒</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-4">
                  <h2 className="my-4 text-lg font-bold text-zinc-700 line-clamp-2">
                    {game.title}
                  </h2>
                  
                  <div className="my-4 flex flex-wrap gap-2">
                    <Badge className={`text-xs font-bold ${difficultyConfig.className}`}>
                      {difficultyConfig.label}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      <Trophy className="w-3 h-3 mr-1" />
                      {game.xp_reward} XP
                    </Badge>
                  </div>

                  <div className="mt-10 flex flex-row items-center justify-between">
                    <span className="text-sm text-gray-500">{game.category}</span>
                    
                    {status === "authenticated" ? (
                      <Link
                        href={isLocked ? "#" : getGameUrl(game)}
                        className={isLocked ? "pointer-events-none" : ""}
                      >
                        <div className={`relative z-10 block rounded-xl ${colorClass} px-6 py-2 text-xs font-bold text-white transition-all hover:opacity-90 ${
                          isLocked && "opacity-50 cursor-not-allowed"
                        }`}>
                          {isLocked ? "🔒 Terkunci" : "Mulai Main"}
                        </div>
                      </Link>
                    ) : (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <div className={`relative z-10 block rounded-xl ${colorClass} px-6 py-2 text-xs font-bold text-white cursor-pointer transition-all hover:opacity-90`}>
                            Mulai Main
                          </div>
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
                </div>
              </div>
            </FollowerPointerCard>
          );

          return <div key={game.id}>{GameContent}</div>;
        })}
      </div>
    </section>
  );
}
