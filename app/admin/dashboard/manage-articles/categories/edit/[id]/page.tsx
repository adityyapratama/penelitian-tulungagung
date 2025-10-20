import { notFound } from "next/navigation";
import Link from "next/link";
import { GetArticleCategoryById } from "../../../lib/data";
import { UpdateArticleCategory } from "../../../lib/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";

type EditCategoryPageProps = {
  params: {
    id: string;
  };
};

export default async function EditCategoryPage({
  params,
}: EditCategoryPageProps) {
  const { id } = params;
  const category = await GetArticleCategoryById(id);

  if (!category) {
    notFound();
  }
  async function updateCategoryAction(formData: FormData) {
    "use server";
    await UpdateArticleCategory(null, formData);
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <form action={updateCategoryAction}>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Edit Kategori Artikel
            </CardTitle>
            <CardDescription>
              Perbarui nama kategori di bawah ini.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="hidden"
              name="id"
              value={category.KategoriArtikel_id}
            />
            <div className="space-y-2">
              <Label htmlFor="category" className="font-semibold">
                Nama Kategori
              </Label>
              <Input
                id="category"
                name="category"
                placeholder="e.g., Sejarah Lokal"
                defaultValue={category.nama_kategori}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard/manage-articles/categories">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Batal
              </Link>
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
