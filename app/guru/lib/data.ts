import { auth } from "@/auth";
import prisma from "@/lib/prisma";



export async function GetGroup(){
    const session = await auth()
    if(!session){
        return {error:"not authenticated"}
    }

    try {
        const data = prisma.group.findMany({
            where:{
                created_by: Number(session.user.id!)
            }
        })

        return data;
    } catch {
        return {error: "terjadi kesalahan" }
    }
}