import { GetGuruById } from "@/app/guru/lib/actions";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import type { Group } from "@/lib/generated/prisma";

type DataError = { error: string };

type GroupWithCount = Group & {
    _count?: { GroupMember: number } | null
};

export async function GetGroup(): Promise<GroupWithCount[] | DataError> {
    const session = await auth();
    if (!session?.user?.id) { 
        return { error: "not authenticated" };
    }

    try {
        const guru = await GetGuruById(session.user.id!)

        const data = prisma.group.findMany({
            where:{
                created_by: Number(guru.guru_id!)
            },
            include: {
                _count: {
                    select: { GroupMember: true }
                }
            },
        })

        return data;
    } catch {
        return {error: "terjadi kesalahan" }
    }
}

export async function GetGroupById(id: string): Promise<GroupWithCount | null | DataError> {
    const session = await auth();
    if (!session?.user?.id) {
        return { error: "not authenticated" };
    }

    if (!id) {
        return { error: "ID Grup tidak valid" };
    }

    try {
        const guru = await GetGuruById(session.user.id!)

        const data = await prisma.group.findFirst({
            where:{
                created_by: Number(guru.guru_id!),
                group_id : id
            },
            include: { 
                _count: {
                    select: { GroupMember: true }
                }
            },
        })

        return data;
    } catch {
        return {error: "terjadi kesalahan" }
    }
}