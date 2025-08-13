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