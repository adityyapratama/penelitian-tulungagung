import { getCategoryById } from "../../lib/data";
import { UpdateCategoryForm } from "../../_components/update-category-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function UpdateCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const category = await getCategoryById(params.id);

  if (!category || "error" in category) {
    return (
      <div className="container mx-auto p-6">Kategori tidak ditemukan.</div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/dashboard/manage-stories/category">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Edit Kategori Cerita
          </h1>
          <p className="text-muted-foreground">
            Perbarui detail untuk kategori{" "}
            <span className="font-semibold text-foreground">
              "{category.NamaKategori}"
            </span>
            .
          </p>
        </div>
      </div>

      <Card className="border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Detail Kategori
          </CardTitle>
          <CardDescription>
            Perbarui nama dan deskripsi kategori cerita Anda di bawah ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateCategoryForm category={category} />
        </CardContent>
      </Card>
    </div>
  );
}
