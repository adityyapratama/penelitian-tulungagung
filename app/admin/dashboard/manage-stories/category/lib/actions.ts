'use server'

import { auth } from "@/auth"
import prisma from "@/lib/prisma"
import { SchemaStoryCategory } from "@/lib/schema"
import { ActionResult } from "@/lib/executeAction"

export async function createCategory(_:unknown,formData:FormData):Promise<ActionResult> {
    const session = await auth()

    if(!session){
        return {error: "Not Authorized"}
    }

    const parse = SchemaStoryCategory.safeParse({
        NamaKategori : formData.get("nama_kategori")
    })

    if (!parse.success) {
        return { error: parse.error.errors[0].message };
    }

    try {
        prisma.kategoriCerita.create({
            data:{
                NamaKategori : parse.data.NamaKategori
            }
        })

        return {success:"Kategori Berhasil Ditambahkan"}
    } catch{

        return {error: "Gagal Membuat Kategori"}
    }
}

export async function updateCategory(id: string, formData: FormData): Promise<ActionResult> {
    const session = await auth()

    if (!session) {
        return { error: "Not Authorized" }
    }

    if (!id) {
        return { error: "ID Kategori tidak ditemukan" }
    }

    const parse = SchemaStoryCategory.safeParse({
        NamaKategori: formData.get("nama_kategori")
    })

    if (!parse.success) {
        return { error: parse.error.errors[0].message }
    }

    try {
        await prisma.kategoriCerita.update({
            where: { KategoriId: parseInt(id.toString()) },
            data: { NamaKategori: parse.data.NamaKategori }
        })

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

    if (!id) {
        return { error: "ID Kategori tidak ditemukan" }
    }

    try {
        await prisma.kategoriCerita.delete({
            where: { KategoriId: parseInt(id.toString()) }
        })

        return { success: "Kategori Berhasil Dihapus" }
    } catch {
        return { error: "Gagal Menghapus Kategori" }
    }
}