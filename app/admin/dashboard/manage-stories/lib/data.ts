import prisma from "@/lib/prisma"

export async function GetStories() {
    try {
        const stories = await prisma.ceritaInteraktif.findMany({})

        return stories
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