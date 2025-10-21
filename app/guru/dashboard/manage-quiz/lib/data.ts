'use server'

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

// Helper untuk mengambil userId
async function getUserId(): Promise<number | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return parseInt(session.user.id);
}

export async function getQuizzes() {
  const userId = await getUserId();
  if (!userId) return { error: "Not Authorized" };

  try {
    const quizzes = await prisma.kuis.findMany({
      where: {
        created_by: userId // FILTER KEPEMILIKAN
      },
      include: {
        KategoriKuis: true,
        User: true, // Ini akan selalu user saat ini
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return quizzes;
  } catch (error) {
    console.log(error);
    return { error: error };
  }
}

export async function getQuizById(id: string) {
  const userId = await getUserId();
  if (!userId) return { error: "Not Authorized" };

  try {
    const quizId = parseInt(id);
    if (isNaN(quizId)) return { error: "Invalid quiz ID" };

    const quiz = await prisma.kuis.findFirst({
      where: {
        kuis_id: quizId,
        created_by: userId // FILTER KEPEMILIKAN
      },
      include: {
        KategoriKuis: true // Tambahkan ini jika diperlukan di form edit
      }
    });

    if (!quiz) {
      return { error: "Quiz not found or not authorized" };
    }
    return quiz;
  } catch (error) {
    console.log("getQuizById error:", error);
    return { error: "Failed to fetch quiz" };
  }
}

// Kategori bersifat global, tidak perlu filter user
export async function getCategoryQuiz() {
  try {
    const categories = await prisma.kategoriKuis.findMany({
      include: {
        User: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return categories;
  } catch (error) {
    console.log(error);
    return { error: error };
  }
}

// Kategori bersifat global
export async function getCategoryQuizById(id: string) {
  try {
    const categoryId = parseInt(id);
    const category = await prisma.kategoriKuis.findUnique({
      where: {
        kategori_id: categoryId,
      },
    });
    return category;
  } catch (error) {
    console.log(error);
    return { error: error };
  }
}

export async function getQuizQuestionByQuizId(id: string) {
  const userId = await getUserId();
  if (!userId) return { error: "Not Authorized" };
  
  try {
    const quizId = parseInt(id);
    if (isNaN(quizId)) return { error: "Invalid quiz ID" };

    // CEK KEPEMILIKAN KUIS
    const quiz = await prisma.kuis.findFirst({
        where: { kuis_id: quizId, created_by: userId }
    });
    if (!quiz) return { error: "Quiz not found or not authorized" };

    // Jika lolos, ambil pertanyaan
    const questions = await prisma.pertanyaanKuis.findMany({
      where: {
        kuis_id: quizId,
      },
      include: {
        PilihanKuis: true,
      },
      orderBy: {
        urutan: "asc",
      },
    });

    return questions; // Bisa jadi array kosong, itu valid
  } catch (error) {
    console.log("getQuizQuestionByQuizId error:", error);
    return { error: "Failed to fetch questions" };
  }
}

export async function getQuestionById(id: string) {
  const userId = await getUserId();
  if (!userId) return { error: "Not Authorized" };

  try {
    const pertanyaanId = parseInt(id);
    if (isNaN(pertanyaanId)) return { error: "Invalid question ID" };

    const question = await prisma.pertanyaanKuis.findUnique({
      where: {
        pertanyaan_id: pertanyaanId,
      },
      include: {
        PilihanKuis: true,
        Kuis: true, // Ambil data kuis untuk cek kepemilikan
      },
    });

    // CEK KEPEMILIKAN
    if (!question || question.Kuis?.created_by !== userId) {
        return { error: "Question not found or not authorized" };
    }

    return question;
  } catch (error) {
    console.log(error);
    return { error: error };
  }
}