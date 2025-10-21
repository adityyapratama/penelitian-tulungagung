import { notFound } from "next/navigation";
import { getQuizById, getCategoryQuiz } from "../../lib/data";
import { EditQuizForm } from "../../_components/quiz-edit-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface EditQuizPageProps {
  params: {
    id: string;
  };
}

export default async function EditQuizPage({ params }: EditQuizPageProps) {
  const id = params.id;

  const [quizResult, categoriesResult] = await Promise.all([
    getQuizById(id),
    getCategoryQuiz(),
  ]);

  if (!quizResult || 'error' in quizResult) {
    notFound();
  }
   
  if (!Array.isArray(categoriesResult)) {
     return <div className="container mx-auto p-6">Gagal memuat kategori.</div>;
  }
  
  const quiz = quizResult;
  const categories = categoriesResult;

  return (
    <div className="p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/guru/dashboard/manage-quiz">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Edit Kuis
            </h1>
            <p className="text-muted-foreground">
              Anda sedang mengubah detail kuis: <span className="font-semibold">{quiz.judul}</span>
            </p>
          </div>
        </div>
        
        <EditQuizForm quiz={quiz} categories={categories} />
      </div>
    </div>
  );
}