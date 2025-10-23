"use server";

import { auth } from "@/auth";
import { SchemaGroup, SchemaGroupContent, SchemaGuru } from "@/lib/schema";
import fs from "fs";
import path from "path";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";
import nodemailer from "nodemailer";
import z from "zod";
import { Prisma } from "@prisma/client";
import { Guru } from "@/lib/generated/prisma";

export type SimpleActionResult = {
  success?: string;
  error?: string;
};

export type FlattenedErrors = {
  group_name?: string[];
  group_thumbnail?: string[];
};

export type GroupActionResult = {
  success?: string;
  error?: string;
  errors?: FlattenedErrors;
  groupId?: string;
};

export type ContentActionResult = {
  success?: string;
  error?: string;
};

type DeleteContentPayload = {
  group_id: string;
  contents: ContentItemPayload[];
};

type ContentItemPayload = {
  content_type: "kuis" | "cerita" | "puzzle";
  content_id: number;
};
type CreateContentPayload = { groupId: string; contents: ContentItemPayload[] };

async function getGuruId(): Promise<number | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  const userId = parseInt(session.user.id);
  try {
    const guru = await prisma.guru.findUnique({
      where: { user_id: userId },
      select: { guru_id: true },
    });
    return guru?.guru_id ?? null;
  } catch (error) {
    console.error("Error fetching guru_id:", error);
    return null;
  }
}

export async function CreateGroup(_: unknown, formData: FormData) {
  const session = await auth();
  if (!session) {
    return { error: "Not Authorized" };
  }
  const guru = await GetGuruById(session.user.id!);
  if (guru == null || "error" in guru) {
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
        created_at: new Date(),
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

  const guru = await GetGuruById(session.user.id!);
  if (guru == null || "error" in guru) {
    return { error: "lengkapi data guru terlebih dahulu" };
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

  if (existingGroup.created_by !== guru.guru_id!) {
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
    const oldFilePath = path.join(
      process.cwd(),
      "public",
      existingGroup.group_thumbnail!
    );
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
        updated_at: new Date(),
      },
    });

    revalidatePath("/guru/dashboard/manage-group");
    return { success: "Group berhasil diperbarui" };
  } catch (error) {
    console.error(error);
    return { error: "Terjadi kesalahan saat memperbarui group" };
  }
}

export async function CreateGroupContent(
  payload: CreateContentPayload
): Promise<ContentActionResult> {
  const guruId = await getGuruId();
  if (!guruId)
    return { error: "Tidak terautentikasi atau akun guru tidak ditemukan." };

  const { groupId, contents } = payload;
  if (!groupId || !Array.isArray(contents) || contents.length === 0) {
    return { error: "Data input tidak valid." };
  }

  const schema = z.object({
    groupId: z.string().uuid(),
    contents: z.array(SchemaGroupContent.shape.contents.element).min(1),
  });
  const parse = schema.safeParse({ groupId, contents });
  if (!parse.success) return { error: parse.error.errors[0].message };

  try {
    const group = await prisma.group.findFirst({
      where: { group_id: groupId, created_by: guruId },
      select: { group_id: true },
    });
    if (!group)
      return { error: "Grup tidak ditemukan atau Anda tidak berhak." };

    await prisma.groupContent.createMany({
      data: contents.map((item) => ({
        group_id: groupId,
        content_type: item.content_type,
        content_id: item.content_id,
      })),
      skipDuplicates: true,
    });

    revalidatePath(`/guru/dashboard/manage-group/${groupId}`);
    return { success: `${contents.length} konten berhasil ditambahkan.` };
  } catch (error) {
    console.error(error);
    return { error: "Terjadi kesalahan saat menambahkan konten." };
  }
}

export async function DeleteGroupContent(
  payload: DeleteContentPayload
): Promise<ContentActionResult> {
  const guruId = await getGuruId();
  if (!guruId)
    return { error: "Tidak terautentikasi atau akun guru tidak ditemukan." };

  const { group_id, contents } = payload;
  if (!group_id || !Array.isArray(contents) || contents.length === 0) {
    return { error: "Data input tidak valid." };
  }

  const parse = SchemaGroupContent.safeParse({ group_id, contents });
  if (!parse.success) {
    return { error: parse.error.errors[0].message };
  }

  try {
    const group = await prisma.group.findFirst({
      where: { group_id: group_id, created_by: guruId },
      select: { group_id: true },
    });
    if (!group) return { error: "Grup tidak ditemukan." };

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

    revalidatePath(`/guru/dashboard/manage-group/${group_id}`);
    return { success: "Konten berhasil dihapus." };
  } catch (error) {
    console.error(error);
    return { error: "Terjadi kesalahan saat menghapus group content" };
  }
}

export async function GroupPerformance(id: string) {
  const session = await auth();

  if (!session) {
    return { error: "Not Authorized" };
  }

  try {
    type RawPerformanceData = {
      username: string;
      scores: unknown; 
      last_login: Date | null;
    }

    const data =
      await prisma.$queryRaw<RawPerformanceData[]>`SELECT u.username,SUM(p.skor) as scores, u.last_login from Member m
                                        INNER JOIN User u ON m.user_id = u.user_id
                                        LEFT JOIN ProgresMember p ON m.member_id = p.member_id
                                        WHERE p.group_id = ${id}
                                        GROUP BY u.username;`;
    const cleanedData = data.map(item => ({
      username: item.username,
      scores: item.scores ? Number(item.scores) : 0,
      last_login: item.last_login ? item.last_login.toISOString() : null
    }));

    return cleanedData;
  } catch {
    return { error: "terjadi kesalahan saat mengambil member" };
  }
}

export async function CreateGuru(_: unknown, formData: FormData) {
  const session = await auth();

  if (!session) {
    return { error: "Not Authorized" };
  }

  const parse = SchemaGuru.safeParse({
    user_id: formData.get("user_id"),
    sekolah_id: formData.get("sekolah_id"),
    nip: formData.get("nip"),
    bidang_ajar: formData.get("bidang_ajar"),
  });

  if (!parse.success) {
    return {
      error: `Input tidak valid: ${
        parse.error.errors[0]?.message || "Periksa isian Anda."
      }`,
    };
  }

  try {
    await prisma.guru.create({
      data: {
        user_id: Number(parse.data.user_id),
        sekolah_id: Number(parse.data.sekolah_id),
        nip: parse.data.nip,
        bidang_ajar: parse.data.bidang_ajar,
      },
    });
    revalidatePath("/guru/dashboard");
    return { success: "Data guru berhasil disimpan!" };
  } catch (e: unknown) {
    console.error("CreateGuru Error:", e);
    if (e instanceof Prisma.PrismaClientKnownRequestError) { 
      if (e.code === "P2002") {
        const target = e.meta?.target as string[];
        if (target && target.includes("nip"))
          return { error: "NIP sudah terdaftar." };
        if (target && target.includes("user_id"))
          return { error: "User ini sudah terdaftar sebagai guru." };
        return { error: "Data unik sudah ada (NIP atau User ID)." };
      }
    }
    return { error: "Terjadi kesalahan saat menyimpan data guru." };
  }
}

export async function GetGuruById(
  id: string
): Promise<Guru | null | { error: string }> {
  if (!id || isNaN(Number(id))) {
    return { error: "ID User tidak valid" };
  }
  try {
    const data = await prisma.guru.findUnique({
      where: {
        user_id: Number(id),
      },
    });
    return data ?? null;
  } catch (e: unknown) {
    console.error("GetGuruById Error:", e);
    return { error: "Terjadi kesalahan saat mencari data guru." };
  }
}

export async function InviteByEmail(
  prevState: SimpleActionResult | null,
  formData: FormData
): Promise<SimpleActionResult> {
  const guruId = await getGuruId();
  const session = await auth();

  if (!guruId)
    return { error: "Tidak terautentikasi atau akun guru tidak ditemukan." };

  if (!session) {
    return { error: "Not Authorized" };
  }
  const inviterName = session.user.name || "Guru Anda";

  const email = formData.get("email") as string | null;
  const groupId = formData.get("groupId") as string | null;
  const groupName = formData.get("groupName") as string | null;

  if (!email || !groupId) {
    return { error: "Email dan Group ID diperlukan." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Format email tidak valid." };
  }

  try {
    const group = await prisma.group.findFirst({
      where: { group_id: groupId, created_by: guruId },
      select: { group_name: true },
    });
    if (!group)
      return { error: "Grup tidak ditemukan atau Anda tidak berhak." };

    const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/invite/${groupId}`;
    const groupDisplayName = group.group_name || groupName || "Grup Anda";

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlContent = `
  <!DOCTYPE html>
  <html lang="id">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Undangan Bergabung ke Grup</title>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
      body {
        margin: 0;
        padding: 0;
        background-color: #f3f4f6; /* Tailwind gray-100 */
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      }
      table {
        border-collapse: collapse;
      }
      .container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-radius: 12px;
        overflow: hidden;
        border: 1px solid #e5e7eb; /* Tailwind gray-200 */
        box-shadow: 0 4px 12px rgba(0,0,0,0.03);
      }
      .header {
        background-color: #2563EB; /* Tailwind blue-600 */
        padding: 24px 32px;
        text-align: center;
      }
      .header h1 {
        color: #ffffff;
        margin: 0;
        font-size: 28px;
        font-weight: 700;
        letter-spacing: -0.5px;
      }
      .content {
        padding: 32px 40px;
        color: #1f2937; /* Tailwind gray-800 */
        font-size: 16px;
        line-height: 1.6;
      }
      .content h2 {
        margin: 0 0 20px 0;
        color: #111827; /* Tailwind gray-900 */
        font-size: 22px;
        font-weight: 600;
      }
      .content p {
        margin: 0 0 20px 0;
      }
      .button-container {
        text-align: center;
        padding: 10px 0 20px 0;
      }
      .button {
        display: inline-block;
        background-color: #2563EB; /* Tailwind blue-600 */
        color: #ffffff;
        padding: 14px 28px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        font-size: 16px;
        border: 0;
      }
      .fallback-link {
        font-size: 12px;
        color: #64748B; /* Tailwind slate-500 */
        word-break: break-all;
        line-height: 1.5;
      }
      .disclaimer {
        font-size: 14px;
        color: #64748B; /* Tailwind slate-500 */
      }
      .footer {
        background-color: #f8fafc; /* Tailwind slate-50 */
        padding: 32px 40px;
        text-align: center;
        border-top: 1px solid #f1f5f9; /* Tailwind slate-100 */
      }
      .footer p {
        margin: 0;
        font-size: 12px;
        color: #64748B; /* Tailwind slate-500 */
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Inter', Arial, sans-serif;">
    <span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
      Anda diundang untuk bergabung ke grup ${groupDisplayName}!
    </span>
  
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td style="padding: 20px 0;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" class="container" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.03); border-collapse: separate;">
            
            <tr>
              <td class="header" style="background-color: #2563EB; padding: 24px 32px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; font-family: 'Inter', Arial, sans-serif;">
                  Pusaka Tulungagung
                </h1>
              </td>
            </tr>

            <tr>
              <td class="content" style="padding: 32px 40px; color: #1f2937; font-size: 16px; line-height: 1.6; font-family: 'Inter', Arial, sans-serif;">
                <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 22px; font-weight: 600; font-family: 'Inter', Arial, sans-serif;">
                  Anda Diundang Bergabung! 👋
                </h2>
                <p style="margin: 0 0 20px 0;">
                  Halo,
                </p>
                <p style="margin: 0 0 20px 0;">
                  Anda telah diundang oleh <strong>${inviterName}</strong> (Guru Anda) untuk bergabung ke grup <strong>${groupDisplayName}</strong> di aplikasi Pusaka Tulungagung.
                </p>
                
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td class="button-container" style="text-align: center; padding: 10px 0 20px 0;">
                      <a href="${inviteLink}" target="_blank" class="button" style="display: inline-block; background-color: #2563EB; color: #ffffff; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 16px; border: 0; font-family: 'Inter', Arial, sans-serif;">
                        Terima Undangan & Bergabung
                      </a>
                    </td>
                  </tr>
                </table>
                
                <p class="fallback-link" style="margin: 0 0 20px 0; font-size: 12px; color: #64748B; word-break: break-all; line-height: 1.5; font-family: 'Inter', Arial, sans-serif;">
                  Jika tombol tidak berfungsi, salin dan tempel tautan ini di browser Anda:
                  <br>
                  <a href="${inviteLink}" target="_blank" style="color: #2563EB; text-decoration: underline;">${inviteLink}</a>
                </p>
                
                <p class="disclaimer" style="margin: 0; font-size: 14px; color: #64748B; font-family: 'Inter', Arial, sans-serif;">
                  Jika Anda tidak mengharapkan undangan ini, silakan abaikan email ini.
                </p>
              </td>
            </tr>
            
            <tr>
              <td class="footer" style="background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #f1f5f9;">
                <p style="margin: 0; font-size: 12px; color: #64748B; font-family: 'Inter', Arial, sans-serif;">
                  &copy; 2025 Pusaka Tulungagung. Semua hak cipta dilindungi.
                </p>
              </td>
            </tr>
            
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: `Undangan Bergabung ke Grup ${groupDisplayName}`,
      html: htmlContent,
    });

    return { success: `Undangan berhasil dikirim ke ${email}.` };
  } catch (error) {
    console.log(error);
    return { error: "Terjadi kesalahan pada server saat mengirim undangan." };
  }
}
