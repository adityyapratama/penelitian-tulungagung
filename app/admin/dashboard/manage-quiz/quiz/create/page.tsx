import { getCategoryQuiz } from "@/app/admin/dashboard/manage-quiz/lib/data"
import QuizCreateForm from "./QuizCreateForm"

export default async function QuizCreatePage() {
  const categories = await getCategoryQuiz()

  return (
    <div className="min-h-screen p-6 bg-background">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">Create New Quiz</h1>
          <p className="text-muted-foreground">Fill in the details to create a new quiz</p>
        </div>
        <QuizCreateForm categories={categories} />
      </div>
    </div>
  )
}
