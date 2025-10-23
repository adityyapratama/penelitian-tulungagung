import { Suspense } from "react";
import { getMemberGroups, getAssignedContentForGroup } from "./lib/data";
import { GroupAssignmentClient } from "./group-assignment-client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react"; 
import { Skeleton } from "@/components/ui/skeleton";

interface GroupsPageProps {
    searchParams?: {
        group_id?: string;
    };
}

function LoadingFallback() {
    return (
        <div className="space-y-8">
            {/* Skeleton untuk Dropdown */}
            <Skeleton className="h-10 w-full max-w-sm" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        </div>
    );
}

// Komponen Data Container
async function GroupDataContainer({ selectedGroupId }: { selectedGroupId?: string }) {
    const [groupsResult, contentResult] = await Promise.all([
        getMemberGroups(),
        selectedGroupId ? getAssignedContentForGroup(selectedGroupId) : Promise.resolve([])
    ]);

    if ('error' in groupsResult) {
         return (
             <Alert variant="destructive" className="max-w-md">
                 <Terminal className="h-4 w-4" />
                 <AlertTitle>Gagal Memuat Grup</AlertTitle>
                 <AlertDescription>{groupsResult.error}</AlertDescription>
             </Alert>
         );
    }

    const content = Array.isArray(contentResult) ? contentResult : [];
    const contentError = (!Array.isArray(contentResult) && contentResult.error) ? contentResult.error : null;

    return (
        <GroupAssignmentClient
            allMemberGroups={groupsResult}
            assignedContent={content}
            selectedGroupId={selectedGroupId}
            contentError={contentError}
        />
    );
}


export default function GroupsPage({ searchParams }: GroupsPageProps) {
    const selectedGroupId = searchParams?.group_id;

    return (
        <main className="min-h-screen bg-background">
            <div className="p-6 pt-20 md:pt-24">
                <div className="mx-auto space-y-8 max-w-7xl">
                    <div className="space-y-4 text-center">
                        <h1 className="text-4xl font-bold md:text-5xl text-primary text-balance animate-fade-in">
                            Petualangan Grup Menanti! 🚀
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-muted-foreground text-pretty">
                            Pilih grup belajarmu untuk melihat misi seru (kuis, cerita, puzzle) yang diberikan oleh gurumu dan mulai kerjakan!
                        </p>
                    </div>

                    <Suspense fallback={<LoadingFallback />}>
                        <GroupDataContainer selectedGroupId={selectedGroupId} />
                    </Suspense>
                </div>
            </div>
        </main>
    );
}