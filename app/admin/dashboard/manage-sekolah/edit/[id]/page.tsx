import { getSekolahById } from "@/app/admin/dashboard/manage-sekolah/lib/data"
import UpdateSekolahForm from "./UpdateSekolahForm"

export default async function EditSekolahPage({ params }: { params: { id: string } }) {
  const sekolah = await getSekolahById(params.id)

  if (!sekolah || "error" in sekolah) {
    return <div>Data sekolah tidak ditemukan</div>
  }

  return <UpdateSekolahForm sekolah={sekolah} />
}
