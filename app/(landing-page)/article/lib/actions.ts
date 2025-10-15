
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import dayjs from 'dayjs';

export async function getArticles(limit?: number) {
    try {
        const articles = await prisma.artikel.findMany({
            take: limit, 
            include: {
                KategoriArtikel: {
                    select: {
                        nama_kategori: true,
                    },
                },
                User: {
                    select: {
                        username: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
        });

        return articles.map((article) => ({
            id: article.artikel_id,
            title: article.judul,
            category: article.KategoriArtikel?.nama_kategori || 'Uncategorized',
            date: dayjs(article.created_at).format('MMM DD, YYYY'),
            imageSrc: article.thumbnail || '/default-article-image.jpg',
            excerpt: article.konten.substring(0, 150) + '...',
        }));
    } catch (error) {
        console.error('Error fetching articles:', error);
        throw new Error('Failed to fetch articles');
    }
}

export async function getArticleById(id: number) {
    try {
        const article = await prisma.artikel.findUnique({
            where: {
                artikel_id: id,
            },
            include: {
                KategoriArtikel: {
                    select: {
                        nama_kategori: true,
                    },
                },
                User: {
                    select: {
                        username: true,
                    },
                },
            },
        });

        return article;
    } catch (error) {
        console.error('Error fetching article by ID:', error);
        throw new Error('Failed to fetch article');
    }
}

export async function getRecommendedArticles(currentArticleId: number, limit: number = 3) {
    try {
        const currentArticle = await prisma.artikel.findUnique({
            where: { artikel_id: currentArticleId },
            select: { kategori: true },
        });

        if (!currentArticle) {
            return [];
        }

        const recommendedArticles = await prisma.artikel.findMany({
            where: {
                AND: [
                    { artikel_id: { not: currentArticleId } },
                    { kategori: currentArticle.kategori },
                ],
            },
            include: {
                KategoriArtikel: {
                    select: {
                        nama_kategori: true,
                    },
                },
                User: {
                    select: {
                        username: true,
                    },
                },
            },
            orderBy: {
                created_at: 'desc',
            },
            take: limit,
        });

        return recommendedArticles.map((article) => ({
            id: article.artikel_id,
            title: article.judul,
            category: article.KategoriArtikel?.nama_kategori || 'Uncategorized',
            date: dayjs(article.created_at).format('MMM DD, YYYY'),
            imageSrc: article.thumbnail || '/default-article-image.jpg',
            excerpt: article.konten.substring(0, 150) + '...',
        }));
    } catch (error) {
        console.error('Error fetching recommended articles:', error);
        return [];
    }
}

export async function LoginUpdate() {
    const session = await auth();

    if (!session){
        return { }
    }

    const now = new Date();
    try {
        await prisma.user.update({
            where:{
                user_id: Number(session.user.id)
            },
            data:{
                last_login: now
            }
        })

        return {success : "updated"}
    } catch{
        return {error:"terjadi kesalahan"}
    }
}