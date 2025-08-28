"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { SchemaQuiz,SchemaPilihan,SchemaPertanyaan, SchemaCategoryKuis } from "@/lib/schema";
import z from "zod";
import {ActionResult} from "@/lib/executeAction";
import { revalidatePath } from "next/cache";


export async function CreateQuiz(_:unknown,formData:FormData): Promise<ActionResult> {

    const session = await auth()

    if(!session){
        return {error: "Not Authorized"}
    }

    
    const parse = SchemaQuiz.safeParse({
            judul : formData.get("judul"),
            deskripsi : formData.get("deskripsi"),
            kategori_id : Number(formData.get("kategori_id")),
            xp_reward : Number(formData.get("xp_reward")),
            is_published : formData.get("is_published") === "1"
        })

    if(!parse.success){
        
        console.error(parse.error.flatten().fieldErrors);
        return {error:"Data yang dikirim tidak valid."}
    }

    try {
        await prisma.kuis.create({
            data:{
                judul:parse.data.judul,
                deskripsi:parse.data.deskripsi,
                kategori_id:parse.data.kategori_id, 
                xp_reward:parse.data.xp_reward,       
                created_by: parseInt(session.user.id!),
                is_published:parse.data.is_published  
            }
        })
    revalidatePath("/admin/dashboard/manage-quiz/quiz");
        return {success : "Kuis berhasil dibuat"}
    } catch (error) {
        console.log(error)
        return {error:"Gagal membuat kuis"}
    }
}


export async function UpdateQuiz(id: string, formData: FormData): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  const parse = SchemaQuiz.safeParse({
    judul : formData.get("judul"),
            deskripsi : formData.get("deskripsi"),
            kategori_id : Number(formData.get("kategori_id")),
            xp_reward : Number(formData.get("xp_reward")),
            is_published : formData.get("is_published") === "1"
  });

  if (!parse.success) {
    return { error: parse.error.message };
  }

  try {
    await prisma.kuis.update({
      where: { kuis_id: parseInt(id) },
      data: {
        judul: parse.data.judul,
        deskripsi: parse.data.deskripsi,
        kategori_id: parse.data.kategori_id,
        xp_reward: parse.data.xp_reward,
        is_published: parse.data.is_published ,
      },
    });

    return { success: "Kuis berhasil diperbarui" };
  } catch (error) {
    console.error(error);
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




export async function CreatePertanyaan(id:string, formData: FormData): Promise<ActionResult> {
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
  });

  if (!parse.success) {
    return { error: parse.error.message };
  }

  try {
    await prisma.pertanyaanKuis.create({
      data: {
        kuis_id: parseInt(id),
        teks_pertanyaan: parse.data.teks_pertanyaan,
        tipe: parse.data.tipe,
        poin: parse.data.poin,
        urutan: parse.data.urutan,
        PilihanKuis: {
          create: parse.data.pilihan.map((p: z.infer<typeof SchemaPilihan>) => ({
            teks_jawaban: p.teks_jawaban,
            score: p.score,
          })),
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
) {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  const parse = SchemaPertanyaan.safeParse({
    teks_pertanyaan: formData.get("teks_pertanyaan"),
    tipe: formData.get("tipe"),
    poin: Number(formData.get("poin")),
    urutan: Number(formData.get("urutan")),
    pilihan: JSON.parse(formData.get("pilihan") as string),
  });

  if (!parse.success) return { error: parse.error.message };

  try {
    await prisma.$transaction([
      prisma.pilihanKuis.deleteMany({
        where: { pertanyaan_id: parseInt(pertanyaanId) },
      }),

      prisma.pertanyaanKuis.update({
        where: { pertanyaan_id: parseInt(pertanyaanId) },
        data: {
          kuis_id: parseInt(quizId),
          teks_pertanyaan: parse.data.teks_pertanyaan,
          tipe: parse.data.tipe,
          poin: parse.data.poin,
          urutan: parse.data.urutan,
          PilihanKuis: {
            create: parse.data.pilihan.map((p) => ({
              teks_jawaban: p.teks_jawaban,
              score: p.score,
            })),
          },
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error };
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
            msg.replace(/String must contain at least \d+ character\(s\)/, "Minimal beberapa karakter")
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
  } catch (err: any) {
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
  } catch (error: any) {
    console.error("UpdateQuizCategory Error:", error);
    return { error: error.message || "Failed to update category" };
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
  } catch (error: any) {
    console.error("DeleteQuizCategory Error:", error);
    return { error: error.message || "Failed to delete category" };
}
}






export async function DeleteMultipleQuizCategories(ids: string[]): Promise<ActionResult> {
  const session = await auth();
  if (!session) {
    return { error: "Tidak terautentikasi" };
  }

  // Konversi array string ID menjadi array angka
  const numericIds = ids.map(id => parseInt(id)).filter(id => !isNaN(id));

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

export async function DeleteMultipleQuizzes(ids: string[]): Promise<ActionResult> {
  const session = await auth();
  if (!session) {
    return { error: "Tidak terautentikasi" };
  }

  const numericIds = ids.map(id => parseInt(id)).filter(id => !isNaN(id));

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
  } catch (error: any) {
    console.error("Bulk Delete Error:", error);
    return { error: "Gagal menghapus kuis yang dipilih." };
  }
}