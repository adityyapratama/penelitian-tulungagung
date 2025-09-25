"use server"

import { auth } from "@/auth"
import prisma from "@/lib/prisma";
import { SchemaMember } from "@/lib/schema";
import fs from 'fs'
import path from 'path'
import { v4 as uuidv4 } from "uuid"
import {ProgressData} from "@/types/index"
import { ContentType } from "@/lib/generated/prisma";


export async function GetMemberData(){
    const session = await auth()

    if (!session) {
        return { error: "Not Authorized" }; 
    }

    try {
        const member = await prisma.member.findFirst({
            where:{
                user_id: parseInt(session.user.id!)
            }
        })

        return member
    } catch (error) {
        return {error}
    }
}


export async function CreateMember(_: unknown, formData: FormData) {
  const session = await auth()
  if (!session) {
    return { error: "Not Authorized" }
  }

  const parse = SchemaMember.safeParse({
    sekolah_id: formData.get("sekolah"),
    nis: formData.get("nis"),
    foto_profile: formData.get("foto_profile"),
    bio: formData.get("bio"),
    tanggal_lahir: formData.get("tanggal_lahir"),
    jenis_kelamin: formData.get("jenis_kelamin"),
    minat: formData.get("minat"),
  })

  if (!parse.success) {
    return { error: parse.error.errors.map((e) => e.message).join(", ") }
  }

  const file = parse.data.foto_profile as File
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadDir = path.join(process.cwd(), "public", "users")
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const ext = path.extname(file.name) || ".png"
  const fileName = `${uuidv4()}${ext}`
  const filePath = path.join(uploadDir, fileName)
  fs.writeFileSync(filePath, buffer)

  const relativePath = `/users/${fileName}`

  try {
    const member = await prisma.member.create({
      data: {
        user_id: parseInt(session.user.id!),
        sekolah_id: parseInt(parse.data.sekolah_id),
        nis: parse.data.nis,
        foto_profil: relativePath,
        bio: parse.data.bio,
        tanggal_lahir: parse.data.tanggal_lahir,
        jenis_kelamin: parse.data.jenis_kelamin,
        minat: parse.data.minat,
      },
    })

    return { success: true, member }
  } catch (error) {
    console.error("CreateMember error:", error)
    return { error: "Failed to create member" }
  }
}

export async function UpdateMember(_: unknown, formData: FormData, id:string) {
  const session = await auth()
  if (!session) {
    return { error: "Not Authorized" }
  }

  if (!id) return { error: "ID Member tidak ditemukan" }

  const parse = SchemaMember.safeParse({
    sekolah_id: formData.get("sekolah"),
    nis: formData.get("nis"),
    foto_profile: formData.get("foto_profile"),
    bio: formData.get("bio"),
    tanggal_lahir: formData.get("tanggal_lahir"),
    jenis_kelamin: formData.get("jenis_kelamin"),
    minat: formData.get("minat"),
  })

  if (!parse.success) {
    return { error: parse.error.errors.map((e) => e.message).join(", ") }
  }

  let relativePath: string | undefined = undefined

  if (parse.data.foto_profile instanceof File) {
    const file = parse.data.foto_profile
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), "public", "users")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const ext = path.extname(file.name) || ".png"
    const fileName = `${uuidv4()}${ext}`
    const filePath = path.join(uploadDir, fileName)
    fs.writeFileSync(filePath, buffer)

    relativePath = `/users/${fileName}`
  }

  try {
    const member = await prisma.member.update({
      where: { member_id : parseInt(id) },
      data: {
        sekolah_id: parseInt(parse.data.sekolah_id),
        nis: parse.data.nis,
        ...(relativePath && { foto_profil: relativePath }),
        bio: parse.data.bio,
        tanggal_lahir: parse.data.tanggal_lahir,
        jenis_kelamin: parse.data.jenis_kelamin,
        minat: parse.data.minat,
      },
    })

    return { success: true, member }
  } catch (error) {
    console.error("UpdateMember error:", error)
    return { error: "Failed to update member" }
  }
}

export async function GetExpMember(id : string) {
  try {
    const progress = await prisma.progresMember.aggregate({
      where:{
        member_id:parseInt(id)
      },
      _sum:{
        skor:true
      }
    })

    return progress._sum.skor
  } catch (error) {
    console.log(error)
    return 0;
  }
}

export async function GetDetailsProgressMember(id : string){
  try {

    const memberId = Number(id) 

    if (isNaN(memberId)) {
      return { error: "invalid member id" }
    }

    const progress = await prisma.progresMember.findMany({
      where:{
        member_id:memberId
      }
    })

    return {data:progress}
  } catch {
    return {error:"failed to find progress member"}
  }
}

export async function CreateProgress(_:unknown,data : ProgressData){
  const session = await auth()
  if (!session){
    return {error:"Not Authorized"}
  }

  let id
  try {
    const user = await prisma.member.findFirst({
      where:{
        user_id: parseInt(session.user.id!)
      }
    })

    id = user?.member_id
    if (!id) return { error: "User is not a member" };
  } catch (error) {
    console.log(error)
    return {error:"User is not a member"}
  }

  try {
    const completedAt = new Date(); 
    const duration = Math.floor(
      (completedAt.getTime() - data.startedAt.getTime()) / 1000
    );

    await prisma.progresMember.create({
      data: {
        member_id: id,
        content_id: data.contentId,
        content_type: data.contentType,
        skor: data.skor,
        completed_at: completedAt,
        duration: duration,
      },
    });

    const score = await GetExpMember(String(id))

   if (score !== null) {
      const level = Math.floor(Number(score) / 400);
      
      try {
        await prisma.member.update({
          where:{
            member_id:id
          },
          data:{
            level:level
          }
        })
      } catch {
        return {error:"terjadi kesalahan"}
      }
  }

  return {success:"Selamat",score:`${data.skor}`}
    
  } catch (error) {
    console.error("CreateProgress error:", error);
    return null;
  }
}


export async function GetLeaderboard(id: string, content_type: ContentType) {
  try {
    const progressList = await prisma.progresMember.findMany({
      where: {
        content_type,
        content_id: parseInt(id)
      },
      select: {
        member_id: true,
        skor: true,
        duration: true
      }
    });

    const leaderboard = progressList
      .map(p => ({
        member_id: p.member_id,
        skor: p.skor ?? 0,
        duration: p.duration ?? 1, 
        ratio: (p.skor ?? 0) / (p.duration ?? 1)
      }))
      .sort((a, b) => b.ratio - a.ratio);

    return leaderboard;
  } catch (error) {
    console.error(error);
    return [];
  }
}





