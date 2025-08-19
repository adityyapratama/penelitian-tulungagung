// File: /components/ArticleGridClient.tsx (Nama diubah agar lebih jelas)

"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';


// Type definition (sudah bagus)
interface Article {
  id: number;
  title: string;
  category: string;
  date: string;
  imageSrc: string;
  excerpt: string;
}

// Komponen Card (sudah bagus, tidak perlu diubah)
const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  // ... (kode card Anda tidak berubah)
  return (

    <div className="block overflow-hidden transition-shadow duration-300 rounded-lg shadow-lg group hover:shadow-xl">
      <Image
        alt={article.title}
        src={article.imageSrc}
        width={400}
        height={256}
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
          className="inline-block px-4 py-2 mt-4 mr-2 font-semibold text-white transition bg-blue-600 border-2 rounded-full back hover:text-blue-600 hover:bg-white hover:border-blue-600"
        >
          Read more &rarr;
        </Link>
      </div>
    </div>
  );
};

// Komponen Grid UTAMA yang sudah diperbaiki
const ArticleGridClient: React.FC<{ articles: Article[]; limit?: number }> = ({ articles, limit }) => {
  // Komponen ini SEKARANG MENERIMA 'articles' dari props
  // BUKAN memanggil getArticles() lagi.

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
          {articles.map((article) => ( // Langsung gunakan articles dari props
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
        {limit && ( 
          <div className="flex justify-center mt-16">
            <Link href="/article">
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

export default ArticleGridClient;