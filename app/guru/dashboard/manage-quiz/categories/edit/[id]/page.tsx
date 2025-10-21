import { getCategoryQuizById } from "../../../lib/data"; 
import { notFound } from "next/navigation";
import { EditCategoryForm } from "./edit-form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default async function EditCategoryPage({
  params,
}: {
  params: { id: string };
}) {
  const id = params.id;
  const categoryResult = await getCategoryQuizById(id);

  if (!categoryResult || 'error' in categoryResult) { 
    notFound();
  }
  const category = categoryResult;

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-8">
       {/* Header with Back Button */}
       <div className="flex items-center gap-4 mb-6">
           <Button variant="outline" size="icon" asChild>
             {/* Updated Path */}
             <Link href="/guru/dashboard/manage-quiz/categories">
               <ArrowLeft className="h-4 w-4" />
             </Link>
           </Button>
         <div>
           <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
             Edit Kategori Kuis
           </h1>
           <p className="text-muted-foreground">
             Ubah detail untuk kategori: <span className="font-semibold">{category.nama_kategori}</span>
           </p>
         </div>
       </div>
      <EditCategoryForm category={category} />
    </div>
  );
}