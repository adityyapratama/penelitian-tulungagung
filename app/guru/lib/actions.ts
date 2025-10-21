'use server'

import { auth } from "@/auth"
import { SchemaGroup, SchemaGroupContent, SchemaGuru } from "@/lib/schema"
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer"




export async function CreateGroup(_: unknown, formData: FormData) {
  const session = await auth();
  if (!session) {
    return { error: "Not Authorized" };
  }
  const guru =  await GetGuruById(session.user.id!)
  if (guru == null || "error" in guru){
    return { error: "lengkapi data guru terlebih dahulu" };
  }

  const parse = SchemaGroup.safeParse({
    group_name: formData.get("group_name"),
    group_thumbnail: formData.get("thumbnail"),
  });

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: "Validasi gagal, silakan cek input Anda.",
    };
  }

  const file = parse.data.group_thumbnail;

  if (!(file instanceof File)) return { error: "Thumbnail invalid" };

  // Validasi format file
  const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
  const fileExt = path.extname(file.name).toLowerCase();
  if (!allowedExt.includes(fileExt)) {
    return { error: "Format file tidak diizinkan" };
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "group");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const fileName = `${uuidv4()}${fileExt}`;
  const filePath = path.join(uploadDir, fileName);
  fs.writeFileSync(filePath, buffer);

  const relativePath = `/group/${fileName}`;

  try {
    await prisma.group.create({
      data: {
        group_name: parse.data.group_name,
        group_thumbnail: relativePath,
        created_by: guru.guru_id!,
      },
    });

    revalidatePath("/groups");
    return { success: "Group berhasil dibuat" };
  } catch (error) {
    // Hapus file jika database gagal
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error(error);
    return { error: "Terjadi kesalahan saat membuat group" };
  }
}

export async function UpdateGroup(_: unknown, formData: FormData) {
  const session = await auth();
  if (!session) {
    return { error: "Not Authorized" };
  }

  const groupId = formData.get("group_id")?.toString();
  if (!groupId) {
    return { error: "Group ID diperlukan" };
  }

  // Cek apakah group ada dan user adalah creator
  const existingGroup = await prisma.group.findUnique({
    where: { group_id: groupId },
  });

  if (!existingGroup) {
    return { error: "Group tidak ditemukan" };
  }

  if (existingGroup.created_by !== Number(session.user.id)) {
    return { error: "Anda tidak memiliki akses untuk mengubah group ini" };
  }

  const parse = SchemaGroup.safeParse({
    group_name: formData.get("group_name"),
    group_thumbnail: formData.get("thumbnail"),
  });

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: "Validasi gagal, silakan cek input Anda.",
    };
  }

  let relativePath = existingGroup.group_thumbnail;
  const file = parse.data.group_thumbnail;

  // Jika ada file baru
  if (file instanceof File && file.size > 0) {
    const allowedExt = [".jpg", ".jpeg", ".png", ".webp"];
    const fileExt = path.extname(file.name).toLowerCase();
    
    if (!allowedExt.includes(fileExt)) {
      return { error: "Format file tidak diizinkan" };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "group");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    relativePath = `/group/${fileName}`;

    // Hapus file lama
    const oldFilePath = path.join(process.cwd(), "public", existingGroup.group_thumbnail!);
    if (fs.existsSync(oldFilePath)) {
      fs.unlinkSync(oldFilePath);
    }
  }

  try {
    await prisma.group.update({
      where: { group_id: groupId },
      data: {
        group_name: parse.data.group_name,
        group_thumbnail: relativePath,
      },
    });

    revalidatePath("/groups");
    return { success: "Group berhasil diperbarui" };
  } catch (error) {
    console.error(error);
    return { error: "Terjadi kesalahan saat memperbarui group" };
  }
}

export async function CreateGroupContent(_: unknown, request: Request) {
  const body = await request.json();

  const parse = SchemaGroupContent.safeParse(body);
  if (!parse.success) {
    return { error: parse.error.errors[0].message };
  }

  const { group_id, contents } = parse.data;

  try {
    await prisma.groupContent.createMany({
      data: contents.map((item) => ({
        group_id,
        content_type: item.content_type,
        content_id: item.content_id,
      })),
      skipDuplicates: true,
    });

    return { success: "Berhasil menambahkan group content" };
  } catch (error) {
    console.error(error);
    return { error: "Terjadi kesalahan saat membuat group content" };
  }
}

export async function DeleteGroupContent(_: unknown, request: Request) {
  const body = await request.json();

  const parse = SchemaGroupContent.safeParse(body);
  if (!parse.success) {
    return { error: parse.error.errors[0].message };
  }

  const { group_id, contents } = parse.data;

  try {
    await prisma.$transaction(async (tx) => {
      for (const item of contents) {
        await tx.groupContent.deleteMany({
          where: {
            group_id,
            content_type: item.content_type,
            content_id: item.content_id,
          },
        });
      }
    });

    return { success: "Berhasil menghapus group content" };
  } catch (error) {
    console.error(error);
    return { error: "Terjadi kesalahan saat menghapus group content" };
  }
}

export async function GroupPerformance(id:string){
  const session = await auth()
  
  if (!session){
    return {error:"Not Authorized"}
  }

  try {
    const data = await prisma.$queryRaw`SELECT u.username,SUM(p.skor) as scores, u.last_login from Member m
                                        INNER JOIN User u ON m.user_id = u.user_id
                                        LEFT JOIN ProgresMember p ON m.member_id = p.member_id
                                        WHERE p.group_id = ${id}
                                        GROUP BY u.username;`
    return data;  
  } catch {
    return {error:"terjadi kesalahan saat mengambil member"}
  }
}

export async function CreateGuru(_:unknown,formData:FormData) {
  const session = await auth()
  
  if (!session){
    return {error:"Not Authorized"}
  }

  const parse = SchemaGuru.safeParse({
    user_id : formData.get("user_id"),
    sekolah_id : formData.get("sekolah_id"),
    nip : formData.get("nip"),
    bidang_ajar : formData.get("bidang_ajar")
  })

  if(!parse.success){
    return { error: parse.error.errors[0].message };
  }

  try {
    await prisma.guru.create({
      data: {
        user_id     : Number(parse.data.user_id),
        sekolah_id  : Number(parse.data.sekolah_id),
        nip         :parse.data.nip,
        bidang_ajar : parse.data.bidang_ajar
      }
    })
  } catch {
    return {error:"terjadi kesalahan saat membuat guru"}
  }
}

export async function GetGuruById(id:string) {
  try {
    const data = prisma.guru.findFirst({
      where:{
        user_id:Number(id)
      }
    })

    return data
  } catch {
    return {error : "User bukan seorang guru"}
  }
}

export async function InviteByEmail(email:string,id:string){
  // const group = await prisma.group.findFirst({
  //   where:{
  //     group_id:id
  //   }
  // })

  // if (!group) {
  //   return {error:"invalid id"}
  // }



  const inviteLink = `http://discord.com/invite/${id}`

  
  const transporter = nodemailer.createTransport({
    host:"smtp.gmail.com",
    port: 465,
    secure: true,
    auth:{
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  });

  const htmlContent = `
  <div style="font-family: Arial, sans-serif; background:#f5f5f5; padding:20px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:10px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
      <div style="background:#4CAF50; color:white; padding:15px 25px;">
        <h2 style="margin:0;">Undangan Bergabung ke Grup</h2>
      </div>
      <div style="padding:25px;">
        <p>Halo 👋,</p>
        <p>Kamu diundang untuk bergabung ke grup <b>${id}</b>.</p>
        <p>Klik tombol di bawah ini untuk menerima undangan:</p>
        <a href="${inviteLink}"
          style="display:inline-block; background:#4CAF50; color:white; padding:10px 20px; border-radius:6px;
                 text-decoration:none; font-weight:bold; margin-top:10px;">
          Bergabung ke Grup
        </a>
        <p style="margin-top:20px; font-size:13px; color:#777;">
          Jika kamu tidak mengenal grup ini, abaikan saja email ini.
        </p>
      </div>
    </div>
  </div>
  `;
  
  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to : email,
    subject : `Undangan Bergabung ke Grup ${id}`,
    html: htmlContent,
  });

  console.log("executed")
}


