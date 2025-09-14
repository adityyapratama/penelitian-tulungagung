"use server"
import prisma from "@/lib/prisma";
import { SchemaSekolah } from "@/lib/schema";
import { auth } from "@/auth";



export async function createSekolah(_:unknown,formData:FormData){
    const parse = SchemaSekolah.safeParse({
        nama_sekolah:formData.get("nama_sekolah"),
        alamat_sekolah:formData.get("alamat_sekolah")
    })

    if(!parse.success){
        return {error:parse.error.errors[0].message}
    }

    try {
        await prisma.sekolah.create({
            data:{
                nama_sekolah:parse.data.nama_sekolah,
                alamat_sekolah:parse.data.alamat_sekolah
            }
        })

        return {success:"berhasil membuat sekolah"}
    } catch (error) {
        console.log(error)
        return {error:"terjadi kesalahan saat membuat sekolah"}
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

        return {success:"berhasil update sekolah"}
    } catch {
        return {error:"terjadi kesalahan"}
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
        return { error:"terjadi kesalahan" };
    }
}

export async function deleteManySekolah(ids: number[]) {
  const session = await auth();

  if (!session?.user) {
    return { error: "Not authenticated" };
  }

  try {
    await prisma.sekolah.deleteMany({
      where: {
        sekolah_id: { in: ids },
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Gagal menghapus banyak sekolah" };
  }
}
