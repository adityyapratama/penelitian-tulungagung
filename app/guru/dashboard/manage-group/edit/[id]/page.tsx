import { GetGroupById } from "../../lib/data";
import { notFound } from "next/navigation";
import { EditGroupForm } from "../../_components/edit-group-form"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface EditGroupPageProps {
  params: {
    id: string;
  };
}

export default async function EditGroupPage({ params }: EditGroupPageProps) {
  const id = params.id;
  const groupResult = await GetGroupById(id);

  if (!groupResult || (typeof groupResult === 'object' && 'error' in groupResult)) {
     if (groupResult?.error) {
         return (
             <div className="container mx-auto p-6">
                 <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{groupResult.error}</AlertDescription>
                 </Alert>
                  <Button variant="outline" asChild className="mt-4">
                     <Link href="/guru/dashboard/manage-group">
                       <ArrowLeft className="w-4 h-4 mr-2" />
                       Kembali ke Daftar Grup
                     </Link>
                  </Button>
             </div>
          );
     }
     notFound();
  }

  const group = groupResult;

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-8">
      <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/guru/dashboard/manage-group">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Edit Grup
          </h1>
          <p className="text-muted-foreground">
            Ubah detail untuk grup: <span className="font-semibold">{group.group_name || 'Tanpa Nama'}</span>
          </p>
        </div>
      </div>

      <EditGroupForm group={group} />

    </div>
  );
}