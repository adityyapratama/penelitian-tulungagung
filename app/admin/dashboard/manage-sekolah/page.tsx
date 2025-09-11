
import { getSekolah } from "@/app/admin/dashboard/manage-sekolah/lib/data"
import { columns } from "./columns"
import { DataTable } from "./data-table" 
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function ManageSekolahPage() {
  const sekolah = await getSekolah()

  if ("error" in sekolah) {
    return <div>Gagal memuat data sekolah</div>
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Daftar Sekolah</h1>
        <Button asChild>
          <Link href="/admin/dashboard/manage-sekolah/create">Tambah Sekolah</Link>
        </Button>
      </div>

      <DataTable columns={columns} data={sekolah} />
    </div>
  )
}
