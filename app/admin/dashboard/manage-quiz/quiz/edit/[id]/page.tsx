import { notFound } from "next/navigation";
import { getQuizById, getCategoryQuiz } from "@/app/admin/dashboard/manage-quiz/lib/data";
import { EditQuizForm } from "./EditQuizForm"; // Komponen form edit yang akan kita buat

interface EditQuizPageProps {
  params: {
    id: string;
  };
}

export default async function EditQuizPage({ params }: EditQuizPageProps) {
  const id = params.id;

  const [quiz, categories] = await Promise.all([
    getQuizById(id),
    getCategoryQuiz(),
  ]);

  if (!quiz) {
    notFound();
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Edit Kuis</h1>
          <p className="text-muted-foreground">Anda sedang mengubah detail untuk kuis: <span className="font-semibold">{quiz.judul}</span></p>
        </div>
        
        {/* Kirim data yang sudah diambil sebagai props ke komponen form */}
        <EditQuizForm quiz={quiz} categories={categories} />
      </div>
    </div>
  );
}