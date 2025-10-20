import prisma from "@/lib/prisma";

type ArticleFilter = {
    userId?: number;
};

export async function getArticle(filter: ArticleFilter = {}) {
    try {
        const Articles = await prisma.artikel.findMany({
            where: {
                ...(filter.userId && { created_by: filter.userId }),
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
            }
        })
        return Articles
    } catch (error) {
        console.error(error)
        return []
    }
}

export async function getArticleById(id: string) {
    try {
        const Article = await prisma.artikel.findFirst({
            where: {
                artikel_id: Number.parseInt(id)
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
        })
        return Article
    } catch (error) {
        console.error(error)
        return null
    }
}

export async function GetArticleCategory() {
    try {
        const categories = await prisma.kategoriArtikel.findMany({})
        return categories
    } catch (error) {
        console.error(error)
        return []
    }
}

export async function GetArticleCategoryById(id:string) {
    try {
        const category = await prisma.kategoriArtikel.findFirst({
            where:{
                KategoriArtikel_id:Number.parseInt(id)
            }
        })
        return category
    } catch (error) {
        console.error(error)
        return null
    }
}