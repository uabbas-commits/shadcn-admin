import { useEffect, useState } from 'react'
import { useNavigate as useRouterNavigate } from '@tanstack/react-router'
import {
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
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
import {
  type Customer,
  customerStatusValues,
  customerTierValues,
  walletStatusValues,
} from '../data/schema'
import { customersColumns as columns } from './customers-columns'

type CustomersTableProps = {
  data: Customer[]
  search: Record<string, unknown>
  navigate: NavigateFn
}

const statusLabels: Record<(typeof customerStatusValues)[number], string> = {
  verified: 'Verified',
  pending: 'Pending',
  unverified: 'Unverified',
}

const tierLabels: Record<(typeof customerTierValues)[number], string> = {
  new: 'New Customer',
  gold: 'Gold',
  bronze: 'Bronze',
  silver: 'Silver',
}

const walletLabels: Record<(typeof walletStatusValues)[number], string> = {
  valid: 'Valid',
  suspended: 'Suspended',
  frozen: 'Frozen',
  closed: 'Closed',
}

export function CustomersTable({ data, search, navigate }: CustomersTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])
  const rowNavigate = useRouterNavigate()

  const {
    globalFilter = '',
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: true, key: 'filter', trim: true },
    columnFilters: [
      { columnId: 'status', searchKey: 'status', type: 'string' },
      { columnId: 'tier', searchKey: 'tier', type: 'string' },
      { columnId: 'wallet', searchKey: 'wallet', type: 'string' },
    ],
  })

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
      columnFilters,
      globalFilter,
    },
    onPaginationChange,
    onColumnFiltersChange,
    onGlobalFilterChange,
    onSortingChange: setSorting,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const value = String(filterValue ?? '').trim().toLowerCase()
      if (!value) return true
      const pk = String(row.original.pk).toLowerCase()
      const phone = String(row.original.phone).toLowerCase()
      return pk.includes(value) || phone.includes(value)
    },
  })

  useEffect(() => {
    ensurePageInRange(table.getPageCount())
  }, [table, ensurePageInRange])

  return (
    <div className='flex flex-1 flex-col gap-4 text-sm'>
      <div className='grid gap-3 sm:grid-cols-[minmax(220px,360px)_repeat(3,120px)]'>
        <Input
          value={globalFilter}
          onChange={(e) => onGlobalFilterChange?.(e.target.value)}
          placeholder='Search by PK , Phone'
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
            {customerStatusValues.map((status) => (
              <SelectItem key={status} value={status}>
                {statusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={
            (table.getColumn('tier')?.getFilterValue() as string | undefined) ??
            'all'
          }
          onValueChange={(value) =>
            table
              .getColumn('tier')
              ?.setFilterValue(value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger className='w-full bg-card text-sm'>
            <SelectValue placeholder='Tier' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tier</SelectItem>
            {customerTierValues.map((tier) => (
              <SelectItem key={tier} value={tier}>
                {tierLabels[tier]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={
            (table.getColumn('wallet')?.getFilterValue() as string | undefined) ??
            'all'
          }
          onValueChange={(value) =>
            table
              .getColumn('wallet')
              ?.setFilterValue(value === 'all' ? undefined : value)
          }
        >
          <SelectTrigger className='w-full bg-card text-sm'>
            <SelectValue placeholder='Wallet' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Wallet</SelectItem>
            {walletStatusValues.map((wallet) => (
              <SelectItem key={wallet} value={wallet}>
                {walletLabels[wallet]}
              </SelectItem>
            ))}
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
                <TableRow
                  key={row.id}
                  className='hover:bg-transparent cursor-pointer'
                  onClick={() =>
                    rowNavigate({
                      to: '/customers/details',
                      search: { pk: row.original.pk },
                    })
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-card',
                        cell.column.columnDef.meta?.className,
                        cell.column.columnDef.meta?.tdClassName
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='h-24 text-center'>
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
