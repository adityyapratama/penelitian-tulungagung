import { getSekolahById } from "@/app/admin/dashboard/manage-sekolah/lib/data";
import UpdateSekolahForm from "./UpdateSekolahForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, School } from "lucide-react";

export default async function EditSekolahPage({
  params,
}: {
  params: { id: string };
}) {
  const sekolah = await getSekolahById(params.id);

  if (!sekolah || "error" in sekolah) {
    notFound();
  }

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/dashboard/manage-sekolah">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Edit Data Sekolah
          </h1>
          <p className="text-muted-foreground">
            Perbarui detail untuk{" "}
            <span className="font-semibold text-foreground">
              {sekolah.nama_sekolah}
            </span>
            .
          </p>
        </div>
      </div>
      <UpdateSekolahForm sekolah={sekolah} />
    </div>
  );
}
