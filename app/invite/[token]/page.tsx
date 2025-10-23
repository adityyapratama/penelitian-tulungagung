import { auth } from "@/auth";
import { getGroupInviteDetails, getMemberDetailsFromSession, checkIfAlreadyMember } from "../lib/data"; // Impor data fetcher
import { InviteClientPage } from "../_components/invite-client-page"; 
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";
import { redirect } from "next/navigation";

interface InvitePageProps {
    params: {
        token: string; 
    };
}

export default async function InvitePage({ params }: InvitePageProps) {
    const groupId = params.token;
    
    const session = await auth(); 
    if (!session?.user?.id) {
        const callbackUrl = `/invite/${groupId}`;
        redirect(`/sign-in?callbackUrl=${encodeURIComponent(callbackUrl)}`);
    }

    const [groupResult, memberResult] = await Promise.all([
        getGroupInviteDetails(groupId),
        getMemberDetailsFromSession()
    ]);

    if ('error' in groupResult) {
        return (
             <div className="flex items-center justify-center min-h-screen bg-muted">
                 <Alert variant="destructive" className="max-w-md">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Undangan Tidak Valid</AlertTitle>
                    <AlertDescription>{groupResult.error}</AlertDescription>
                 </Alert>
             </div>
        );
    }
    
    if ('error' in memberResult) {
         return (
             <div className="flex items-center justify-center min-h-screen bg-muted">
                 <Alert variant="destructive" className="max-w-md">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Profil Member Tidak Ditemukan</AlertTitle>
                    <AlertDescription>{memberResult.error} Harap lengkapi profil Anda terlebih dahulu.</AlertDescription>
                 </Alert>
             </div>
        );
    }

    const isAlreadyMember = await checkIfAlreadyMember(groupId, memberResult.member_id);

    return (
        <InviteClientPage
            group={groupResult}
            member={memberResult}
            isAlreadyMember={isAlreadyMember}
        />
    );
}