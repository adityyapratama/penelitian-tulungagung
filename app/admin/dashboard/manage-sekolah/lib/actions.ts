import prisma from "@/lib/prisma";
import { SchemaSekolah } from "@/lib/schema";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function createSekolah(_:unknown,formData:FormData){
    const parse = SchemaSekolah.safeParse({
        nama_sekolah:formData.get("nama_sekolah"),
        alamat_sekolah:formData.get("alamat_sekolah")
    })

    if(!parse.success){
        return {error:parse.error.message}
    }

    try {
        await prisma.sekolah.create({
            data:{
                nama_sekolah:parse.data.nama_sekolah,
                alamat_sekolah:parse.data.alamat_sekolah
            }
        })

        return redirect("/admin/dashboard/manage-sekolah")
    } catch (error) {
        console.log(error)
        return {error:error}
    }
}

export async function updateSekolah(_:unknown,formData:FormData,id:string | undefined) {
    const parse = SchemaSekolah.safeParse({
        nama_sekolah:formData.get("nama_sekolah"),
        alamat_sekolah:formData.get("alamat_sekolah")
    })

    if(!parse.success){
        return {error:parse.error.message}
    }

    if(id == undefined){
        return {error:"id not found"}
    }

    try {
        await prisma.sekolah.update({
            where:{
                sekolah_id:parseInt(id)
            },
            data:{
                nama_sekolah:parse.data.nama_sekolah,
                alamat_sekolah:parse.data.alamat_sekolah
            }
        })

        return 
    } catch (error) {
        return {error:error}
    }
}

export async function deleteSekolah(id:number) {
        const session = await auth();

    if (!session?.user) {
        throw new Error("Not authenticated");
    }

    try {
        await prisma.sekolah.delete({
            where: { sekolah_id:id }
        });

        return { success: true };
    } catch (error) {
        console.log(error);
        return { error:error };
    }
}