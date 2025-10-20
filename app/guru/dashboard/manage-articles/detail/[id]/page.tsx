import { getArticleById } from "../../lib/data";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription, 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import Image from "next/image";

interface DetailPageProps {
  params: {
    id: string;
  };
}

type ArticleWithDetails = Awaited<ReturnType<typeof getArticleById>>;

const GURU_BASE_PATH = "/guru/dashboard/manage-articles";

export default async function ArticleDetailPage({ params }: DetailPageProps) {
  const article = await getArticleById(params.id) as ArticleWithDetails;

  if (!article) {
    notFound();
  }

  const kategoriName = article.KategoriArtikel?.nama_kategori || "Tanpa Kategori";
  const createdByName = article.User?.username || `User ID: ${article.created_by}`;

  const cleanContent = DOMPurify.sanitize(article.konten);

  return (
    <div className="container mx-auto py-8 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <Button asChild variant="outline" size="sm">
          <Link href={GURU_BASE_PATH}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Daftar Artikel
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="mb-4 rounded-lg overflow-hidden h-64 w-full bg-muted flex items-center justify-center relative">
            {article.thumbnail ? (
              <Image
                src={article.thumbnail}
                alt={article.judul}
                fill
                className="object-cover"
              />
            ) : (
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          
          <Badge variant="secondary" className="w-fit mb-2">
            {kategoriName}
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
              Dibuat oleh: {createdByName}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="prose dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: cleanContent }}
          />
        </CardContent>
      </Card>
    </div>
  );
}