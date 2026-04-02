import { useMemo, useState } from 'react'
import { format } from 'date-fns'
import { Expand, UserX, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { Worker } from '@/routes/_authenticated/workers/-workers-data'

const timeOptions = [
  '12:00 AM',
  '1:00 AM',
  '2:00 AM',
  '3:00 AM',
  '4:00 AM',
  '5:00 AM',
  '6:00 AM',
  '7:00 AM',
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
  '7:00 PM',
  '8:00 PM',
  '9:00 PM',
  '10:00 PM',
  '11:00 PM',
]

type BlockStatus = 'active' | 'inactive'
type BlockScheduleType = 'full_day' | 'custom_hours'
type BlockReason = 'vacation' | 'sick' | 'personal' | 'other'

export type BlockDetailsData = {
  pk: number
  workerPk: number
  status: BlockStatus
  dateFrom: Date
  dateTo: Date
  scheduleType: BlockScheduleType
  hourFrom?: string
  hourTo?: string
  reason: BlockReason
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

const reasonLabels: Record<BlockReason, string> = {
  vacation: 'Vacation',
  sick: 'Sick',
  personal: 'Personal',
  other: 'Other',
}

export function BlockDetailsSheet({
  open,
  onOpenChange,
  block,
  workers,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  block: BlockDetailsData | null
  workers: Worker[]
}) {
  const defaultWorkerPk = useMemo(() => {
    return block?.workerPk ?? workers[0]?.pk
  }, [block?.workerPk, workers])

  const [workerPk, setWorkerPk] = useState<string>(defaultWorkerPk ? String(defaultWorkerPk) : '')
  const [dateFrom, setDateFrom] = useState<Date | undefined>(block?.dateFrom)
  const [dateTo, setDateTo] = useState<Date | undefined>(block?.dateTo)
  const [scheduleType, setScheduleType] = useState<BlockScheduleType>(block?.scheduleType ?? 'full_day')
  const [hourFrom, setHourFrom] = useState<string>(block?.hourFrom ?? '9:00 AM')
  const [hourTo, setHourTo] = useState<string>(block?.hourTo ?? '3:45 AM')
  const [reason, setReason] = useState<BlockReason>(block?.reason ?? 'vacation')
  const [status, setStatus] = useState<BlockStatus>(block?.status ?? 'active')

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        overlayClassName='bg-transparent'
        className='sm:max-w-md overflow-hidden [&_[data-slot="sheet-close"]]:hidden'
      >
        <SheetTitle className='sr-only'>Block details</SheetTitle>
        <SheetDescription className='sr-only'>View block details</SheetDescription>

        <div className='flex items-center justify-between border-b px-4 py-3'>
          <div className='min-w-0 flex-1 truncate text-sm font-medium text-muted-foreground'>
            Details
          </div>
          <div className='flex items-center gap-3'>
            <button
              type='button'
              className='inline-flex size-9 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground hover:text-foreground'
              aria-label='Expand'
              onClick={() => {}}
            >
              <Expand className='size-4' />
            </button>
            <button
              type='button'
              className='inline-flex size-9 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground hover:text-foreground'
              aria-label='Close'
              onClick={() => onOpenChange(false)}
            >
              <X className='size-4' />
            </button>
          </div>
        </div>

        {block ? (
          <ScrollArea className='min-h-0 flex-1 px-4 pb-6'>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col items-center gap-3 pt-3'>
                <div className='mx-auto flex size-12 items-center justify-center rounded-full border bg-background text-muted-foreground'>
                  <UserX className='size-5' />
                </div>
                <div className='text-lg font-medium'>{String(block.pk)}</div>
                <div className='flex items-center gap-2'>
                  <Badge variant='secondary' className={statusBadgeClasses[block.status]}>
                    {statusLabels[block.status]}
                  </Badge>
                  <Badge variant='secondary' className={scheduleBadgeClasses[block.scheduleType]}>
                    {scheduleLabels[block.scheduleType]}
                  </Badge>
                </div>
              </div>

              <Section title='Block Informations'>
                <div className='grid gap-3'>
                  <div className='grid gap-1.5'>
                    <div className='text-xs font-medium text-muted-foreground'>Worker</div>
                    <Select value={workerPk} onValueChange={setWorkerPk}>
                      <SelectTrigger className='h-9 w-full rounded-sm bg-background text-sm shadow-none'>
                        <SelectValue placeholder='Select worker' />
                      </SelectTrigger>
                      <SelectContent>
                        {workers.map((w) => (
                          <SelectItem key={w.pk} value={String(w.pk)}>
                            {w.name} ({w.phone})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='grid grid-cols-2 gap-3'>
                    <div className='grid gap-1.5'>
                      <div className='text-xs font-medium text-muted-foreground'>Date From</div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type='button'
                            variant='outline'
                            className={cn(
                              'h-9 w-full justify-between rounded-sm bg-background px-3 text-sm font-normal shadow-none',
                              !dateFrom && 'text-muted-foreground'
                            )}
                          >
                            {dateFrom ? format(dateFrom, 'd MMMM, yyyy') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            captionLayout='dropdown'
                            selected={dateFrom}
                            onSelect={(d) => setDateFrom(d ?? undefined)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className='grid gap-1.5'>
                      <div className='text-xs font-medium text-muted-foreground'>Date To</div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            type='button'
                            variant='outline'
                            className={cn(
                              'h-9 w-full justify-between rounded-sm bg-background px-3 text-sm font-normal shadow-none',
                              !dateTo && 'text-muted-foreground'
                            )}
                          >
                            {dateTo ? format(dateTo, 'd MMMM, yyyy') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            captionLayout='dropdown'
                            selected={dateTo}
                            onSelect={(d) => setDateTo(d ?? undefined)}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <RadioGroup
                    value={scheduleType}
                    onValueChange={(v) => setScheduleType(v as BlockScheduleType)}
                    className='flex items-center gap-6 pt-1'
                  >
                    <label className='flex items-center gap-2'>
                      <RadioGroupItem value='full_day' />
                      <span className='text-sm'>Full day</span>
                    </label>
                    <label className='flex items-center gap-2'>
                      <RadioGroupItem value='custom_hours' />
                      <span className='text-sm'>Custom hours</span>
                    </label>
                  </RadioGroup>

                  <div
                    className={cn(
                      'grid grid-cols-2 gap-3',
                      scheduleType !== 'custom_hours' && 'opacity-50'
                    )}
                  >
                    <div className='grid gap-1.5'>
                      <div className='text-xs font-medium text-muted-foreground'>From Hour</div>
                      <Select
                        value={hourFrom}
                        onValueChange={setHourFrom}
                        disabled={scheduleType !== 'custom_hours'}
                      >
                        <SelectTrigger className='h-9 w-full rounded-sm bg-background text-sm shadow-none'>
                          <SelectValue placeholder='Select time' />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className='grid gap-1.5'>
                      <div className='text-xs font-medium text-muted-foreground'>To Hour</div>
                      <Select
                        value={hourTo}
                        onValueChange={setHourTo}
                        disabled={scheduleType !== 'custom_hours'}
                      >
                        <SelectTrigger className='h-9 w-full rounded-sm bg-background text-sm shadow-none'>
                          <SelectValue placeholder='Select time' />
                        </SelectTrigger>
                        <SelectContent>
                          {timeOptions.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className='grid gap-1.5'>
                    <div className='text-xs font-medium text-muted-foreground'>Reason</div>
                    <Select value={reason} onValueChange={(v) => setReason(v as BlockReason)}>
                      <SelectTrigger className='h-9 w-full rounded-sm bg-background text-sm shadow-none'>
                        <SelectValue placeholder='Select reason' />
                      </SelectTrigger>
                      <SelectContent>
                        {(['vacation', 'sick', 'personal', 'other'] as const).map((r) => (
                          <SelectItem key={r} value={r}>
                            {reasonLabels[r]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='grid gap-1.5'>
                    <div className='text-xs font-medium text-muted-foreground'>Status</div>
                    <Select value={status} onValueChange={(v) => setStatus(v as BlockStatus)}>
                      <SelectTrigger className='h-9 w-full rounded-sm bg-background text-sm shadow-none'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                      <SelectContent>
                        {(['active', 'inactive'] as const).map((s) => (
                          <SelectItem key={s} value={s}>
                            {statusLabels[s]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Section>

              <Section title='Block Summary'>
                <InfoBox label='Date Created' value={block.createdAt} />
              </Section>
            </div>
          </ScrollArea>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-3'>
      <div className='text-sm font-medium text-muted-foreground'>{title}</div>
      {children}
    </div>
  )
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-sm border border-border/60 bg-card p-3'>
      <div className='text-sm font-medium text-foreground'>{value}</div>
      <div className='mt-2 text-xs font-medium text-muted-foreground'>{label}</div>
    </div>
  )
}

