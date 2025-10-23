"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Eye } from "lucide-react"; 
import type { TGroupColumn } from "./columns";

interface CellActionsProps {
  row: { original: TGroupColumn };
}

export function CellActions({ row }: CellActionsProps) {
  const group = row.original;

  return (
    <div className="flex items-center justify-end space-x-2">
      <Button asChild variant="ghost" size="icon" className="w-8 h-8">
        <Link
          href={`/guru/dashboard/manage-group/${group.group_id}`}
        >
          <Eye className="w-4 h-4 text-muted-foreground" />
        </Link>
      </Button>

      <Button asChild variant="outline" size="icon" className="w-8 h-8">
        <Link
          href={`/guru/dashboard/manage-group/edit/${group.group_id}`}
        >
          <Edit className="w-4 h-4" />
        </Link>
      </Button>
    </div>
  );
}