import prisma from "@/lib/prisma"
import { SchemaStory } from "@/lib/schema"
import fs from 'fs'
import path from 'path'
import { auth } from "@/auth"

export async function createStory(_: unknown, formData: FormData) {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  const parse = SchemaStory.safeParse({
    judul: formData.get("judul"),
    thumbnail: formData.get("thumbnail"),
    deskripsi: formData.get("deskripsi"),
    xp_reward: Number(formData.get("xp_reward")), // convert string → number
  });

  if (!parse.success) {
    return { error: parse.error.message };
  }

  const file = parse.data.thumbnail as File;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "story");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, file.name);
  fs.writeFileSync(filePath, buffer);

  const relativePath = path.join("/story", file.name);

  try {
    const newStory = await prisma.ceritaInteraktif.create({
      data: {
        judul: parse.data.judul,
        thumbnail: relativePath, 
        deskripsi: parse.data.deskripsi,
        xp_reward: parse.data.xp_reward,
        created_by: parseInt(session.user.id!),
      },
    });

    return { success: true, data: newStory };
  } catch (error: any) {
    console.error("createStory Error:", error);
    return { error: error.message || "Something went wrong" };
  }
}

export async function UpdateStory(id: string, formData: FormData) {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  const parse = SchemaStory.safeParse({
    judul: formData.get("judul"),
    thumbnail: formData.get("thumbnail"),
    deskripsi: formData.get("deskripsi"),
    xp_reward: Number(formData.get("xp_reward")),
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

      // upload file baru
      const file = parse.data.thumbnail as File;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "story");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, file.name);
      fs.writeFileSync(filePath, buffer);

      relativePath = path.join("/story", file.name);
    }

    // update database
    await prisma.ceritaInteraktif.update({
      where: { cerita_id: parseInt(id) },
      data: {
        judul: parse.data.judul,
        deskripsi: parse.data.deskripsi,
        xp_reward: parse.data.xp_reward,
        ...(relativePath && { thumbnail: relativePath }),
      },
    });

    return { success: true };
  } catch (error) {
    console.error("UpdateStory Error:", error);
    return { error: "Gagal update story" };
  }
}

export async function DeleteStory(id: string) {
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

    return { success: true };
  } catch (error) {
    console.error("DeleteStory Error:", error);
    return { error:error };
  }
}

