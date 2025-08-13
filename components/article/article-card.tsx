// File: /app/page.tsx atau /app/artikel/page.tsx (Ini adalah SERVER COMPONENT)

import { getArticles } from '@/app/lib/actions'; // Panggil fungsi server Anda
import ArticleGridClient from '@/components/article/article';

// Halaman ini adalah ASYNC function
export default async function ArticlePage() {
  // 1. Ambil data di server
  const articles = await getArticles();

  return (
    <main>
      {/* 2. Lempar data yang sudah diambil sebagai PROPS ke Client Component */}
      <ArticleGridClient articles={articles} limit={3} />
    </main>
  );
}