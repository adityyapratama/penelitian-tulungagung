import { getCategoryById } from "../../lib/data";
import { UpdateCategoryForm } from "../../_components/update-category-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tag } from "lucide-react";

export default async function UpdateCategoryPage({ params }: { params: { id: string } }) {
  const category = await getCategoryById(params.id);

  if (!category || "error" in category) {
    return <div className="container mx-auto p-6">Kategori tidak ditemukan.</div>;
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card className="border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Update Kategori
          </CardTitle>
          <CardDescription>
            Perbarui nama kategori cerita Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UpdateCategoryForm category={category} />
        </CardContent>
      </Card>
    </div>
  );
}