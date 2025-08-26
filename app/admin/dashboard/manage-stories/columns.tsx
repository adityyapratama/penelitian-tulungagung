"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, ArrowUpDown } from "lucide-react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

export type StoryColumn = {
  cerita_id: number
  judul: string
  thumbnail?: string | null
  deskripsi?: string | null
  xp_reward: number
  created_at?: Date | null
}



export const getColumns = (onDelete: (id: string) => void,
  deletingIds: Set<string>): ColumnDef<StoryColumn>[] => [
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
    accessorKey: "judul",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold hover:bg-transparent"
      >
        Judul
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const story = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-lg">
            {story.thumbnail ? (
              <AvatarImage src={story.thumbnail} alt={story.judul} />
            ) : (
              <AvatarFallback>{story.judul.charAt(0)}</AvatarFallback>
            )}
          </Avatar>
          <span className="font-medium">{story.judul}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "deskripsi",
    header: "Deskripsi",
    cell: ({ row }) => {
      const desc = row.getValue("deskripsi") as string | null
      return (
        <p className="line-clamp-2 text-sm text-muted-foreground max-w-xs">
          {desc || "-"}
        </p>
      )
    },
  },
  {
    accessorKey: "xp_reward",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-semibold hover:bg-transparent"
      >
        XP Reward
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      return <span className="font-semibold text-primary">{row.getValue("xp_reward")}</span>
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => {
      const story = row.original
      const id = story.cerita_id.toString()

      return (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 px-2 bg-transparent hover:bg-primary hover:text-white"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-8 px-2"
            onClick={() => onDelete(id)}
            disabled={deletingIds.has(id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    },
  },
]
