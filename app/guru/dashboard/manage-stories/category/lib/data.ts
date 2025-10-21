'use server'

import prisma from "@/lib/prisma"

export async function getCategory(){
    try {
        const categories = await prisma.kategoriCerita.findMany({})

        return categories
    } catch (error) {
        console.log(error)
        return {error : error}
    }
}

export async function getCategoryById(id:string){
    try {
        const category = await prisma.kategoriCerita.findFirst({
            where:{
                KategoriId:parseInt(id)
            }
        })

        return category
    } catch (error) {
        console.log(error)
        return {error:error}
    }
}