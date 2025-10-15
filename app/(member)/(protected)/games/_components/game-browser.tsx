"use client";

import { useState } from "react";
import type { GameCardData } from "../lib/data";
import { GameSections } from "./game-sections";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  ArrowDownUp,
  SearchX,
  Trophy,
  Star,
  Crown,
} from "lucide-react";

interface GameBrowserProps {
  puzzles: GameCardData[];
  quizzes: GameCardData[];
  stories: GameCardData[];
}

export function GameBrowser({ puzzles, quizzes, stories }: GameBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("terbaru");

  // const [userLevel] = useState(5);
  // const [totalXP] = useState(1250);
  // const [achievements] = useState([
  //   { id: 1, name: "Penjelajah Pemula", icon: Star, unlocked: true },
  //   { id: 2, name: "Master Kuis", icon: Trophy, unlocked: true },
  //   { id: 3, name: "Ahli Sejarah", icon: Crown, unlocked: false },
  // ]);

  const lowercasedQuery = searchQuery.toLowerCase();

  const filteredPuzzles = puzzles.filter((game) =>
    game.title.toLowerCase().includes(lowercasedQuery)
  );
  const filteredQuizzes = quizzes.filter((game) =>
    game.title.toLowerCase().includes(lowercasedQuery)
  );
  const filteredStories = stories.filter((game) =>
    game.title.toLowerCase().includes(lowercasedQuery)
  );

  const sortGames = (games: GameCardData[]) => {
    switch (sortBy) {
      case "terlama":
        return games.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "judul-az":
        return games.sort((a, b) => a.title.localeCompare(b.title));
      case "judul-za":
        return games.sort((a, b) => b.title.localeCompare(a.title));
      case "terbaru":
      default:
        return games.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
  };

  const sortedPuzzles = sortGames([...filteredPuzzles]);
  const sortedQuizzes = sortGames([...filteredQuizzes]);
  const sortedStories = sortGames([...filteredStories]);

  const puzzlesToShow =
    selectedType === "all" || selectedType === "puzzle" ? sortedPuzzles : [];
  const quizzesToShow =
    selectedType === "all" || selectedType === "kuis" ? sortedQuizzes : [];
  const storiesToShow =
    selectedType === "all" || selectedType === "cerita" ? sortedStories : [];

  const noResults =
    puzzlesToShow.length === 0 &&
    quizzesToShow.length === 0 &&
    storiesToShow.length === 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari nama permainan..."
            className="h-11 w-full border border-input bg-white pl-10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select
          value={selectedType}
          onValueChange={(value) => setSelectedType(value)}
        >
          <SelectTrigger className="h-11 w-full border border-input bg-white md:w-[180px] focus:ring-2 focus:ring-ring focus:ring-offset-2">
            <Filter className="h-4 w-4 mr-2 text-primary font-semibold" />
            <SelectValue placeholder="Filter Tipe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tipe</SelectItem>
            <SelectItem value="puzzle">Puzzle</SelectItem>
            <SelectItem value="kuis">Kuis</SelectItem>
            <SelectItem value="cerita">Cerita</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(value) => setSortBy(value)}>
          <SelectTrigger className="w-full md:w-[180px] h-11 bg-white border-2 focus:border-primary">
            <ArrowDownUp className="h-4 w-4 mr-2 text-primary" />
            <SelectValue placeholder="Urutkan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="terbaru">Terbaru</SelectItem>
            <SelectItem value="terlama">Terlama</SelectItem>
            <SelectItem value="judul-az">Judul (A-Z)</SelectItem>
            <SelectItem value="judul-za">Judul (Z-A)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {noResults ? (
        <div className="text-center py-20 px-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-muted/50 flex items-center justify-center mb-6 animate-bounce-in">
            <SearchX className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h3 className="text-2xl font-bold text-primary mb-2">
            Game Tidak Ditemukan
          </h3>
          <p className="text-muted-foreground">
            Coba ubah kata kunci pencarian atau filter Anda.
          </p>
        </div>
      ) : (
        <GameSections
          puzzles={puzzlesToShow}
          quizzes={quizzesToShow}
          stories={storiesToShow}
        />
      )}
    </div>
  );
}
