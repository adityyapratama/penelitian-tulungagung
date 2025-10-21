'use server'

import prisma from "@/lib/prisma"
import { SchemaStory, SchemaStoryUpdate } from "@/lib/schema"
import fs from 'fs'
import path from 'path'
import { auth } from "@/auth"
import { ActionResult } from "@/lib/executeAction"
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation"

const UPLOAD_DIR_STORY = path.join(process.cwd(), "public", "story");
const GURU_REDIRECT_PATH = "/guru/dashboard/manage-stories";

export async function createStory(_: unknown, formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session || !session.user?.id) return { error: "Not Authorized" };

  const isPublishedValue = formData.get("is_published") === "on" ? "true" : "false";

  const parse = SchemaStory.safeParse({
    judul: formData.get("judul"),
    thumbnail: formData.get("thumbnail"),
    category: formData.get("kategori"),
    deskripsi: formData.get("deskripsi"),
    xp_reward: Number(formData.get("xp_reward") ?? 0),
    is_published: isPublishedValue
  });

  if (!parse.success) {
    return { error: parse.error.message };
  }

  const file = parse.data.thumbnail;
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Thumbnail invalid atau kosong" };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  if (!fs.existsSync(UPLOAD_DIR_STORY)) {
    fs.mkdirSync(UPLOAD_DIR_STORY, { recursive: true });
  }

  const fileExt = path.extname(file.name);
  const fileName = `${uuidv4()}${fileExt}`;
  const filePath = path.join(UPLOAD_DIR_STORY, fileName);
  fs.writeFileSync(filePath, buffer);

  const relativePath = `/story/${fileName}`;

  try {
    await prisma.ceritaInteraktif.create({
      data: {
        judul: parse.data.judul,
        thumbnail: relativePath, 
        deskripsi: parse.data.deskripsi,
        xp_reward: parse.data.xp_reward,
        created_by: parseInt(session.user.id),
        kategori: parseInt(parse.data.category),
        is_published: parse.data.is_published,
        created_at: new Date()
      },
    });

    return { success: "Cerita berhasil dibuat", redirectTo: GURU_REDIRECT_PATH }; 
  } catch (error: unknown) {
    console.error("createStory Error:", error);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return { error: "Gagal Membuat Cerita" };
  }
}

export async function UpdateStory(id: string, formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session || !session.user?.id) return { error: "Not Authorized" };

  const storyId = parseInt(id);
  const userId = parseInt(session.user.id);
  
  const existingStory = await prisma.ceritaInteraktif.findUnique({ where: { cerita_id: storyId } });
  
  if (!existingStory || (existingStory.created_by !== userId && session.user.role !== "super_admin")) {
    return { error: "Unauthorized access or Story not found" };
  }

  const isPublishedValue = formData.get("is_published") === "on" ? "true" : "false";

  const parse = SchemaStoryUpdate.safeParse({
    judul: formData.get("judul"),
    thumbnail: formData.get("thumbnail"),
    deskripsi: formData.get("deskripsi"),
    category: formData.get("kategori"),
    xp_reward: Number(formData.get("xp_reward") ?? 0),
    is_published: isPublishedValue
  });

  if (!parse.success) {
    return { error: parse.error.message };
  }

  try {
    let relativePath: string | undefined;
    const file = parse.data.thumbnail;

    if (file instanceof File && file.size > 0) {
      if (existingStory.thumbnail) {
        const oldPath = path.join(process.cwd(), "public", existingStory.thumbnail);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      if (!fs.existsSync(UPLOAD_DIR_STORY)) {
        fs.mkdirSync(UPLOAD_DIR_STORY, { recursive: true });
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileExt = path.extname(file.name);
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = path.join(UPLOAD_DIR_STORY, fileName);
      fs.writeFileSync(filePath, buffer);

      relativePath = `/story/${fileName}`;
    }

    await prisma.ceritaInteraktif.update({
      where: { cerita_id: storyId },
      data: {
        judul: parse.data.judul,
        deskripsi: parse.data.deskripsi,
        xp_reward: parse.data.xp_reward,
        kategori: parseInt(parse.data.category ?? "0"),
        is_published: parse.data.is_published,
        ...(relativePath && { thumbnail: relativePath }),
      },
    });

    return { success: "berhasil", redirectTo: GURU_REDIRECT_PATH };
  } catch (error) {
    console.error("UpdateStory Error:", error);
    return { error: "Gagal update story" };
  }
}

export async function DeleteStory(id: string):Promise<ActionResult> {
  const session = await auth();
  if (!session || !session.user?.id) return { error: "Not Authorized" };
  
  const storyId = parseInt(id);
  const userId = parseInt(session.user.id);

  try {
    const story = await prisma.ceritaInteraktif.findUnique({
        where: { cerita_id: storyId },
        select: { created_by: true, thumbnail: true }
    });

    if (!story || (story.created_by !== userId && session.user.role !== "super_admin")) {
        return { error: "Unauthorized access or Story not found" };
    }

    if (story.thumbnail) {
      const oldPath = path.join(process.cwd(), "public", story.thumbnail);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await prisma.ceritaInteraktif.delete({
      where: { cerita_id: storyId },
    });

    return { success: "Berhasil menghapus Story" };
  } catch (error) {
    console.error("DeleteStory Error:", error);
    return { error:"Terjadi Kesalahan" };
  }
}

export async function DeleteMultipleStories(ids: string[]): Promise<ActionResult> {
  const session = await auth()
  if (!session || !session.user?.id) return { error: "Not Authorized" }
  
  const userId = parseInt(session.user.id);
  const idsNumber = ids.map((id) => Number.parseInt(id));

  try {
    const storiesToDelete = await prisma.ceritaInteraktif.findMany({
      where: {
        cerita_id: { in: idsNumber },
        ...(session.user.role === "guru" && { created_by: userId }), 
      },
      select: { thumbnail: true, cerita_id: true },
    })

    if (storiesToDelete.length === 0 && ids.length > 0) {
        return { error: "Tidak ada cerita yang diizinkan untuk dihapus." };
    }

    for (const story of storiesToDelete) {
      if (story.thumbnail) {
        const oldPath = path.join(process.cwd(), "public", story.thumbnail)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }
    }

    await prisma.ceritaInteraktif.deleteMany({
      where: {
        cerita_id: { in: storiesToDelete.map(s => s.cerita_id) },
      },
    })

    return { success: `Berhasil menghapus ${storiesToDelete.length} cerita` }
  } catch (error) {
    console.error("DeleteMultipleStories Error:", error)
    return { error: "Terjadi kesalahan saat menghapus stories" }
  }
}