import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getQuizzes } from "./lib/data"; 
import Link from "next/link";
import { Plus, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function ManageQuizPage() {
  const quizzes = await getQuizzes();

  if (!Array.isArray(quizzes)) {
    return <div className="container mx-auto p-6">Error: Gagal memuat data kuis. (Mungkin Anda belum membuat kuis)</div>;
  }

  return (
    <div className="container px-4 py-4 mx-auto space-y-6 md:py-8 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Manajemen Soal Kuis
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola semua Soal kuis yang telah Anda buat.
          </p>
        </div>
        <Button asChild className="w-full shadow-sm md:w-auto">
          <Link href="/guru/dashboard/manage-quiz/create">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kuis
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total kuis Anda</CardTitle>
          <LayoutGrid className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{quizzes.length}</div>
          <p className="text-xs text-muted-foreground">
            Jumlah semua kuis yang Anda buat.
          </p>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">
            Daftar Kuis
          </CardTitle>
          <CardDescription className="text-sm">
            Kelola semua kuis yang terdaftar dalam sistem.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          <DataTable columns={columns} data={quizzes} />
        </CardContent>
      </Card>
    </div>
  );
}