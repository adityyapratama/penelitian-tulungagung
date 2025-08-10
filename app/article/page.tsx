// app/artikel/page.tsx
import { NavbarDemo } from "@/app/components/navbar/navbar";
import ArticleGrid from "@/app/components/article/article";
import { Suspense } from "react";
import { getArticle } from "./lib/actions";

export default function ArticlesPage() {
  const data = getArticle()
  console.log(data)
  return (
    <div className="min-h-screen overflow-x-hidden font-sans">
      <main className="max-w-full px-4 pt-20 sm:px-8 lg:px-20">
        <section id="all-articles" className="relative py-24 sm:py-32">
          <Suspense fallback={<div className="w-full h-screen" />}>
            <ArticleGrid /> {/* Panggil tanpa limit, jadi akan tampilkan semua artikel */}
          </Suspense>
        </section>
      </main>
    </div>
  );
}