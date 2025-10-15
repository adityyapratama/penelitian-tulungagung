import Link from "next/link";
import Image from "next/image";

interface Article {
  id: number;
  title: string;
  category: string;
  date: string;
  imageSrc: string;
  excerpt: string;
}

export const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <div className="block overflow-hidden transition-shadow duration-300 bg-white border border-gray-100 rounded-lg shadow-lg group hover:shadow-xl">
      <Image
        alt={article.title}
        src={article.imageSrc || "/placeholder.svg"}
        width={400}
        height={256}
        className="object-cover w-full h-48 transition duration-500 group-hover:scale-105"
      />
      <div className="p-4">
        <div className="flex items-center justify-between mb-2 text-sm">
          <span className="px-3 py-1 text-xs font-medium text-white bg-[#2957A4] rounded-full">
            {article.category}
          </span>
          <span className="text-gray-500">{article.date}</span>
        </div>
        <h3 className="mt-2 text-lg font-bold text-gray-900 transition-colors line-clamp-2 group-hover:text-[#2957A4]">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-gray-700 line-clamp-2">{article.excerpt}</p>
        <Link
          href={`/article/${article.id}`}
          className="inline-block mt-4 text-sm font-semibold text-[#2957A4] hover:underline"
        >
          Baca Selengkapnya →
        </Link>
      </div>
    </div>
  );
};