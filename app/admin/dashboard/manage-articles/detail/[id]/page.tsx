import { getArticleById } from "@/app/admin/dashboard/manage-articles/lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription, 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify"; 
interface DetailPageProps {
  params: {
    id: string;
  };
}

export default async function ArticleDetailPage({ params }: DetailPageProps) {
  const articleId = Number(params.id);

  const article = await getArticleById(params.id);

  if (!article) {
    notFound();
  }

  const cleanContent = DOMPurify.sanitize(article.konten);

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/dashboard/manage-articles">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Artikel
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          {article.thumbnail && (
            <div className="mb-4 rounded-lg overflow-hidden h-64 w-full">
              <img
                src={article.thumbnail}
                alt={article.judul}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <Badge variant="secondary" className="w-fit mb-2">
            {article.kategori
              ? `Kategori ${article.kategori}`
              : "Tanpa Kategori"}
          </Badge>
          <CardTitle className="text-3xl font-bold">{article.judul}</CardTitle>
          <CardDescription className="flex items-center space-x-4 text-sm text-muted-foreground pt-2">
            <span className="flex items-center">
              <Calendar className="h-4 w-4 mr-1.5" />
              {new Date(article.created_at).toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center">
              <User className="h-4 w-4 mr-1.5" />
              Dibuat oleh: {article.created_by || "Admin"}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Render konten HTML yang sudah disanitasi */}
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
