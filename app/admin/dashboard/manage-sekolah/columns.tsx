"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowUpDown } from "lucide-react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import { CellActions } from "./cell-actions"

dayjs.extend(utc)
dayjs.extend(timezone)

export type TSekolahColumn = {
  sekolah_id: number
  nama_sekolah: string
  alamat_sekolah: string | null
  created_at: Date | null
}

export const columns: ColumnDef<TSekolahColumn>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    accessorKey: "nama_sekolah",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() =>
          column.toggleSorting(column.getIsSorted() === "asc")
        }
      >
        Nama Sekolah
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("nama_sekolah")}</span>
    ),
  },
  {
    accessorKey: "alamat_sekolah",
    header: "Alamat Sekolah",
    cell: ({ row }) => {
      const alamat = row.getValue("alamat_sekolah") as string | null
      if (!alamat) {
        return (
          <span className="italic text-muted-foreground">
            Tidak ada alamat
          </span>
        )
      }
      return (
        <span className="text-muted-foreground">
          {alamat.length > 50 ? `${alamat.substring(0, 50)}...` : alamat}
        </span>
      )
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions row={row} />,
  },
]
