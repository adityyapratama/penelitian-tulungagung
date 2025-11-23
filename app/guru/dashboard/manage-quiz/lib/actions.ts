"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  SchemaQuiz,
  SchemaQuizUpdate,
  SchemaPilihan,
  SchemaPertanyaan,
  SchemaCategoryKuis,
} from "@/lib/schema";
import z from "zod";
import { ActionResult as BaseActionResult } from "@/lib/executeAction";
import { revalidatePath } from "next/cache";
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from "uuid";

export type CategoryActionResult = {
  success?: string;
  error?: string;
  errors?: {
    nama_kategori?: string[];
    deskripsi?: string[];
    thumbnail?: string[];
  };
  data?: any; 
};

export type QuizActionResult = {
  success?: string;
  error?: string;        
  errors?: {               
    judul?: string[];
    deskripsi?: string[];
    kategori_id?: string[];
    xp_reward?: string[];
    is_published?: string[];
    thumbnail?: string[];
  };
  data?: any;              
};

type ActionResult = BaseActionResult;

async function getUserId(): Promise<number | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return parseInt(session.user.id);
}

export async function CreateQuiz(
  _: unknown,
  formData: FormData
): Promise<QuizActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not Authorized" };

  const parse = SchemaQuiz.safeParse({
    judul: formData.get("judul"),
    deskripsi: formData.get("deskripsi"),
    kategori_id: Number(formData.get("kategori_id")),
    xp_reward: Number(formData.get("xp_reward")),
    is_published: formData.get("is_published"),
    thumbnail: formData.get("thumbnail"),
  });

  if (!parse.success) {
    return { errors: parse.error.flatten().fieldErrors };
  }

  
  const file = parse.data.thumbnail;
 if (!(file instanceof File) || file.size === 0) {
   return { 
     errors: { 
       thumbnail: ["Thumbnail invalid atau kosong"] 
     } 
   };
}

const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
const fileExt = path.extname(file.name).toLowerCase();

if (!allowedExt.includes(fileExt)) {
   return { 
     errors: { 
       thumbnail: ["Format file tidak diizinkan"] 
     } 
   };
}

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "quiz");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${uuidv4()}${fileExt}`;
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, buffer);

  const relativePath = `/quiz/${fileName}`;

  try {
    await prisma.kuis.create({
      data: {
        judul: parse.data.judul,
        deskripsi: parse.data.deskripsi,
        kategori_id: parse.data.kategori_id,
        xp_reward: parse.data.xp_reward,
        created_by: userId,
        is_published: parse.data.is_published,
        thumbnail: relativePath,
        created_at: new Date()
      },
    });

    revalidatePath("/guru/dashboard/manage-quiz");
    return { success: "Kuis berhasil dibuat" };
  } catch (error) {
    console.error("CreateQuiz error:", error);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return { error: "Gagal membuat kuis." };
  }
}

export async function UpdateQuiz(
  id: string,
  _: unknown,
  formData: FormData
): Promise<QuizActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not Authorized" };

  const existingQuiz = await prisma.kuis.findFirst({
    where: { kuis_id: parseInt(id), created_by: userId }
  });

  if (!existingQuiz) return { error: "Kuis tidak ditemukan atau Anda tidak berhak." };

  const isImageRemoved = formData.get("is_image_removed") === "true";

  const parse = SchemaQuizUpdate.safeParse({
    judul: formData.get("judul"),
    deskripsi: formData.get("deskripsi"),
    kategori_id: Number(formData.get("kategori_id")),
    xp_reward: Number(formData.get("xp_reward")),
    is_published: formData.get("is_published"),
    thumbnail: formData.get("thumbnail"),
  });

  if (!parse.success) {
    return { errors: parse.error.flatten().fieldErrors };
  }

  let relativePath: string | undefined;
  const file = parse.data.thumbnail;
  const hasNewFile = file instanceof File && file.size > 0;

  if (isImageRemoved && !hasNewFile) {
    return { 
      errors: { 
        thumbnail: ["Thumbnail wajib diisi."] 
      } 
    };
  }

  if (hasNewFile) {
    const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
    const fileExt = path.extname(file.name).toLowerCase();

    if (!allowedExt.includes(fileExt)) {
      return { 
        errors: { 
          thumbnail: ["Format file tidak diizinkan"] 
        } 
      };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "quiz");
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);
    relativePath = `/quiz/${fileName}`;

    if (existingQuiz.thumbnail) {
      const oldPath = path.join(process.cwd(), "public", existingQuiz.thumbnail);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
  }

  try {
    await prisma.kuis.update({
      where: { kuis_id: parseInt(id) },
      data: {
        judul: parse.data.judul,
        deskripsi: parse.data.deskripsi,
        kategori_id: parse.data.kategori_id,
        xp_reward: parse.data.xp_reward,
        is_published: parse.data.is_published,
        ...(relativePath && { thumbnail: relativePath }),
      },
    });

    revalidatePath("/guru/dashboard/manage-quiz");
    return { success: "Kuis berhasil diupdate" };
  } catch (error) {
    console.error("UpdateQuiz error:", error);
    return { error: "Gagal update kuis" };
  }
}

export async function DeleteQuiz(id: string): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not Authorized" };

  try {
    const quiz = await prisma.kuis.findFirst({
      where: { kuis_id: parseInt(id), created_by: userId },
      select: { thumbnail: true }
    });

    if (!quiz) {
      return { error: "Kuis tidak ditemukan atau Anda tidak berhak." };
    }

    if (quiz.thumbnail) {
        const oldPath = path.join(process.cwd(), "public", quiz.thumbnail);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await prisma.kuis.delete({
      where: { kuis_id: parseInt(id) },
    });

    revalidatePath("/guru/dashboard/manage-quiz");
    return { success: "Kuis berhasil dihapus" };
  } catch (error) {
    console.error(error);
    return { error: "Gagal menghapus kuis. Pastikan semua relasi data sudah bersih." };
  }
}

export async function DeleteMultipleQuizzes(
  ids: string[]
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Tidak terautentikasi" };

  const numericIds = ids.map((id) => parseInt(id)).filter((id) => !isNaN(id));
  if (numericIds.length === 0) return { error: "Tidak ada ID valid." };

  try {
    const quizzesToDelete = await prisma.kuis.findMany({
        where: {
            kuis_id: { in: numericIds },
            created_by: userId
        },
        select: { thumbnail: true, kuis_id: true }
    });

    for (const quiz of quizzesToDelete) {
        if (quiz.thumbnail) {
            const oldPath = path.join(process.cwd(), "public", quiz.thumbnail);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
    }

    const deleteResult = await prisma.kuis.deleteMany({
      where: {
        kuis_id: { in: quizzesToDelete.map(q => q.kuis_id) },
        created_by: userId
      },
    });

    revalidatePath("/guru/dashboard/manage-quiz");
    return { success: `${deleteResult.count} kuis berhasil dihapus.` };
  } catch (error: unknown) {
    console.error("Bulk Delete Error:", error);
    return { error: "Gagal menghapus kuis yang dipilih." };
  }
}

export async function CreatePertanyaan(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not Authorized" };

  const quiz = await prisma.kuis.findFirst({
    where: { kuis_id: parseInt(id), created_by: userId }
  });
  if (!quiz) return { error: "Kuis tidak ditemukan atau Anda tidak berhak." };

  const parse = SchemaPertanyaan.safeParse({
    teks_pertanyaan: formData.get("teks_pertanyaan"),
    tipe: formData.get("tipe"),
    poin: Number(formData.get("poin")),
    urutan: Number(formData.get("urutan")),
    pilihan: JSON.parse(formData.get("pilihan") as string),
    image: formData.get("image") === "null" ? undefined : formData.get("image"),
  });

  if (!parse.success) return { error: parse.error.errors[0].message };

  let relativePath: string | null = null;
  const image = parse.data.image;

  if (image instanceof File && image.size > 0) {
    const file = image;
    const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
    const fileExt = path.extname(file.name).toLowerCase();
    if (!allowedExt.includes(fileExt)) {
      return { error: "Format file tidak diizinkan" };
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uploadDir = path.join(process.cwd(), "public", "quiz");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);
    relativePath = `/quiz/${fileName}`;
  }

  try {
    await prisma.pertanyaanKuis.create({
      data: {
        kuis_id: parseInt(id),
        teks_pertanyaan: parse.data.teks_pertanyaan,
        tipe: parse.data.tipe,
        poin: parse.data.poin,
        urutan: parse.data.urutan,
        image: relativePath,
        PilihanKuis: {
          create: parse.data.pilihan.map(
            (p: z.infer<typeof SchemaPilihan>) => ({
              teks_jawaban: p.teks_jawaban,
              score: p.score,
            })
          ),
        },
      },
    });

    revalidatePath(`/guru/dashboard/manage-quiz/edit/${id}`);
    return { success: "Pertanyaan berhasil dibuat" };
  } catch (error) {
    console.error(error);
    if (relativePath) {
        const filePath = path.join(process.cwd(), "public", relativePath);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    return { error: "Gagal membuat pertanyaan" };
  }
}

export async function UpdatePertanyaan(
  quizId: string,
  pertanyaanId: string,
  formData: FormData
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not Authorized" };

  const quiz = await prisma.kuis.findFirst({
    where: { kuis_id: parseInt(quizId), created_by: userId }
  });
  if (!quiz) return { error: "Kuis tidak ditemukan atau Anda tidak berhak." };

  const parse = SchemaPertanyaan.safeParse({
    teks_pertanyaan: formData.get("teks_pertanyaan"),
    tipe: formData.get("tipe"),
    poin: Number(formData.get("poin")),
    urutan: Number(formData.get("urutan")),
    pilihan: JSON.parse(formData.get("pilihan") as string),
    image: formData.get("image") === "null" ? undefined : formData.get("image"),
  });

  if (!parse.success) return { error: parse.error.errors[0].message };

  const { teks_pertanyaan, tipe, poin, urutan, pilihan, image } = parse.data;

  let relativePath: string | null = null;
  const existingPertanyaan = await prisma.pertanyaanKuis.findUnique({
    where: { pertanyaan_id: parseInt(pertanyaanId) },
  });
  if (!existingPertanyaan) return { error: "Pertanyaan tidak ditemukan." };

  let newFilePath: string | null = null;

  try {
    if (image instanceof File && image.size > 0) {
      const file = image;
      const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
      const fileExt = path.extname(file.name).toLowerCase();
      if (!allowedExt.includes(fileExt)) {
        return { error: "Format file tidak diizinkan." };
      }
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const uploadDir = path.join(process.cwd(), "public", "quiz");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      const fileName = `${uuidv4()}${fileExt}`;
      newFilePath = path.join(uploadDir, fileName);
      fs.writeFileSync(newFilePath, buffer);
      relativePath = `/quiz/${fileName}`;
    } else if (formData.get("image_changed") === "false") {
      relativePath = existingPertanyaan.image;
    }

    await prisma.$transaction(async (tx) => {
      await tx.pilihanKuis.deleteMany({
        where: { pertanyaan_id: parseInt(pertanyaanId) },
      });

      await tx.pertanyaanKuis.update({
        where: { pertanyaan_id: parseInt(pertanyaanId) },
        data: {
          kuis_id: parseInt(quizId),
          teks_pertanyaan: teks_pertanyaan,
          tipe: tipe,
          poin: poin,
          urutan: urutan,
          image: relativePath,
          PilihanKuis: {
            create: pilihan.map((p: z.infer<typeof SchemaPilihan>) => ({
              teks_jawaban: p.teks_jawaban,
              score: p.score,
            })),
          },
        },
      });
    });

    if (image instanceof File && image.size > 0 && existingPertanyaan.image) {
      const oldImagePath = path.join(process.cwd(), "public", existingPertanyaan.image);
      if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }
    if (formData.get("image_changed") !== "false" && !(image instanceof File) && existingPertanyaan.image) {
        const oldImagePath = path.join(process.cwd(), "public", existingPertanyaan.image);
        if (fs.existsSync(oldImagePath)) fs.unlinkSync(oldImagePath);
    }

    revalidatePath(`/guru/dashboard/manage-quiz/edit/${quizId}`);
    return { success: "Pertanyaan berhasil diperbarui." };
  } catch (error) {
    console.error(error);
    if (newFilePath && fs.existsSync(newFilePath)) fs.unlinkSync(newFilePath);
    return { error: "Gagal memperbarui pertanyaan." };
  }
}

export async function DeletePertanyaan(
  pertanyaanId: string
): Promise<ActionResult> {
  const userId = await getUserId();
  if (!userId) return { error: "Not Authorized" };

  try {
    const question = await prisma.pertanyaanKuis.findFirst({
        where: { pertanyaan_id: parseInt(pertanyaanId) },
        include: { Kuis: true }
    });

    if (!question || question.Kuis?.created_by !== userId) {
        return { error: "Pertanyaan tidak ditemukan atau Anda tidak berhak." };
    }

    if (question.image) {
        const oldPath = path.join(process.cwd(), "public", question.image);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    await prisma.pertanyaanKuis.delete({
        where: { pertanyaan_id: parseInt(pertanyaanId) }
    });

    revalidatePath(`/guru/dashboard/manage-quiz/edit/${question.kuis_id}`);
    return { success: "Pertanyaan berhasil dihapus" };
  } catch (error) {
    console.error(error);
    return { error: "Gagal menghapus pertanyaan" };
  }
}

export async function CreateQuizCategory(
  _: unknown,
  formData: FormData
): Promise<CategoryActionResult> { // Use CategoryActionResult
  const userId = await getUserId();
  if (!userId) return { error: "Not Authorized" };

  const parse = SchemaCategoryKuis.safeParse({
    nama_kategori: formData.get("nama_kategori"),
    deskripsi: formData.get("deskripsi"),
    thumbnail: formData.get("thumbnail")
  });

  // Return validation errors correctly
  if (!parse.success) {
      return { errors: parse.error.flatten().fieldErrors };
  }

  try {
    await prisma.kategoriKuis.create({
      data: {
        nama_kategori: parse.data.nama_kategori,
        created_by: userId,
        deskripsi: parse.data.deskripsi,
        created_at: new Date(),
      },
    });

    revalidatePath("/guru/dashboard/manage-quiz/categories");
    return { success: "Kategori kuis berhasil dibuat" };
  } catch (err: unknown) {
    console.error(err);

    if (err instanceof Error && 'code' in err && (err as any).code === 'P2002') {
         return { error: "Nama kategori sudah ada. Gunakan nama lain." };
    }
    return { error: "Gagal membuat kategori kuis" };
  }
}

export async function UpdateQuizCategory(
    id: string,
    _: unknown,
    formData: FormData
): Promise<CategoryActionResult> { 
  const session = await auth();
  if (!session || !session.user || !session.user.id) { 
    return { error: "Not Authorized" }; 
  }

  const userId = parseInt(session.user.id); 
  const kategoriId = parseInt(id);

  const parse = SchemaCategoryKuis.safeParse({
    nama_kategori: formData.get("nama_kategori"),
    deskripsi: formData.get("deskripsi"),
    thumbnail: formData.get("thumbnail")
  });

  if (!parse.success) {
      return { errors: parse.error.flatten().fieldErrors };
  }

  try {
    const ownershipError = await verifyCategoryOwnership(kategoriId, userId);
    if (ownershipError) {
      return { error: ownershipError };
    }
    
    const updated = await prisma.kategoriKuis.update({
      where: { kategori_id: kategoriId },
      data: {
        nama_kategori: parse.data.nama_kategori,
        deskripsi: parse.data.deskripsi,
      },
    });

    revalidatePath("/guru/dashboard/manage-quiz/categories");
    return { success: "Kategori berhasil diupdate", data: updated }; 
  } catch (error: unknown) {
    console.error("UpdateQuizCategory Error:", error);
     if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
         return { error: "Nama kategori sudah ada. Gunakan nama lain." };
    }
    return { error: "Gagal update kategori" };
  }
}

export async function DeleteQuizCategory(id: string): Promise<CategoryActionResult> {
  const session = await auth();
  if (!session || !session.user || !session.user.id) { 
    return { error: "Not Authorized" }; 
  }

  const userId = parseInt(session.user.id); 
  const kategoriId = parseInt(id);

  try {
    const ownershipError = await verifyCategoryOwnership(kategoriId, userId);
    if (ownershipError) {
      return { error: ownershipError };
    }

    const kuisCount = await prisma.kuis.count({
      where: { kategori_id: kategoriId },
    });

    if (kuisCount > 0) {
      return { 
        error: `Gagal: Kategori ini masih digunakan oleh ${kuisCount} kuis. Hapus kuis terlebih dahulu.` 
      };
    }

    await prisma.kategoriKuis.delete({
      where: { kategori_id: kategoriId },
    });

    revalidatePath("/guru/dashboard/manage-quiz/categories");
    return { success: "Kategori berhasil dihapus" };

  } catch (error) {
    console.error("DeleteQuizCategory Error:", error);
    return { error: "Terjadi kesalahan sistem saat menghapus kategori." };
  }
}

export async function DeleteMultipleQuizCategories(
  ids: string[]
): Promise<CategoryActionResult> { 
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return { error: "Tidak terautentikasi" };
  }

  const userId = parseInt(session.user.id);
  const numericIds = ids.map((id) => parseInt(id)).filter((id) => !isNaN(id));

  if (numericIds.length === 0) {
    return { error: "Tidak ada ID valid yang dipilih." };
  }

  try {
    const unauthorizedCount = await prisma.kategoriKuis.count({
      where: {
        kategori_id: { in: numericIds }, 
        created_by: { not: userId },     
      },
    });

    if (unauthorizedCount > 0) {
      return { 
        error: `Gagal, Terdapat ${unauthorizedCount} kategori yang bukan milik Anda. Tindakan dibatalkan.` 
      };
    }

    const kuisCount = await prisma.kuis.count({
      where: {
        kategori_id: { in: numericIds },
      },
    });

    if (kuisCount > 0) {
      return { 
        error: `Gagal, ${kuisCount} kuis masih menggunakan kategori-kategori yang dipilih. Hapus atau pindahkan kuis terlebih dahulu.` 
      };
    }

    const deleteResult = await prisma.kategoriKuis.deleteMany({
      where: {
        kategori_id: { in: numericIds },
      },
    });

    revalidatePath("/guru/dashboard/manage-quiz/categories");
    return { success: `${deleteResult.count} kategori berhasil dihapus.` };

  } catch (error) {
    console.error("Bulk Delete Error:", error);
    return { error: "Terjadi kesalahan sistem saat menghapus kategori." };
  }
}

async function verifyCategoryOwnership(kategoriId: number, userId: number): Promise<string | null> {
  const kategori = await prisma.kategoriKuis.findUnique({
    where: { kategori_id: kategoriId },
    select: { created_by: true }, 
  });

  if (!kategori) {
    return "Kategori tidak ditemukan.";
  }

  if (kategori.created_by !== userId) {
    return "Anda tidak memiliki izin untuk menghapus/mengedit kategori ini.";
  }

  return null;
}