import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, X } from 'lucide-react'

type MockViolationStatus = 'pending' | 'approved'

const statusLabels: Record<MockViolationStatus, string> = {
  pending: 'Pending',
  approved: 'Approved',
}

const statusBadgeClasses: Record<MockViolationStatus, string> = {
  pending:
    'rounded-full border-0 bg-amber-100 px-3 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  approved:
    'rounded-full border-0 bg-emerald-100 px-3 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
}

function ThumbTile({
  children,
  showRemove,
}: {
  children?: ReactNode
  showRemove?: boolean
}) {
  return (
    <div className='relative aspect-[16/10] overflow-hidden rounded-sm border border-border/60 bg-muted'>
      {children}
      {showRemove ? (
        <button
          type='button'
          className='absolute right-1 top-1 inline-flex size-6 items-center justify-center rounded-full bg-muted/80 text-foreground shadow-sm hover:bg-muted'
          aria-label='Remove image'
          onClick={() => {}}
        >
          <X className='size-4' />
        </button>
      ) : null}
    </div>
  )
}

function AddThumbTile() {
  return (
    <button
      type='button'
      className='flex aspect-[16/10] items-center justify-center rounded-sm border border-dashed bg-background hover:bg-accent'
      aria-label='Add picture'
    >
      <Plus className='size-5 text-muted-foreground' />
    </button>
  )
}

function ValueFieldBox({ value, label }: { value: string; label: string }) {
  return (
    <div className='rounded-sm border border-sky-100/80 p-4 dark:border-border/60'>
      <div className='text-base font-medium text-foreground'>{value}</div>
      <div className='mt-2 text-xs font-medium text-muted-foreground'>{label}</div>
    </div>
  )
}

export function WorkerViolationsTab({
  count,
  workerPk,
}: {
  count: number
  workerPk: number
}) {
  if (count <= 0) {
    return (
      <div className='flex h-32 items-center justify-center rounded-none border bg-card text-sm text-muted-foreground'>
        No violations recorded.
      </div>
    )
  }

  const violationsToShow = Math.min(count, 2) // screenshot shows 2 cards

  const mock = [
    {
      name: 'Forgetting to wipe glasses',
      category: 'Washing Mistakes',
      amount: '20 SAR',
      bookingNumber: '526-292-210',
      status: 'pending' as const,
    },
    {
      name: 'Losing washing materials',
      category: 'General Violations',
      amount: '20 SAR',
      bookingNumber: '526-292-210',
      status: 'approved' as const,
    },
  ]

  const photos = [
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1200&auto=format&fit=crop',
  ]

  return (
    <div className='grid gap-6 sm:grid-cols-2'>
      {Array.from({ length: violationsToShow }, (_, i) => {
        const m = mock[i % mock.length]

        return (
          <Card
            key={`${workerPk}-v-card-${i}`}
            className='rounded-sm border border-border/60 bg-transparent shadow-none'
          >
            <CardContent className='p-4'>
              <div className='flex items-center justify-start'>
                <Badge variant='secondary' className={statusBadgeClasses[m.status]}>
                  {statusLabels[m.status]}
                </Badge>
              </div>

              <div className='mt-4 grid grid-cols-2 gap-4'>
                <ValueFieldBox value={m.name} label='Violation Name' />
                <ValueFieldBox value={m.category} label='Violation Category' />
                <ValueFieldBox value={m.amount} label='Amount' />
                <ValueFieldBox value={m.bookingNumber} label='Booking Number' />
              </div>

              <div className='mt-4 rounded-sm border border-sky-100/80 p-4 dark:border-border/60'>
                <div className='text-sm text-foreground'>
                  It refers to placeholder text or images used to fill spaces on a webpage
                  or document during the design phase. This guide will delve into what dummy
                  content is, its importance, types and other.
                </div>
                <div className='mt-2 text-xs font-medium text-muted-foreground'>Description</div>
              </div>

              <div className='mt-4 rounded-sm border border-sky-100/80 p-4 dark:border-border/60'>
                <div className='text-sm font-medium text-foreground'>
                  Oct. 2, 2025, 11:44 p.m.
                </div>
                <div className='mt-2 text-xs font-medium text-muted-foreground'>Date Created</div>
              </div>

              <div className='mt-4 grid grid-cols-4 gap-3'>
                {photos.map((src) => (
                  <ThumbTile key={`${workerPk}-v-${i}-${src}`} showRemove>
                    <img src={src} alt='' className='h-full w-full object-cover' />
                  </ThumbTile>
                ))}
                <AddThumbTile />
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
