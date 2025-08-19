// import { ColumnDef } from "@tanstack/react-table";


// export type TColumn = {
//   id: number;
//   username: string;
//   email: string;
//   role: string;
//   last_login: Date | null;
// };

// export const columns: ColumnDef<TColumn, any>[] = [
//   {
//     accessorKey: "username",
//     header: "Username",
//   },
  
//   {
//     accessorKey: "email",
//     header: "Email",
//   },
//   {
//     accessorKey: "role",
//     header: "Role",
//   },
//   {
//     accessorKey: "last_login",
//     header: "Last Login",
//   },
// ];

"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type TColumn = {
  id: number;
  username: string;
  email: string;
  role: string;
  last_login: Date | null;
};

export const columns: ColumnDef<TColumn>[] = [
  
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

  },
{
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "username",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Username
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
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
        >
          Email
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      )
    },
    
  },

  {
    accessorKey: "role",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Role
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
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
        >
          Last Login
          <ArrowUpDown className="w-4 h-4 ml-2" />
        </Button>
      )
    },  
  },
  

]