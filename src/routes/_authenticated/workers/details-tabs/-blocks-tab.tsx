import { useEffect, useMemo, useState } from 'react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'

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

type BlockReason = 'vacation' | 'sick' | 'personal' | 'other'
type BlockStatus = 'active' | 'inactive'
type BlockScheduleType = 'full_day' | 'custom_hours'

type Block = {
  id: string
  reason: BlockReason
  status: BlockStatus
  dateFrom: Date
  dateTo: Date
  scheduleType: BlockScheduleType
  hourFrom: string
  hourTo: string
}

const scheduleBadgeLabels: Record<BlockScheduleType, string> = {
  custom_hours: 'Custom Hours',
  full_day: 'Full Days',
}

const scheduleBadgeClasses: Record<BlockScheduleType, string> = {
  custom_hours:
    'rounded-full border-0 bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-500/20 dark:text-amber-200',
  full_day:
    'rounded-full border-0 bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-500/20 dark:text-slate-200',
}

export function WorkerBlocksTab({ count, workerPk }: { count: number; workerPk: number }) {
  const initialBlocks = useMemo<Block[]>(() => {
    const effectiveCount = Math.max(count, 2)
    return Array.from({ length: effectiveCount }, (_, i) => ({
      id: `${workerPk}-block-${i}`,
      reason: 'vacation',
      status: 'active',
      dateFrom: new Date('2026-03-03T12:00:00'),
      dateTo: new Date('2026-03-05T12:00:00'),
      scheduleType: i === 0 ? 'custom_hours' : i === 1 ? 'full_day' : i % 2 === 0 ? 'custom_hours' : 'full_day',
      hourFrom: '11:00 PM',
      hourTo: '6:00 PM',
    }))
  }, [count, workerPk])

  const [blocks, setBlocks] = useState<Block[]>(() => initialBlocks)

  useEffect(() => {
    setBlocks(initialBlocks)
  }, [initialBlocks])

  const updateBlock = (index: number, patch: Partial<Block>) => {
    setBlocks((prev) => prev.map((b, i) => (i === index ? { ...b, ...patch } : b)))
  }

  return (
    <div className='grid gap-6'>
      {blocks.map((block, index) => (
        <Card
          key={block.id}
          className='rounded-sm border-0 bg-card shadow-none'
        >
          <CardContent className='p-4'>
            <Badge
              variant='secondary'
              className={scheduleBadgeClasses[block.scheduleType]}
            >
              {scheduleBadgeLabels[block.scheduleType]}
            </Badge>

            <div className='mt-4 grid gap-4'>
              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='grid gap-1.5'>
                  <div className='text-xs font-medium text-muted-foreground'>Reason</div>
                  <Select
                    value={block.reason}
                    onValueChange={(value) =>
                      updateBlock(index, { reason: value as BlockReason })
                    }
                  >
                    <SelectTrigger className='bg-card text-sm'>
                      <SelectValue placeholder='Select reason' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='vacation'>Vacation</SelectItem>
                      <SelectItem value='sick'>Sick</SelectItem>
                      <SelectItem value='personal'>Personal</SelectItem>
                      <SelectItem value='other'>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='grid gap-1.5'>
                  <div className='text-xs font-medium text-muted-foreground'>Status</div>
                  <Select
                    value={block.status}
                    onValueChange={(value) =>
                      updateBlock(index, { status: value as BlockStatus })
                    }
                  >
                    <SelectTrigger className='bg-card text-sm'>
                      <SelectValue placeholder='Select status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='active'>Active</SelectItem>
                      <SelectItem value='inactive'>Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className='grid gap-4 sm:grid-cols-2'>
                <div className='grid gap-1.5'>
                  <div className='text-xs font-medium text-muted-foreground'>Date From</div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type='button'
                        variant='outline'
                        className={cn(
                          'w-full justify-between bg-card text-sm',
                          !block.dateFrom && 'text-muted-foreground'
                        )}
                      >
                        {block.dateFrom ? format(block.dateFrom, 'd MMMM, yyyy') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        captionLayout='dropdown'
                        selected={block.dateFrom}
                        onSelect={(date) => {
                          if (!date) return
                          updateBlock(index, { dateFrom: date })
                        }}
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
                          'w-full justify-between bg-card text-sm',
                          !block.dateTo && 'text-muted-foreground'
                        )}
                      >
                        {block.dateTo ? format(block.dateTo, 'd MMMM, yyyy') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        captionLayout='dropdown'
                        selected={block.dateTo}
                        onSelect={(date) => {
                          if (!date) return
                          updateBlock(index, { dateTo: date })
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <RadioGroup
                value={block.scheduleType}
                onValueChange={(value) =>
                  updateBlock(index, { scheduleType: value as BlockScheduleType })
                }
                className='flex items-center gap-6'
              >
                <label className='flex items-center gap-2'>
                  <RadioGroupItem value='full_day' />
                  <span className='text-sm'>Full days</span>
                </label>
                <label className='flex items-center gap-2'>
                  <RadioGroupItem value='custom_hours' />
                  <span className='text-sm'>Custom hours</span>
                </label>
              </RadioGroup>

              {block.scheduleType === 'custom_hours' ? (
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div className='grid gap-1.5'>
                    <div className='text-xs font-medium text-muted-foreground'>Hour From</div>
                    <Select
                      value={block.hourFrom}
                      onValueChange={(value) => updateBlock(index, { hourFrom: value })}
                    >
                      <SelectTrigger className='bg-card text-sm'>
                        <SelectValue placeholder='Select time' />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((t) => (
                          <SelectItem key={`${block.id}-from-${t}`} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='grid gap-1.5'>
                    <div className='text-xs font-medium text-muted-foreground'>Hour To</div>
                    <Select
                      value={block.hourTo}
                      onValueChange={(value) => updateBlock(index, { hourTo: value })}
                    >
                      <SelectTrigger className='bg-card text-sm'>
                        <SelectValue placeholder='Select time' />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((t) => (
                          <SelectItem key={`${block.id}-to-${t}`} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : null}

              <div className='flex items-center justify-end gap-3'>
                <Button variant='destructive' className='h-9 w-[140px] rounded-sm'>
                  Delete
                </Button>
                <Button className='h-9 w-[140px] rounded-sm bg-[rgb(24,24,27)] text-white hover:bg-[rgb(24,24,27)]/90'>
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
