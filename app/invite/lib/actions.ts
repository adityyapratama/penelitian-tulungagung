'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { dateFormat } from "@/lib/utils";


export async function AccInvite(id:string) {
    const session = await auth();

    if (!session){
        return {error:"Not Authorized"}
    }
    try {
        const group = await prisma.group.findFirst({
            where:{
                group_id:id
            }
        })

        if (!group){
            return {error: "Invalid or Expired Invitation"}
        }

        const now = new Date()

        await prisma.groupMember.create({
            data:{
                group_id:group.group_id,
                member_id: Number(session.user.id!),
                tanggal_bergabung: dateFormat(now)
            }
        })

        return {success:"berhasil bergabung ke group"}
    } catch {
        return {error:"terjadi kesalahan saat bergabung ke group"}
    }
}