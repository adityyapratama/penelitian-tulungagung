import prisma from "@/lib/prisma"
import { StoryColumn } from "../columns"

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

        return stories
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

export async function GetScenesByStoryId(id:string){
    try {
        const scenes = await prisma.scene.findMany({
            where:{
                cerita_id:parseInt(id)
            }
        })
        return scenes
    } catch (error) {
        console.log(error)
        return {error:error}
    }
}