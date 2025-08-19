import prisma from "@/lib/prisma"


export async function getPuzzle(){
    try {
        const puzzles = await prisma.puzzle.findMany({})

        return puzzles
    } catch (error:unknown) {
        console.log(error)
        return {error:error}
    }
}

export async function getPuzzleById(id:string){
    try {
        const puzzle = await prisma.puzzle.findFirst({
            where:{
                puzzle_id:parseInt(id)
            }
        })

        return puzzle
    }catch(error){
        console.log(error)
        return {error:error}
    }
}