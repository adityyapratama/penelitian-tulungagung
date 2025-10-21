'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { SchemaStoryCategory } from "@/lib/schema"
import { revalidatePath } from "next/cache"

export type ActionResult = {
  success?: string;
  error?: string;
  errors?: {
    NamaKategori?: string[];
  };
};

export async function createCategory(_: unknown, formData: FormData): Promise<ActionResult> {
    const session = await auth()
    if (!session) {
        return { error: "Not Authorized" }
    }

    const parse = SchemaStoryCategory.safeParse({
        NamaKategori: formData.get("nama_kategori")
    })

    if (!parse.success) {
        return { errors: parse.error.flatten().fieldErrors };
    }

    try {
        await prisma.kategoriCerita.create({
            data: {
                NamaKategori: parse.data.NamaKategori
            }
        })
        revalidatePath("/guru/dashboard/manage-stories/category")
        return { success: "Kategori Berhasil Ditambahkan" }
    } catch (e) {
        return { error: "Gagal Membuat Kategori. Mungkin nama sudah ada." }
    }
}

export async function updateCategory(id: string, prevState: unknown, formData: FormData): Promise<ActionResult> {
    const session = await auth()
    if (!session) {
        return { error: "Not Authorized" }
    }

    const parse = SchemaStoryCategory.safeParse({
        NamaKategori: formData.get("nama_kategori")
    })

    if (!parse.success) {
        return { errors: parse.error.flatten().fieldErrors };
    }

    try {
        await prisma.kategoriCerita.update({
            where: { KategoriId: parseInt(id) },
            data: { NamaKategori: parse.data.NamaKategori }
        })
        revalidatePath("/guru/dashboard/manage-stories/category")
        return { success: "Kategori Berhasil Diperbarui" }
    } catch {
        return { error: "Gagal Update Kategori" }
    }
}

export async function deleteCategory(id: string): Promise<ActionResult> {
    const session = await auth()
    if (!session) {
        return { error: "Not Authorized" }
    }

    try {
        await prisma.kategoriCerita.delete({
            where: { KategoriId: parseInt(id) }
        })
        revalidatePath("/guru/dashboard/manage-stories/category")
        return { success: "Kategori Berhasil Dihapus" }
    } catch {
        return { error: "Gagal Menghapus Kategori. Pastikan tidak ada cerita yang menggunakan kategori ini." }
    }
}