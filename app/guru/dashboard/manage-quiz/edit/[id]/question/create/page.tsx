import { notFound } from "next/navigation";
import { getQuizById, getQuizQuestionByQuizId } from "../../../../lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import CreateQuestionForm from "../../../../_components/create-question-form";

interface PageProps {
  params: {
    id: string; 
  };
}

export default async function CreateQuestionPage({ params }: PageProps) {
  const quizId = params.id;

  const [quizResult, initialQuestionsResult] = await Promise.all([
    getQuizById(quizId),
    getQuizQuestionByQuizId(quizId)
  ]);

  if (!quizResult || 'error' in quizResult) {
    notFound();
  }

  const initialQuestions = Array.isArray(initialQuestionsResult) ? initialQuestionsResult : [];
  const quiz = quizResult;

  return (
    <div className="container p-4 mx-auto md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold md:text-3xl">Manajemen Pertanyaan</h1>
            <p className="text-muted-foreground">
              Untuk Kuis: <span className="font-semibold">{quiz.judul}</span>
            </p>
          </div>
          <Button variant="outline" asChild className="w-full md:w-auto">
            <Link href={`/guru/dashboard/manage-quiz/edit/${quiz.kuis_id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Edit Kuis
            </Link>
          </Button>
        </div>

        {/* Render the form component */}
        <CreateQuestionForm
            quizId={quiz.kuis_id}
            initialQuestions={initialQuestions}
            quizTitle={quiz.judul}
            quizDescription={quiz.deskripsi} 
        />
      </div>
    </div>
  );
}