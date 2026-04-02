import { z } from 'zod'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { ArrowLeft, TriangleAlert, User, UserMinus } from 'lucide-react'
import { Page } from '@/components/layout/page'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AddViolationDialog } from '@/routes/_authenticated/workers/-add-violation-dialog'
import { DeleteBlockDialog } from '@/routes/_authenticated/workers/-delete-block-dialog'
import {
  getWorkerByPk,
  stateLabels,
  stateBadgeClasses,
  statusLabels,
  statusBadgeClasses,
  workers,
} from '@/routes/_authenticated/workers/-workers-data'
import {
  WorkerDetailsTabs,
  workerDetailsTabs,
  type WorkerDetailsTabId,
} from '@/routes/_authenticated/workers/details-tabs/-worker-details-tabs'
import { cn } from '@/lib/utils'
import { useState } from 'react'

const workerDetailsSearchSchema = z.object({
  pk: z.number().optional().catch(undefined),
  tab: z.enum(workerDetailsTabs).optional().catch(undefined),
})

export const Route = createFileRoute('/_authenticated/workers/details')({
  validateSearch: workerDetailsSearchSchema,
  component: WorkerDetailsRoute,
})

function WorkerDetailsRoute() {
  const { history } = useRouter()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()
  const worker = getWorkerByPk(search.pk)
  const tab = (search.tab ?? 'profile') as WorkerDetailsTabId

  const [violationOpen, setViolationOpen] = useState(false)
  const [deleteBlockOpen, setDeleteBlockOpen] = useState(false)

  const title = worker ? `${worker.name}` : 'Worker details'

  return (
    <Page
      title={title}
      fluid
      className='font-inter px-4 py-4 sm:px-6 sm:py-5 lg:px-10 [&>div>div>h1]:sr-only'
      actions={
        <>
          <Button
            variant='destructive'
            className='h-9 gap-2'
            onClick={() => setDeleteBlockOpen(true)}
          >
            <UserMinus className='size-4' />
            Delete Block
          </Button>
          <Button
            className='h-9 gap-2 bg-[rgb(24,24,27)] text-white hover:bg-[rgb(24,24,27)]/90'
            onClick={() => setViolationOpen(true)}
          >
            <TriangleAlert className='size-4' />
            Add Violation
          </Button>
        </>
      }
    >
      <div className='flex w-full max-w-full flex-col gap-4 sm:gap-6'>
        <button
          type='button'
          onClick={() => history.go(-1)}
          className='flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground'
        >
          <ArrowLeft className='size-4' />
          Back
        </button>

        {!worker ? (
          <Card className='rounded-sm border-0 bg-card py-12 shadow-none'>
            <CardContent className='text-center text-sm text-muted-foreground'>
              Worker not found. Go back and select a row from the workers table.
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className='w-full rounded-sm border-0 bg-card shadow-none'>
              <CardContent className='flex items-center gap-4 p-4'>
                <div className='flex size-9 items-center justify-center rounded-full border bg-background'>
                  <User className='size-4 text-muted-foreground' />
                </div>
                <div className='flex flex-col gap-1'>
                  <div className='text-base font-semibold'>{worker.phone}</div>
                  <div className='flex flex-wrap items-center gap-2'>
                    <Badge
                      variant='secondary'
                      className={cn('text-xs font-semibold', stateBadgeClasses[worker.state])}
                    >
                      {stateLabels[worker.state]}
                    </Badge>
                    <Badge
                      variant='secondary'
                      className={cn('text-xs font-semibold', statusBadgeClasses[worker.status])}
                    >
                      {statusLabels[worker.status]}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className='grid gap-4 sm:grid-cols-4'>
              <SummaryCard
                value={String(worker.violations)}
                label='Total Violations'
                className='sm:col-span-2'
              />
              <SummaryCard
                value={String(worker.blocks)}
                label='Total Blocks'
                className='sm:col-span-2'
              />
            </div>

            <WorkerDetailsTabs
              worker={worker}
              tab={tab}
              onTabChange={(nextTab) =>
                navigate({
                  search: (prev) => ({
                    ...prev,
                    pk: worker.pk,
                    tab:
                      nextTab === 'profile'
                        ? undefined
                        : (nextTab as WorkerDetailsTabId),
                  }),
                })
              }
            />
          </>
        )}
      </div>

      <DeleteBlockDialog open={deleteBlockOpen} onOpenChange={setDeleteBlockOpen} />

      <AddViolationDialog
        key={violationOpen ? `violation-${worker?.pk ?? 'open'}` : 'violation-closed'}
        open={violationOpen}
        onOpenChange={setViolationOpen}
        workers={workers}
        initialWorkerPk={worker?.pk}
      />
    </Page>
  )
}

function SummaryCard({
  value,
  label,
  className,
}: {
  value: string
  label: string
  className?: string
}) {
  return (
    <Card className={cn('rounded-sm border-0 bg-card py-4 shadow-none', className)}>
      <CardContent className='px-4'>
        <div className='flex flex-col gap-1'>
          <div className='text-base font-semibold'>{value}</div>
          <div className='text-sm font-normal text-muted-foreground'>{label}</div>
        </div>
      </CardContent>
    </Card>
  )
}
