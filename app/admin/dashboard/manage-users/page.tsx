import { getUsers } from "./lib/actions";
import { columns } from "./lib/columns";
import { DataTable } from "./data-table";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function ManageUsersPage() {
  const users = await getUsers();

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Manajemen User</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-500">
            Total: {users.length} user{users.length > 1 ? "s" : ""}
          </div>
          <Link
            href="/admin/dashboard/manage-users/create"
            className="btn-primary"
          >
            <Plus className="h-4 w-4" />
            Tambah User
          </Link>
        </div>
      </div>

      <DataTable columns={columns} data={users} />
    </div>
  );
}
