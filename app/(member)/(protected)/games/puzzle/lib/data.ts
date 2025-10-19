"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma";
import { ContentType } from "@/lib/generated/prisma";


export async function getPuzzleStats(puzzleId: string) {
  const id = parseInt(puzzleId);
  if (isNaN(id)) {
    return { playerCount: 0, averageTime: 0, recordTime: 0, personalBest: null };
  }

  try {
    const session = await auth();

    const stats = await prisma.progresMember.aggregate({
      where: {
        content_type: ContentType.puzzle,
        content_id: id,
      },
      _count: {
        member_id: true,
      },
      _avg: {
        duration: true, 
      },
      _min: {
        duration: true, 
      },
    });

    let personalBest = null;
    if (session?.user) {
      const member = await prisma.member.findUnique({
        where: { user_id: parseInt(session.user.id!) },
        select: { member_id: true }
      });

      if (member) {
        const personalRecord = await prisma.progresMember.findFirst({
          where: {
            member_id: member.member_id,
            content_type: ContentType.puzzle,
            content_id: id,
          },
          orderBy: {
            duration: 'asc',
          },
        });
        personalBest = personalRecord?.duration || null;
      }
    }

    return {
      playerCount: stats._count.member_id || 0,
      averageTime: Math.round(stats._avg.duration || 0),
      recordTime: stats._min.duration || 0,
      personalBest: personalBest,
    };

  } catch (error) {
    console.error("Gagal mengambil statistik puzzle:", error);
    return { playerCount: 0, averageTime: 0, recordTime: 0, personalBest: null };
  }
}