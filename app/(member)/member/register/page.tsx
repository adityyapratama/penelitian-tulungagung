import { getSekolah } from "@/app/admin/dashboard/manage-sekolah/lib/data"
import CreateMemberPage from "@/app/(member)/member/register/createFrom"

export default async function CreateMember() {
  const sekolah = await getSekolah()

  return <CreateMemberPage sekolah={sekolah} />
}
