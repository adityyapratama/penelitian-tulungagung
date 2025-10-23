// /guru/dashboard/manage-group/[id]/page.tsx

import { GetGroupById } from "../lib/data";
import { GroupPerformance } from "../../../lib/actions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import GroupDetailClient from "./group-detail-client"; 
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

interface GroupDetailPageProps {
  params: { id: string; };
}

export default async function GroupDetailPage({ params }: GroupDetailPageProps) {
  const id = params.id;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const [groupResult, performanceResult] = await Promise.all([
      GetGroupById(id),
      GroupPerformance(id)
  ]);

  if (!groupResult || (typeof groupResult === 'object' && 'error' in groupResult)) {
     if (groupResult?.error) {
         return (
             <div className="container mx-auto p-6">
                 <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error Memuat Grup</AlertTitle>
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

  const performanceData = Array.isArray(performanceResult) ? performanceResult : [];
  const group = groupResult;
  const assignedContent = (group as any).GroupContent || [];
  const members = (group as any).GroupMember || [];

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-8">
      {/* Header (Tombol Kembali & Judul) */}
      <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" asChild>
            <Link href="/guru/dashboard/manage-group">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Detail Grup
          </h1>
          <p className="text-muted-foreground">
             Kelola grup: <span className="font-semibold">{group.group_name || 'Tanpa Nama'}</span>
          </p>
        </div>
      </div>

      <GroupDetailClient
        group={group}
        initialAssignedContent={assignedContent}
        initialMembers={members}
        performanceData={performanceData}
        guruId={group.created_by!}
      />

    </div>
  );
}