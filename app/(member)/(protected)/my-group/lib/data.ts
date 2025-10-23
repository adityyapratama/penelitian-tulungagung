'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import type { Group, GroupMember, Member, User, GroupContent, Kuis, CeritaInteraktif, Puzzle, ContentType } from "@/lib/generated/prisma";

type DataError = { error: string };

export type AssignedGameCard = {
  id: string;
  type: "puzzle" | "kuis" | "cerita";
  title: string;
  description: string;
  image: string;
  category: string;
  xp_reward: number;
  createdAt: Date;
  groupId: string;
  groupName: string | null;
};

export type MemberGroup = {
    group_id: string;
    group_name: string | null;
    group_thumbnail: string | null;
};

async function getMemberIdFromSession(): Promise<number | null> {
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

export async function getMemberGroups(): Promise<MemberGroup[] | DataError> {
    const memberId = await getMemberIdFromSession();
    if (!memberId) return { error: "Member tidak terautentikasi." };

    try {
        const memberGroups = await prisma.groupMember.findMany({
            where: { member_id: memberId },
            include: {
                Group: {
                    select: {
                        group_id: true,
                        group_name: true,
                        group_thumbnail: true
                    }
                }
            },
            orderBy: {
                Group: { group_name: 'asc' } 
            }
        });

        return memberGroups.map(gm => gm.Group).filter(Boolean) as MemberGroup[];
        
    } catch (e) {
        console.error("getMemberGroups Error:", e);
        return { error: "Terjadi kesalahan saat mengambil daftar grup." };
    }
}

export async function getAssignedContentForGroup(groupId: string): Promise<AssignedGameCard[] | DataError> {
    const memberId = await getMemberIdFromSession();
    if (!memberId) return { error: "Member tidak terautentikasi." };

    if (!groupId) return []; 

    try {
        const isMember = await prisma.groupMember.findUnique({
            where: {
                group_id_member_id: {
                    group_id: groupId,
                    member_id: memberId
                }
            },
            include: {
                Group: { select: { group_name: true }}
            }
        });

        if (!isMember) {
            return { error: "Anda bukan anggota grup ini." };
        }
        
        const groupName = isMember.Group?.group_name || null;

        const groupContents = await prisma.groupContent.findMany({
            where: { group_id: groupId },
            select: { content_type: true, content_id: true }
        });

        if (groupContents.length === 0) return [];

        const kuisIds = groupContents.filter(gc => gc.content_type === 'kuis').map(gc => gc.content_id);
        const ceritaIds = groupContents.filter(gc => gc.content_type === 'cerita').map(gc => gc.content_id);
        const puzzleIds = groupContents.filter(gc => gc.content_type === 'puzzle').map(gc => gc.content_id);

        const [kuisDetails, ceritaDetails, puzzleDetails] = await Promise.all([
            kuisIds.length > 0 ? prisma.kuis.findMany({
                where: { kuis_id: { in: kuisIds }, is_published: true },
                select: { kuis_id: true, judul: true, thumbnail: true, deskripsi: true, KategoriKuis: { select: { nama_kategori: true }}, xp_reward: true, created_at: true }
            }) : Promise.resolve([]),
            
            ceritaIds.length > 0 ? prisma.ceritaInteraktif.findMany({
                where: { cerita_id: { in: ceritaIds }, is_published: true },
                select: { cerita_id: true, judul: true, thumbnail: true, deskripsi: true, KategoriCerita: { select: { NamaKategori: true }}, xp_reward: true, created_at: true }
            }) : Promise.resolve([]),
            
            puzzleIds.length > 0 ? prisma.puzzle.findMany({
                where: { puzzle_id: { in: puzzleIds }, is_published: true },
                select: { puzzle_id: true, judul: true, gambar: true, kategori: true, xp_reward: true, created_at: true }
            }) : Promise.resolve([]),
        ]);

        const assignedContentList: AssignedGameCard[] = [];

        kuisDetails.forEach(kuis => {
            assignedContentList.push({
                id: `kuis-${kuis.kuis_id}`,
                type: 'kuis',
                title: kuis.judul,
                description: kuis.deskripsi || "Kuis ini tidak memiliki deskripsi.",
                image: kuis.thumbnail || "/placeholder.svg",
                category: kuis.KategoriKuis?.nama_kategori || "Tidak ada kategori",
                xp_reward: kuis.xp_reward,
                createdAt: kuis.created_at,
                groupId: groupId,
                groupName: groupName,
            });
        });
        
        ceritaDetails.forEach(cerita => {
            assignedContentList.push({
                id: `story-${cerita.cerita_id}`,
                type: 'cerita',
                title: cerita.judul,
                description: cerita.deskripsi || "Cerita interaktif yang menarik",
                image: cerita.thumbnail || "/placeholder.svg",
                category: cerita.KategoriCerita?.NamaKategori || "Tidak ada kategori",
                xp_reward: cerita.xp_reward,
                createdAt: cerita.created_at || new Date(),
                groupId: groupId,
                groupName: groupName,
            });
        });

        puzzleDetails.forEach(puzzle => {
            assignedContentList.push({
                id: `puzzle-${puzzle.puzzle_id}`,
                type: 'puzzle',
                title: puzzle.judul,
                description: `Susun gambar ${puzzle.judul}.`,
                image: puzzle.gambar || "/placeholder.svg",
                category: puzzle.kategori?.replace("_", " ") || "Umum",
                xp_reward: puzzle.xp_reward,
                createdAt: puzzle.created_at,
                groupId: groupId,
                groupName: groupName,
            });
        });

        return assignedContentList;

    } catch (e) {
        console.error("getAssignedContentForGroup Error:", e);
        return { error: "Terjadi kesalahan saat mengambil konten grup." };
    }
}