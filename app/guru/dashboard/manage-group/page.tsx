import { GetGroup } from "./lib/data"; 
import { columns } from "./columns";
import { DataTable } from "./data-table";

import Link from "next/link";
import { Plus, Users, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function ManageGroupsPage() {
  const groupsResult = await GetGroup();

  // Handle potential error object from GetGroup
  if (groupsResult && typeof groupsResult === 'object' && 'error' in groupsResult && typeof groupsResult.error === 'string') {
    return (
       <div className="container px-4 py-4 mx-auto space-y-6 md:py-8 md:space-y-8">
           <Alert variant="destructive">
             <Terminal className="h-4 w-4" />
             <AlertTitle>Gagal Memuat Data</AlertTitle>
             <AlertDescription>
               {groupsResult.error}. Coba muat ulang halaman.
             </AlertDescription>
           </Alert>
       </div>
    );
  }

  // Ensure it's an array before proceeding
  const groups = Array.isArray(groupsResult) ? groupsResult : [];

  return (
    <div className="container px-4 py-4 mx-auto space-y-6 md:py-8 md:space-y-8">
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-1.5">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Manajemen Grup</h1>
          <p className="text-sm md:text-base text-muted-foreground">
              Kelola grup belajar Anda, tambahkan member, dan tugaskan konten.
          </p>
        </div>
        <Button asChild className="w-full shadow-sm md:w-auto">
          <Link href="/guru/dashboard/manage-group/create">
            <Plus className="w-4 h-4 mr-2" />
            Buat Grup Baru
          </Link>
        </Button>
      </div>

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-sm font-medium">Total Grup Anda</CardTitle>
          <Users className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{groups.length}</div>
          <p className="text-xs text-muted-foreground">Jumlah grup yang telah Anda buat.</p>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="px-4 md:px-6">
          <CardTitle className="text-lg md:text-xl">Daftar Grup</CardTitle>
          <CardDescription className="text-sm">
              Lihat, edit, atau hapus grup yang ada.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          <DataTable columns={columns} data={groups} />
        </CardContent>
      </Card>
    </div>
  );
}