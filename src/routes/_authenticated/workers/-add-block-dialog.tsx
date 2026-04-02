import { useEffect, useMemo } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cn } from '@/lib/utils'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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

const blockFormSchema = z
  .object({
    workerPk: z.string().min(1, 'Worker is required.'),
    reason: z.string().min(1, 'Reason is required.'),
    status: z.enum(['active', 'inactive']),
    dateFrom: z.date(),
    dateTo: z.date(),
    scheduleType: z.enum(['full_day', 'custom_hours']),
    hourFrom: z.string().optional(),
    hourTo: z.string().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.dateTo < value.dateFrom) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Date to must be after date from.',
        path: ['dateTo'],
      })
    }

    if (value.scheduleType === 'custom_hours') {
      if (!value.hourFrom) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Hour from is required.',
          path: ['hourFrom'],
        })
      }
      if (!value.hourTo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Hour to is required.',
          path: ['hourTo'],
        })
      }
    }
  })

type BlockForm = z.infer<typeof blockFormSchema>

export function AddBlockDialog({
  open,
  onOpenChange,
  workers,
  initialWorkerPk,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  workers: Worker[]
  initialWorkerPk?: number
}) {
  const defaultWorkerPk = useMemo(() => {
    return initialWorkerPk ?? workers[0]?.pk
  }, [initialWorkerPk, workers])

  const form = useForm<BlockForm>({
    resolver: zodResolver(blockFormSchema),
    defaultValues: {
      workerPk: defaultWorkerPk ? String(defaultWorkerPk) : '',
      reason: 'vacation',
      status: 'active',
      dateFrom: new Date(),
      dateTo: new Date(),
      scheduleType: 'full_day',
      hourFrom: '11:00 PM',
      hourTo: '6:00 PM',
    },
  })

  const scheduleType = form.watch('scheduleType')

  useEffect(() => {
    if (!open) return
    form.reset({
      workerPk: defaultWorkerPk ? String(defaultWorkerPk) : '',
      reason: 'vacation',
      status: 'active',
      dateFrom: new Date(),
      dateTo: new Date(),
      scheduleType: 'full_day',
      hourFrom: '11:00 PM',
      hourTo: '6:00 PM',
    })
  }, [defaultWorkerPk, form, open])

  const onSubmit = (values: BlockForm) => {
    showSubmittedData({
      ...values,
      workerPk: Number(values.workerPk),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='gap-0 rounded-sm p-0 sm:max-w-[480px]'>
        <DialogHeader className='gap-1.5 border-b px-6 py-4'>
          <DialogTitle className='text-base font-medium'>Add Block</DialogTitle>
          <DialogDescription className='sr-only'>
            Create a new block for a worker
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='px-6 py-4'>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='workerPk'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-medium text-muted-foreground'>
                      Worker
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='rounded-sm bg-background text-sm shadow-none'>
                          <SelectValue placeholder='Select worker' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {workers.map((w) => (
                          <SelectItem key={w.pk} value={String(w.pk)}>
                            {w.name} ({w.phone})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='reason'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-medium text-muted-foreground'>
                      Reason
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='rounded-sm bg-background text-sm shadow-none'>
                          <SelectValue placeholder='Select reason' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='vacation'>Vacation</SelectItem>
                        <SelectItem value='sick'>Sick</SelectItem>
                        <SelectItem value='personal'>Personal</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='status'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-xs font-medium text-muted-foreground'>
                      Status
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='rounded-sm bg-background text-sm shadow-none'>
                          <SelectValue placeholder='Select status' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='active'>Active</SelectItem>
                        <SelectItem value='inactive'>Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='dateFrom'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-medium text-muted-foreground'>
                        Date From
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type='button'
                              variant='outline'
                              className={cn(
                                'h-9 w-full justify-between rounded-sm bg-background text-sm font-normal shadow-none',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? format(field.value, 'd MMMM, yyyy')
                                : 'Pick a date'}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            captionLayout='dropdown'
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='dateTo'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-medium text-muted-foreground'>
                        Date To
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type='button'
                              variant='outline'
                              className={cn(
                                'h-9 w-full justify-between rounded-sm bg-background text-sm font-normal shadow-none',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value
                                ? format(field.value, 'd MMMM, yyyy')
                                : 'Pick a date'}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className='w-auto p-0' align='start'>
                          <Calendar
                            mode='single'
                            captionLayout='dropdown'
                            selected={field.value}
                            onSelect={field.onChange}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name='scheduleType'
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        className='flex items-center gap-6'
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
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div
                className={cn(
                  'grid grid-cols-2 gap-4',
                  scheduleType !== 'custom_hours' && 'opacity-50'
                )}
              >
                <FormField
                  control={form.control}
                  name='hourFrom'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-medium text-muted-foreground'>
                        Hour From
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={scheduleType !== 'custom_hours'}
                      >
                        <FormControl>
                          <SelectTrigger className='rounded-sm bg-background text-sm shadow-none'>
                            <SelectValue placeholder='Select time' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='hourTo'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-xs font-medium text-muted-foreground'>
                        Hour To
                      </FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={scheduleType !== 'custom_hours'}
                      >
                        <FormControl>
                          <SelectTrigger className='rounded-sm bg-background text-sm shadow-none'>
                            <SelectValue placeholder='Select time' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeOptions.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className='flex-row items-center justify-between gap-3 pt-4'>
              <Button
                type='button'
                variant='outline'
                className='h-10 flex-1 rounded-sm bg-background shadow-none'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='h-10 flex-1 rounded-sm bg-[rgb(24,24,27)] text-white hover:bg-[rgb(24,24,27)]/90'
              >
                Block Worker
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
