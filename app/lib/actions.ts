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
    // 1. Ambil data dari database, SERTAKAN (include) relasinya
    const rawArticles = await prisma.artikel.findMany({
     // Opsional untuk membatasi jumlah artikel
      orderBy: {
        created_at: "desc", // Urutkan dari yang terbaru
      },
      include: {
        // Sertakan data dari tabel relasi
        KategoriArtikel: true,
        User: true,
      },
    });

    // 2. Transformasikan data mentah menjadi format yang siap ditampilkan
    const transformedArticles = rawArticles.map((article) => {
      return {
        id: article.artikel_id,
        title: article.judul,
        // Gunakan optional chaining (?.) untuk keamanan jika relasi null
        category: article.KategoriArtikel?.nama_kategori || "Tanpa Kategori",
        date: dayjs(article.created_at).format("DD MMMM YYYY"),
        imageSrc: article.thumbnail || "/placeholder-image.jpg", // Sediakan gambar default
        excerpt: article.konten.substring(0, 120) + "...",
        author: article.User?.username || "Penulis Tidak Dikenal",
      };
    });

    // 3. Kembalikan data yang sudah "matang"
    return transformedArticles;
  } catch (error) {
    console.error("Database Error:", error);
    // Jika terjadi error, sebaiknya lemparkan error agar bisa ditangani
    // oleh file error.tsx di level atas, atau kembalikan array kosong.
    return [];
  }
}
