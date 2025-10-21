"use server";

import prisma from "@/lib/prisma";
import { StoryColumn } from "../data-table";
import { revalidatePath } from "next/cache";
import { saveScenesToDatabase, loadScenesFromDatabase, type SceneData } from "./database";

export async function GetStoriesForGuru(userId: number) {
  try {
    const stories = await prisma.ceritaInteraktif.findMany({
      where: {
        created_by: userId,
      },
      include: {
        KategoriCerita: {
          select: {
            NamaKategori: true,
          },
        },
        User: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const response: StoryColumn[] = stories.map((story) => {
      return {
        cerita_id: story.cerita_id,
        judul: story.judul,
        thumbnail: story.thumbnail,
        deskripsi: story.deskripsi,
        KategoriCerita: {
          NamaKategori: story.KategoriCerita.NamaKategori,
        },
        is_published: story.is_published,
        created_by: story.created_by!,
        xp_reward: story.xp_reward,
        created_at: story.created_at,
      };
    });

    return response;
  } catch (error) {
    console.error(error);
    return { error: "Gagal memuat cerita untuk guru" };
  }
}

export async function GetStoryById(id: string) {
  try {
    const Article = await prisma.ceritaInteraktif.findFirst({
      where: {
        cerita_id: Number.parseInt(id)
      },
      include: {
        KategoriCerita: {
          select: {
            NamaKategori: true,
          },
        },
        User: {
          select: {
            username: true,
          },
        },
      },
    });
    return Article;
  } catch (error) {
    console.error(error);
    return { error: error };
  }
}

export async function saveScenes(formData: FormData) {
  const scenesJson = formData.get("scenes") as string;
  const ceritaId = Number.parseInt(formData.get("cerita_id") as string);

  if (!ceritaId || isNaN(ceritaId)) {
    return { success: false, error: "Invalid story ID" };
  }

  try {
    const scenes: SceneData[] = JSON.parse(scenesJson); 
    const result = await saveScenesToDatabase(scenes, ceritaId);

    revalidatePath(`/${ceritaId}`);
    return result;
  } catch (error) {
    return { success: false, error: "Invalid scene data" }; 
  }
}

export async function loadScenes(formData: FormData) {
  const ceritaId = Number.parseInt(formData.get("cerita_id") as string);

  if (!ceritaId || isNaN(ceritaId)) {
    return { success: false, error: "Invalid story ID" };
  }

  const result = await loadScenesFromDatabase(ceritaId);
  revalidatePath(`/${ceritaId}`);
  return result;
}

export async function GetScenesByStoryId(id: string) {
  try {
    const scenes = await prisma.scene.findMany({
      where: {
        cerita_id: Number.parseInt(id),
      },
    });
    return scenes;
  } catch (error) {
    console.error(error);
    return { error: error };
  }
}

export async function GetCategories() {
  try {
    const categories = await prisma.kategoriCerita.findMany({
      select: {
        KategoriId: true,
        NamaKategori: true,
      },
    });
    return categories;
  } catch (error) {
    console.error(error);
    return { error: error };
  }
}