"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"
import dayjs from "dayjs"
import "dayjs/locale/id" // Impor lokal Indonesia
import { CellActions } from "./cell-actions"

dayjs.locale('id') // Setel dayjs untuk menggunakan bahasa Indonesia


export type TQuizColumn = {
  kuis_id: number
  judul: string
  is_published: boolean
  created_at: Date
  KategoriKuis: {
    nama_kategori: string
  } | null
  User: {
    username: string
  } | null
}

export const columns: ColumnDef<TQuizColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "judul",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Judul Kuis
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.getValue("judul")}</span>,
  },
  {
    accessorFn: row => row.KategoriKuis?.nama_kategori,
    id: "kategori",
    header: "Kategori",
    cell: ({ row }) => {
      const kategori = row.original.KategoriKuis?.nama_kategori;
      return kategori ? <span>{kategori}</span> : <span className="italic text-muted-foreground">Tanpa Kategori</span>;
    },
  },
   {
  accessorKey: "is_published",
  header: "Status",
  cell: ({ row }) => {
    const isPublished = Boolean(row.getValue("is_published"));
    return (
      <Badge variant={isPublished ? "default" : "destructive"}>
        {isPublished ? "Published" : "Draft"}
      </Badge>
    );
  },
},
  {
    accessorFn: row => row.User?.username,
    id: "dibuat_oleh",
    header: "Dibuat Oleh",
  },
  {
    accessorKey: "created_at",
    header: "Tanggal Dibuat",
    cell: ({ row }) => dayjs(row.getValue("created_at")).format("DD MMMM YYYY"),
  },
  {
    id: "actions",
    header: () => <div className="text-right">Aksi</div>,
    cell: ({ row }) => <CellActions row={row} />,
  },
]