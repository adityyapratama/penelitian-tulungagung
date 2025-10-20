import { CreateArticleForm } from "../_components/create-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GetArticleCategory } from "../lib/data"; 

export default async function CreateArticlePage() {
  const categories = await GetArticleCategory();

  const manageArticlesPath = "/guru/dashboard/manage-articles";

  return (
    <div className="container mx-auto py-4 px-4 md:py-8 space-y-6 md:space-y-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href={manageArticlesPath}>
                <ArrowLeft className="h-4 w-4 mr-1" />
                Kembali
              </Link>
            </Button>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Buat Artikel Baru (Guru)
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Tambahkan artikel yang akan Anda publikasi
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
          <FileText className="h-4 w-4" />
          <span>Form Artikel</span>
        </div>
      </div>

      {categories.length === 0 && (
        <div className="bg-yellow-100 text-yellow-700 p-3 rounded-md border border-yellow-300">
          Tidak ada kategori artikel tersedia. Silakan hubungi Administrator untuk membuat kategori.
        </div>
      )}

      <Card>
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">Detail Artikel</CardTitle>
          <CardDescription className="text-sm">
            Lengkapi informasi artikel yang akan Anda buat
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 md:px-6">
          <CreateArticleForm categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}