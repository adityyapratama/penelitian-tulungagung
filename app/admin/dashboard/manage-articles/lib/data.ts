import prisma from "@/lib/prisma";

export async function getArticle(){
    try {
        const Articles = await prisma.artikel.findMany({})

        return Articles
    } catch (error) {
        console.log(error)
        return []
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

export async function GetArticleCategory() {
    try {
        const categories = await prisma.kategoriArtikel.findMany({})
        return categories
    } catch (error) {
        console.log(error)
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
        console.log(error)
        return null
    }
}