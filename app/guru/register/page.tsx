import { getSekolah } from "@/app/admin/dashboard/manage-sekolah/lib/data"; 
import CreateGuruForm from "./create-guru-form"; 
import { auth } from "@/auth"; 
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

async function fetchSchools() {
    try {
        const schools = await getSekolah(); 
        if ('error' in schools) {
            console.error("Error fetching schools:", schools.error);
            return { error: "Gagal memuat daftar sekolah." };
        }
        return schools;
    } catch (e) {
        console.error("Exception fetching schools:", e);
        return { error: "Terjadi kesalahan server saat memuat sekolah." };
    }
}


export default async function RegisterGuruPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== 'guru') {
    redirect("/sign-in"); 
  }

  const userId = session.user.id;
  const schoolsResult = await fetchSchools(); 

  return (
       <div className="min-h-screen px-4 py-12 overflow-x-hidden bg-gray-50 flex items-center justify-center">
         <div className="w-full max-w-lg">
           {/* Header */}
           <div className="mb-8 text-center">
             <h1 className="mb-2 text-3xl font-bold sm:text-4xl bg-gradient-to-r text-primary">
               Lengkapi Profil Anda
             </h1>
             <p className="text-gray-600">
               Silakan isi data berikut untuk melanjutkan ke dashboard.
             </p>
           </div>

            {/* Error handling for school fetching */}
           {typeof schoolsResult === 'object' && 'error' in schoolsResult ? (
                <Alert variant="destructive" className="mb-6">
                 <Terminal className="h-4 w-4" />
                 <AlertTitle>Gagal Memuat Data Sekolah</AlertTitle>
                 <AlertDescription>
                   {schoolsResult.error}. Silakan coba lagi nanti atau hubungi administrator.
                 </AlertDescription>
               </Alert>
           ) : (
                <CreateGuruForm
                    sekolahList={schoolsResult} 
                    userId={userId!} 
                />
           )}
         </div>
       </div>
    );
}