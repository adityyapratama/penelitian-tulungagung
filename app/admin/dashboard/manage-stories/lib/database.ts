import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

export interface SceneData {
  scene_key: string
  scene_text: string
  scene_choices: Array<{ text: string; next: string }>
  is_ending: boolean
  ending_point?: number
  ending_type?: string
  scene_image?: string
}

export async function saveScenesToDatabase(scenes: SceneData[], cerita_id: number) {
  try {
    // Delete existing scenes for this story
    await prisma.Scene.deleteMany({
      where: { cerita_id },
    })

    // Insert new scenes
    const scenePromises = scenes.map((scene, index) =>
      prisma.Scene.create({
        data: {
          cerita_id,
          scene_key: scene.scene_key,
          scene_text: scene.scene_text,
          scene_choices: scene.scene_choices,
          is_ending: scene.is_ending,
          ending_point: scene.ending_point || 0,
          ending_type: scene.ending_type,
          scene_image: scene.scene_image,
          urutan: index + 1,
        },
      }),
    )

    await Promise.all(scenePromises)
    return { success: true }
  } catch (error) {
    console.error("Database save error:", error)
    return { success: false, error: "Failed to save scenes" }
  }
}

export async function loadScenesFromDatabase(cerita_id: number) {
  try {
    const scenes = await prisma.Scene.findMany({
      where: { cerita_id },
      orderBy: { urutan: "asc" },
    })

    return {
      success: true,
      scenes: scenes.map((scene) => ({
        scene_key: scene.scene_key,
        scene_text: scene.scene_text,
        scene_choices: (scene.scene_choices as Array<{ text: string; next: string }>) || [],
        is_ending: scene.is_ending,
        ending_point: scene.ending_point,
        ending_type: scene.ending_type,
        scene_image: scene.scene_image,
      })),
    }
  } catch (error) {
    console.error("Database load error:", error)
    return { success: false, error: "Failed to load scenes" }
  }
}
