import { getCategoryQuiz } from "@/app/admin/dashboard/manage-quiz/lib/data" // Sesuaikan path ke data.ts
import { columns } from "./columns"
import { DataTable } from "./data-table" 

import Link from "next/link"
import { Plus, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ManageQuizCategoriesPage() {
  // Panggil fungsi yang sudah kita perbaiki    
  const categories = await getCategoryQuiz()

  return (
    <div className="container px-4 py-4 mx-auto space-y-6 md:py-8 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Manajemen Kategori Kuis</h1>
          <p className="text-sm md:text-base text-muted-foreground">Kelola semua kategori untuk kuis di dalam sistem.</p>
        </div>
        <Button asChild className="w-full shadow-sm md:w-auto">
          {/* Arahkan ke halaman pembuatan kategori baru */}
          <Link href="/admin/dashboard/manage-quiz/categories/create">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kategori
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Kategori</CardTitle>
          <LayoutGrid className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{categories.length}</div>
          <p className="text-xs text-muted-foreground">Jumlah semua kategori yang ada.</p>
        </CardContent>
      </Card>

      {/* Data Table */}
      <Card>
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">Daftar Kategori Kuis</CardTitle>
          <CardDescription className="text-sm">Kelola semua kategori yang terdaftar dalam sistem.</CardDescription>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          {/* Kirim kolom dan data yang sudah sesuai ke DataTable */}
          <DataTable columns={columns} data={categories} />
        </CardContent>
      </Card>
    </div>
  )
}