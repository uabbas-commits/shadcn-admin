import type { ReactNode } from 'react'
import type { Worker } from '@/routes/_authenticated/workers/-workers-data'
import { Card, CardContent } from '@/components/ui/card'

export function WorkerProfileTab({ worker }: { worker: Worker }) {
  return (
    <div className='grid gap-4 sm:grid-cols-2'>
      <Card className='rounded-sm border-0 bg-card shadow-none'>
        <CardContent className='p-0'>
          <DetailCell label='PK' value={String(worker.pk)} />
        </CardContent>
      </Card>
      <Card className='rounded-sm border-0 bg-card shadow-none'>
        <CardContent className='p-0'>
          <DetailCell label='Date Joined' value={worker.dateJoined} />
        </CardContent>
      </Card>
      <Card className='rounded-sm border-0 bg-card shadow-none'>
        <CardContent className='p-0'>
          <DetailCell label='Phone' value={worker.phone} />
        </CardContent>
      </Card>
      <Card className='rounded-sm border-0 bg-card shadow-none'>
        <CardContent className='p-0'>
          <DetailCell label='Name' value={worker.name} />
        </CardContent>
      </Card>
    </div>
  )
}

function DetailCell({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className='flex flex-col gap-1 p-4'>
      <div className='text-base font-semibold'>{value}</div>
      <div className='text-sm font-medium text-muted-foreground'>{label}</div>
    </div>
  )
}
