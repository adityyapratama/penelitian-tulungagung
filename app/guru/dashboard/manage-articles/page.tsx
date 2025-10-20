import { ArticleDataTable } from "./data-table"; 
import { guruArticleColumns, TArticleColumn } from "./columns"; 
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText } from "lucide-react";
import Link from "next/link";
import { getArticle, GetArticleCategory } from "./lib/data"; // Import fungsi data yang sudah direvisi
import { auth } from "@/auth"; // Import auth untuk mendapatkan user session

type TCategory = {
  KategoriArtikel_id: number;
  nama_kategori: string;
};

export default async function ManageArticlesGuruPage() {
  const session = await auth();
  const userId = session?.user.id;

  if (!userId) {
      // Tangani kasus jika sesi tidak ada (seharusnya sudah diurus di layout)
      return <div className="p-8 text-center text-xl font-semibold text-red-500">Akses Ditolak. Sesi pengguna tidak ditemukan.</div>
  }

  // 1. Ambil data artikel HANYA milik Guru yang sedang login
  const articles: TArticleColumn[] = await getArticle({ userId: Number(userId) });
  
  // 2. Ambil kategori (biasanya semua kategori tetap perlu untuk filter)
  const categories: TCategory[] = await GetArticleCategory();

  // 3. Tentukan path untuk penambahan artikel baru (rute Guru)
  const createArticlePath = "/guru/dashboard/manage-articles/create"; 

  return (
    <div className="container px-4 py-4 mx-auto space-y-6 md:py-8 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Manajemen Artikel Saya
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola artikel yang telah Anda buat
          </p>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="flex items-center px-3 py-2 space-x-2 text-sm rounded-lg text-muted-foreground bg-muted/50">
            <FileText className="w-4 h-4" />
            <span>
              Total Artikel Saya: {articles.length}
            </span>
          </div>
          <Button asChild className="w-full shadow-sm md:w-auto">
            <Link href={createArticlePath}>
              <Plus className="w-4 h-4 mr-2" />
              Buat Artikel Baru
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards (Konten tetap menghitung berdasarkan data yang disaring) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {/* ... (Konten Card tetap sama, karena articles sudah disaring) ... */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-xs text-muted-foreground">
              Artikel yang Anda buat
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Dengan Kategori
            </CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {articles.filter((article) => article.kategori !== null).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Artikel yang memiliki kategori
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Tanpa Kategori
            </CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {articles.filter((article) => article.kategori === null).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Artikel yang belum memiliki kategori
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">Daftar Artikel Saya</CardTitle>
          <CardDescription className="text-sm">
            Tabel ini hanya menampilkan artikel yang Anda buat.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          <ArticleDataTable
            columns={guruArticleColumns} // Menggunakan columns Guru
            data={articles}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}