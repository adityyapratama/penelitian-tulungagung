import { getSekolah } from "@/app/admin/dashboard/manage-sekolah/lib/data"
import CreateMemberPage from "@/app/(member)/member/register/createFrom"

export default async function CreateMember() {
  const sekolah = await getSekolah()

  return (
    <div className="min-h-screen overflow-x-hidden bg-background">
      
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">Create New Quiz</h1>
          <p className="text-muted-foreground">Fill in the details to create a new quiz</p>
        </div>
        <CreateMemberPage sekolah={sekolah} />
      
    </div>
  )
}
