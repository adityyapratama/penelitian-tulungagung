"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link'; // Import Link dari Next.js

// Type definition for an article
interface Article {
  id: number;
  title: string;
  category: string;
  date: string;
  imageSrc: string;
  excerpt: string;
}

// Reusable Article Card Component
const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <div className="block overflow-hidden transition-shadow duration-300 rounded-lg shadow-lg group hover:shadow-xl">
      <img
        alt={article.title}
        src={article.imageSrc}
        className="object-cover w-full h-64 transition duration-500 group-hover:scale-105"
      />
      <div className="p-6 bg-white">
        <div className="flex items-center justify-between mb-2 text-sm text-gray-500">
          <span className="font-medium text-blue-600">{article.category}</span>
          <span>{article.date}</span>
        </div>
        <h3 className="mt-2 text-2xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
          {article.title}
        </h3>
        <p className="mt-2 text-gray-700">{article.excerpt}</p>
        <Link 
          href={`/artikel/${article.id}`} 
          className="inline-block mt-4 font-semibold text-blue-600 transition hover:text-blue-600"
        >
          Read more &rarr;
        </Link>
      </div>
    </div>
  );
};

// Main Article Grid Component
const ArticleGrid: React.FC<{ limit?: number }> = ({ limit }) => {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    // This is a placeholder for fetching data from your API.
    const allArticles: Article[] = [
        { id: 1, title: "Designing for Modern UI", category: "Design", date: "2025-08-06", imageSrc: "https://images.unsplash.com/photo-1596526145339-44043b497063?q=80&w=2070&auto=format&fit=crop", excerpt: "Exploring the new design trends and practices." },
        { id: 2, title: "The Power of AI in Coding", category: "Technology", date: "2025-08-05", imageSrc: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?q=80&w=2070&auto=format&fit=crop", excerpt: "How AI is changing the way we build software." },
        { id: 3, title: "The Art of Effective Blogging", category: "Content", date: "2025-08-04", imageSrc: "https://images.unsplash.com/photo-1506157786151-b8491531cd0b?q=80&w=2070&auto=format&fit=crop", excerpt: "Tips to make your blog posts more engaging." },
        { id: 4, title: "A Great Article from Last Month", category: "News", date: "2025-07-20", imageSrc: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop", excerpt: "An older article that's still relevant." },
        { id: 5, title: "Advanced CSS Techniques", category: "Development", date: "2025-07-15", imageSrc: "https://images.unsplash.com/photo-1549692520-acc6669e2f0c?q=80&w=2070&auto=format&fit=crop", excerpt: "Deep dive into CSS tricks and tips." },
    ];

    const sortedArticles = allArticles.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (limit) {
      setArticles(sortedArticles.slice(0, limit));
    } else {
      setArticles(sortedArticles);
    }
  }, [limit]);

  return (
    <div className="py-24 bg-white sm:py-32">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-center text-gray-900 sm:text-4xl">
          {limit ? 'Latest Articles' : 'All Articles'}
        </h2>
        <p className="mt-2 text-lg leading-8 text-center text-gray-600">
          {limit ? 'Stay up to date with our newest posts.' : 'Browse our complete collection of articles.'}
        </p>
        <div className="grid max-w-2xl grid-cols-1 mx-auto mt-16 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
        {limit && ( // Hanya tampilkan tombol jika `limit` ada
          <div className="flex justify-center mt-16">
            <Link href="/article" passHref>
              <button 
                type="button" 
                className="px-6 py-3 text-lg font-semibold text-white transition-colors bg-blue-600 rounded-full shadow-md hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                See All Articles
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleGrid;