import { notFound, redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Save, Eye, ArrowLeft } from "lucide-react";
import Image from "next/image";
import { UpdateArticle } from "../../lib/actions";
import { getArticleById, GetArticleCategory } from "../../lib/data";

interface EditPageProps {
  params: {
    id: string;
  };
  searchParams: {
    preview?: string;
    error?: string;
    saved?: string;
  };
}

async function updateArticleAction(formData: FormData) {
  "use server";

  const id = formData.get("id") as string;
  const result = await UpdateArticle(null, formData, id);

  

  if (result && "error" in result) {
    redirect(
      `/admin/dashboard/manage-articles/edit/${id}?error=${encodeURIComponent(
        result.error || "Error tidak diketahui"
      )}`
    );
  }
  redirect(`/admin/dashboard/manage-articles/edit/${id}?saved=1`);
}

export default async function ArticleEdit({
  params,
  searchParams,
}: EditPageProps) {
  const { id } = await params;
  const searchP = await searchParams;
  const preview = searchP.preview || "";
  const saved = searchP.saved || "";
  const error = searchP.error || "";
  const [article, categories] = await Promise.all([
    getArticleById(id),
    GetArticleCategory(),
  ]);

  if (!article) {
    notFound();
  }

  const showPreview = preview === "true";
  const selectedCategory = categories.find(
    (cat) => cat.KategoriArtikel_id === article.kategori
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {saved && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">
            ✓ Artikel berhasil disimpan!
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium">✗ {error}</p>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <a href="/admin/dashboard/manage-articles">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </a>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-balance">Edit Artikel</h1>
            <p className="text-muted-foreground">ID: {article.artikel_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <a
              href={`/admin/dashboard/manage-articles/edit/${id}${
                showPreview ? "" : "?preview=true"
              }`}
            >
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? "Edit" : "Preview"}
            </a>
          </Button>
        </div>
      </div>

      <form action={updateArticleAction}>
        <input type="hidden" name="id" value={article.artikel_id} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {!showPreview ? (
              <>
                {/* Title */}
                <Card>
                  <CardHeader>
                    <CardTitle>Judul Artikel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      name="judul"
                      defaultValue={article.judul}
                      placeholder="Masukkan judul artikel..."
                      className="text-lg"
                      required
                    />
                  </CardContent>
                </Card>

                {/* Content */}
                <Card>
                  <CardHeader>
                    <CardTitle>Konten Artikel</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      name="konten"
                      defaultValue={article.konten}
                      placeholder="Tulis konten artikel di sini..."
                      className="min-h-[400px] text-base leading-relaxed"
                      required
                    />
                  </CardContent>
                </Card>
              </>
            ) : (
              /* Preview Mode */
              <Card>
                <CardHeader>
                  <CardTitle>Preview Artikel</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h1 className="text-3xl font-bold text-balance mb-4">
                      {article.judul}
                    </h1>
                    {selectedCategory && (
                      <Badge variant="secondary" className="mb-4">
                        {selectedCategory.nama_kategori}
                      </Badge>
                    )}
                  </div>

                  {article.thumbnail && (
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={article.thumbnail || "/placeholder.svg"}
                        alt={article.judul}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <Separator />

                  <div className="prose prose-gray max-w-none">
                    {article.konten.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="text-base leading-relaxed mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Article Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Artikel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Dibuat pada</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(article.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Dibuat oleh</Label>
                  <p className="text-sm text-muted-foreground">
                    User ID: {article.created_by}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Category */}
            <Card>
              <CardHeader>
                <CardTitle>Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  name="kategori"
                  defaultValue={article?.kategori?.toString() ?? undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.KategoriArtikel_id}
                        value={category.KategoriArtikel_id.toString()}
                      >
                        {category.nama_kategori}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Thumbnail */}
            <Card>
              <CardHeader>
                <CardTitle>Thumbnail</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {article.thumbnail && (
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={article.thumbnail || "/placeholder.svg"}
                      alt="Thumbnail"
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <Label htmlFor="thumbnail">Upload Thumbnail</Label>
                  <Input
                    id="thumbnail"
                    name="thumbnail"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: JPG, PNG, WEBP, JPEG. Maksimal 5MB.
                  </p>
                </div>
              </CardContent>
            </Card>

            {!showPreview && (
              <Card>
                <CardContent className="pt-6">
                  <Button type="submit" className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Artikel
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
