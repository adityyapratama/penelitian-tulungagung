"use client";

import { useState, useMemo } from "react";
import type { GameCardData } from "../lib/data";
import { GameSections } from "./game-sections";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, ArrowDownUp, SearchX } from "lucide-react"; // 1. Impor ikon baru

interface GameBrowserProps {
  puzzles: GameCardData[];
  quizzes: GameCardData[];
  stories: GameCardData[];
}

export function GameBrowser({ puzzles, quizzes, stories }: GameBrowserProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('terbaru');

  const lowercasedQuery = searchQuery.toLowerCase();

  const filteredPuzzles = puzzles.filter(game =>
    game.title.toLowerCase().includes(lowercasedQuery)
  );
  const filteredQuizzes = quizzes.filter(game =>
    game.title.toLowerCase().includes(lowercasedQuery)
  );
  const filteredStories = stories.filter(game =>
    game.title.toLowerCase().includes(lowercasedQuery)
  );

  const sortGames = (games: GameCardData[]) => {
    switch (sortBy) {
      case 'terlama':
        return games.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      case 'judul-az':
        return games.sort((a, b) => a.title.localeCompare(b.title));
      case 'judul-za':
        return games.sort((a, b) => b.title.localeCompare(a.title));
      case 'terbaru':
      default:
        return games.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
  };

  const sortedPuzzles = sortGames([...filteredPuzzles]);
  const sortedQuizzes = sortGames([...filteredQuizzes]);
  const sortedStories = sortGames([...filteredStories]);
  
  // 2. Cek apakah ada hasil setelah semua filter dan sort diterapkan
  const puzzlesToShow = selectedType === 'all' || selectedType === 'puzzle' ? sortedPuzzles : [];
  const quizzesToShow = selectedType === 'all' || selectedType === 'kuis' ? sortedQuizzes : [];
  const storiesToShow = selectedType === 'all' || selectedType === 'cerita' ? sortedStories : [];

  const noResults = puzzlesToShow.length === 0 && quizzesToShow.length === 0 && storiesToShow.length === 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative w-full flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari nama permainan..."
            className="w-full pl-10 h-11"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={selectedType} onValueChange={(value) => setSelectedType(value)}>
          <SelectTrigger className="w-full md:w-[180px] h-11">
            <Filter className="h-4 w-4 mr-2" />
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
          <SelectTrigger className="w-full md:w-[180px] h-11">
             <ArrowDownUp className="h-4 w-4 mr-2" />
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

      {/* 3. Tampilkan pesan jika tidak ada hasil, atau tampilkan daftar game jika ada */}
      {noResults ? (
        <div className="text-center py-20 px-6 flex flex-col items-center">
          <SearchX className="w-16 h-16 text-muted-foreground/50 mb-4" />
          <h3 className="text-xl font-semibold text-foreground">Game Tidak Ditemukan</h3>
          <p className="text-muted-foreground mt-2">
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