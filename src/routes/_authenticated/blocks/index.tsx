import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { UserX } from 'lucide-react'
import { Page } from '@/components/layout/page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
import { cn } from '@/lib/utils'
import { BlockDetailsSheet, type BlockDetailsData } from '@/routes/_authenticated/blocks/-block-details-sheet'
import { AddBlockDialog } from '@/routes/_authenticated/workers/-add-block-dialog'
import { workers } from '@/routes/_authenticated/workers/-workers-data'

export const Route = createFileRoute('/_authenticated/blocks/')({
  component: BlocksRoute,
})

type BlockStatus = 'active' | 'inactive'
type BlockScheduleType = 'full_day' | 'custom_hours'

type BlockRow = {
  pk: number
  workerPk: number
  workerName: string
  workerPhone: string
  status: BlockStatus
  dateFrom: Date
  dateTo: Date
  scheduleType: BlockScheduleType
  hourFrom?: string
  hourTo?: string
  reason: 'vacation' | 'sick' | 'personal' | 'other'
  createdAt: string
}

const statusLabels: Record<BlockStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
}

const statusBadgeClasses: Record<BlockStatus, string> = {
  active:
    'rounded-full border-0 bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  inactive:
    'rounded-full border-0 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-500/20 dark:text-slate-200',
}

const scheduleLabels: Record<BlockScheduleType, string> = {
  custom_hours: 'Custom Hours',
  full_day: 'Full Days',
}

const scheduleBadgeClasses: Record<BlockScheduleType, string> = {
  custom_hours:
    'rounded-full border-0 bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  full_day:
    'rounded-full border-0 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-500/20 dark:text-slate-200',
}

function BlocksRoute() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<BlockStatus | 'all'>('all')
  const [scheduleType, setScheduleType] = useState<BlockScheduleType | 'all'>('all')
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [blockOpen, setBlockOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedBlock, setSelectedBlock] = useState<BlockDetailsData | null>(null)

  const data = useMemo<BlockRow[]>(() => {
    return [
      {
        pk: 181,
        workerPk: 181,
        workerName: 'Shehab Eldin ghazy',
        workerPhone: '+965902020',
        status: 'active',
        dateFrom: new Date('2026-03-03T12:00:00'),
        dateTo: new Date('2026-03-04T12:00:00'),
        scheduleType: 'custom_hours',
        hourFrom: '9:00 AM',
        hourTo: '3:45 AM',
        reason: 'vacation',
        createdAt: 'March 13, 2026, 3:57 a.m.',
      },
      {
        pk: 127,
        workerPk: 127,
        workerName: 'Milton Sheikh',
        workerPhone: '+965902020',
        status: 'inactive',
        dateFrom: new Date('2026-03-03T12:00:00'),
        dateTo: new Date('2026-03-04T12:00:00'),
        scheduleType: 'full_day',
        reason: 'personal',
        createdAt: 'March 13, 2026, 3:57 a.m.',
      },
    ]
  }, [])

  const openDetails = (row: BlockRow) => {
    setSelectedBlock({
      pk: row.pk,
      workerPk: row.workerPk,
      status: row.status,
      dateFrom: row.dateFrom,
      dateTo: row.dateTo,
      scheduleType: row.scheduleType,
      hourFrom: row.hourFrom,
      hourTo: row.hourTo,
      reason: row.reason,
      createdAt: row.createdAt,
    })
    setDetailsOpen(true)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.filter((row) => {
      if (status !== 'all' && row.status !== status) return false
      if (scheduleType !== 'all' && row.scheduleType !== scheduleType) return false

      if (dateFrom && row.dateFrom < dateFrom) return false
      if (dateTo && row.dateTo > dateTo) return false

      if (!q) return true
      const pk = String(row.pk)
      const workerPk = String(row.workerPk)
      const name = row.workerName.toLowerCase()
      const phone = row.workerPhone.toLowerCase()
      return (
        pk.includes(q) ||
        workerPk.includes(q) ||
        name.includes(q) ||
        phone.includes(q)
      )
    })
  }, [data, query, status, scheduleType, dateFrom, dateTo])

  return (
    <Page
      title='Blocks'
      fluid
      className='font-inter px-4 py-4 sm:px-6 sm:py-5 lg:px-10 [&>div>div>h1]:text-xl [&>div>div>h1]:font-medium'
      actions={
        <Button
          className='h-9 gap-2 rounded-sm bg-[rgb(24,24,27)] text-white hover:bg-[rgb(24,24,27)]/90'
          onClick={() => setBlockOpen(true)}
        >
          <UserX className='size-4' />
          Add Block
        </Button>
      }
    >
      <div className='grid gap-4'>
        <SummaryCard value={String(data.length)} label='Total Blocks' />
      </div>

      <div className='flex flex-1 flex-col gap-4 text-sm'>
        <div className='grid gap-3 sm:grid-cols-[minmax(220px,360px)_repeat(4,120px)]'>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search by PK , Phone, Name'
            className='h-9 bg-card text-sm'
          />

          <Select
            value={status}
            onValueChange={(value) => setStatus(value as BlockStatus | 'all')}
          >
            <SelectTrigger className='w-full bg-card text-sm'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Status</SelectItem>
              {(['active', 'inactive'] as const).map((s) => (
                <SelectItem key={s} value={s}>
                  {statusLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={scheduleType}
            onValueChange={(value) =>
              setScheduleType(value as BlockScheduleType | 'all')
            }
          >
            <SelectTrigger className='w-full bg-card text-sm'>
              <SelectValue placeholder='Type' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Type</SelectItem>
              {(['custom_hours', 'full_day'] as const).map((t) => (
                <SelectItem key={t} value={t}>
                  {scheduleLabels[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type='button'
                variant='outline'
                className={cn(
                  'h-9 w-full justify-between bg-card px-3 text-sm font-normal',
                  !dateFrom && 'text-muted-foreground'
                )}
              >
                {dateFrom ? format(dateFrom, 'd MMMM, yyyy') : 'Date From'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                captionLayout='dropdown'
                selected={dateFrom}
                onSelect={(date) => setDateFrom(date ?? undefined)}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type='button'
                variant='outline'
                className={cn(
                  'h-9 w-full justify-between bg-card px-3 text-sm font-normal',
                  !dateTo && 'text-muted-foreground'
                )}
              >
                {dateTo ? format(dateTo, 'd MMMM, yyyy') : 'Date To'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                captionLayout='dropdown'
                selected={dateTo}
                onSelect={(date) => setDateTo(date ?? undefined)}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className='overflow-hidden rounded-none border'>
          <Table className='[&_th]:h-10 [&_th]:px-4 [&_th]:text-sm [&_th]:font-medium [&_th]:text-foreground [&_td]:px-4 [&_td]:py-2.5 [&_td]:text-sm'>
            <TableHeader>
              <TableRow className='hover:bg-transparent data-[state=selected]:bg-transparent'>
                <TableHead className='w-24 bg-card px-2 text-foreground'>
                  <div className='flex items-center gap-2'>
                    <Checkbox checked={false} aria-label='Select all' />
                    <span>PK</span>
                  </div>
                </TableHead>
                <TableHead className='min-w-[220px] bg-card border-s border-border/60'>
                  Worker
                </TableHead>
                <TableHead className='w-28 bg-card border-s border-border/60'>
                  Status
                </TableHead>
                <TableHead className='w-32 bg-card border-s border-border/60'>
                  Date From
                </TableHead>
                <TableHead className='w-32 bg-card border-s border-border/60'>
                  Date To
                </TableHead>
                <TableHead className='w-32 bg-card border-s border-border/60'>
                  Type
                </TableHead>
                <TableHead className='min-w-[200px] bg-card border-s border-border/60'>
                  Date Created
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((row) => (
                  <TableRow
                    key={row.pk}
                    role='button'
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openDetails(row)
                      }
                    }}
                    className='cursor-pointer hover:bg-muted/40 data-[state=selected]:bg-transparent'
                    onClick={() => openDetails(row)}
                  >
                    <TableCell className='bg-card px-2'>
                      <div className='flex items-center gap-2'>
                        <Checkbox
                          checked={false}
                          aria-label={`Select block ${row.pk}`}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span className='text-sm font-medium text-foreground'>
                          {row.pk}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className='bg-card border-s border-border/60'>
                      {row.workerName} ({row.workerPhone})
                    </TableCell>
                    <TableCell className='bg-card border-s border-border/60'>
                      <Badge
                        variant='secondary'
                        className={cn('font-medium', statusBadgeClasses[row.status])}
                      >
                        {statusLabels[row.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className='bg-card border-s border-border/60'>
                      {format(row.dateFrom, 'd MMMM, yyyy')}
                    </TableCell>
                    <TableCell className='bg-card border-s border-border/60'>
                      {format(row.dateTo, 'd MMMM, yyyy')}
                    </TableCell>
                    <TableCell className='bg-card border-s border-border/60'>
                      <Badge
                        variant='secondary'
                        className={cn('font-medium', scheduleBadgeClasses[row.scheduleType])}
                      >
                        {scheduleLabels[row.scheduleType]}
                      </Badge>
                    </TableCell>
                    <TableCell className='bg-card border-s border-border/60'>
                      {row.createdAt}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className='h-24 text-center'>
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <AddBlockDialog
        open={blockOpen}
        onOpenChange={setBlockOpen}
        workers={workers}
      />

      <BlockDetailsSheet
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        block={selectedBlock}
        workers={workers}
      />
    </Page>
  )
}

function SummaryCard({ value, label }: { value: string; label: string }) {
  return (
    <Card className='rounded-sm border-0 bg-card py-4 shadow-none'>
      <CardContent className='px-4'>
        <div className='flex flex-col gap-1'>
          <div className='text-base font-medium'>{value}</div>
          <div className='text-sm text-muted-foreground'>{label}</div>
        </div>
      </CardContent>
    </Card>
  )
}
