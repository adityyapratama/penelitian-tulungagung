// edit/[id]/page.tsx

import { getCategoryQuizById } from "@/app/admin/dashboard/manage-quiz/lib/data";
import { notFound } from "next/navigation";
import { EditCategoryForm } from "@/app/admin/dashboard/manage-quiz/categories/edit/[id]/edit-form"; // Kita akan buat komponen ini di bawah



// Ini adalah Server Component yang bertugas mengambil data
export default async function EditCategoryPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const category = await getCategoryQuizById(id);

  // Jika kategori dengan ID tersebut tidak ditemukan, tampilkan halaman 404
  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            {/* Me-render Client Component dan mengirim data kategori sebagai props */}
            <EditCategoryForm category={category} />
          </div>
        </div>
      </div>
    </div>
  );
}