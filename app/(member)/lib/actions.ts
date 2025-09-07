import { auth } from "@/auth"
import prisma from "@/lib/prisma";

export async function GetMemberData(){
    const session = await auth()

    if (!session) {
        return { error: "Not Authorized" }; 
    }

    try {
        const member = await prisma.member.findFirst({
            where:{
                user_id: parseInt(session.user.id!)
            }
        })

        return member
    } catch (error) {
        return {error}
    }
}