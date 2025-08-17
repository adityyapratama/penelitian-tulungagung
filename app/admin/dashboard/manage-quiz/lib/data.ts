import prisma from "@/lib/prisma"
import { number } from "zod"

export async function getQuizzes() {
    try {
        const quizzes = await prisma.kuis.findMany({
            include:{
                KategoriKuis:true,
                User:true
            }
        })

        return quizzes
    } catch (error) {
        console.log(error)
        return {error:error}
    }
}

export async function getCategoryQuiz(){
    try {
        const categories = await prisma.kuis.findMany({
            include:{
                User:true
            }
        })

        return categories
    } catch (error) {
        console.log(error)
        return error;
    }
}

export async function getQuizQuestionByQuizId(id:string){
    try {
        const questions = await prisma.pertanyaanKuis.findMany({
            where:{
                kuis_id:parseInt(id)
            }
        })
        return questions;
    } catch (error) {
        console.log(error)
        return {error:error}
    }
}

export async function getQuestionById(id:string){
    try {
        const questions = await prisma.pertanyaanKuis.findFirst({
            where:{
                kuis_id:parseInt(id)
            },
            include:{
                PilihanKuis:true
            }
        })
        return questions;
    } catch (error) {
        console.log(error)
        return {error:error}
    }
}