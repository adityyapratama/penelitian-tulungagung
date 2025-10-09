import { CreateCategoryForm } from "../_components/create-category-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function CreateCategoryPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 md:p-6">
      {/* Header Halaman */}
      <div className="flex items-center gap-4">
         <Button variant="outline" size="icon" asChild>
            <Link href="/admin/dashboard/manage-stories/category">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Tambah Kategori Baru
          </h1>
          <p className="text-muted-foreground">
            Buat kategori baru untuk mengelompokkan cerita interaktif Anda.
          </p>
        </div>
      </div>

      {/* Form dalam Card */}
      <Card className="border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Detail Kategori
          </CardTitle>
          <CardDescription>
            Masukkan nama yang jelas dan deskriptif untuk kategori baru.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateCategoryForm />
        </CardContent>
      </Card>
    </div>
  );
}