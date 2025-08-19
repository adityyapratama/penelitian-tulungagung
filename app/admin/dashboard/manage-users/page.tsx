import { getUsers } from "./lib/actions"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import Link from "next/link"
import { Plus, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ManageUsersPage() {
  const users = await getUsers()

  return (
    <div className="container mx-auto py-4 px-4 md:py-8 space-y-6 md:space-y-8">
      {/* Header Section */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Manajemen User</h1>
          <p className="text-sm md:text-base text-muted-foreground">Kelola pengguna sistem dan atur hak akses mereka</p>
        </div>
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-lg">
            <Users className="h-4 w-4" />
            <span>
              Total: {users.length} user{users.length !== 1 ? "s" : ""}
            </span>
          </div>
          <Button asChild className="shadow-sm w-full md:w-auto">
            <Link href="/admin/dashboard/manage-users/create">
              <Plus className="h-4 w-4 mr-2" />
              Tambah User
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">Semua pengguna terdaftar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((user) => user.role === "super_admin").length}</div>
            <p className="text-xs text-muted-foreground">Super admin aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guru</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((user) => user.role === "guru").length}</div>
            <p className="text-xs text-muted-foreground">Guru terdaftar</p>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">Daftar User</CardTitle>
          <CardDescription className="text-sm">Kelola semua pengguna yang terdaftar dalam sistem</CardDescription>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          <DataTable columns={columns} data={users} />
        </CardContent>
      </Card>
    </div>
  )
}
