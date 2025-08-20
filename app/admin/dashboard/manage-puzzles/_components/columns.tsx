"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Edit, Trash2, ArrowUpDown, Star } from "lucide-react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import Image from "next/image"
import Link from "next/link";
import DeletePuzzleButton from "./delete-puzzle-button"

dayjs.extend(utc)
dayjs.extend(timezone)

export type TPuzzle = {
  puzzle_id: number
  judul: string
  gambar: string
  kategori: string 
  xp_reward: number
  created_by: number
  created_at: Date
}

const getCategoryIcon = (kategori: string) => {
  switch (kategori) {
    case "Tempat_Wisata":
      return "🏞️"
    case "Tokoh_Sejarah":
      return "🧑‍🎓"
    case "Peta":
      return "🗺️"
    case "Budaya":
      return "🎭"
    default:
      return "🧩"
  }
}


const getCategoryColor = (kategori: string) => {
  switch (kategori) {
    case "Tempat_Wisata":
      return "bg-green-500 text-white hover:bg-green-600"
    case "Tokoh_Sejarah":
      return "bg-yellow-500 text-white hover:bg-yellow-600"
    case "Peta":
      return "bg-blue-500 text-white hover:bg-blue-600"
    case "Budaya":
      return "bg-purple-500 text-white hover:bg-purple-600"
    default:
      return "bg-gray-500 text-white hover:bg-gray-600"
  }
}

export const columns: ColumnDef<TPuzzle>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "gambar",
    header: "Gambar",
    cell: ({ row }) => {
      const puzzle = row.original
      return (
        <div className="flex items-center justify-center">
          <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted">
            <Image
              src={puzzle.gambar || "/placeholder.svg?height=48&width=48&query=puzzle"}
              alt={puzzle.judul}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: "judul",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Judul Puzzle
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const puzzle = row.original
      return (
        <div className="flex items-center space-x-3">
          <span className="font-medium">{puzzle.judul}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "kategori",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Kategori
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const kategori = row.getValue("kategori") as string
      return (
        <Badge className={`flex items-center gap-1 w-fit ${getCategoryColor(kategori)}`}>
          <span>{getCategoryIcon(kategori)}</span>
          {kategori}
        </Badge>
      )
    },
  },
  {
    accessorKey: "xp_reward",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          XP Reward
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const xp = row.getValue("xp_reward") as number
      return (
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-yellow-500" />
          <span className="font-medium">{xp} XP</span>
        </div>
      )
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Dibuat
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as Date
      return (
        <div className="space-y-1">
          <p className="text-sm font-medium">{dayjs(createdAt).tz("Asia/Jakarta").format("DD MMM YYYY")}</p>
          <p className="text-xs text-muted-foreground">{dayjs(createdAt).tz("Asia/Jakarta").format("HH:mm")} WIB</p>
        </div>
      )
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const puzzle = row.original

      return (
        <div className="flex items-center space-x-2">
          <Link href={`/admin/dashboard/manage-puzzles/edit/${puzzle.puzzle_id}`}>
          <Button variant="outline" size="sm" className="h-8 px-2 bg-transparent hover:bg-primary hover:text-white">
            <Edit className="h-4 w-4" />
          </Button>
        </Link>
          <DeletePuzzleButton 
          puzzleId={puzzle.puzzle_id} 
          puzzleJudul={puzzle.judul} 
        />
        </div>
      )
    },
  },
]
