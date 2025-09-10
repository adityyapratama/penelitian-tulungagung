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
      <div className="container py-10 mx-auto">
        <p className="text-red-500">Gagal memuat data cerita</p>
      </div>
    )
  }

  return (
    <div className="container px-4 py-4 mx-auto space-y-6 md:py-8 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Manajemen Cerita Interaktif</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola cerita interaktif, thumbnail, dan reward XP
          </p>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="flex items-center px-3 py-2 space-x-2 text-sm rounded-lg text-muted-foreground bg-muted/50">
            <BookOpen className="w-4 h-4" />
            <span>
              Total: {stories.length} cerita{stories.length !== 1 ? "s" : ""}
            </span>
          </div>
          <Button asChild className="w-full shadow-sm md:w-auto">
            <Link href="/admin/dashboard/manage-stories/create">
              <Plus className="w-4 h-4 mr-2" />
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
