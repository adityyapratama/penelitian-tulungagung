import prisma from "@/lib/prisma";

export async function getArticle(){
    try {
        const artikel = await prisma.artikel.findMany()

        return artikel

    } catch (error) {
        return {error:error}
    }
}