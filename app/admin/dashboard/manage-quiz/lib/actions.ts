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
            kategori_id : formData.get("kategori_id"),
            xp_reward : formData.get("xp_reward"),
            is_published : formData.get("is_published")
        })

    if(!parse.success){
        return {error:parse.error.message}
    }

    try {
        await prisma.kuis.create({
            data:{
                judul:parse.data.judul,
                deskripsi:parse.data.deskripsi,
                kategori_id:parse.data.kategori_id,
                xp_reward:parse.data.xp_reward,
                created_by: parseInt(session.user.id!),
                is_published:parse.data.is_publised
            }
        })

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
    judul: formData.get("judul"),
    deskripsi: formData.get("deskripsi"),
    kategori_id: formData.get("kategori_id"),
    xp_reward: formData.get("xp_reward"),
    is_published: formData.get("is_published"),
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
        is_published: parse.data.is_publised ,
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
): Promise<ActionResult> {
  const session = await auth();
  if (!session) {
    return { error: "Not Authorized" };
  }

  const parse = SchemaCategoryKuis.safeParse({
    nama_kategori: formData.get("nama_kategori"),
    deskripsi: formData.get("deskripsi"),
  });

  if (!parse.success) {
    return { error: parse.error.errors[0].message };
  }

  try {
    await prisma.kategoriKuis.create({
      data: {
        nama_kategori: parse.data.nama_kategori,
        created_by: parseInt(session.user.id!),
        deskripsi: parse.data.deskripsi,
      },
    });

    // ⚠️ Bug: success tidak terdefinisi
    // console.log(success);

    return { success: "Category Berhasil Dibuat" };
  } catch (error) {
    console.log(error);
    return { error: "terjadi kesalahan :" + error };
  }
}

// 1. Definisikan tipe state agar konsisten dengan frontend


// 2. Buat skema validasi menggunakan Zod


// export async function CreateQuizCategory(
//   prevState: FormState | null,
//   formData: FormData
// ): Promise<FormState> {
//   // 3. Autentikasi: Periksa sesi pengguna
//   const session = await auth();
  
//   // Anda juga bisa menambahkan pengecekan role di sini, misalnya:
//   // if (session.user.role !== 'guru' && session.user.role !== 'super_admin') {
//   //   return { success: false, message: "Anda tidak memiliki izin untuk membuat kategori." };
//   // }

//   // 4. Validasi Input: Gunakan Zod untuk memvalidasi data dari form
//   const validatedFields = SchemaCategoryKuis.safeParse({
//     nama_kategori: formData.get("nama_kategori"),
//     deskripsi: formData.get("deskripsi"),
//   });

//   if (!validatedFields.success) {
//     // Jika validasi gagal, kirim pesan error pertama
//     return {
//       success: false,
//       message: validatedFields.error.errors[0].message,
//     };
//   }
  
//   // 5. Operasi Database: Coba buat data baru
//   try {
//     await prisma.kategoriKuis.create({
//       data: {
//         nama_kategori: validatedFields.data.nama_kategori,
//         deskripsi: validatedFields.data.deskripsi,
//         created_by: parseInt(session.user.id),
//       },
//     });

//     // 6. Revalidasi Path: Bersihkan cache agar daftar kategori terupdate
//     revalidatePath("/admin/dashboard/manage-quiz/categories");
    
//     // 7. Kirim Respons Sukses
//     return { success: true, message: "Kategori baru berhasil ditambahkan!" };

//   } catch (error: any) {
//     // 8. Penanganan Error Database
//     console.error("Database Error:", error);
//     // Cek jika error karena nama kategori sudah ada (unique constraint)
//     if (error.code === 'P2002') {
//       return { success: false, message: "Nama kategori ini sudah ada. Silakan gunakan nama lain." };
//     }
//     // Error umum lainnya
//     return { success: false, message: "Terjadi kesalahan pada server. Gagal membuat kategori." };
//   }
// }




// export async function UpdateQuizCategory(id: string, formData: FormData): Promise<ActionResult> {
//   const session = await auth();
//   if (!session) return { error: "Not Authorized" };

//   const parse = SchemaCategoryKuis.safeParse({
//     nama_kategori: formData.get("nama_kategori"),
//     deskripsi: formData.get("deskripsi"),
//   });

//   if (!parse.success) return { error: parse.error.message };

//   try {
//      await prisma.kategoriKuis.update({
//       where: { kategori_id: parseInt(id) }, 
//       data: {
//         nama_kategori: parse.data.nama_kategori,
//         deskripsi: parse.data.deskripsi,
//       },
//     });

//     return { success: "Kategori berhasil diperbarui" };
//   } catch (error: unknown
//   ) {
//     console.error("UpdateQuizCategory Error:", error);
//     return { error:  "Failed to update category" };
//   }
// }

const SchemaCategoryKuis = z.object({
  nama_kategori: z.string().min(3, "Nama kategori minimal 3 karakter."),
  deskripsi: z.string().optional(),
});

export async function UpdateQuizCategory(
  id: string,
  prevState: ActionResult, // ⚠️ hanya dipakai untuk useActionState
  formData: FormData
): Promise<ActionResult> {
  const session = await auth();
  if (!session) {
    return { error: "Tidak terautentikasi" };
  }

  const parse = SchemaCategoryKuis.safeParse({
    nama_kategori: formData.get("nama_kategori"),
    deskripsi: formData.get("deskripsi"),
  });

  if (!parse.success) {
    return { error: parse.error.errors[0].message };
  }

  try {
    await prisma.kategoriKuis.update({
      where: { kategori_id: parseInt(id) },
      data: {
        nama_kategori: parse.data.nama_kategori,
        deskripsi: parse.data.deskripsi,
      },
    });

    revalidatePath("/admin/dashboard/manage-quiz/categories");

    return { success: "Kategori berhasil diperbarui!" };
  } catch (error: any) {
    console.error("UpdateQuizCategory Error:", error);
    if (error.code === "P2002") {
      return {
        error: "Nama kategori ini sudah digunakan oleh kategori lain.",
      };
    }
    return { error: "Gagal memperbarui kategori." };
  }
}





// export async function DeleteQuizCategory(id: string): Promise<ActionResult> {
//   const session = await auth();
//   if (!session) return { error: "Not Authorized" };

//   try {
//     await prisma.kategoriKuis.delete({
//       where: { kategori_id: parseInt(id) }, 
//     });

//     return { success: "Category deleted successfully" };
//   } catch (error: unknown) {
//     console.error("DeleteQuizCategory Error:", error);
//     return { error: "Failed to delete category" };
//   }
// }

export async function DeleteQuizCategory(id: string): Promise<ActionResult> {
  const session = await auth();
  if (!session) return { error: "Tidak terautentikasi" };

  try {
    await prisma.kategoriKuis.delete({
      where: { kategori_id: parseInt(id) },
    });

    // PENTING: Revalidasi path agar tabel di-refresh secara otomatis
    revalidatePath("/admin/dashboard/manage-quiz/categories");

    return { success: "Kategori berhasil dihapus." };
  } catch (error: any) {
    console.error("DeleteQuizCategory Error:", error);
    
    // Tangani error jika kategori masih digunakan oleh kuis lain
    if (error.code === 'P2003') { // Foreign key constraint failed
      return { error: "Kategori ini tidak dapat dihapus karena masih digunakan oleh beberapa kuis." };
    }
    
    return { error: "Gagal menghapus kategori." };
  }
}

// lib/actions.ts

// ...impor dan action lainnya...

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
  } catch (error: any) {
    console.error("Bulk Delete Error:", error);
    if (error.code === 'P2003') {
      return { error: "Beberapa kategori gagal dihapus karena masih digunakan oleh kuis." };
    }
    return { error: "Gagal menghapus kategori yang dipilih." };
  }
}

