'use server'

import prisma from "@/lib/prisma"
import { SchemaStory } from "@/lib/schema"
import fs from 'fs'
import path from 'path'
import { auth } from "@/auth"
import { ActionResult } from "@/lib/executeAction"
import { v4 as uuidv4 } from "uuid"; // untuk generate UUID

export async function createStory(_: unknown, formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  const parse = SchemaStory.safeParse({
    judul: formData.get("judul"),
    thumbnail: formData.get("thumbnail"),
    category: formData.get("kategori"),
    deskripsi: formData.get("deskripsi"),
    xp_reward: Number(formData.get("xp_reward") ?? 0), // safe conversion
    is_published: formData.get("is_published") === "1"
  });

  if (!parse.success) {
    return { error: parse.error.message };
  }

  const file = parse.data.thumbnail;
  if (!(file instanceof File)) {
    return { error: "Thumbnail invalid" };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "story");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileExt = path.extname(file.name);
  const fileName = `${uuidv4()}${fileExt}`;
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, buffer);

  const relativePath = path.join("/story", fileName);

  try {
    await prisma.ceritaInteraktif.create({
      data: {
        judul: parse.data.judul,
        thumbnail: relativePath, 
        deskripsi: parse.data.deskripsi,
        xp_reward: parse.data.xp_reward,
        created_by: parseInt(session.user.id!),
        kategori: parseInt(parse.data.category),
        is_published: parse.data.is_published
      },
    });

    return { success: "berhasil", redirectTo: "/admin/dashboard/manage-stories" };
  } catch (error: unknown) {
    console.error("createStory Error:", error);
    return { error: "Gagal Membuat Cerita" };
  }
}

export async function UpdateStory(id: string, formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  const parse = SchemaStory.safeParse({
    judul: formData.get("judul"),
    thumbnail: formData.get("thumbnail"),
    deskripsi: formData.get("deskripsi"),
    category: formData.get("category"),
    xp_reward: Number(formData.get("xp_reward") ?? 0), // safe conversion
    is_published: formData.get("is_published") === "1"
  });

  if (!parse.success) {
    return { error: parse.error.message };
  }

  try {
    let relativePath: string | undefined;

    // Kalau ada thumbnail baru
    if (parse.data.thumbnail instanceof File) {
      // ambil data lama
      const old = await prisma.ceritaInteraktif.findUnique({
        where: { cerita_id: parseInt(id) },
        select: { thumbnail: true },
      });

      // hapus file lama kalau ada
      if (old?.thumbnail) {
        const oldPath = path.join(process.cwd(), "public", old.thumbnail);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // upload file baru dengan nama unik
      const file = parse.data.thumbnail as File;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "story");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileExt = path.extname(file.name);
      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      relativePath = path.join("/story", fileName);
    }

    // update database
    await prisma.ceritaInteraktif.update({
      where: { cerita_id: parseInt(id) },
      data: {
        judul: parse.data.judul,
        deskripsi: parse.data.deskripsi,
        xp_reward: parse.data.xp_reward,
        kategori: parseInt(parse.data.category ?? "0"), // safe conversion
        is_published: parse.data.is_published,
        ...(relativePath && { thumbnail: relativePath }),
      },
    });

    return { success: "berhasil", redirectTo: "/admin/dashboard/manage-stories" };
  } catch (error) {
    console.error("UpdateStory Error:", error);
    return { error: "Gagal update story" };
  }
}

export async function DeleteStory(id: string):Promise<ActionResult> {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  try {
    // ambil data lama
    const old = await prisma.ceritaInteraktif.findUnique({
      where: { cerita_id: parseInt(id) },
      select: { thumbnail: true },
    });

    if (old?.thumbnail) {
      const oldPath = path.join(process.cwd(), "public", old.thumbnail);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await prisma.ceritaInteraktif.delete({
      where: { cerita_id: parseInt(id) },
    });

    return { success: "Berhasil menghapus Story" };
  } catch (error) {
    console.error("DeleteStory Error:", error);
    return { error:"Terjadi Kesalahan" };
  }
}

export async function DeleteMultipleStories(ids: string[]): Promise<ActionResult> {
  const session = await auth()
  if (!session) return { error: "Not Authorized" }

  try {
    // Get all stories to delete their thumbnails
    const stories = await prisma.ceritaInteraktif.findMany({
      where: {
        cerita_id: {
          in: ids.map((id) => Number.parseInt(id)),
        },
      },
      select: { thumbnail: true },
    })

    // Delete thumbnail files
    for (const story of stories) {
      if (story.thumbnail) {
        const oldPath = path.join(process.cwd(), "public", story.thumbnail)
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath)
        }
      }
    }

    // Delete from database
    await prisma.ceritaInteraktif.deleteMany({
      where: {
        cerita_id: {
          in: ids.map((id) => Number.parseInt(id)),
        },
      },
    })

    return { success: `Berhasil menghapus ${ids.length} story` }
  } catch (error) {
    console.error("DeleteMultipleStories Error:", error)
    return { error: "Terjadi kesalahan saat menghapus stories" }
  }
}

