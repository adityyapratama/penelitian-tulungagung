"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { SchemaPuzzle } from "@/lib/schema";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

export type PuzzleFormState = {
  errors?: {
    judul?: string[];
    gambar?: string[];
    kategori?: string[];
    xp_reward?: string[];
  };
  message?: string;
  error?: string;
  success?: boolean;
};

export async function createPuzzle(
  previousState: PuzzleFormState,
  formData: FormData
): Promise<PuzzleFormState> {
  const session = await auth();

  if (!session) {
    return { error: "Not Authorized" };
  }

  const parse = SchemaPuzzle.safeParse({
    judul: formData.get("judul"),
    gambar: formData.get("gambar"),
    thumbnail: formData.get("thumbnail"),
    kategori: formData.get("kategori"),
    xp_reward: formData.get("xp_reward"),
    is_published: formData.get("is_published"),
  });

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: "Validasi gagal, silakan cek input Anda.",
    };
  }

  const file = parse.data.gambar;
  const thumbnailFile = parse.data.thumbnail;
  if (!(file instanceof File)) return { error: "Gambar puzzle invalid" };
  if (!(thumbnailFile instanceof File)) return { error: "Thumbnail invalid" };

  // Validasi tambahan (opsional)
  const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
  const thumbExt = path.extname(thumbnailFile.name).toLowerCase();
  const fileExt = path.extname(file.name).toLowerCase();
  if (!allowedExt.includes(fileExt) || !allowedExt.includes(thumbExt)) {
    return { error: "Format file tidak diizinkan" };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const thumbBytes = await thumbnailFile.arrayBuffer();
  const thumbBuffer = Buffer.from(thumbBytes);

  const uploadDir = path.join(process.cwd(), "public", "puzzle");
  const thumbUploadDir = path.join(process.cwd(), "public", "puzzle", "thumbnails");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  if (!fs.existsSync(thumbUploadDir)) {
    fs.mkdirSync(thumbUploadDir, { recursive: true });
  }

  const thumbFileName = `${uuidv4()}${thumbExt}`;
  const thumbFilePath = path.join(thumbUploadDir, thumbFileName);
  fs.writeFileSync(thumbFilePath, thumbBuffer);

  const relativeThumbnailPath = `/puzzle/thumbnails/` + thumbFileName;

  const fileName = `${uuidv4()}${fileExt}`;
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, buffer);

  const relativePath = `/puzzle/` + fileName;

  try {
    await prisma.puzzle.create({
      data: {
        judul: parse.data.judul,
        thumbnail: relativeThumbnailPath,
        gambar: relativePath,
        kategori: parse.data.kategori,
        xp_reward: parse.data.xp_reward,
        created_by: parseInt(session.user.id!),
        is_published: parse.data.is_published,
      },
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { error: "Terjadi kesalahan saat menyimpan ke database." };
  }
}

export async function UpdatePuzzle(
  id: string,
  previousState: PuzzleFormState,
  formData: FormData
): Promise<PuzzleFormState> {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  const parse = SchemaPuzzle.safeParse({
    judul: formData.get("judul"),
    gambar: formData.get("gambar"),
    thumbnail: formData.get("thumbnail"),
    kategori: formData.get("kategori"),
    xp_reward: formData.get("xp_reward"),
    is_published: formData.get("is_published"),
  });

  if (!parse.success) {
    return { error: parse.error.message };
  }

  try {
    let relativeThumbnailPath: string | undefined;
    let relativePath: string | undefined;

    if (parse.data.thumbnail instanceof File && parse.data.thumbnail.size > 0) {
      const oldThumb = await prisma.puzzle.findUnique({
        where: { puzzle_id: parseInt(id) },
        select: { thumbnail: true },
      });

      if (oldThumb?.thumbnail) {
        const oldThumbPath = path.join(process.cwd(), "public", oldThumb.thumbnail);
        if (fs.existsSync(oldThumbPath)) {
          fs.unlinkSync(oldThumbPath);
        }
      }

      const thumbFile = parse.data.thumbnail as File;
      const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
      const thumbExt = path.extname(thumbFile.name).toLowerCase();
      if (!allowedExt.includes(thumbExt)) {
              return { error: "Format file tidak diizinkan" };
      }
      const thumbBytes = await thumbFile.arrayBuffer();
      const thumbBuffer = Buffer.from(thumbBytes);

      const thumbnailDir = path.join(process.cwd(), "public", "puzzle", "thumbnails");
      if (!fs.existsSync(thumbnailDir)) {
        fs.mkdirSync(thumbnailDir, { recursive: true });
      }

      const thumbFileName = `${uuidv4()}${thumbExt}`;
      const thumbFilePath = path.join(thumbnailDir, thumbFileName);
      fs.writeFileSync(thumbFilePath, thumbBuffer);

      relativeThumbnailPath = `/puzzle/thumbnails/` + thumbFileName;
    }
    if (parse.data.gambar instanceof File && parse.data.gambar.size > 0) {
      const old = await prisma.puzzle.findUnique({
        where: { puzzle_id: parseInt(id) },
        select: { gambar: true },
      });

      if (old?.gambar) {
        const oldPath = path.join(process.cwd(), "public", old.gambar);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const file = parse.data.gambar as File;
      const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
      const fileExt = path.extname(file.name).toLowerCase();
      if (!allowedExt.includes(fileExt)) {
              return { error: "Format file tidak diizinkan" };
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "puzzle");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileName = `${uuidv4()}${fileExt}`;
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      relativePath = `/puzzle/` + file.name;
    }

    await prisma.puzzle.update({
      where: { puzzle_id: parseInt(id) },
      data: {
        judul: parse.data.judul,
        kategori: parse.data.kategori,
        xp_reward: parse.data.xp_reward,
        is_published: parse.data.is_published ,
        ...(relativePath && { gambar: relativePath }),
        ...(relativeThumbnailPath && { thumbnail: relativeThumbnailPath }),
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Gagal update puzzle" };
  }
}

export async function DeletePuzzle(id: string) {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  try {
    const old = await prisma.puzzle.findUnique({
      where: { puzzle_id: parseInt(id) },
      select: { gambar: true },
    });

    if (old?.gambar) {
      const oldPath = path.join(process.cwd(), "public", old.gambar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    await prisma.puzzle.delete({
      where: { puzzle_id: parseInt(id) },
    });

    revalidatePath("/guru/dashboard/manage-puzzles");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Gagal menghapus puzzle" };
  }
}
