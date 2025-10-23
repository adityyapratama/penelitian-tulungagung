"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { SchemaMember } from "@/lib/schema";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { ProgressData } from "@/types/index";
import { ContentType } from "@prisma/client";

export type LeaderboardEntry = {
  rank: number;
  member_id: number;
  username: string | null;
  foto_profil: string | null;
  skor: number;
  duration: number;
};


export async function GetMemberData() {
  const session = await auth();

  if (!session) {
    return { error: "Not Authorized" };
  }

  try {
    const member = await prisma.member.findFirst({
      where: {
        user_id: parseInt(session.user.id!),
      },
      include: {
        Sekolah: {
          select: {
            nama_sekolah: true,
          },
        },
        User:{
          select: {
            email: true,
            username: true,
          }
        }
      },
    });

    return member;
  } catch {
    return { error : "terjadi kesalahan" };
  }
}

export async function CreateMember(_: unknown, formData: FormData) {
  const session = await auth();
  if (!session) {
    return { error: "Not Authorized" };
  }

  const parse = SchemaMember.safeParse({
    sekolah_id: formData.get("sekolah"),
    nis: formData.get("nis"),
    foto_profile: formData.get("foto_profile"),
    bio: formData.get("bio"),
    tanggal_lahir: formData.get("tanggal_lahir"),
    jenis_kelamin: formData.get("jenis_kelamin"),
    minat: formData.get("minat"),
  });

  if (!parse.success) {
    return { error: parse.error.errors.map((e) => e.message).join(", ") };
  }

  const file = parse.data.foto_profile as File;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "users");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const ext = path.extname(file.name) || ".png";
  const fileName = `${uuidv4()}${ext}`;
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, buffer);

  const relativePath = `/users/${fileName}`;

  try {
    const member = await prisma.member.create({
      data: {
        user_id: parseInt(session.user.id!),
        sekolah_id: parseInt(parse.data.sekolah_id),
        nis: parse.data.nis,
        foto_profil: relativePath,
        bio: parse.data.bio,
        tanggal_lahir: parse.data.tanggal_lahir,
        jenis_kelamin: parse.data.jenis_kelamin,
        minat: parse.data.minat,
      },
    });

    return { success: true, member };
  } catch (error) {
    console.error("CreateMember error:", error);
    return { error: "Failed to create member" };
  }
}

export async function UpdateMember(_: unknown, formData: FormData, id: string) {
  const session = await auth();
  if (!session) {
    return { error: "Not Authorized" };
  }

  if (!id) return { error: "ID Member tidak ditemukan" };

  const parse = SchemaMember.safeParse({
    sekolah_id: formData.get("sekolah"),
    nis: formData.get("nis"),
    foto_profile: formData.get("foto_profile"),
    bio: formData.get("bio"),
    tanggal_lahir: formData.get("tanggal_lahir"),
    jenis_kelamin: formData.get("jenis_kelamin"),
    minat: formData.get("minat"),
  });

  if (!parse.success) {
    return { error: parse.error.errors.map((e) => e.message).join(", ") };
  }

  let relativePath: string | undefined = undefined;

  if (parse.data.foto_profile instanceof File) {
    const file = parse.data.foto_profile;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "users");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const ext = path.extname(file.name) || ".png";
    const fileName = `${uuidv4()}${ext}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    relativePath = `/users/${fileName}`;
  }

  try {
    const member = await prisma.member.update({
      where: { member_id: parseInt(id) },
      data: {
        sekolah_id: parseInt(parse.data.sekolah_id),
        nis: parse.data.nis,
        ...(relativePath && { foto_profil: relativePath }),
        bio: parse.data.bio,
        tanggal_lahir: parse.data.tanggal_lahir,
        jenis_kelamin: parse.data.jenis_kelamin,
        minat: parse.data.minat,
      },
    });

    return { success: true, member };
  } catch (error) {
    console.error("UpdateMember error:", error);
    return { error: "Failed to update member" };
  }
}

export async function GetExpMember(id: string) {
  try {
    const progress = await prisma.progresMember.aggregate({
      where: {
        member_id: parseInt(id),
      },
      _sum: {
        skor: true,
      },
    });

    return progress._sum.skor;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

export async function GetDetailsProgressMember(id: string) {
  try {
    const memberId = Number(id);

    if (isNaN(memberId)) {
      return { error: "invalid member id" };
    }

    const progress = await prisma.$queryRaw`
        SELECT     pm.completed_at,pm.skor,pm.duration,COALESCE(k.judul, c.judul, p.judul) AS content_name   
        FROM ProgresMember pm   
        LEFT JOIN Kuis k    ON pm.content_type = 'kuis'   AND pm.content_id = k.kuis_id   
        LEFT JOIN cerita_interaktif c  ON pm.content_type = 'cerita' AND pm.content_id = c.cerita_id   
        LEFT JOIN Puzzle p  ON pm.content_type = 'puzzle' AND pm.content_id = p.puzzle_id
        WHERE pm.member_id = ${memberId};
    `;

    return { data: progress };
  } catch {
    return { error: "failed to find progress member" };
  }
}


export async function CreateProgress(_: unknown, data: ProgressData) {
  const session = await auth();
  if (!session) {
    return { error: "Not Authorized" };
  }

  let id;
  try {
    const user = await prisma.member.findFirst({
      where: {
        user_id: parseInt(session.user.id!),
      },
    });
    id = user?.member_id;
    if (!id) return { error: "User is not a member" };
  } catch {
    return { error: "User is not a member" };
  }

  try {
    const completedAt = new Date();
    const duration = data.startedAt instanceof Date
      ? Math.max(0, Math.floor((completedAt.getTime() - data.startedAt.getTime()) / 1000))
      : 0;
    const existingProgress = await prisma.progresMember.findFirst({
      where: {
        member_id: id,
        content_id: data.contentId,
        content_type: data.contentType,
      }
    });

    if (!existingProgress) {
      await prisma.progresMember.create({
        data: {
          member_id: id,
          content_id: data.contentId,
          content_type: data.contentType,
          group_id: data.group_id || null,
          skor: data.skor,
          completed_at: completedAt,
          duration: duration,
        },
      });
    } else {
      const currentBestScore = existingProgress.skor ?? -1;

      if (data.skor > currentBestScore) {
        await prisma.progresMember.update({
          where: { progres_id: existingProgress.progres_id },
          data: {
            skor: data.skor,
            completed_at: completedAt,
            duration: duration,
            group_id: data.group_id || null, 
          },
        });
      } else {
        if (data.group_id && existingProgress.group_id === null) {
          await prisma.progresMember.update({
            where: { progres_id: existingProgress.progres_id },
            data: {
              group_id: data.group_id,
            },
          });
        }
      }
    } 

    const score = await GetExpMember(String(id));
    if (score !== null) {
      const level = Math.floor(Number(score) / 400);
      try {
        await prisma.member.update({
          where: {
            member_id: id,
          },
          data: {
            level: level,
          },
        });
      } catch {
        return { error: "terjadi kesalahan update level" };
      }
    }

    return { success: "Selamat", score: `${data.skor}` };
  } catch (error) {
    console.error("CreateProgress error:", error);
    return { error: "Gagal menyimpan progres." };
  }
}

export async function GetLeaderboard() {
  try {
    const data = prisma.$queryRaw`SELECT 
              u.username,
              SUM(p.skor) AS skor,
              m.last_active
              FROM Member m
              JOIN User u ON m.user_id = u.user_id
              JOIN ProgresMember p ON p.member_id = m.member_id
              GROUP BY u.username, m.last_active
              ORDER BY skor DESC;
            `;

    return data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return [];
  }
}

export async function GetLeaderboardByGame(
  content_type: ContentType,
  content_id: number,
  take = 10
): Promise<LeaderboardEntry[]> {
  try {
    const grouped = await prisma.progresMember.groupBy({
      by: ["member_id"],
      where: {
        content_type,
        content_id,
      },
      _max: {
        skor: true,
      },
      orderBy: {
        _max: {
          skor: "desc",
        },
      },
      take,
    });

    if (grouped.length === 0) return [];

    const bestAttempts = await Promise.all(
      grouped.map(async (g) => {

        if (g.member_id == null || g._max.skor == null) return null;

        const attempt = await prisma.progresMember.findFirst({
          where: {
            member_id: g.member_id,
            content_type,
            content_id,
            skor: g._max.skor,
          },
          orderBy: {

            duration: "asc",
          },

          select: {
            progres_id: true,
            member_id: true,
            skor: true,
            duration: true,
          },
        });

        return (
          attempt ?? {
            progres_id: -1,
            member_id: g.member_id,
            skor: g._max.skor ?? 0,
            duration: 0,
          }
        );
      })
    );

    const attemptsFiltered = bestAttempts.filter(
      (a): a is { progres_id: number; member_id: number; skor: number; duration: number } =>
        a !== null && a.member_id !== null
    );

    const finalMemberIds = attemptsFiltered.map((a) => a.member_id);

    const memberDetails = await prisma.member.findMany({
      where: {
        member_id: { in: finalMemberIds },
      },
      select: {
        member_id: true,
        foto_profil: true,
        User: {
          select: {
            username: true,
          },
        },
      },
    });

    const memberMap = new Map(
      memberDetails.map((m) => [m.member_id, m])
    );

    const combined = attemptsFiltered.map((a) => {
      const detail = memberMap.get(a.member_id) ?? null;
      return {
        member_id: a.member_id,
        skor: a.skor ?? 0,
        duration: a.duration ?? 0,
        username: detail?.User?.username ?? null,
        avatar: detail?.foto_profil ?? null,
      };
    });

    combined.sort((x, y) => {
      if (y.skor !== x.skor) return y.skor - x.skor;
      return x.duration - y.duration;
    });

    const fullLeaderboard: LeaderboardEntry[] = combined.map((c, idx) => ({
      rank: idx + 1,
      member_id: c.member_id,
      username: c.username,
      foto_profil: c.avatar,
      skor: c.skor,
      duration: c.duration,
    }));

    return fullLeaderboard;
  } catch (error) {
    console.error("Error GetLeaderboardByGame:", error);
    return [];
  }
}




export async function GetQuizzes() {
  try {
      const quizzes = await prisma.$queryRaw<
    Array<{
      kuis_id: number;
      judul: string;
      xp_reward: number;
      level: string;
    }>
  >`
    SELECT 
      kuis_id,
      judul,
      thumbnail,
      CASE
        WHEN xp_reward < 100 THEN 'easy'
        WHEN xp_reward >= 100 AND xp_reward < 200 THEN 'medium'
        ELSE 'hard'
      END AS level
    FROM "Quiz"
    WHERE is_published = true
  `;

  return quizzes;
  } catch {
    return {error : "terjadi kesalahan"}
  }
}

export async function GetCerita(){
  try {
      const cerita = await prisma.$queryRaw<
      Array<{
        cerita_id: number;
        judul: string;
        xp_reward: number;
        level: string;
      }>
    >`
      SELECT
        cerita_id,
        judul,
        thumbnail,
        CASE
          WHEN xp_reward < 100 THEN 'easy'
          WHEN xp_reward >= 100 AND xp_reward < 200 THEN 'medium'
          ELSE 'hard'
        END AS level
      FROM "cerita_interaktif"
      WHERE is_published = true
    `;

    return cerita;
  } catch {
    return {error : "terjadi kesalahan"}
  }
}


export async function GetPuzzle(){
  try {
    const puzzles = await prisma.$queryRaw<
    Array<{
      puzzle_id: number;
      judul: string;
      xp_reward: number;
      level: string;
    }>
  >`
    SELECT
      puzzle_id,
      judul,
      thumbnail,
      CASE
        WHEN xp_reward < 100 THEN 'easy'
        WHEN xp_reward >= 100 AND xp_reward < 200 THEN 'medium'
        ELSE 'hard'
      END AS level
    FROM "Puzzle"
    WHERE is_published = true
  `;

  return puzzles;
  } catch {
    return {error : "terjadi kesalahan"}
  }
}





