import { createFileRoute } from '@tanstack/react-router'
import { TriangleAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Page } from '@/components/layout/page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
import { cn } from '@/lib/utils'
import { AddViolationDialog } from '@/routes/_authenticated/workers/-add-violation-dialog'
import { workers } from '@/routes/_authenticated/workers/-workers-data'
import {
  type ViolationDetailsData,
  ViolationDetailsSheet,
} from '@/routes/_authenticated/violations/-violation-details-sheet'

export const Route = createFileRoute('/_authenticated/violations/')({
  component: ViolationsRoute,
})

type ViolationStatus = 'active' | 'closed'
type ViolationCategory = 'washing_mistakes' | 'general_violations'

type ViolationRow = {
  code: number
  name: string
  category: ViolationCategory
  amountSar: number
  status: ViolationStatus
  dateAdded: string
  workerPk: number
  workerPhone: string
  description: string
  photos: string[]
}

const categoryLabels: Record<ViolationCategory, string> = {
  washing_mistakes: 'Washing Mistakes',
  general_violations: 'General Violations',
}

const statusLabels: Record<ViolationStatus, string> = {
  active: 'Active',
  closed: 'Closed',
}

const statusBadgeClasses: Record<ViolationStatus, string> = {
  active:
    'rounded-full border-0 bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  closed:
    'rounded-full border-0 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-500/20 dark:text-slate-200',
}

function ViolationsRoute() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ViolationCategory | 'all'>('all')
  const [status, setStatus] = useState<ViolationStatus | 'all'>('all')
  const [violationOpen, setViolationOpen] = useState(false)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedViolation, setSelectedViolation] = useState<ViolationDetailsData | null>(null)

  const data = useMemo<ViolationRow[]>(() => {
    return [
      {
        code: 211,
        name: 'Forgetting to wipe glasses',
        category: 'washing_mistakes',
        amountSar: 20,
        status: 'active',
        dateAdded: 'March 13, 2026, 3:57 a.m.',
        workerPk: 181,
        workerPhone: '+965902020',
        description:
          'It refers to placeholder text or images used to fill spaces on a webpage or document during the design phase. This guide will delve into what dummy content is, its importance, types',
        photos: [
          'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1200&auto=format&fit=crop',
        ],
      },
      {
        code: 602,
        name: 'Receiving 1-star rating twice in a day',
        category: 'general_violations',
        amountSar: 19,
        status: 'closed',
        dateAdded: 'Oct. 2, 2025, 11:44 p.m.',
        workerPk: 328,
        workerPhone: '+965902020',
        description:
          'It refers to placeholder text or images used to fill spaces on a webpage or document during the design phase. This guide will delve into what dummy content is, its importance, types',
        photos: [
          'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop',
          'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop',
        ],
      },
    ]
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.filter((row) => {
      if (category !== 'all' && row.category !== category) return false
      if (status !== 'all' && row.status !== status) return false
      if (!q) return true

      return (
        String(row.workerPk).toLowerCase().includes(q) ||
        String(row.workerPhone).toLowerCase().includes(q) ||
        row.name.toLowerCase().includes(q)
      )
    })
  }, [category, data, query, status])

  const summary = useMemo(() => {
    const totalViolations = data.length
    const totalPaidSar = data.reduce((acc, r) => acc + r.amountSar, 0)
    return { totalViolations, totalPaidSar }
  }, [data])

  const openDetails = (row: ViolationRow) => {
    setSelectedViolation({
      code: row.code,
      name: row.name,
      description: row.description,
      categoryLabel: categoryLabels[row.category],
      amountLabel: `${row.amountSar} SAR`,
      statusLabel: statusLabels[row.status],
      statusBadgeClassName: cn('px-2.5 py-0.5 text-xs font-medium', statusBadgeClasses[row.status]),
      dateAddedLabel: row.dateAdded,
      photos: row.photos,
    })
    setDetailsOpen(true)
  }

  return (
    <Page
      title='Violations'
      fluid
      className='font-inter px-4 py-4 sm:px-6 sm:py-5 lg:px-10 [&>div>div>h1]:text-xl [&>div>div>h1]:font-medium'
      actions={
        <Button
          className='h-9 gap-2 rounded-sm bg-[rgb(24,24,27)] text-white hover:bg-[rgb(24,24,27)]/90'
          onClick={() => setViolationOpen(true)}
        >
          <TriangleAlert className='size-4' />
          Add Violation
        </Button>
      }
    >
      <div className='grid gap-4 sm:grid-cols-2'>
        <SummaryCard value={String(summary.totalViolations)} label='Total Violations' />
        <SummaryCard value={`${summary.totalPaidSar} SAR`} label='Total Paid' />
      </div>

      <div className='flex flex-1 flex-col gap-4 text-sm'>
        <div className='grid gap-3 sm:grid-cols-[minmax(220px,360px)_repeat(2,120px)]'>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder='Search by PK , Phone, Name'
            className='h-9 bg-card text-sm'
          />

          <Select
            value={category}
            onValueChange={(value) => setCategory(value as ViolationCategory | 'all')}
          >
            <SelectTrigger className='w-full bg-card text-sm'>
              <SelectValue placeholder='Category' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Category</SelectItem>
              {(['washing_mistakes', 'general_violations'] as const).map((c) => (
                <SelectItem key={c} value={c}>
                  {categoryLabels[c]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={status}
            onValueChange={(value) => setStatus(value as ViolationStatus | 'all')}
          >
            <SelectTrigger className='w-full bg-card text-sm'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Status</SelectItem>
              {(['active', 'closed'] as const).map((s) => (
                <SelectItem key={s} value={s}>
                  {statusLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='overflow-hidden rounded-none border'>
          <Table className='[&_th]:h-10 [&_th]:px-4 [&_th]:text-sm [&_th]:font-medium [&_th]:text-foreground [&_td]:px-4 [&_td]:py-2.5 [&_td]:text-sm'>
            <TableHeader>
              <TableRow className='hover:bg-transparent data-[state=selected]:bg-transparent'>
                <TableHead className='w-20 bg-card text-foreground'>Code</TableHead>
                <TableHead className='min-w-[220px] bg-card border-s border-border/60'>
                  Name
                </TableHead>
                <TableHead className='min-w-[180px] bg-card border-s border-border/60'>
                  Category
                </TableHead>
                <TableHead className='w-28 bg-card border-s border-border/60'>Amount</TableHead>
                <TableHead className='w-28 bg-card border-s border-border/60'>Status</TableHead>
                <TableHead className='min-w-[200px] bg-card border-s border-border/60'>
                  Date Added
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((row) => (
                  <TableRow
                    key={row.code}
                    role='button'
                    tabIndex={0}
                    onClick={() => openDetails(row)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        openDetails(row)
                      }
                    }}
                    className='cursor-pointer hover:bg-muted/40 data-[state=selected]:bg-transparent'
                  >
                    <TableCell className='bg-card text-foreground font-medium'>
                      {row.code}
                    </TableCell>
                    <TableCell className='bg-card border-s border-border/60'>
                      {row.name}
                    </TableCell>
                    <TableCell className='bg-card border-s border-border/60'>
                      {categoryLabels[row.category]}
                    </TableCell>
                    <TableCell className='bg-card border-s border-border/60'>
                      {row.amountSar} SAR
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
                      {row.dateAdded}
                    </TableCell>
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

      <ViolationDetailsSheet
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        violation={selectedViolation}
      />

      <AddViolationDialog
        key={violationOpen ? 'violation-open' : 'violation-closed'}
        open={violationOpen}
        onOpenChange={setViolationOpen}
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
