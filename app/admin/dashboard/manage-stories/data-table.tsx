"use client"

import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search, Eye, Download, Trash2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { useReactTable, flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel, type ColumnDef, type SortingState, type ColumnFiltersState, type VisibilityState, type RowSelectionState } from "@tanstack/react-table"
import { getColumns } from "./columns"
import { DeleteMultipleStories, DeleteStory } from "./lib/actions"

export type StoryColumn = {
  id: string
  title: string
  author: string
  createdAt: string
}

interface DataTableProps<TData extends StoryColumn> {
  columns: ColumnDef<TData, any>[]
  data: TData[]
}


export function DataTable<TData extends StoryColumn, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [isPending, startTransition] = useTransition()
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

  // Single delete
  const handleDeleteSingle = (id: string) => {
    if (!id) return
    setDeletingIds((prev) => new Set(prev).add(id))

    startTransition(async () => {
      const result = await DeleteStory(id)
      if (result.success) {
        toast("Berhasil", { description: result.success })
        window.location.reload()
      } else {
        toast("Error", { description: result.error })
        setDeletingIds((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }
    })
  }

  // Gunakan nama lain untuk avoid shadowing
  const tableColumns = getColumns(handleDeleteSingle, deletingIds)

  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: { pageSize: 10 },
    },
  })

  // Bulk delete
  const handleDeleteSelected = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const selectedIds = selectedRows.map((row) => row.original.id).filter(Boolean)
    if (!selectedIds.length) return

    startTransition(async () => {
      const result = await DeleteMultipleStories(selectedIds)
      if (result.success) {
        toast("Berhasil", { description: result.success })
        setRowSelection({})
        window.location.reload()
      } else {
        toast("Error", { description: result.error })
      }
    })
  }

  // Export CSV
  const exportToCSV = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const dataToExport = selectedRows.length ? selectedRows.map((row) => row.original) : table.getFilteredRowModel().rows.map((row) => row.original)
    if (!dataToExport.length) return

    const csv = [
      Object.keys(dataToExport[0]).join(","),
      ...dataToExport.map((row) => Object.values(row as Record<string, unknown>).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `stories-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length

  return (
    <div className="space-y-4">
      {/* Filters & Actions */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="relative flex-1 w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari di semua kolom..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto bg-transparent">
                <Eye className="mr-2 h-4 w-4" />
                Kolom
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Pilih Kolom</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table.getAllColumns().filter((col) => col.getCanHide()).map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.id}
                  checked={col.getIsVisible()}
                  onCheckedChange={(val) => col.toggleVisibility(!!val)}
                  className="capitalize"
                >
                  {col.id}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bulk Actions */}
        {selectedRowsCount > 0 && (
          <div className="flex flex-col md:flex-row md:items-center md:justify-between p-4 bg-muted/50 rounded-lg border">
            <Badge variant="secondary" className="font-medium">{selectedRowsCount} story dipilih</Badge>
            <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="mr-2 h-4 w-4" /> Export Terpilih
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDeleteSelected} disabled={isPending}>
                <Trash2 className="mr-2 h-4 w-4" /> {isPending ? "Menghapus..." : "Hapus Terpilih"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={tableColumns.length} className="h-24 text-center text-muted-foreground">
                    Tidak ada data yang ditemukan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4">
        <div className="text-sm text-muted-foreground">
          Menampilkan {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} -{" "}
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} dari {table.getFilteredRowModel().rows.length} data
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Prev
          </Button>
          <span className="text-sm font-medium">{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Baris per halaman:</span>
          <Select value={`${table.getState().pagination.pageSize}`} onValueChange={(val) => table.setPageSize(Number(val))}>
            <SelectTrigger className="h-8 w-[70px]"><SelectValue placeholder={table.getState().pagination.pageSize} /></SelectTrigger>
            <SelectContent side="top">
              {[5, 10, 20, 30, 50].map((size) => <SelectItem key={size} value={`${size}`}>{size}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
