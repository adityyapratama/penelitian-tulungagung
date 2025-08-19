import { columns } from "./columns"
import { DataTable } from "./data-table"
import { getUsers } from "./lib/actions";



export default async function ManageUsersPage() {
  const users = await getUsers();

  return (
    <div className="container py-10 mx-auto">
      <DataTable columns={columns} data={users} />
    </div>
  );
}