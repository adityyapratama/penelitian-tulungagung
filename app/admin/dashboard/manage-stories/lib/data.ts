"use server"

import prisma from "@/lib/prisma"
import { StoryColumn } from "../columns"
import { saveScenesToDatabase, loadScenesFromDatabase, type SceneData } from "./database"
import { revalidatePath } from "next/cache"
import { IScene } from "@/types"

export async function GetStories() {
    try {
        const stories = await prisma.ceritaInteraktif.findMany({})

        const response: StoryColumn[] = stories.map((stories) => {
            return {
                cerita_id : stories.cerita_id,
                judul: stories.judul,
                thumbnail: stories.thumbnail,
                deskripsi: stories.deskripsi,
                xp_reward: stories.xp_reward,
                created_at: stories.created_at
            }
        })

        return response
    } catch (error) {
        console.log(error)
        return {error:error}
    }
}

export async function GetStoryById(id:string){
    try {
        const story = await prisma.ceritaInteraktif.findFirst({
            where:{
                cerita_id:parseInt(id)
            }
        })

        return story
    } catch (error) {
        console.log(error)
        return {error:error}
    }
}

export async function GetScenesByStoryId(id: string): Promise<IScene[] | { error: string }> {
  try {
    const scenes = await prisma.scene.findMany({
      where: { cerita_id: parseInt(id) },
    })
    return scenes
  } catch (error) {
    console.error(error)
    return { error: String(error) }
  }
}





export async function saveScenes(formData: FormData) {
  const scenesJson = formData.get("scenes") as string
  const ceritaId = Number.parseInt(formData.get("cerita_id") as string)

  if (!ceritaId || isNaN(ceritaId)) {
    return { success: false, error: "Invalid story ID" }
  }

  try {
    const scenes: SceneData[] = JSON.parse(scenesJson)
    const result = await saveScenesToDatabase(scenes, ceritaId)

    revalidatePath(`/${ceritaId}`)
    return result
  } catch (error) {
    return { success: false, error: "Invalid scene data" }
  }
}

export async function loadScenes(formData: FormData) {
  const ceritaId = Number.parseInt(formData.get("cerita_id") as string)

  if (!ceritaId || isNaN(ceritaId)) {
    return { success: false, error: "Invalid story ID" }
  }

  const result = await loadScenesFromDatabase(ceritaId)
  revalidatePath(`/${ceritaId}`)
  return result
}