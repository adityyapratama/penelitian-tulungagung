import prisma from "@/lib/prisma";

 export async function getSekolah(){
    try {
        const sekolah = await prisma.sekolah.findMany({})
        
        return sekolah
    } catch (error) {
        console.log(error)
        return {error:error}
    }
 }


 export async function getSekolahById(id:string) {
    try {
        const sekolah = await prisma.sekolah.findFirst({
            where:{
                sekolah_id:Number.parseInt(id)
            }
        })

        return sekolah
    } catch (error) {
        console.log(error)
        return {error:error}
    }
 }