// BUAT FILE BARU INI

import { Suspense } from "react";
import { getArticleById, getRecommendedArticles } from "../lib/actions";
import Image from "next/image";
import dayjs from "dayjs";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>; // ✅ harus Promise
}

// Metadata untuk SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  try {
    const { id } = await params; // ✅ harus di-await
    const articleId = Number.parseInt(id);

    if (isNaN(articleId)) {
      notFound();
    }
    const article = await getArticleById(articleId);

    if (!article) {
      return {
        title: "Artikel Tidak Ditemukan",
        description: "Artikel yang Anda cari tidak ditemukan.",
      };
    }

    return {
      title: article.judul,
      description: article.konten.substring(0, 160) + "...",
      openGraph: {
        title: article.judul,
        description: article.konten.substring(0, 160) + "...",
        images: article.thumbnail ? [article.thumbnail] : [],
      },
    };
  } catch {
    return {
      title: "Artikel Tidak Ditemukan",
      description: "Artikel yang Anda cari tidak ditemukan.",
    };
  }
}

// Component detail artikel
async function ArticleDetail({ id }: { id: number }) {
  try {
    const article = await getArticleById(id);

    if (!article) {
      notFound();
    }

    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left content area - takes 3 columns */}
            <div className="lg:col-span-3 space-y-8">
              {/* Header: Judul | Jenis */}
              <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-6 border-b border-gray-200">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                    {article.judul}
                  </h1>
                </div>
                <div className="lg:ml-8">
                  <span className="px-4 py-2 text-sm font-medium text-white bg-[#2957A4] rounded-full whitespace-nowrap">
                    {article.KategoriArtikel?.nama_kategori || "Uncategorized"}
                  </span>
                </div>
              </header>

              {/* Photo section */}
              {article.thumbnail && (
                <div className="w-full">
                  <Image
                    src={article.thumbnail || "/placeholder.svg"}
                    alt={article.judul}
                    width={1200}
                    height={400}
                    className="object-cover w-full h-auto max-h-[300px] rounded-lg shadow-lg"
                    priority
                  />
                </div>
              )}

              {/* Article content */}
              <article className="prose prose-lg max-w-none">
                <div className="leading-relaxed text-gray-700 whitespace-pre-wrap text-justify">
                  {article.konten}
                </div>
              </article>

              {/* Footer */}
              <footer className="pt-8 mt-12 border-t border-gray-200">
                <Link
                  href="/article"
                  className="inline-block px-6 py-3 text-white transition-colors bg-[#2957A4] rounded-lg hover:bg-[#1e3f7a] font-medium"
                >
                  ← Kembali ke Daftar Artikel
                </Link>
              </footer>
            </div>

            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8 space-y-6 bg-[#FFCC29]/10 border border-[#FFCC29]/20 p-6 rounded-lg">
                <h2 className="text-lg font-bold text-[#2957A4] border-b border-[#FFCC29]/30 pb-2">
                  Detail Artikel
                </h2>

                {/* Pembuat (Creator) */}
                {article.User && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#2957A4] uppercase tracking-wide mb-2">
                      Pembuat
                    </h3>
                    <p className="text-gray-800 font-medium">
                      {article.User.username}
                    </p>
                  </div>
                )}

                {/* Tanggal (Date) */}
                <div>
                  <h3 className="text-sm font-semibold text-[#2957A4] uppercase tracking-wide mb-2">
                    Tanggal Publikasi
                  </h3>
                  <p className="text-gray-700">
                    {dayjs(article.created_at).format("DD MMMM YYYY")}
                  </p>
                </div>

                {/* Kategori */}
                <div>
                  <h3 className="text-sm font-semibold text-[#2957A4] uppercase tracking-wide mb-2">
                    Kategori
                  </h3>
                  <span className="px-3 py-1 text-sm font-medium text-white bg-[#2957A4] rounded-full">
                    {article.KategoriArtikel?.nama_kategori || "Uncategorized"}
                  </span>
                </div>

                {/* Deskripsi (Description) */}
                <div>
                  <h3 className="text-sm font-semibold text-[#2957A4] uppercase tracking-wide mb-2">
                    Ringkasan
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {article.konten.substring(0, 200)}...
                  </p>
                </div>

                {/* Reading time estimate */}
                <div>
                  <h3 className="text-sm font-semibold text-[#2957A4] uppercase tracking-wide mb-2">
                    Estimasi Baca
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {Math.ceil(article.konten.length / 1000)} menit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error loading article:", error);
    notFound();
  }
}

// Component rekomendasi artikel
async function RecommendedArticles({
  currentArticleId,
}: {
  currentArticleId: number;
}) {
  try {
    const recommendedArticles = await getRecommendedArticles(
      currentArticleId,
      3
    );

    if (recommendedArticles.length === 0) {
      return null;
    }

    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
            Artikel Lainnya yang Mungkin Anda Suka
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recommendedArticles.map((article) => (
              <div
                key={article.id}
                className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-lg hover:shadow-xl"
              >
                <Image
                  src={article.imageSrc || "/placeholder.svg"}
                  alt={article.title}
                  width={400}
                  height={200}
                  className="object-cover w-full h-48"
                />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 text-xs font-medium text-white bg-[#2957A4] rounded">
                      {article.category}
                    </span>
                    <span className="text-sm text-gray-500">
                      {article.date}
                    </span>
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    <Link
                      href={`/article/${article.id}`}
                      className="hover:text-[#2957A4]"
                    >
                      {article.title}
                    </Link>
                  </h3>
                  <p className="mb-4 text-sm text-gray-600">
                    {article.excerpt}
                  </p>
                  <Link
                    href={`/article/${article.id}`}
                    className="inline-block px-4 py-2 text-white transition-colors bg-[#2957A4] rounded hover:bg-[#1e3f7a]"
                  >
                    Baca Selengkapnya →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    console.error("Error loading recommended articles:", error);
    return null;
  }
}

// Halaman utama
export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const articleId = Number.parseInt(id);

  if (isNaN(articleId)) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Detail artikel */}
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-6 py-8 animate-pulse">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-3 space-y-8">
                <div className="flex justify-between items-start gap-4">
                  <div className="w-3/4 h-12 bg-gray-300 rounded"></div>
                  <div className="w-24 h-8 bg-gray-200 rounded-full"></div>
                </div>
                <div className="h-64 bg-gray-300 rounded"></div>
                <div className="space-y-4">
                  <div className="w-full h-4 bg-gray-200 rounded"></div>
                  <div className="w-full h-4 bg-gray-200 rounded"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-gray-100 p-6 rounded-lg space-y-4">
                  <div className="w-full h-6 bg-gray-300 rounded"></div>
                  <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                  <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        }
      >
        <ArticleDetail id={articleId} />
      </Suspense>

      {/* Rekomendasi artikel */}
      <Suspense
        fallback={
          <div className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 text-center">
              <div className="animate-pulse">
                <div className="w-1/2 h-8 mx-auto mb-12 bg-gray-300 rounded"></div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="p-6 bg-white rounded-lg">
                      <div className="h-32 mb-4 bg-gray-300 rounded"></div>
                      <div className="h-4 mb-2 bg-gray-200 rounded"></div>
                      <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        }
      >
        <RecommendedArticles currentArticleId={articleId} />
      </Suspense>
    </main>
  );
}
