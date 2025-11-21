"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Trophy, Search, Filter } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { FollowerPointerCard } from "@/components/ui/following-pointer";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GameCardData } from "../../lib/data";

interface PuzzlesClientProps {
  puzzles: GameCardData[];
}

export function PuzzlesClient({ puzzles }: PuzzlesClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("terbaru");
  const [filteredGames, setFilteredGames] = useState<GameCardData[]>(puzzles);

  useEffect(() => {
    let result = [...puzzles];

    // Filter by search
    if (searchQuery) {
      result = result.filter((game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case "terlama":
        result.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "judul-az":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "judul-za":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "xp-tinggi":
        result.sort((a, b) => b.xp_reward - a.xp_reward);
        break;
      case "xp-rendah":
        result.sort((a, b) => a.xp_reward - b.xp_reward);
        break;
      case "terbaru":
      default:
        result.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
    }

    setFilteredGames(result);
  }, [searchQuery, sortBy, puzzles]);

  return (
    <>
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari puzzle..."
            className="h-10 md:h-11 w-full border border-input bg-white pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
          <SelectTrigger className="w-full sm:w-[180px] md:w-[200px] h-10 md:h-11 bg-white border-input">
            <Filter className="h-4 w-4 mr-2 text-primary" />
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="terbaru">Terbaru</SelectItem>
            <SelectItem value="terlama">Terlama</SelectItem>
            <SelectItem value="judul-az">Judul (A-Z)</SelectItem>
            <SelectItem value="judul-za">Judul (Z-A)</SelectItem>
            <SelectItem value="xp-tinggi">XP Tertinggi</SelectItem>
            <SelectItem value="xp-rendah">XP Terendah</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Menampilkan {filteredGames.length} dari {puzzles.length} puzzle
      </div>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <div className="py-12 md:py-20 text-center">
          <p className="text-base md:text-lg text-muted-foreground">
            {searchQuery ? "Tidak ada puzzle yang sesuai dengan pencarian" : "Belum ada puzzle tersedia"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filteredGames.map((game, index) => (
            <GameCard key={game.id} game={game} index={index} />
          ))}
        </div>
      )}
    </>
  );
}

function GameCard({ game, index }: { game: GameCardData; index: number }) {
  const isLocked = false;
  const difficulties = ["Mudah", "Sedang", "Sulit"];
  const difficulty = difficulties[index % difficulties.length];
  
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

  const difficultyConfig = getDifficultyConfig(difficulty);
  const colorClass = "bg-red-500";

  const TitleComponent = ({ title, category }: { title: string; category: string }) => (
    <div className="flex items-center space-x-2">
      <Badge variant="secondary" className="text-xs">
        {category}
      </Badge>
      <p className="text-xs md:text-sm font-medium line-clamp-1">{title}</p>
    </div>
  );

  const gameUrl = `/games/puzzle/${game.id.split("-")[1]}`;

  return (
    <FollowerPointerCard
      title={<TitleComponent title={game.title} category={game.category} />}
    >
      <div className="group relative flex flex-col overflow-hidden rounded-xl md:rounded-2xl border border-zinc-100 bg-white transition duration-200 hover:shadow-xl">
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
            className="object-cover transform transition duration-200 group-hover:scale-105"
          />
          {isLocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <span className="text-4xl md:text-6xl">🔒</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-2 md:p-4 flex flex-col flex-1">
          <h2 className="my-2 md:my-4 text-sm md:text-lg font-bold text-zinc-700 line-clamp-2">
            {game.title}
          </h2>
          
          <p className="text-[10px] md:text-xs text-gray-500 line-clamp-2 mb-2 md:mb-3">
            {game.description}
          </p>

          <div className="mb-2 md:mb-4 flex flex-wrap gap-1 md:gap-2">
            <Badge className={`text-[10px] md:text-xs font-bold ${difficultyConfig.className}`}>
              {difficultyConfig.label}
            </Badge>
            <Badge variant="outline" className="text-[10px] md:text-xs">
              <Trophy className="w-2 h-2 md:w-3 md:h-3 mr-0.5 md:mr-1" />
              {game.xp_reward} XP
            </Badge>
          </div>

          {/* Spacer to push button to bottom */}
          <div className="flex-grow"></div>

          {/* Button Container */}
          <div className="mt-2 md:mt-4 pt-2 md:pt-3 border-t border-gray-100">
            <Link href={isLocked ? "#" : gameUrl} className={isLocked ? "pointer-events-none" : ""}>
              <div className={`relative z-10 block text-center rounded-lg md:rounded-xl ${colorClass} px-3 md:px-6 py-1.5 md:py-2 text-[10px] md:text-xs font-bold text-white transition-all hover:opacity-90 w-full ${
                isLocked && "opacity-50 cursor-not-allowed"
              }`}>
                {isLocked ? "🔒 Terkunci" : "Mulai Main"}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </FollowerPointerCard>
  );
}
