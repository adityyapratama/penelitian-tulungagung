import {
  getQuizById,
  getQuizQuestionByQuizId,
} from "@/app/admin/dashboard/manage-quiz/lib/data";
import { QuizClientComponent } from "@/app/(member)/(protected)/games/quiz/[id]/_components/QuizClientComponent";

type PageProps = {
  params: { id: string };
};

export default async function QuizDetailPage({ params }: PageProps) {
  const quizDetails = await getQuizById(params.id);
  const questions = await getQuizQuestionByQuizId(params.id);

  // ✅ Perbaiki pengecekan error dari database
  if (
    !quizDetails ||
    (quizDetails &&
      typeof quizDetails === "object" &&
      "error" in quizDetails) ||
    !Array.isArray(questions) ||
    (questions && typeof questions === "object" && "error" in questions)
  ) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold">Kuis Tidak Ditemukan</h1>
        <p>Kuis ini mungkin tidak ada atau belum memiliki pertanyaan.</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <QuizClientComponent
        quizDetails={
          quizDetails as { kuis_id: number; judul: string; xp_reward: number }
        }
        questions={
          questions as Array<{
            pertanyaan_id: number;
            teks_pertanyaan: string;
            image?: string | null;
            tipe: string;
            poin: number;
            kuis_id: number | null;
            urutan: number;
            PilihanKuis: Array<{
              jawaban_id: number;
              teks_jawaban: string;
              score: number;
              pertanyaan_id: number | null;
            }>;
          }>
        }
      />
    </div>
  );
}
