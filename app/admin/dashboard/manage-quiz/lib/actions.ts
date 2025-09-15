"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  SchemaQuiz,
  SchemaPilihan,
  SchemaPertanyaan,
  SchemaCategoryKuis,
} from "@/lib/schema";
import z from "zod";
import { ActionResult } from "@/lib/executeAction";
import { revalidatePath } from "next/cache";
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from "uuid"; // untuk generate UUID


export async function CreateQuiz(
  _: unknown,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  const parse = SchemaQuiz.safeParse({
    judul: formData.get("judul"),
    deskripsi: formData.get("deskripsi"),
    kategori_id: Number(formData.get("kategori_id")),
    xp_reward: Number(formData.get("xp_reward")),
    is_published: formData.get("is_published"),
    thumbnail: formData.get("thumbnail"),
  });

  if (!parse.success) return { error: parse.error.errors[0].message};

  const file = parse.data.thumbnail;
  if (!(file instanceof File)) return { error: "Thumbnail invalid" };

  // Validasi tambahan (opsional)
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

  const relativePath = `/quiz/${fileName}`;

  try {
    await prisma.kuis.create({
      data: {
        judul: parse.data.judul,
        deskripsi: parse.data.deskripsi,
        kategori_id: parse.data.kategori_id,
        xp_reward: parse.data.xp_reward,
        created_by: parseInt(session.user.id!),
        is_published: parse.data.is_published,
        thumbnail: relativePath,
      },
    });

    revalidatePath("/admin/dashboard/manage-quiz/quiz");
    return { success: "Kuis berhasil dibuat" };
  } catch (error) {
    console.error("CreateQuiz error:", error);
    return { error: "Gagal membuat kuis" };
  }
}


export async function UpdateQuiz(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  const parse = SchemaQuiz.safeParse({
    judul: formData.get("judul"),
    deskripsi: formData.get("deskripsi"),
    kategori_id: Number(formData.get("kategori_id")),
    xp_reward: Number(formData.get("xp_reward")),
    is_published: formData.get("is_published"),
    thumbnail: formData.get("thumbnail"),
  });

  if (!parse.success) return { error: parse.error.errors[0].message };

  let relativePath: string | undefined;

  try {
    // Kalau ada thumbnail baru
    if (parse.data.thumbnail instanceof File) {
      // ambil data lama
      const old = await prisma.kuis.findUnique({
        where: { kuis_id: parseInt(id) },
        select: { thumbnail: true },
      });

      // hapus file lama kalau ada
      if (old?.thumbnail) {
        const oldPath = path.join(process.cwd(), "public", old.thumbnail);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      // validasi tambahan
      const file = parse.data.thumbnail;
      const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
      const fileExt = path.extname(file.name).toLowerCase();
      if (!allowedExt.includes(fileExt)) {
        return { error: "Format file tidak diizinkan" };
      }

      // upload file baru
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

    // update database
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

    revalidatePath("/admin/dashboard/manage-quiz/quiz");
    return { success: "Kuis berhasil diupdate" };
  } catch (error) {
    console.error("UpdateQuiz error:", error);
    return { error: "Gagal update kuis" };
  }
}


export async function DeleteQuiz(id: string) {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  try {
    await prisma.kuis.delete({
      where: { kuis_id: parseInt(id) },
    });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Gagal menghapus kuis" };
  }
}

export async function CreatePertanyaan(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  if (!session) {
    return { error: "Not Authorized" };
  }

  const parse = SchemaPertanyaan.safeParse({
    teks_pertanyaan: formData.get("teks_pertanyaan"),
    tipe: formData.get("tipe"),
    poin: Number(formData.get("poin")),
    urutan: Number(formData.get("urutan")),
    pilihan: JSON.parse(formData.get("pilihan") as string),
    image: formData.get("image") === "null" ? undefined : formData.get("image"), // Tangani kasus `null`
  });

  if (!parse.success) return { error: parse.error.errors[0].message };

  let relativePath = null;

  // Unggah gambar jika ada
  if (parse.data.image) {
    const file = parse.data.image;
    
    // Validasi tambahan (opsional)
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
        image: relativePath, // Simpan URL gambar jika ada
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

    return { success: "Pertanyaan berhasil dibuat" };
  } catch (error) {
    console.error(error);
    return { error: "Gagal membuat pertanyaan" };
  }
}

export async function UpdatePertanyaan(
  quizId: string,
  pertanyaanId: string,
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();

  if (!session) {
    return { error: "Not Authorized" };
  }

  const parse = SchemaPertanyaan.safeParse({
    teks_pertanyaan: formData.get("teks_pertanyaan"),
    tipe: formData.get("tipe"),
    poin: Number(formData.get("poin")),
    urutan: Number(formData.get("urutan")),
    pilihan: JSON.parse(formData.get("pilihan") as string),
    image: formData.get("image") === "null" ? undefined : formData.get("image"),
  });

  if (!parse.success) {
    return { error: parse.error.errors[0].message };
  }

  const { teks_pertanyaan, tipe, poin, urutan, pilihan, image } = parse.data;

  let relativePath = null;
  const existingPertanyaan = await prisma.pertanyaanKuis.findUnique({
    where: { pertanyaan_id: parseInt(pertanyaanId) },
  });

  if (!existingPertanyaan) {
    return { error: "Pertanyaan tidak ditemukan." };
  }

  // Hapus gambar lama jika ada dan unggah yang baru
  if (image) {
    const file = image;

    // Validasi file
    const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
    const fileExt = path.extname(file.name).toLowerCase();
    if (!allowedExt.includes(fileExt)) {
      return { error: "Format file tidak diizinkan." };
    }

    // Unggah gambar baru
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

    // Hapus gambar lama di disk jika ada
    if (existingPertanyaan.image) {
      const oldImagePath = path.join(
        process.cwd(),
        "public",
        existingPertanyaan.image
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
  } else if (formData.get("image_changed") === "false") {
    // Pertahankan gambar lama jika tidak ada perubahan
    relativePath = existingPertanyaan.image;
  } else {
    // Hapus gambar lama jika pengguna ingin menghapus gambar
    if (existingPertanyaan.image) {
      const oldImagePath = path.join(
        process.cwd(),
        "public",
        existingPertanyaan.image
      );
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      // 1. Hapus pilihan lama
      await tx.pilihanKuis.deleteMany({
        where: { pertanyaan_id: parseInt(pertanyaanId) },
      });

      // 2. Perbarui pertanyaan
      await tx.pertanyaanKuis.update({
        where: { pertanyaan_id: parseInt(pertanyaanId) },
        data: {
          kuis_id: parseInt(quizId),
          teks_pertanyaan: teks_pertanyaan,
          tipe: tipe,
          poin: poin,
          urutan: urutan,
          image: relativePath, // Simpan path gambar
          PilihanKuis: {
            // 3. Buat pilihan baru
            create: pilihan.map((p: z.infer<typeof SchemaPilihan>) => ({
              teks_jawaban: p.teks_jawaban,
              score: p.score,
            })),
          },
        },
      });
    });

    return { success: "Pertanyaan berhasil diperbarui." };
  } catch (error) {
    console.error(error);
    return { error: "Gagal memperbarui pertanyaan." };
  }
}

export async function DeletePertanyaan(
  pertanyaanId: string
): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  try {
    await prisma.$transaction([
      prisma.pilihanKuis.deleteMany({
        where: { pertanyaan_id: parseInt(pertanyaanId) },
      }),

      prisma.pertanyaanKuis.delete({
        where: { pertanyaan_id: parseInt(pertanyaanId) },
      }),
    ]);

    return { success: "Pertanyaan berhasil dihapus" };
  } catch (error) {
    console.error(error);
    return { error: "Gagal menghapus pertanyaan" };
  }
}

export async function CreateQuizCategory(
  _: unknown,
  formData: FormData
): Promise<{
  message?: string;
  error?: string;
  errors?: { nama_kategori?: string[]; deskripsi?: string[] };
}> {
  const session = await auth();
  if (!session) {
    return { error: "Not Authorized" };
  }

  const parse = SchemaCategoryKuis.safeParse({
    nama_kategori: formData.get("nama_kategori"),
    deskripsi: formData.get("deskripsi"),
  });

  if (!parse.success) {
    const errors = Object.entries(parse.error.flatten().fieldErrors).reduce(
      (acc, [key, value]) => {
        if (value && value.length > 0) {
          acc[key as "nama_kategori" | "deskripsi"] = value.map((msg) =>
            msg
              .replace(
                /String must contain at least \d+ character\(s\)/,
                "Minimal beberapa karakter"
              )
              .replace(/Required/, "Wajib diisi")
          );
        }
        return acc;
      },
      {} as { nama_kategori?: string[]; deskripsi?: string[] }
    );

    return { errors };
  }

  try {
    await prisma.kategoriKuis.create({
      data: {
        nama_kategori: parse.data.nama_kategori,
        created_by: Number(session.user.id),
        deskripsi: parse.data.deskripsi,
      },
    });

    return { message: "Kategori kuis berhasil dibuat" };
  } catch (err: unknown) {
    console.error(err);
    return { error: "Gagal membuat kategori kuis" };
  }
}

export async function UpdateQuizCategory(id: string, formData: FormData) {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  const parse = SchemaCategoryKuis.safeParse({
    nama_kategori: formData.get("nama_kategori"),
    deskripsi: formData.get("deskripsi"),
  });

  if (!parse.success) return { error: parse.error.message };

  try {
    const updated = await prisma.kategoriKuis.update({
      where: { kategori_id: parseInt(id) },
      data: {
        nama_kategori: parse.data.nama_kategori,
        deskripsi: parse.data.deskripsi,
      },
    });

    return { success: true, data: updated };
  } catch (error: unknown) {
    console.error("UpdateQuizCategory Error:", error);
    return { error: "Failed to update category" };
  }
}

export async function DeleteQuizCategory(id: string) {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  try {
    await prisma.kategoriKuis.delete({
      where: { kategori_id: parseInt(id) },
    });

    return { success: true, message: "Category deleted successfully" };
  } catch (error: unknown) {
    console.error("DeleteQuizCategory Error:", error);
    return { error: "Failed to delete category" };
  }
}

export async function DeleteMultipleQuizCategories(
  ids: string[]
): Promise<ActionResult> {
  const session = await auth();
  if (!session) {
    return { error: "Tidak terautentikasi" };
  }

  // Konversi array string ID menjadi array angka
  const numericIds = ids.map((id) => parseInt(id)).filter((id) => !isNaN(id));

  if (numericIds.length === 0) {
    return { error: "Tidak ada ID valid yang dipilih." };
  }

  try {
    // Gunakan 'deleteMany' dari Prisma dengan operator 'in'
    const deleteResult = await prisma.kategoriKuis.deleteMany({
      where: {
        kategori_id: {
          in: numericIds,
        },
      },
    });

    revalidatePath("/admin/dashboard/manage-quiz/categories");

    return { success: `${deleteResult.count} kategori berhasil dihapus.` };
  } catch (error: unknown) {
    console.error("Bulk Delete Error:", error);

    return { error: "Gagal menghapus kategori yang dipilih." };
  }
}

export async function DeleteMultipleQuizzes(
  ids: string[]
): Promise<ActionResult> {
  const session = await auth();
  if (!session) {
    return { error: "Tidak terautentikasi" };
  }

  const numericIds = ids.map((id) => parseInt(id)).filter((id) => !isNaN(id));

  if (numericIds.length === 0) {
    return { error: "Tidak ada ID valid yang dipilih." };
  }

  try {
    const deleteResult = await prisma.kuis.deleteMany({
      where: {
        kuis_id: {
          in: numericIds,
        },
      },
    });

    revalidatePath("/admin/dashboard/manage-quiz/quiz");

    return { success: `${deleteResult.count} kuis berhasil dihapus.` };
  } catch (error: unknown) {
    console.error("Bulk Delete Error:", error);
    return { error: "Gagal menghapus kuis yang dipilih." };
  }
}
