"use server"

import { GetGuruById } from "@/app/guru/lib/actions";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import type { Group, Guru, GroupMember, Member, User, GroupContent, Kuis, CeritaInteraktif, Puzzle, ContentType } from "@/lib/generated/prisma";

type DataError = { error: string };

type MemberUser = Pick<User, 'user_id' | 'username' | 'email'> & { Member?: { foto_profil: string | null } | null };
type MemberWithUser = Member & { User: MemberUser | null };
export type GroupMemberWithDetails = GroupMember & { Member: MemberWithUser | null };

type KuisDetails = Pick<Kuis, 'kuis_id' | 'judul'>;
type CeritaDetails = Pick<CeritaInteraktif, 'cerita_id' | 'judul'>;
type PuzzleDetails = Pick<Puzzle, 'puzzle_id' | 'judul'>;
export type GroupContentWithDetails = GroupContent & {
    Kuis?: KuisDetails | null;
    CeritaInteraktif?: CeritaDetails | null;
    Puzzle?: PuzzleDetails | null;
    content_type: ContentType;
};
export type GroupWithDetails = Group & {
    _count?: { GroupMember: number } | null;
    GroupMember?: GroupMemberWithDetails[];
    GroupContent?: GroupContentWithDetails[];
};
type GroupWithCount = Group & { _count?: { GroupMember: number } | null };
export type PerformanceData = {
    username: string;
    scores: number | null;
    last_login: string | null;
};
type AvailableContentItem = { id: number; judul: string; };

export async function GetGroup(): Promise<GroupWithCount[] | DataError> {
    const session = await auth();
    if (!session?.user?.id) { 
        return { error: "not authenticated" };
    }

    try {
        const guru = await GetGuruById(session.user.id!)

        if (!guru || (typeof guru === 'object' && 'error' in guru)) {
            return { error: "Data guru tidak ditemukan atau tidak valid." };
        }
        
        const data = await prisma.group.findMany({
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

   const guru = await GetGuruById(session.user.id!)

   if (!guru || (typeof guru === 'object' && 'error' in guru)) {
        return { error: "Data guru tidak ditemukan atau tidak valid." };
    }

    try {
        const groupData = await prisma.group.findFirst({
            where: {
                created_by:  Number(guru.guru_id!),
                group_id: id
            },
            include: {
                 _count: {
                    select: { GroupMember: true }
                 },
                 GroupMember: {
                    include: {
                        Member: {
                            include: {
                                User: {
                                    select: { user_id: true, username: true, email: true, Member: { select: { foto_profil: true }} }
                                }
                            }
                        }
                    },
                    orderBy: {
                        tanggal_bergabung: 'asc'
                    }
                },
                GroupContent: {
                    orderBy: {
                        group_content_id: 'asc'
                    }
                }
            },
        });

        if (!groupData) {
            return null;
        }

        if (groupData.GroupContent && groupData.GroupContent.length > 0) {
            const kuisIds = groupData.GroupContent.filter(gc => gc.content_type === 'kuis').map(gc => gc.content_id);
            const ceritaIds = groupData.GroupContent.filter(gc => gc.content_type === 'cerita').map(gc => gc.content_id);
            const puzzleIds = groupData.GroupContent.filter(gc => gc.content_type === 'puzzle').map(gc => gc.content_id);

            const [kuisDetails, ceritaDetails, puzzleDetails] = await Promise.all([
                kuisIds.length > 0 ? prisma.kuis.findMany({ where: { kuis_id: { in: kuisIds } }, select: { kuis_id: true, judul: true } }) : [],
                ceritaIds.length > 0 ? prisma.ceritaInteraktif.findMany({ where: { cerita_id: { in: ceritaIds } }, select: { cerita_id: true, judul: true } }) : [],
                puzzleIds.length > 0 ? prisma.puzzle.findMany({ where: { puzzle_id: { in: puzzleIds } }, select: { puzzle_id: true, judul: true } }) : [],
            ]);

            const kuisMap = new Map(kuisDetails.map(k => [k.kuis_id, k]));
            const ceritaMap = new Map(ceritaDetails.map(c => [c.cerita_id, c]));
            const puzzleMap = new Map(puzzleDetails.map(p => [p.puzzle_id, p]));

            const detailedGroupContent = groupData.GroupContent.map(gc => {
                const item = gc as GroupContentWithDetails;
                if (item.content_type === 'kuis') item.Kuis = kuisMap.get(item.content_id) || null;
                else if (item.content_type === 'cerita') item.CeritaInteraktif = ceritaMap.get(item.content_id) || null;
                else if (item.content_type === 'puzzle') item.Puzzle = puzzleMap.get(item.content_id) || null;
                return item;
            });
            (groupData as GroupWithDetails).GroupContent = detailedGroupContent;
        }
        return groupData as GroupWithDetails;

    } catch (e) {
        console.error("GetGroupById prisma query error:", e);
        return { error: "Terjadi kesalahan" };
    }
}

export async function getAvailableQuizzesForGroup(groupId: string, userId: number): Promise<AvailableContentItem[] | DataError> {
    if (!userId) return { error: "Tidak terautentikasi" };

    try {
        const assignedKuisIds = await prisma.groupContent.findMany({
            where: {
                group_id: groupId,
                content_type: 'kuis' 
            },
            select: { content_id: true }
        });
        const assignedIds = assignedKuisIds.map(item => item.content_id);

        const availableQuizzes = await prisma.kuis.findMany({
            where: {
                kuis_id: {
                    notIn: assignedIds 
                },
                OR: [
                    { is_published: true }, 
                    { created_by: userId }  
                ]
            },
            select: {
                kuis_id: true,
                judul: true
            },
            orderBy: {
                judul: 'asc'
            }
        });

        return availableQuizzes.map(q => ({ id: q.kuis_id, judul: q.judul }));

    } catch (error) {
        console.error("Error fetching available quizzes:", error);
        return { error: "Gagal mengambil data kuis yang tersedia." };
    }
}

export async function getAvailableStoriesForGroup(groupId: string, userId: number): Promise<AvailableContentItem[] | DataError> {
    if (!userId) return { error: "Tidak terautentikasi" };

     try {
        const assignedStoryIds = await prisma.groupContent.findMany({
            where: { group_id: groupId, content_type: 'cerita' },
            select: { content_id: true }
        });
        const assignedIds = assignedStoryIds.map(item => item.content_id);

        const availableStories = await prisma.ceritaInteraktif.findMany({
            where: {
                cerita_id: { notIn: assignedIds },
                OR: [
                    { is_published: true }, 
                    { created_by: userId }  
                ]
            },
            select: { cerita_id: true, judul: true },
            orderBy: { judul: 'asc' }
        });

        return availableStories.map(s => ({ id: s.cerita_id, judul: s.judul }));

    } catch (error) {
        console.error("Error fetching available stories:", error);
        return { error: "Gagal mengambil data cerita yang tersedia." };
    }
}

export async function getAvailablePuzzlesForGroup(groupId: string, userId: number): Promise<AvailableContentItem[] | DataError> {
    if (!userId) return { error: "Tidak terautentikasi" };

     try {
        const assignedPuzzleIds = await prisma.groupContent.findMany({
            where: { group_id: groupId, content_type: 'puzzle' }, 
            select: { content_id: true }
        });
        const assignedIds = assignedPuzzleIds.map(item => item.content_id);

        const availablePuzzles = await prisma.puzzle.findMany({
            where: {
                puzzle_id: { notIn: assignedIds },
                OR: [
                    { is_published: true }, 
                    { created_by: userId }  
                ]
            },
            select: { puzzle_id: true, judul: true },
            orderBy: { judul: 'asc' }
        });

        return availablePuzzles.map(p => ({ id: p.puzzle_id, judul: p.judul }));

    } catch (error) {
        console.error("Error fetching available puzzles:", error);
        return { error: "Gagal mengambil data puzzle yang tersedia." };
    }
}