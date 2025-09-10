import { getPuzzle } from "./lib/data";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import Link from "next/link";
import { Plus, Puzzle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata = {
  title: "Manage-puzzles",
};


export default async function ManagePuzzlesPage() {
  const puzzles = await getPuzzle();

  if ("error" in puzzles) {
    return (
      <div className="container px-4 py-4 mx-auto md:py-8">
        <div className="text-center">
          <p className="text-destructive">
            Error loading puzzles: {String(puzzles.error)}
          </p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalPuzzles = puzzles.length;
  const kategoris = [...new Set(puzzles.map((p) => p.kategori))];
  const totalXP = puzzles.reduce((sum, puzzle) => sum + puzzle.xp_reward, 0);

  return (
    <div className="container px-4 py-4 mx-auto space-y-6 md:py-8 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Manajemen Puzzle
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola puzzle dan tantangan untuk pengguna
          </p>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="flex items-center px-3 py-2 space-x-2 text-sm rounded-lg text-muted-foreground bg-muted/50">
            <Puzzle className="w-4 h-4" />
            <span>
              Total: {totalPuzzles} puzzle{totalPuzzles !== 1 ? "s" : ""}
            </span>
          </div>
          <Button asChild className="w-full shadow-sm md:w-auto">
            <Link href="/admin/dashboard/manage-puzzles/create">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Puzzle
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Puzzles</CardTitle>
            <Puzzle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPuzzles}</div>
            <p className="text-xs text-muted-foreground">
              Semua puzzle tersedia
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Kategori</CardTitle>
            <Puzzle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kategoris.length}</div>
            <p className="text-xs text-muted-foreground">Kategori berbeda</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total XP</CardTitle>
            <Puzzle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalXP.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              XP yang bisa diperoleh
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">Daftar Puzzle</CardTitle>
          <CardDescription className="text-sm">
            Kelola semua puzzle yang tersedia dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          <DataTable columns={columns} data={puzzles} />
        </CardContent>
      </Card>
    </div>
  );
}
