import { GetStoriesForGuru } from "./lib/data"
import { getGuruColumns } from "./columns" // Mengimpor fungsi columns dari file columns.tsx Guru
import { DataTable } from "./data-table"
import Link from "next/link"
import { Plus, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/auth"
import { redirect } from "next/navigation"


export default async function ManageStoriesGuruPage() {
  const session = await auth();
  const userId = session?.user?.id;
  const basePath = "/guru/dashboard/manage-stories";

  if (!userId) {
    redirect("/"); 
  }
  
  const stories = await GetStoriesForGuru(Number(userId));

  if (!Array.isArray(stories)) {
    return (
      <div className="container py-10 mx-auto">
        <p className="text-red-500">Gagal memuat data cerita. {(stories as { error: string }).error}</p>
      </div>
    );
  }

  return (
    <div className="container px-4 py-4 mx-auto space-y-6 md:py-8 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Manajemen Cerita Saya</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola cerita interaktif yang telah Anda buat
          </p>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="flex items-center px-3 py-2 space-x-2 text-sm rounded-lg text-muted-foreground bg-muted/50">
            <BookOpen className="w-4 h-4" />
            <span>
              Total Cerita : {stories.length}
            </span>
          </div>
          <Button asChild className="w-full shadow-sm md:w-auto">
            <Link href={`${basePath}/create`}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Cerita
            </Link>
          </Button>
          <Button asChild className="w-full shadow-sm md:w-auto">
            <Link href={`${basePath}/category`}>
              <Plus className="w-4 h-4 mr-2" />
              Tambah Kategori Cerita
            </Link>
          </Button>
        </div>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">Daftar Cerita Saya</CardTitle>
          <CardDescription className="text-sm">
            Tabel ini hanya menampilkan cerita interaktif yang Anda buat.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          <DataTable data={stories} basePath={basePath} />
        </CardContent>
      </Card>
    </div>
  );
}