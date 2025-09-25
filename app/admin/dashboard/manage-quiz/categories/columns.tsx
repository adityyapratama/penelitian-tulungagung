"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Trash2, ArrowUpDown } from "lucide-react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import Link from "next/link"
import { CellActions } from "./cell-actions"




dayjs.extend(utc)
dayjs.extend(timezone)

// 1. Definisikan tipe data sesuai dengan hasil query Prisma

export type TCategoryColumn = {
  kategori_id: number
  nama_kategori: string
  deskripsi: string | null
  thumbnail: string | null
  created_at: Date | null
  User: {
    username: string
  } | null
}


export const columns: ColumnDef<TCategoryColumn>[] = [
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
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => {
      const thumbnail = row.getValue("thumbnail") as string | null
      if (!thumbnail) {
        return <span className="italic text-muted-foreground text-sm">Tidak ada gambar</span>
      }
      return (
        <div className="w-12 h-12 rounded-md overflow-hidden border">
          <img 
            src={thumbnail} 
            alt={`Thumbnail ${row.getValue("nama_kategori")}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none'
              e.currentTarget.nextElementSibling?.classList.remove('hidden')
            }}
          />
          <div className="hidden w-full h-full bg-muted items-center justify-center text-xs text-muted-foreground">
            Error
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "nama_kategori",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Nama Kategori
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      return <span className="font-medium">{row.getValue("nama_kategori")}</span>
    },
  },
  {
    accessorKey: "deskripsi",
    header: "Deskripsi",
    cell: ({ row }) => {
      const deskripsi = row.getValue("deskripsi") as string | null
      // Tampilkan placeholder jika deskripsi kosong, dan potong jika terlalu panjang
      if (!deskripsi) {
        return <span className="italic text-muted-foreground">Tidak ada deskripsi</span>
      }
      return <span className="text-muted-foreground">{deskripsi.length > 50 ? `${deskripsi.substring(0, 50)}...` : deskripsi}</span>
    },
  },
  {
    // Menggunakan accessorFn untuk data yang nested (User.username)
    accessorFn: row => row.User?.username,
    id: "dibuat_oleh",
    header: "Dibuat Oleh",
    cell: ({ row }) => {
      const username = row.original.User?.username
      return username ? <span>{username}</span> : <span className="italic text-muted-foreground">N/A</span>
    },
  },
  
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Tanggal Dibuat
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as Date | null
      if (!createdAt) {
        return <span className="italic text-muted-foreground text-sm">Tidak ada tanggal</span>
      }
      return (
        <div className="text-sm">
          {dayjs(createdAt).tz("Asia/Jakarta").format("DD MMM YYYY, HH:mm")}
        </div>
      )
    },
  },
   {
    id: "actions",
    cell: ({ row }) => <CellActions row={row} />, // Tidak ada perubahan di sini
  },
]