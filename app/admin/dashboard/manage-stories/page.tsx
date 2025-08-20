import { GetStories } from "./lib/data"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import Link from "next/link"
import { Plus, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ManageStoriesPage() {
  const stories = await GetStories()

  // Antisipasi kalau error
  if (!Array.isArray(stories)) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-red-500">Gagal memuat data cerita</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4 px-4 md:py-8 space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Manajemen Cerita Interaktif</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola cerita interaktif, thumbnail, dan reward XP
          </p>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
            <BookOpen className="h-4 w-4" />
            <span>
              Total: {stories.length} cerita{stories.length !== 1 ? "s" : ""}
            </span>
          </div>
          <Button asChild className="shadow-sm w-full md:w-auto">
            <Link href="/admin/dashboard/manage-stories/create">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Cerita
            </Link>
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">Daftar Cerita</CardTitle>
          <CardDescription className="text-sm">
            Kelola semua cerita interaktif yang tersedia
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          <DataTable columns={columns} data={stories} />
        </CardContent>
      </Card>
    </div>
  )
}
