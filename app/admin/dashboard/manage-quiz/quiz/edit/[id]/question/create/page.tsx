import { notFound } from "next/navigation";
import { getQuizById, getQuizQuestionByQuizId } from "@/app/admin/dashboard/manage-quiz/lib/data";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// 1. UBAH: Impor komponen builder yang baru dan dinamis
import DynamicQuestionBuilder from "@/app/admin/dashboard/manage-quiz/quiz/edit/[id]/question/create/CreateQuestionForm"; 

interface PageProps {
  params: {
    id: string; // ini itu id quiz
  };
}

export default async function CreateQuestionPage({ params }: PageProps) {
  const quizId = params.id;
  
  const [quiz, initialQuestions] = await Promise.all([
    getQuizById(quizId),
    getQuizQuestionByQuizId(quizId)
  ]);

  if (!quiz) {
    notFound();
  }

  
  return (
    <div className="container p-6 mx-auto">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Manajemen Pertanyaan</h1>
            <p className="text-muted-foreground">
              Untuk Kuis: <span className="font-semibold">{quiz.judul}</span>
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href={`/admin/dashboard/manage-quiz/quiz/edit/${quiz.kuis_id}`}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Edit Kuis
            </Link>
          </Button>
        </div>
        
        {/* 2. UBAH: Render komponen DynamicQuestionBuilder dan kirim props */}
        {/* Kita akan sesuaikan DynamicQuestionBuilder untuk menerima props ini */}
        <DynamicQuestionBuilder 
            quizId={quiz.kuis_id}
            initialQuestions={Array.isArray(initialQuestions) ? initialQuestions : []} 
        />
      </div>
    </div>
  );
}