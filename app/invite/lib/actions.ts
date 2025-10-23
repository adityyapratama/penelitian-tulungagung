'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { dateFormat } from "@/lib/utils";

export type InviteActionResult = {
  success?: string;
  error?: string;
};

async function getMemberId(): Promise<number | null> {
    const session = await auth();
    if (!session?.user?.id) return null;
    const userId = parseInt(session.user.id);
    try {
        const member = await prisma.member.findUnique({
            where: { user_id: userId },
            select: { member_id: true }
        });
        return member?.member_id ?? null; 
    } catch (error) {
        console.error("Error fetching member_id:", error);
        return null;
    }
}

export async function AccInvite(id: string): Promise<InviteActionResult> {
    const session = await auth();

    if (!session){
        return {error:"Not Authorized"}
    }

    if (session.user.role !== 'member') {
        return { error: "Hanya member yang bisa bergabung." };
    }

    const memberId = await getMemberId();
    if (!memberId) {
        return { error: "Profil member tidak ditemukan. Harap lengkapi profil Anda." };
    }

    try {
        const group = await prisma.group.findUnique({
            where:{
                group_id:id
            }
        })

        if (!group){
            return {error: "Undangan tidak valid atau grup tidak ditemukan."}
        }

        const existingMembership = await prisma.groupMember.findUnique({
             where: {
                 group_id_member_id: { 
                     group_id: id,
                     member_id: memberId
                 }
             }
         });

         if (existingMembership) {
             return { success: "Anda sudah tergabung dalam grup ini." };
         }

        await prisma.groupMember.create({
            data:{
                group_id:group.group_id,
                member_id: memberId,
                tanggal_bergabung: new Date()
            }
        })

        return {success:"Berhasil bergabung ke group"}
    } catch {
        return {error:"Terjadi kesalahan saat bergabung ke group"}
    }
}