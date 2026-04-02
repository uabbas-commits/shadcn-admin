import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
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
import { Button } from '@/components/ui/button'
import { CustomerBookingDetailsSheet } from '@/routes/_authenticated/customers/details-tabs/-bookings-details-sheet'

const bookingStatusValues = ['completed', 'cancelled'] as const
type BookingStatus = (typeof bookingStatusValues)[number]

type CustomerBooking = {
  pk: number
  bookingNumber: string
  status: BookingStatus
  worker: string
  location: string
  rating: number
  dateTime: Date
}

const statusStyles = new Map<BookingStatus, string>([
  [
    'completed',
    'border-0 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  ],
  [
    'cancelled',
    'border-0 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-200',
  ],
])

function formatDate(date: Date) {
  return format(date, 'MMMM d, yyyy')
}

function formatTime(date: Date) {
  return format(date, 'h:mm a')
    .replace(/\bAM\b/, 'a.m.')
    .replace(/\bPM\b/, 'p.m.')
}

export function CustomerBookingsTab() {
  const data = useMemo<CustomerBooking[]>(
    () => [
      {
        pk: 181,
        bookingNumber: '826-353-362',
        status: 'completed',
        worker: '14-Rabie',
        location: '24.71355174,66.75295257',
        rating: 3,
        dateTime: new Date('2026-03-13T03:45:00'),
      },
      {
        pk: 127,
        bookingNumber: '180-534-569',
        status: 'completed',
        worker: '81-Mohamed',
        location: '24.8040833,46.6418614',
        rating: 1,
        dateTime: new Date('2026-03-13T15:45:00'),
      },
      {
        pk: 328,
        bookingNumber: '998-620-123',
        status: 'cancelled',
        worker: '90-Demo',
        location: '24.71355174,46.0752957',
        rating: 5,
        dateTime: new Date('2026-03-13T12:00:00'),
      },
    ],
    []
  )

  const columns = useMemo<ColumnDef<CustomerBooking>[]>(
    () => [
      {
        id: 'select',
        header: () => null,
        cell: () => (
          <Checkbox
            checked={false}
            aria-label='Select booking'
            onClick={(e) => e.stopPropagation()}
          />
        ),
        meta: { thClassName: 'w-10 pe-0', tdClassName: 'pe-0' },
        enableSorting: false,
      },
      {
        accessorKey: 'pk',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Pk' />,
        cell: ({ row }) => (
          <span className='text-sm font-normal text-foreground'>
            {row.getValue('pk')}
          </span>
        ),
        meta: { thClassName: 'w-16 ps-0 text-foreground', tdClassName: 'ps-0' },
        enableSorting: false,
      },
      {
        accessorKey: 'bookingNumber',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Booking Number' />
        ),
        cell: ({ row }) => (
          <span className='text-sm'>{row.getValue('bookingNumber')}</span>
        ),
        meta: {
          thClassName: 'border-s border-border/60 min-w-[140px]',
          tdClassName: 'border-s border-border/60',
        },
        enableSorting: false,
      },
      {
        accessorKey: 'status',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Status' />
        ),
        cell: ({ row }) => {
          const value = row.original.status
          return (
            <Badge
              variant='secondary'
              className={cn('px-2.5 py-0.5 text-xs font-medium', statusStyles.get(value))}
            >
              {value === 'completed' ? 'Completed' : 'Cancelled'}
            </Badge>
          )
        },
        meta: {
          thClassName: 'border-s border-border/60 w-[130px]',
          tdClassName: 'border-s border-border/60',
        },
        enableSorting: false,
      },
      {
        accessorKey: 'worker',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Worker' />
        ),
        cell: ({ row }) => <span className='text-sm'>{row.getValue('worker')}</span>,
        meta: {
          thClassName: 'border-s border-border/60 w-[140px]',
          tdClassName: 'border-s border-border/60',
        },
        enableSorting: false,
      },
      {
        accessorKey: 'location',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Location' />
        ),
        cell: ({ row }) => (
          <span className='text-sm'>{row.getValue('location')}</span>
        ),
        meta: {
          thClassName: 'border-s border-border/60 min-w-[180px]',
          tdClassName: 'border-s border-border/60',
        },
        enableSorting: false,
      },
      {
        accessorKey: 'rating',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Rating' />
        ),
        cell: ({ row }) => <span className='text-sm'>{row.getValue('rating')}</span>,
        meta: {
          thClassName: 'border-s border-border/60 w-[100px]',
          tdClassName: 'border-s border-border/60',
        },
        enableSorting: false,
      },
      {
        accessorKey: 'dateTime',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Date' />,
        cell: ({ row }) => (
          <span className='text-sm'>{formatDate(row.original.dateTime)}</span>
        ),
        meta: {
          thClassName: 'border-s border-border/60 w-[160px]',
          tdClassName: 'border-s border-border/60',
        },
        enableSorting: false,
      },
      {
        id: 'time',
        header: ({ column }) => <DataTableColumnHeader column={column} title='Time' />,
        cell: ({ row }) => (
          <span className='text-sm'>{formatTime(row.original.dateTime)}</span>
        ),
        meta: {
          thClassName: 'border-s border-border/60 w-[120px]',
          tdClassName: 'border-s border-border/60',
        },
        enableSorting: false,
      },
    ],
    []
  )

  const [globalFilter, setGlobalFilter] = useState('')
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { globalFilter, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const value = String(filterValue ?? '').trim().toLowerCase()
      if (!value) return true
      const pk = String(row.original.pk).toLowerCase()
      const bookingNumber = String(row.original.bookingNumber).toLowerCase()
      return pk.includes(value) || bookingNumber.includes(value)
    },
  })

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selected, setSelected] = useState<CustomerBooking | null>(null)
  const openDetails = (booking: CustomerBooking) => {
    setSelected(booking)
    setDetailsOpen(true)
  }

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
            {bookingStatusValues.map((status) => (
              <SelectItem key={status} value={status}>
                {status === 'completed' ? 'Completed' : 'Cancelled'}
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
            {Array.from(new Set(data.map((d) => d.worker))).map((worker) => (
              <SelectItem key={worker} value={worker}>
                {worker}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className='overflow-hidden rounded-none border'>
        <Table className='[&_th]:h-10 [&_th]:px-4 [&_th]:text-sm [&_th]:font-medium [&_th]:text-foreground [&_td]:px-4 [&_td]:py-2.5 [&_td]:text-sm [&_th:first-child]:pe-0 [&_td:first-child]:pe-0 [&_th:nth-child(2)]:ps-0 [&_td:nth-child(2)]:ps-0'>
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
                  onClick={() => openDetails(row.original)}
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
                      {cell.column.id === 'bookingNumber' ? (
                        <Button
                          variant='link'
                          className='px-0 text-foreground hover:no-underline focus-visible:no-underline active:no-underline'
                          onClick={(e) => {
                            e.stopPropagation()
                            openDetails(row.original)
                          }}
                        >
                          {row.original.bookingNumber}
                        </Button>
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className='h-24 text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <CustomerBookingDetailsSheet
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        booking={
          selected
            ? {
                ...selected,
                customerPhone: '+96538920',
                branch: 'main',
                car: 'A4 (2023)',
                items: 'Claro-lavender sc..',
                partner: 'Partner',
                uploadedBy: '+9637202892',
                source: 'Customer Service',
                photos: [
                  'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1200&auto=format&fit=crop',
                  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop',
                ],
              }
            : null
        }
      />
    </div>
  )
}
