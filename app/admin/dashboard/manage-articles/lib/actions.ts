'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { SchemaArticle } from "@/lib/schema";
import { ActionResult } from "@/lib/executeAction";
import fs from 'fs'
import path from 'path'
import { redirect } from "next/navigation";

export async function CreateArticle(_:unknown,formData:FormData):Promise<ActionResult> {
    const session = await auth();

    if(!session?.user){
        return {error :"Not authenticated"};
    }

    const validate = SchemaArticle.safeParse({
        judul:formData.get("judul"),
        konten:formData.get("konten"),
        kategori:Number(formData.get("kategori")),
        thumbnail:formData.get("thumbnail")
    })

     if(!validate.success){
    return {error: validate.error.message}
    }

    const bytes = await validate.data.thumbnail.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath = path.join(uploadDir, validate.data.thumbnail.name)

    fs.writeFileSync(filePath, buffer)

    try {
        await prisma.artikel.create({
            data:{
                judul:validate.data.judul,
                konten:validate.data.konten,
                kategori:Number(validate.data.kategori),
                created_by: Number(session.user.id),
                thumbnail: '/uploads/'+validate.data.thumbnail.name
            }
        })

        return redirect("/admin/dashboard/manage-articles");
    } catch (error) {
        console.log(error);
		return {error:"Gagal Membuat Article"}
    }
}


export async function UpdateArticle(_:unknown,formData:FormData,id:string):Promise<ActionResult> {

    const session = await auth();

    if (!session?.user) {
        throw new Error("Not authenticated");
    }
    const validate = SchemaArticle.safeParse({
        judul: formData.get("judul"),
        konten: formData.get("konten"),
        kategori: Number(formData.get("kategori")),
        thumbnail: formData.get("thumbnail")
    });

    if (!validate.success) {
        return { error: validate.error.message };
    }

    let thumbnailPath: string | undefined;
    if (validate.data.thumbnail instanceof File) {
        const bytes = await validate.data.thumbnail.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, validate.data.thumbnail.name);
        fs.writeFileSync(filePath, buffer);

        thumbnailPath = '/uploads/' + validate.data.thumbnail.name;
    }

    try {
        await prisma.artikel.update({
            where: { artikel_id: Number(id) },
            data: {
                judul: validate.data.judul,
                konten: validate.data.konten,
                kategori: Number(validate.data.kategori),
                ...(thumbnailPath && { thumbnail: thumbnailPath })
            }
        });

        return redirect("/admin/dashboard/manage-articles");
    } catch (error) {
        console.error(error);
        return { error: "failed to update data" };
    }
}

export async function DeleteArticle(id: number):Promise<ActionResult> {
    try {
        const artikel = await prisma.artikel.findUnique({
            where: { artikel_id:id },
        });

        if (!artikel) {
            return { error: "Artikel tidak ditemukan" };
        }

        if (artikel.thumbnail) {
            const filePath = path.join(process.cwd(), 'public', artikel.thumbnail);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await prisma.artikel.delete({
            where: { artikel_id:id },
        });

        return redirect("/admin/dashboard/manage-articles");
    } catch (error) {
        console.log(error);
        return { error: "Gagal menghapus artikel" };
    }
}

export async function CreateArticleCategory(_:unknown,formData:FormData):Promise<ActionResult>{
    const session = await auth()

    if (!session?.user) {
        throw new Error("Not authenticated");
    }

    const CategoryName = formData.get("category") as string

    try {
        await prisma.kategoriArtikel.create({
            data:{
                nama_kategori:CategoryName,
                created_by:Number(session.user.id)
            }
        })

        return redirect("/admin/dashboard/manage-articles")
    } catch (error) {
        console.log(error)
        return {error:"Gagal Membuat Category"}
    }
}


export async function UpdateArticleCategory(_: unknown, formData: FormData):Promise<ActionResult> {
    const session = await auth();

    if (!session?.user) {
        throw new Error("Not authenticated");
    }

    const id = Number(formData.get("id"));
    const CategoryName = formData.get("category") as string;

    try {
        await prisma.kategoriArtikel.update({
            where: { KategoriArtikel_id:id },
            data: {
                nama_kategori: CategoryName,
            }
        });

        return redirect("/admin/dashboard/manage-articles");
    } catch (error) {
        console.log(error);
        return { error:"Gagal Update Category" };
    }
}

export async function DeleteArticleCategory(id: number):Promise<ActionResult> {
    const session = await auth();

    if (!session?.user) {
        throw new Error("Not authenticated");
    }

    try {
        await prisma.kategoriArtikel.delete({
            where: { KategoriArtikel_id:id }
        });

        return redirect("/admin/dashboard/manage-articles");
    } catch (error) {
        console.log(error);
        return { error:"Gagal Menghapus Category" };
    }
}
