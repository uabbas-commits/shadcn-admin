import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable as createReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const carStatusValues = ['active', 'inactive'] as const
type CarStatus = (typeof carStatusValues)[number]

type CustomerCar = {
  pk: number
  brand: string
  model: string
  plateNumber: string
  color: string
  dateAdded: Date
  status: CarStatus
  worker: string
}

function formatCarDate(date: Date) {
  return format(date, 'MMM. d, yyyy, h:mm a')
    .replace(/\bAM\b/, 'a.m.')
    .replace(/\bPM\b/, 'p.m.')
}

export function CustomerCarsTab() {
  const data = useMemo<CustomerCar[]>(
    () => [
      {
        pk: 181,
        brand: 'Toyota',
        model: 'Camry',
        plateNumber: 'K BC 1234',
        color: 'Black',
        dateAdded: new Date('2025-10-02T23:44:00'),
        status: 'active',
        worker: 'Worker',
      },
      {
        pk: 127,
        brand: 'Toyota',
        model: 'Corolla',
        plateNumber: 'A D E 6289',
        color: 'White',
        dateAdded: new Date('2025-10-02T23:44:00'),
        status: 'active',
        worker: 'Worker',
      },
    ],
    []
  )

  const columns = useMemo<ColumnDef<CustomerCar>[]>(
    () => [
      {
        accessorKey: 'pk',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Pk' />,
        cell: ({ row }) => <span className='text-sm'>{row.getValue('pk')}</span>,
        meta: { thClassName: 'w-[72px]' },
        enableSorting: false,
      },
      {
        accessorKey: 'brand',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Brand' />
        ),
        cell: ({ row }) => <span className='text-sm'>{row.getValue('brand')}</span>,
        meta: {
          thClassName: 'border-s border-border/60',
          tdClassName: 'border-s border-border/60',
        },
        enableSorting: false,
      },
      {
        accessorKey: 'model',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Model' />
        ),
        cell: ({ row }) => <span className='text-sm'>{row.getValue('model')}</span>,
        meta: {
          thClassName: 'border-s border-border/60',
          tdClassName: 'border-s border-border/60',
        },
        enableSorting: false,
      },
      {
        accessorKey: 'plateNumber',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Plate number' />
        ),
        cell: ({ row }) => (
          <span className='text-sm'>{row.getValue('plateNumber')}</span>
        ),
        meta: {
          thClassName: 'border-s border-border/60',
          tdClassName: 'border-s border-border/60',
        },
        enableSorting: false,
      },
      {
        accessorKey: 'color',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Color' />
        ),
        cell: ({ row }) => <span className='text-sm'>{row.getValue('color')}</span>,
        meta: {
          thClassName: 'border-s border-border/60',
          tdClassName: 'border-s border-border/60',
        },
        enableSorting: false,
      },
      {
        accessorKey: 'dateAdded',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Date Added' />
        ),
        cell: ({ row }) => (
          <span className='text-sm text-muted-foreground'>
            {formatCarDate(row.original.dateAdded)}
          </span>
        ),
        meta: {
          thClassName: 'border-s border-border/60',
          tdClassName: 'border-s border-border/60',
        },
        enableSorting: false,
      },
      {
        accessorKey: 'status',
      },
      {
        accessorKey: 'worker',
      },
    ],
    []
  )

  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = createReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters },
    initialState: { columnVisibility: { status: false, worker: false } },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const value = String(filterValue ?? '').trim().toLowerCase()
      if (!value) return true
      const pk = String(row.original.pk).toLowerCase()
      const plateNumber = String(row.original.plateNumber).toLowerCase()
      const brand = String(row.original.brand).toLowerCase()
      const model = String(row.original.model).toLowerCase()
      return (
        pk.includes(value) ||
        plateNumber.includes(value) ||
        brand.includes(value) ||
        model.includes(value)
      )
    },
  })

  return (
    <div className='flex flex-1 flex-col gap-4 text-sm'>
      <div className='grid gap-3 sm:grid-cols-[minmax(220px,360px)_repeat(2,120px)]'>
        <Input
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder='Search by PK , Booking Number'
          className='h-9 bg-card text-sm'
        />
        <Select
          value={
            (table.getColumn('status')?.getFilterValue() as string | undefined) ??
            'all'
          }
          onValueChange={(value) =>
            table
              .getColumn('status')
              ?.setFilterValue(value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger className='w-full bg-card text-sm'>
            <SelectValue placeholder='Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Status</SelectItem>
            {carStatusValues.map((status) => (
              <SelectItem key={status} value={status}>
                {status === 'active' ? 'Active' : 'Inactive'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={
            (table.getColumn('worker')?.getFilterValue() as string | undefined) ??
            'all'
          }
          onValueChange={(value) =>
            table
              .getColumn('worker')
              ?.setFilterValue(value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger className='w-full bg-card text-sm'>
            <SelectValue placeholder='Worker' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Worker</SelectItem>
            <SelectItem value='Worker'>Worker</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='overflow-hidden rounded-none border'>
        <Table className='[&_th]:h-10 [&_th]:px-4 [&_th]:text-sm [&_th]:font-medium [&_th]:text-foreground [&_td]:px-4 [&_td]:py-2.5 [&_td]:text-sm'>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='hover:bg-transparent'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      'bg-card',
                      header.column.columnDef.meta?.className,
                      header.column.columnDef.meta?.thClassName
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className='hover:bg-transparent'>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-card',
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
