"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { SchemaArticle } from "@/lib/schema";
import { ActionResult } from "@/lib/executeAction";
import fs from "fs";
import path from "path";
import { redirect } from "next/navigation";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function CreateArticle(
    _: unknown,
    formData: FormData
): Promise<ActionResult> {
    const session = await auth();

    if (!session?.user || !session.user.id) {
        return { error: "Not authenticated" };
    }

    const validate = SchemaArticle.safeParse({
        judul: formData.get("judul"),
        konten: formData.get("konten"),
        kategori: Number(formData.get("kategori")),
        thumbnail: formData.get("thumbnail"),
    });

    if (!validate.success) {
        return { error: validate.error.message };
    }

    const bytes = await validate.data.thumbnail.arrayBuffer();
    const buffer = Buffer.from(bytes);

    if (!fs.existsSync(UPLOAD_DIR)) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    const filePath = path.join(UPLOAD_DIR, validate.data.thumbnail.name);
    fs.writeFileSync(filePath, buffer);

    try {
        await prisma.artikel.create({
            data: {
                judul: validate.data.judul,
                konten: validate.data.konten,
                kategori: Number(validate.data.kategori),
                created_by: Number(session.user.id),
                thumbnail: "/uploads/" + validate.data.thumbnail.name,
            },
        });

        return { success: "true" };
    } catch (error) {
        console.error(error);
        return { error: "Gagal Membuat Article" };
    }
}

export async function UpdateArticle(
    _: unknown,
    formData: FormData,
    id: string
): Promise<ActionResult> {
    const session = await auth();

    if (!session?.user || !session.user.id) {
        return { error: "Not authenticated" };
    }

    const articleId = Number(id);

    const existingArticle = await prisma.artikel.findUnique({ where: { artikel_id: articleId } });

    if (!existingArticle) {
        return { error: "Artikel tidak ditemukan" };
    }

    if (existingArticle.created_by !== Number(session.user.id) && session.user.role !== "super_admin") {
        return { error: "Unauthorized access: You cannot update this article." };
    }

    const validate = SchemaArticle.safeParse({
        judul: formData.get("judul"),
        konten: formData.get("konten"),
        kategori: Number(formData.get("kategori")),
        thumbnail: formData.get("thumbnail"), 
    });

    if (!validate.success) {
        return { error: validate.error.message };
    }

    let thumbnailPath: string = existingArticle.thumbnail || "";
    const incomingThumbnail = validate.data.thumbnail;

    if (incomingThumbnail instanceof File && incomingThumbnail.size > 0) {
        const bytes = await incomingThumbnail.arrayBuffer();
        const buffer = Buffer.from(bytes);

        if (!fs.existsSync(UPLOAD_DIR)) {
            fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        }

        const filePath = path.join(UPLOAD_DIR, incomingThumbnail.name);
        fs.writeFileSync(filePath, buffer);

        thumbnailPath = "/uploads/" + incomingThumbnail.name;
        
        if (existingArticle.thumbnail) {
            const oldFilePath = path.join(process.cwd(), "public", existingArticle.thumbnail);
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }
    } 

    try {
        await prisma.artikel.update({
            where: { artikel_id: articleId },
            data: {
                judul: validate.data.judul,
                konten: validate.data.konten,
                kategori: Number(validate.data.kategori),
                thumbnail: thumbnailPath, 
            },
        });

        return { success: "true" };
    } catch (error) {
        console.error(error);
        return { error: "failed to update data" };
    }
}

export async function DeleteArticle(id: number): Promise<ActionResult> {
    const session = await auth();

    if (!session?.user || !session.user.id) {
        return { error: "Not authenticated" };
    }

    try {
        const artikel = await prisma.artikel.findUnique({
            where: { artikel_id: id },
        });

        if (!artikel) {
            return { error: "Artikel tidak ditemukan" };
        }

        if (artikel.created_by !== Number(session.user.id) && session.user.role !== "super_admin") {
             return { error: "Unauthorized access: You cannot delete this article." };
        }

        if (artikel.thumbnail) {
            const filePath = path.join(process.cwd(), "public", artikel.thumbnail);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await prisma.artikel.delete({
            where: { artikel_id: id },
        });

        // Tentukan redirect berdasarkan peran (opsional, disarankan agar Client Component yang menentukan redirect)
        // return redirect("/admin/dashboard/manage-articles");
        return { success: "true" } 

    } catch (error) {
        console.error(error);
        return { error: "Gagal menghapus artikel" };
    }
}

export async function CreateArticleCategory(
    _: unknown,
    formData: FormData
): Promise<ActionResult> {
    const session = await auth();

    if (!session?.user) {
        throw new Error("Not authenticated");
    }

    const CategoryName = formData.get("category") as string;

    try {
        await prisma.kategoriArtikel.create({
            data: {
                nama_kategori: CategoryName,
                created_by: Number(session.user.id),
            },
        });

        return redirect(session.user.role === "super_admin" ? "/admin/dashboard/manage-articles" : "/guru/dashboard/manage-articles");
    } catch (error) {
        console.error(error);
        return { error: "Gagal Membuat Category" };
    }
}

export async function UpdateArticleCategory(
    _: unknown,
    formData: FormData
): Promise<ActionResult> {
    const session = await auth();

    if (!session?.user) {
        throw new Error("Not authenticated");
    }

    const id = Number(formData.get("id"));
    const CategoryName = formData.get("category") as string;

    try {
        await prisma.kategoriArtikel.update({
            where: { KategoriArtikel_id: id },
            data: {
                nama_kategori: CategoryName,
            },
        });

        return redirect(session.user.role === "super_admin" ? "/admin/dashboard/manage-articles" : "/guru/dashboard/manage-articles");
    } catch (error) {
        console.error(error);
        return { error: "Gagal Update Category" };
    }
}

export async function DeleteArticleCategory(id: number): Promise<ActionResult> {
    const session = await auth();

    if (!session?.user) {
        throw new Error("Not authenticated");
    }

    try {
        await prisma.kategoriArtikel.delete({
            where: { KategoriArtikel_id: id },
        });

        return { success: "true" };
    } catch (error) {
        console.error(error);
        return { error: "Gagal Menghapus Category" };
    }
}