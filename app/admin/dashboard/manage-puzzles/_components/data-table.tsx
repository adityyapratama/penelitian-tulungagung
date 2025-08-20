"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  getFilteredRowModel,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Search, Filter, Download, Trash2, Eye } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [globalFilter, setGlobalFilter] = useState("")

  const table = useReactTable({
    data,
    columns,
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
      pagination: {
        pageSize: 10,
      },
    },
  })

  const exportToCSV = () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const dataToExport =
      selectedRows.length > 0
        ? selectedRows.map((row) => row.original)
        : table.getFilteredRowModel().rows.map((row) => row.original)

    const csv = [
      Object.keys(dataToExport[0] || {}).join(","),
      ...dataToExport.map((row) => Object.values(row as Record<string, unknown>).join(",")),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `puzzles-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const selectedRowsCount = table.getFilteredSelectedRowModel().rows.length

  return (
    <div className="space-y-4">
      {/* Enhanced Filters and Actions */}
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          {/* Global Search */}
          <div className="relative flex-1 w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Cari di semua kolom..."
              value={globalFilter ?? ""}
              onChange={(event) => setGlobalFilter(event.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <Select
            value={(table.getColumn("kategori")?.getFilterValue() as string) ?? ""}
            onValueChange={(value) => table.getColumn("kategori")?.setFilterValue(value === "all" ? "" : value)}
          >
            <SelectTrigger className="w-full md:w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filter kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="Tempat_Wisata">Tempat Wisata</SelectItem>
              <SelectItem value="Tokoh_Sejarah">Tokoh Sejarah</SelectItem>
              <SelectItem value="Peta">Peta</SelectItem>
              <SelectItem value="Budaya">Budaya</SelectItem>
              <SelectItem value="Lainnya">Lainnya</SelectItem>
            </SelectContent>
          </Select>

          {/* Column Visibility */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto md:ml-auto bg-transparent">
                <Eye className="mr-2 h-4 w-4" />
                Kolom
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Toggle Kolom</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id === "judul"
                        ? "Judul"
                        : column.id === "kategori"
                          ? "Kategori"
                          : column.id === "xp_reward"
                            ? "XP Reward"
                            : column.id === "created_at"
                              ? "Dibuat"
                              : column.id === "gambar"
                                ? "Gambar"
                                : column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bulk Actions */}
        {selectedRowsCount > 0 && (
          <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0 p-4 bg-muted/50 rounded-lg border-border border">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="font-medium">
                {selectedRowsCount} puzzle dipilih
              </Badge>
            </div>
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-2">
              <Button variant="outline" size="sm" onClick={exportToCSV} className="w-full md:w-auto bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export Terpilih
              </Button>
              <Button variant="destructive" size="sm" className="w-full md:w-auto">
                <Trash2 className="mr-2 h-4 w-4" />
                Hapus Terpilih
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border-border border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-b border-border">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="font-semibold border-b border-border">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50 transition-colors border-b border-border"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                    <div className="flex flex-col items-center space-y-2">
                      <Search className="h-8 w-8 text-muted-foreground/50" />
                      <p>Tidak ada data yang ditemukan</p>
                      {(globalFilter || columnFilters.length > 0) && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setGlobalFilter("")
                            setColumnFilters([])
                          }}
                        >
                          Reset Filter
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Enhanced Pagination */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-col space-y-2 md:flex-row md:items-center md:space-y-0 md:space-x-4">
          <div className="text-sm text-muted-foreground text-center md:text-left">
            Menampilkan {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} -{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length,
            )}{" "}
            dari {table.getFilteredRowModel().rows.length} data
          </div>
          {selectedRowsCount === 0 && (
            <Button variant="outline" size="sm" onClick={exportToCSV} className="w-full md:w-auto bg-transparent">
              <Download className="mr-2 h-4 w-4" />
              Export Semua
            </Button>
          )}
        </div>

        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-2">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-sm text-muted-foreground">Baris per halaman:</span>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                table.setPageSize(Number(value))
              }}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[5, 10, 20, 30, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="flex-1 md:flex-none"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Sebelumnya</span>
              <span className="sm:hidden">Prev</span>
            </Button>
            <div className="flex items-center space-x-1 px-2">
              <span className="text-sm text-muted-foreground hidden sm:inline">Halaman</span>
              <span className="text-sm font-medium">
                {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="flex-1 md:flex-none"
            >
              <span className="hidden sm:inline">Selanjutnya</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
