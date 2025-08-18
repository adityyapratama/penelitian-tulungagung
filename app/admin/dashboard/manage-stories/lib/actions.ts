import prisma from "@/lib/prisma"
import { SchemaStory } from "@/lib/schema"
import fs from 'fs'
import path from 'path'
import { auth } from "@/auth"

export async function createStory(_: unknown, formData: FormData) {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  const parse = SchemaStory.safeParse({
    judul: formData.get("judul"),
    thumbnail: formData.get("thumbnail"),
    deskripsi: formData.get("deskripsi"),
    xp_reward: Number(formData.get("xp_reward")), // convert string → number
  });

  if (!parse.success) {
    return { error: parse.error.message };
  }

  const file = parse.data.thumbnail as File;
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadDir = path.join(process.cwd(), "public", "story");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, file.name);
  fs.writeFileSync(filePath, buffer);

  const relativePath = path.join("/story", file.name);

  try {
    const newStory = await prisma.ceritaInteraktif.create({
      data: {
        judul: parse.data.judul,
        thumbnail: relativePath, // simpan relative path
        deskripsi: parse.data.deskripsi,
        xp_reward: parse.data.xp_reward,
        created_by: parseInt(session.user.id!),
      },
    });

    return { success: true, data: newStory };
  } catch (error: any) {
    console.error("createStory Error:", error);
    return { error: error.message || "Something went wrong" };
  }
}
