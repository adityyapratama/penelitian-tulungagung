"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2, Shield, User, GraduationCap, ArrowUpDown, RotateCcw } from "lucide-react"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"

dayjs.extend(utc)
dayjs.extend(timezone)

export type TColumn = {
  id: number
  username: string
  email: string
  role: string
  last_login: Date | null
  status?: string
  created_at?: Date
}

const getRoleIcon = (role: string) => {
  switch (role) {
    case "super_admin":
      return <Shield className="w-4 h-4" />
    case "guru":
      return <GraduationCap className="w-4 h-4" />
    case "member":
      return <User className="w-4 h-4" />
    default:
      return <User className="w-4 h-4" />
  }
}

const getRoleVariant = (role: string) => {
  switch (role) {
    case "super_admin":
      return "destructive"
    case "guru":
      return "default"
    case "member":
      return "secondary"
    default:
      return "secondary"
  }
}

const getRoleLabel = (role: string) => {
  switch (role) {
    case "super_admin":
      return "Super Admin"
    case "guru":
      return "Guru"
    case "member":
      return "Member"
    default:
      return role
  }
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "super_admin":
      return "bg-red-500 text-white hover:bg-red-600"
    case "guru":
      return "bg-green-500 text-white hover:bg-green-600"
    case "member":
      return "bg-blue-500 text-white hover:bg-blue-600"
    default:
      return "bg-gray-500 text-white hover:bg-gray-600"
  }
}

export const columns: ColumnDef<TColumn>[] = [
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
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Username
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center space-x-3">
          <span className="font-medium">{user.username}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return <span className="text-muted-foreground">{row.getValue("email")}</span>
    },
  },
  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Role
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <Badge className={`flex items-center gap-1 w-fit ${getRoleColor(role)}`}>
          {getRoleIcon(role)}
          {getRoleLabel(role)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "last_login",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="h-auto p-0 font-semibold hover:bg-transparent"
        >
          Login Terakhir
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const lastLogin = row.getValue("last_login") as Date | null
      if (!lastLogin) {
        return <span className="text-muted-foreground italic">Belum pernah</span>
      }
      return (
        <div className="space-y-1">
          <p className="text-sm font-medium">{dayjs(lastLogin).tz("Asia/Jakarta").format("DD MMM YYYY")}</p>
          <p className="text-xs text-muted-foreground">{dayjs(lastLogin).tz("Asia/Jakarta").format("HH:mm")} WIB</p>
        </div>
      )
    },
  },
]
