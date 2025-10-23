'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import type { Guru, GroupMember, Member, User } from "@/lib/generated/prisma";

type DataError = { error: string };

export async function getGroupInviteDetails(groupId: string) {
    try {
        const group = await prisma.group.findUnique({
            where: { group_id: groupId },
            select: {
                group_id: true,
                group_name: true,
                group_thumbnail: true,
                _count: { 
                    select: { GroupMember: true }
                }
            }
        });
        if (!group) return { error: "Grup tidak ditemukan." };
        return group;
    } catch (e) {
        console.error("getGroupInviteDetails Error:", e);
        return { error: "Gagal mengambil data grup." };
    }
}

export async function getMemberDetailsFromSession(): Promise<({
    member_id: number;
    foto_profil: string | null;
    User: { username: string | null } | null;
} & { error?: undefined }) | { error: string }> {
    const session = await auth();
    if (!session?.user?.id) return { error: "Sesi tidak ditemukan." };

    try {
        const member = await prisma.member.findUnique({
            where: { user_id: Number(session.user.id) },
            select: {
                member_id: true,
                foto_profil: true,
                User: {
                    select: { username: true }
                }
            }
        });
        if (!member) return { error: "Profil member tidak ditemukan." };
        return member;
    } catch (e) {
         console.error("getMemberDetailsFromSession Error:", e);
        return { error: "Gagal mengambil data member." };
    }
}

export async function checkIfAlreadyMember(groupId: string, memberId: number): Promise<boolean> {
     try {
        const existingMembership = await prisma.groupMember.findUnique({
             where: {
                 group_id_member_id: {
                     group_id: groupId,
                     member_id: memberId
                 }
             }
         });
         return !!existingMembership; 
    } catch (e) {
        console.error("checkIfAlreadyMember Error:", e);
        return false; 
    }
}