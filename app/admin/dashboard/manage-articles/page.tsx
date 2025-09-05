import { ArticleDataTable } from "./data-table";
import { articleColumns, TArticleColumn } from "./columns";
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
import { getArticle, GetArticleCategory } from "./lib/data";

// Tipe untuk kategori, sesuai dengan data-table.tsx
type TCategory = {
  KategoriArtikel_id: number;
  nama_kategori: string;
};

export default async function ManageArticlesPage() {
  // Ambil data artikel dan kategori dari fungsi di ./data
  const articles: TArticleColumn[] = await getArticle();
  const categories: TCategory[] = await GetArticleCategory();

  return (
    <div className="container mx-auto py-4 px-4 md:py-8 space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Manajemen Artikel
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Kelola artikel sistem dan atur kontennya
          </p>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
            <FileText className="h-4 w-4" />
            <span>
              Total: {articles.length} artikel{articles.length !== 1 ? "s" : ""}
            </span>
          </div>
          <Button asChild className="shadow-sm w-full md:w-auto">
            <Link href="/admin/dashboard/manage-articles/create">
              <Plus className="h-4 w-4 mr-2" />
              Tambah Artikel
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{articles.length}</div>
            <p className="text-xs text-muted-foreground">
              Semua artikel terdaftar
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dengan Kategori
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {articles.filter((article) => article.kategori !== null).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Artikel dengan kategori
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tanpa Kategori
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {articles.filter((article) => article.kategori === null).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Artikel tanpa kategori
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">Daftar Artikel</CardTitle>
          <CardDescription className="text-sm">
            Kelola semua artikel yang terdaftar dalam sistem
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          <ArticleDataTable
            columns={articleColumns}
            data={articles}
            categories={categories}
          />
        </CardContent>
      </Card>
    </div>
  );
}
