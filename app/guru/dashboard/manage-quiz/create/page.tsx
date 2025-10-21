import { getCategoryQuiz } from "../lib/data"; // DIUBAH: Path ke lib guru
import QuizCreateForm from "../_components/quiz-create-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

export default async function QuizCreatePage() {
  const categories = await getCategoryQuiz();

  if (!Array.isArray(categories)) {
     return (
        <div className="container mx-auto p-6">
            <p className="text-red-500">Gagal memuat kategori kuis.</p>
        </div>
     )
  }

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header Halaman */}
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/guru/dashboard/manage-quiz">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Buat Kuis Baru
            </h1>
            <p className="text-muted-foreground">
              Isi detail di bawah ini untuk membuat kuis baru.
            </p>
          </div>
        </div>
        
        {/* Form */}
        <QuizCreateForm categories={categories} />
      </div>
    </div>
  );
}