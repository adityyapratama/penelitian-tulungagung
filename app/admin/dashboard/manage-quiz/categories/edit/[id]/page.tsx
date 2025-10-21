// edit/[id]/page.tsx

import { getCategoryQuizById } from "@/app/admin/dashboard/manage-quiz/lib/data";
import { notFound } from "next/navigation";
import { EditCategoryForm } from "@/app/admin/dashboard/manage-quiz/categories/edit/[id]/edit-form";

// Ini adalah Server Component yang bertugas mengambil data
export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const category = await getCategoryQuizById(id);
  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8 mx-auto max-w-full">
        {/* Hapus pembungkus yang membatasi lebar */}
        <EditCategoryForm category={category} />
      </div>
    </div>
  );
}
