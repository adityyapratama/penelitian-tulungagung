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

// export async function getCategoryQuiz(){
//     try {
//         const categories = await prisma.kuis.findMany({
//             include:{
//                 User:true
//             }
//         })

//         return categories
//     } catch (error) {
//         console.log(error)
//         return error;
//     }
// }


export async function getCategoryQuiz() {
  try {
    // FIX: Mengambil data dari prisma.kategoriKuis, bukan prisma.kuis
    const categories = await prisma.kategoriKuis.findMany({
      include: {
        // Sertakan data User yang berelasi melalui 'created_by'
        User: true, 
      },
      orderBy: {
        // Urutkan berdasarkan yang terbaru
        created_at: 'desc',
      },
    });

    return categories;
  } catch (error) {
    console.error("Failed to fetch quiz categories:", error);
    // Di Server Component, lebih baik melempar error agar bisa ditangani oleh error boundary
    throw new Error("Gagal mengambil data kategori kuis.");
  }
}

// for update categories
export async function getCategoryQuizById(id: string) {
  try {
    const categoryId = parseInt(id);
    // Validasi sederhana untuk memastikan ID adalah angka
    if (isNaN(categoryId)) {
      return null;
    }

    const category = await prisma.kategoriKuis.findUnique({
      where: {
        kategori_id: categoryId,
      },
    });

    return category;
  } catch (error) {
    console.error("Gagal mengambil kategori berdasarkan ID:", error);
    return null; // Kembalikan null jika terjadi error
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