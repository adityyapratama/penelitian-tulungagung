"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"; 
import { ArrowUpDown, Users } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/id";
import relativeTime from "dayjs/plugin/relativeTime";
import { CellActions } from "./cell-actions";
import Image from "next/image";

dayjs.locale("id");
dayjs.extend(relativeTime);

export type TGroupColumn = {
  group_id: string;
  group_name: string | null;
  group_thumbnail: string | null;
  created_at: Date | null;
  updated_at: Date | null;
  _count?: {
    GroupMember: number;
  } | null; 
};

export const columns: ColumnDef<TGroupColumn>[] = [
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
        className="border-border"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="border-border"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
   {
    accessorKey: "group_thumbnail",
    header: " ",
     cell: ({ row }) => {
       const thumbnail = row.getValue("group_thumbnail") as string | null;
       const name = row.original.group_name || "Grup";
       return (
         <div className="w-10 h-10 rounded-md overflow-hidden border border-border bg-muted flex items-center justify-center flex-shrink-0">
           {thumbnail ? (
             <Image
               src={thumbnail}
               alt={`Thumbnail ${name}`}
               width={40}
               height={40}
               className="object-cover w-full h-full"
               onError={(e) => { e.currentTarget.style.display = 'none'; }}
             />
           ) : (
              <Users className="w-5 h-5 text-muted-foreground" />
           )}
         </div>
       );
     },
     enableSorting: false,
  },
  {
    accessorKey: "group_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-2 text-left -ml-2"
      >
        Nama Grup
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("group_name") || <i className="text-muted-foreground">Tanpa Nama</i>}</span>
    ),
  },
   {
    accessorFn: (row) => row._count?.GroupMember ?? 0,
    id: "member_count",
    header: ({ column }) => (
       <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="px-2"
      >
        Jumlah Member
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
       const count = row.original._count?.GroupMember ?? 0;
      return <span className="text-muted-foreground">{count} Member</span>;
    },
   },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
        <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
         className="px-2"
      >
        Dibuat
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at") as Date | null;
      if (!createdAt) return <span className="text-muted-foreground italic">N/A</span>;
      return (
         <span className="text-muted-foreground text-sm whitespace-nowrap">
             {dayjs(createdAt).format("DD MMM YYYY")}
         </span>
      );
    },
  },
  {
    accessorKey: "updated_at",
    header: ({ column }) => (
        <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
         className="px-2"
      >
        Diperbarui
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
    ),
    cell: ({ row }) => {
      const updatedAt = row.getValue("updated_at") as Date | null;
      if (!updatedAt) return <span className="text-muted-foreground italic">N/A</span>;
      return (
         <span className="text-muted-foreground text-sm whitespace-nowrap">
             {dayjs(updatedAt).fromNow()}
         </span>
      );
    },
  },
  {
    id: "actions",
     header: () => <div className="text-right pr-2">Aksi</div>,
    cell: ({ row }) => <CellActions row={row} />,
  },
];