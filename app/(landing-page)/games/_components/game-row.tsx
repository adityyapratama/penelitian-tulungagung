"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Play, ArrowRight } from "lucide-react";
import type { GameCardData } from "../lib/data";
import Link from 'next/link';
import Image from 'next/image';

interface GameRowProps {
  title: string;
  description: string;
  games: GameCardData[];
  href: string;
}

export function GameRow({ title, description, games, href }: GameRowProps) {
  const getGameUrl = (game: GameCardData) => {
    const id = game.id.split('-')[1];
    if (game.type === 'kuis') {
        return `/games/kuis/${id}`;
    }
    if (game.type === 'cerita') {
        return `/games/cerita/${id}`;
    }
    return `/games/puzzle/${id}`;
  };

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <Button asChild variant="ghost" className="text-sm">
                <Link href={href}>
                    Lihat Semua
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
            </Button>
        </div>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.slice(0, 3).map((game) => (
          // KARTU UTAMA: Gunakan flex dan flex-col
          <Card key={game.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200 flex flex-col border-border">
            
            {/* Bagian Gambar */}
            <div className="relative w-full h-48 flex-shrink-0">
              <Image 
                src={game.image || "/placeholder.svg"} 
                alt={game.title} 
                fill 
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute top-3 left-3">
                <Badge variant={game.type === 'kuis' ? 'default' : game.type === 'cerita' ? 'secondary' : 'destructive'}>
                  {game.type.charAt(0).toUpperCase() + game.type.slice(1)}
                </Badge>
              </div>
            </div>

            {/* Bagian Konten Teks: Gunakan flex, flex-col, dan flex-grow */}
            <div className="p-6 space-y-4 flex flex-col flex-grow">
              <div className="space-y-2 flex-grow">
                <h3 className="font-semibold text-lg text-foreground line-clamp-1">{game.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{game.description}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className="font-medium">{game.category}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-1 text-sm font-medium text-primary">
                  <Trophy className="h-4 w-4" />+{game.xp_reward} XP
                </div>
                <Button asChild size="sm" className="gap-2">
                  <Link href={getGameUrl(game)}>
                    <Play className="h-4 w-4" />
                    Lihat Detail
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}