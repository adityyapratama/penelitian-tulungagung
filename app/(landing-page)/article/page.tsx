// File: /app/artikel/page.tsx

import { Suspense } from 'react';
import { getArticles } from '@/app/lib/actions';
import ArticleGridClient from '@/components/(landing-page)/article/article';
// 1. Impor komponen loading baru Anda
import LoadingIndicator from '@/components/(landing-page)/article/loader';

// Komponen async untuk fetching data (tetap sama)
async function Articles() {
  const articles = await getArticles();
  return <ArticleGridClient articles={articles} />;
}

export default function ArticlePage() {
  return (
    <main className="container py-8 mx-auto">
      <h1 className="mb-8 text-4xl font-bold text-center">Semua Artikel</h1>

      {/* 2. Gunakan LoadingIndicator sebagai fallback */}
      <Suspense fallback={<LoadingIndicator />}>
        <Articles />
      </Suspense>
      
    </main>
  );
}