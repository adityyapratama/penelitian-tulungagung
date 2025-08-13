import prisma from "@/lib/prisma";
import dayjs from "dayjs";

interface DisplayArticle {
  id: number;
  title: string;
  category: string;
  date: string;
  imageSrc: string;
  excerpt: string;
  author: string;
}

export async function getArticles(): Promise<DisplayArticle[]> {
  try {
    const rawArticles = await prisma.artikel.findMany({
      orderBy: {
        created_at: "desc", 
      },
      include: {
        KategoriArtikel: true,
        User: true,
      },
    });

    const transformedArticles = rawArticles.map((article) => {
      return {
        id: article.artikel_id,
        title: article.judul,
        category: article.KategoriArtikel?.nama_kategori || "Tanpa Kategori",
        date: dayjs(article.created_at).format("DD MMMM YYYY"),
        imageSrc: article.thumbnail || "/placeholder-image.jpg", 
        excerpt: article.konten.substring(0, 120) + "...",
        author: article.User?.username || "Penulis Tidak Dikenal",
      };
    });

    return transformedArticles;
  } catch (error) {
    console.error("Database Error:", error);
  
    return [];
  }
}

export async function getArticleById(id:string){
      try {
        const Article = await prisma.artikel.findFirst({
            where:{
                artikel_id:Number.parseInt(id)
            }
        })
        return Article
    } catch (error) {
        console.log(error)
        return null
    }
}
