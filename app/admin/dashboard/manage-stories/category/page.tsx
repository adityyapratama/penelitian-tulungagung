import { getCategory } from "./lib/data";
import { DataTable } from "./data-table";
import Link from "next/link";
import { Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ManageCategoriesPage() {
  const categories = await getCategory();

  if ("error" in categories) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-red-500">Gagal memuat data kategori</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-4 md:space-y-8 md:py-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Manajemen Kategori Cerita</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Kelola semua kategori untuk cerita interaktif.
          </p>
        </div>
        <Button asChild className="w-full shadow-sm md:w-auto">
          <Link href="/admin/dashboard/manage-stories/category/create">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Kategori
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">Daftar Kategori</CardTitle>
          <CardDescription className="text-sm">
            Lihat dan kelola semua kategori cerita yang tersedia.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          <DataTable data={categories} />
        </CardContent>
      </Card>
    </div>
  );
}