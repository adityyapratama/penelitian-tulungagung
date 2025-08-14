// BUAT FILE BARU INI

import { Suspense } from 'react';
import { getArticleById, getRecommendedArticles } from '../../article/lib/actions';
import Image from 'next/image';
import dayjs from 'dayjs';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

interface PageProps {
    params: {
        id: string;
    };
}

// Metadata untuk SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    try {
        const article = await getArticleById(parseInt(params.id));
        
        if (!article) {
            return {
                title: 'Artikel Tidak Ditemukan',
                description: 'Artikel yang Anda cari tidak ditemukan.',
            };
        }

        return {
            title: article.judul,
            description: article.konten.substring(0, 160) + '...',
            openGraph: {
                title: article.judul,
                description: article.konten.substring(0, 160) + '...',
                images: article.thumbnail ? [article.thumbnail] : [],
            },
        };
    } catch {
        return {
            title: 'Artikel Tidak Ditemukan',
            description: 'Artikel yang Anda cari tidak ditemukan.',
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
            <article className="max-w-4xl px-6 py-8 mx-auto">
                {/* Header artikel */}
                <header className="mb-8">
                    <h1 className="mb-4 text-4xl font-bold text-gray-900">
                        {article.judul}
                    </h1>
                    
                    <div className="flex items-center gap-4 mb-6 text-gray-600">
                        <span className="px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                            {article.KategoriArtikel?.nama_kategori || 'Uncategorized'}
                        </span>
                        <span>
                            {dayjs(article.created_at).format('DD MMMM YYYY')}
                        </span>
                        {article.User && (
                            <span>By {article.User.username}</span>
                        )}
                    </div>
                </header>

                {/* Gambar thumbnail */}
                {article.thumbnail && (
                    <div className="mb-8">
                        <Image
                            src={article.thumbnail}
                            alt={article.judul}
                            width={800}
                            height={400}
                            className="object-cover w-full h-auto rounded-lg shadow-lg"
                            priority
                        />
                    </div>
                )}

                {/* Konten artikel */}
                <div className="prose prose-lg max-w-none">
                    <div className="leading-relaxed text-gray-700 whitespace-pre-wrap">
                        {article.konten}
                    </div>
                </div>

                {/* Footer artikel */}
                <footer className="pt-8 mt-12 border-t border-gray-200">
                    <Link 
                        href="/article"
                        className="inline-block px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                        ← Kembali ke Daftar Artikel
                    </Link>
                </footer>
            </article>
        );
    } catch (error) {
        console.error('Error loading article:', error);
        notFound();
    }
}

// Component rekomendasi artikel
async function RecommendedArticles({ currentArticleId }: { currentArticleId: number }) {
    try {
        const recommendedArticles = await getRecommendedArticles(currentArticleId, 3);
        
        if (recommendedArticles.length === 0) {
            return null;
        }

        return (
            <section className="py-16 bg-gray-50">
                <div className="px-6 mx-auto max-w-7xl">
                    <h2 className="mb-12 text-3xl font-bold text-center text-gray-900">
                        Artikel Lainnya yang Mungkin Anda Suka
                    </h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {recommendedArticles.map((article) => (
                            <div key={article.id} className="overflow-hidden transition-shadow duration-300 bg-white rounded-lg shadow-lg hover:shadow-xl">
                                <Image
                                    src={article.imageSrc}
                                    alt={article.title}
                                    width={400}
                                    height={200}
                                    className="object-cover w-full h-48"
                                />
                                <div className="p-6">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded">
                                            {article.category}
                                        </span>
                                        <span className="text-sm text-gray-500">{article.date}</span>
                                    </div>
                                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                                        <Link href={`/artikel/${article.id}`} className="hover:text-blue-600">
                                            {article.title}
                                        </Link>
                                    </h3>
                                    <p className="mb-4 text-sm text-gray-600">{article.excerpt}</p>
                                    <Link 
                                        href={`/artikel/${article.id}`}
                                        className="inline-block px-4 py-2 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
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
        console.error('Error loading recommended articles:', error);
        return null;
    }
}

// Halaman utama
export default function ArticleDetailPage({ params }: PageProps) {
    const articleId = parseInt(params.id);

    if (isNaN(articleId)) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">
            {/* Detail artikel */}
            <Suspense fallback={
                <div className="max-w-4xl px-6 py-8 mx-auto animate-pulse">
                    <div className="w-3/4 h-8 mb-4 bg-gray-300 rounded"></div>
                    <div className="w-1/2 h-4 mb-8 bg-gray-200 rounded"></div>
                    <div className="h-64 mb-8 bg-gray-300 rounded"></div>
                    <div className="space-y-4">
                        <div className="w-full h-4 bg-gray-200 rounded"></div>
                        <div className="w-full h-4 bg-gray-200 rounded"></div>
                        <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
                    </div>
                </div>
            }>
                <ArticleDetail id={articleId} />
            </Suspense>

            {/* Rekomendasi artikel */}
            <Suspense fallback={
                <div className="py-16 bg-gray-50">
                    <div className="px-6 mx-auto text-center max-w-7xl">
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
            }>
                <RecommendedArticles currentArticleId={articleId} />
            </Suspense>
        </main>
    );
}