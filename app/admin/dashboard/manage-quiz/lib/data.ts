import prisma from "@/lib/prisma"

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

export async function getQuizById(id: string) {
  try {
    const quizId = parseInt(id);
    if (isNaN(quizId)) {
      return null;
    }

    const quiz = await prisma.kuis.findUnique({
      where: {
        kuis_id: quizId,
      },
    });

   return quiz
     } catch (error) {
         console.log(error)
         return error;
     }
}


export async function getCategoryQuiz() {
  try {

    const categories = await prisma.kategoriKuis.findMany({
      include: {

        User: true, 
      },
      orderBy: {

        created_at: 'desc',
      },
    });
     return categories
     } catch (error) {
         console.log(error)
         return error;
     }
}



export async function getCategoryQuizById(id: string) {
  try {
    const categoryId = parseInt(id);
    const category = await prisma.kategoriKuis.findUnique({
      where: {
        kategori_id: categoryId,
      },
    });

    return category
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
             },
      include: { 
        PilihanKuis: true,
      }, 
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