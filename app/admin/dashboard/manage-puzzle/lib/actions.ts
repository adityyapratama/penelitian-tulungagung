import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { SchemaPuzzle } from "@/lib/schema"
import fs from 'fs'
import path from 'path'

export async function createPuzzle(_:unknown,formData:FormData) {
    const session = await auth()
    
    if(!session){
        return {error: "Not Authorized"}
    }

    const parse = SchemaPuzzle.safeParse({
        judul : formData.get("judul"),
        gambar : formData.get("gambar"),
        kategori : formData.get("kategori"),
        xp_reward : formData.get("xp_reward")
    })

    if (!parse.success) {
    return { error: parse.error.message };
    }

    const file = parse.data.gambar as File;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "story");
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const filePath = path.join(uploadDir, file.name);
    fs.writeFileSync(filePath, buffer);
    
    const relativePath = path.join("/puzzle", file.name);
    
    try {
        await prisma.puzzle.create({
            data:{
                judul:parse.data.judul,
                gambar: relativePath,
                kategori:parse.data.kategori,
                xp_reward:parse.data.xp_reward,
                created_by: parseInt(session.user.id!),
            }
        })

        return {success:true}
    } catch (error) {
        console.log(error)
        return error
    }
}

export async function UpdatePuzzle(id: string, formData: FormData) {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  const parse = SchemaPuzzle.safeParse({
    judul: formData.get("judul"),
    gambar: formData.get("gambar"),
    kategori: formData.get("kategori"),
    xp_reward: formData.get("xp_reward"),
  });

  if (!parse.success) {
    return { error: parse.error.message };
  }

  try {
    let relativePath: string | undefined;

    if (parse.data.gambar instanceof File) {

      const old = await prisma.puzzle.findUnique({
        where: { puzzle_id: parseInt(id) },
        select: { gambar: true },
      });

      if (old?.gambar) {
        const oldPath = path.join(process.cwd(), "public", old.gambar);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }

      const file = parse.data.gambar as File;
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadDir = path.join(process.cwd(), "public", "puzzle");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePath = path.join(uploadDir, file.name);
      fs.writeFileSync(filePath, buffer);

      relativePath = path.join("/puzzle", file.name);
    }

    await prisma.puzzle.update({
      where: { puzzle_id: parseInt(id) },
      data: {
        judul: parse.data.judul,
        kategori: parse.data.kategori,
        xp_reward: parse.data.xp_reward,
        ...(relativePath && { gambar: relativePath }),
      },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Gagal update puzzle" };
  }
}

export async function DeletePuzzle(id: string) {
  const session = await auth();
  if (!session) return { error: "Not Authorized" };

  try {
    const old = await prisma.puzzle.findUnique({
      where: { puzzle_id: parseInt(id) },
      select: { gambar: true },
    });

    if (old?.gambar) {
      const oldPath = path.join(process.cwd(), "public", old.gambar);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }


    await prisma.puzzle.delete({
      where: { puzzle_id: parseInt(id) },
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Gagal menghapus puzzle" };
  }
}
