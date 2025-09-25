"use client";

import type React from "react";
import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Filter, X } from "lucide-react";

interface Article {
  id: number;
  title: string;
  category: string;
  date: string;
  imageSrc: string;
  excerpt: string;
}

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <div className="block overflow-hidden transition-shadow duration-300 rounded-lg shadow-lg group hover:shadow-xl border border-gray-100">
      <Image
        alt={article.title}
        src={article.imageSrc || "/placeholder.svg"}
        width={400}
        height={256}
        className="object-cover w-full h-64 transition duration-500 group-hover:scale-105"
      />
      <div className="p-6 bg-white">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="px-3 py-1 font-medium text-white bg-[#2957A4] rounded-full text-xs">
            {article.category}
          </span>
          <span className="text-gray-500">{article.date}</span>
        </div>
        <h3 className="mt-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-[#2957A4] line-clamp-2">
          {article.title}
        </h3>
        <p className="mt-2 text-gray-700 line-clamp-3">{article.excerpt}</p>
        <Link
          href={`/article/${article.id}`}
          className="inline-flex items-center px-4 py-2 mt-4 font-semibold text-white transition-all bg-[#2957A4] border-2 border-[#2957A4] rounded-full hover:bg-white hover:text-[#2957A4] hover:border-[#2957A4]"
        >
          Read more →
        </Link>
      </div>
    </div>
  );
};

const ArticleGridClient: React.FC<{ articles: Article[]; limit?: number }> = ({
  articles,
  limit,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showFilters, setShowFilters] = useState(false);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = [
      "All",
      ...new Set(articles.map((article) => article.category)),
    ];
    return cats;
  }, [articles]);

  // Filter articles based on search and category
  const filteredArticles = useMemo(() => {
    let filtered = articles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          article.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter(
        (article) => article.category === selectedCategory
      );
    }

    // Apply limit if specified
    if (limit) {
      filtered = filtered.slice(0, limit);
    }

    return filtered;
  }, [articles, searchTerm, selectedCategory, limit]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
  };

  return (
    <div className="py-16 bg-gray-50">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-center text-[#2957A4] sm:text-4xl mb-4">
            {limit ? "Latest Articles" : "All Articles"}
          </h2>
          <p className="text-lg leading-8 text-center text-gray-600 mb-8">
            {limit
              ? "Stay up to date with our newest posts."
              : "Browse our complete collection of articles."}
          </p>

          {/* Search Bar */}

          <div className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#2957A4] focus:border-[#2957A4] outline-none transition-all"
              />
            </div>
          </div>

          {/* Filter Toggle and Categories */}
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-[#2957A4] text-white rounded-full hover:bg-[#1e4080] transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filter by Category</span>
            </button>

            {showFilters && (
              <div className="flex flex-wrap justify-center gap-2 max-w-4xl">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? "bg-[#2957A4] text-white"
                        : "bg-white text-[#2957A4] border border-[#2957A4] hover:bg-[#2957A4] hover:text-white"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}

            {/* Active Filters Display */}
            {(searchTerm || selectedCategory !== "All") && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span>Active filters:</span>
                {searchTerm && (
                  <span className="px-2 py-1 bg-[#FFCC29] text-[#2957A4] rounded-full">
                    Search: "{searchTerm}"
                  </span>
                )}
                {selectedCategory !== "All" && (
                  <span className="px-2 py-1 bg-[#FFCC29] text-[#2957A4] rounded-full">
                    Category: {selectedCategory}
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-1 px-2 py-1 text-red-600 hover:text-red-800"
                >
                  <X className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Showing {filteredArticles.length} of {articles.length} articles
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid max-w-2xl grid-cols-1 mx-auto gap-x-8 gap-y-12 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* No Results Message */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No articles found matching your criteria.
            </p>
            <button
              onClick={clearFilters}
              className="mt-4 px-6 py-2 bg-[#2957A4] text-white rounded-full hover:bg-[#1e4080] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* See All Articles Button */}
        {limit && !searchTerm && selectedCategory === "All" && (
          <div className="flex justify-center mt-16">
            <Link href="/article">
              <button
                type="button"
                className="px-8 py-3 text-lg font-semibold text-white transition-all bg-[#2957A4] rounded-full shadow-lg hover:bg-[#1e4080] hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2957A4]"
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
