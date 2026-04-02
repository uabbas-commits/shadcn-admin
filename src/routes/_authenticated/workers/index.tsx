import { createFileRoute } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { TriangleAlert, UserPlus } from 'lucide-react'
import { Page } from '@/components/layout/page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { AddBlockDialog } from '@/routes/_authenticated/workers/-add-block-dialog'
import { AddViolationDialog } from '@/routes/_authenticated/workers/-add-violation-dialog'
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
import {
  type WorkerState,
  type WorkerStatus,
  stateLabels,
  stateBadgeClasses,
  statusLabels,
  statusBadgeClasses,
  workers,
} from '@/routes/_authenticated/workers/-workers-data'

export const Route = createFileRoute('/_authenticated/workers/')({
  component: WorkersRoute,
})

function WorkersRoute() {
  const navigate = Route.useNavigate()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<WorkerStatus | 'all'>('all')
  const [state, setState] = useState<WorkerState | 'all'>('all')
  const [blockOpen, setBlockOpen] = useState(false)
  const [blockWorkerPk, setBlockWorkerPk] = useState<number | undefined>(undefined)
  const [violationOpen, setViolationOpen] = useState(false)

  const openBlockModal = (pk?: number) => {
    setBlockWorkerPk(pk)
    setBlockOpen(true)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return workers.filter((w) => {
      if (status !== 'all' && w.status !== status) return false
      if (state !== 'all' && w.state !== state) return false

      if (!q) return true
      const pk = String(w.pk).toLowerCase()
      const phone = String(w.phone).toLowerCase()
      const name = String(w.name).toLowerCase()
      return pk.includes(q) || phone.includes(q) || name.includes(q)
    })
  }, [query, status, state])

  const summary = useMemo(() => {
    const activeWorkers = workers.filter((w) => w.state === 'active').length
    const blockedWorkers = workers.filter((w) => w.state === 'blocked').length
    const totalViolations = workers.reduce((acc, w) => acc + w.violations, 0)
    return { activeWorkers, blockedWorkers, totalViolations }
  }, [])

  const goToWorker = (pk: number) => {
    void navigate({ to: '/workers/details', search: { pk } })
  }

  return (
    <Page
      title='Workers'
      fluid
      className='font-inter px-4 py-4 sm:px-6 sm:py-5 lg:px-10 [&>div>div>h1]:text-xl [&>div>div>h1]:font-medium'
      actions={
        <>
          <Button
            variant='outline'
            className='h-9 gap-2 rounded-sm bg-card'
            onClick={() => openBlockModal()}
          >
            <UserPlus className='size-4' />
            Add Block
          </Button>
          <Button
            className='h-9 gap-2 rounded-sm bg-[rgb(24,24,27)] text-white hover:bg-[rgb(24,24,27)]/90'
            onClick={() => setViolationOpen(true)}
          >
            <TriangleAlert className='size-4' />
            Add Violation
          </Button>
        </>
      }
    >
      <div className='grid gap-4 sm:grid-cols-3'>
        <SummaryCard value={String(summary.activeWorkers)} label='Active Workers' />
        <SummaryCard value={String(summary.blockedWorkers)} label='Blocked' />
        <SummaryCard value={String(summary.totalViolations)} label='Total Violations' />
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
            value={status}
            onValueChange={(value) => setStatus(value as WorkerStatus | 'all')}
          >
            <SelectTrigger className='w-full bg-card text-sm'>
              <SelectValue placeholder='Status' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>Status</SelectItem>
              {(['verified', 'pending', 'unverified'] as const).map((s) => (
                <SelectItem key={s} value={s}>
                  {statusLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={state}
            onValueChange={(value) => setState(value as WorkerState | 'all')}
          >
            <SelectTrigger className='w-full bg-card text-sm'>
              <SelectValue placeholder='State' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all'>State</SelectItem>
              {(['active', 'inactive', 'blocked'] as const).map((s) => (
                <SelectItem key={s} value={s}>
                  {stateLabels[s]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='overflow-hidden rounded-none border'>
          <Table className='[&_th]:h-10 [&_th]:px-4 [&_th]:text-sm [&_th]:font-medium [&_th]:text-foreground [&_td]:px-4 [&_td]:py-2.5 [&_td]:text-sm'>
            <TableHeader>
              <TableRow className='hover:bg-transparent data-[state=selected]:bg-transparent'>
                <TableHead className='w-24 bg-card px-2'>
                  <div className='flex items-center gap-2'>
                    <Checkbox checked={false} aria-label='Select all' />
                    <span>PK</span>
                  </div>
                </TableHead>
                <TableHead className='min-w-[180px] bg-card border-s border-border/60'>
                  Name
                </TableHead>
                <TableHead className='w-32 bg-card border-s border-border/60'>
                  Status
                </TableHead>
                <TableHead className='w-24 bg-card border-s border-border/60'>
                  Violations
                </TableHead>
                <TableHead className='w-24 bg-card border-s border-border/60'>
                  Blocks
                </TableHead>
                <TableHead className='w-28 bg-card border-s border-border/60'>
                  State
                </TableHead>
                <TableHead className='min-w-[180px] bg-card border-s border-border/60'>
                  Date Joined
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length > 0 ? (
                filtered.map((w) => (
                  <TableRow
                    key={w.pk}
                    role='link'
                    tabIndex={0}
                    onClick={() => goToWorker(w.pk)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        goToWorker(w.pk)
                      }
                    }}
                    className='cursor-pointer hover:bg-muted/40 data-[state=selected]:bg-transparent'
                  >
                    <TableCell className='bg-card px-2' onClick={(e) => e.stopPropagation()}>
                      <div className='flex items-center gap-2'>
                        <Checkbox checked={false} aria-label={`Select worker ${w.pk}`} />
                        <span className='text-sm font-medium text-foreground'>{w.pk}</span>
                      </div>
                    </TableCell>
                    <TableCell className='bg-card border-s border-border/60'>
                      <div className='flex items-center gap-1.5'>
                        <span className='font-medium text-foreground'>{w.name}</span>
                        <span className='text-muted-foreground'>({w.phone})</span>
                      </div>
                    </TableCell>
                    <TableCell className='bg-card border-s border-border/60'>
                      <Badge
                        variant='secondary'
                        className={cn('font-medium', statusBadgeClasses[w.status])}
                      >
                        {statusLabels[w.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className='bg-card border-s border-border/60'>{w.violations}</TableCell>
                    <TableCell className='bg-card border-s border-border/60'>{w.blocks}</TableCell>
                    <TableCell className='bg-card border-s border-border/60'>
                      <Badge
                        variant='secondary'
                        className={cn('font-medium', stateBadgeClasses[w.state])}
                      >
                        {stateLabels[w.state]}
                      </Badge>
                    </TableCell>
                    <TableCell className='bg-card border-s border-border/60'>
                      {w.dateJoined}
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
        initialWorkerPk={blockWorkerPk}
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
