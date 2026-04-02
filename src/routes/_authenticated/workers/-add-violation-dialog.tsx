import { useEffect, useMemo, useRef, useState } from 'react'
import { z } from 'zod'
import { format } from 'date-fns'
import { zodResolver } from '@hookform/resolvers/zod'
import { ChevronDown, Plus, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { showSubmittedData } from '@/lib/show-submitted-data'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Dialog,
  DialogClose,
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
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import type { Worker } from './-workers-data'

const timeOptions = [
  '12:00 A.m',
  '1:00 A.m',
  '2:00 A.m',
  '3:00 A.m',
  '4:00 A.m',
  '5:00 A.m',
  '6:00 A.m',
  '7:00 A.m',
  '8:00 A.m',
  '9:00 A.m',
  '10:00 A.m',
  '11:00 A.m',
  '12:00 P.m',
  '1:00 P.m',
  '2:00 P.m',
  '3:00 P.m',
  '4:00 P.m',
  '5:00 P.m',
  '6:00 P.m',
  '7:00 P.m',
  '8:00 P.m',
  '9:00 P.m',
  '10:00 P.m',
  '11:00 P.m',
]

const violationFormSchema = z.object({
  workerPk: z.string().min(1, 'Worker is required.'),
  violationName: z.string().min(1, 'Violation name is required.'),
  description: z.string().min(1, 'Description is required.'),
  amount: z
    .string()
    .min(1, 'Amount is required.')
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) >= 0, 'Invalid amount.'),
  status: z.enum(['approved', 'pending', 'rejected']),
  date: z.date(),
  time: z.string().min(1, 'Time is required.'),
})

type ViolationForm = z.infer<typeof violationFormSchema>

type ImageItem = { file: File; url: string }

export function AddViolationDialog({
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
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [images, setImages] = useState<ImageItem[]>([])

  const defaultWorkerPk = useMemo(() => {
    return initialWorkerPk ?? workers[0]?.pk
  }, [initialWorkerPk, workers])

  const form = useForm<ViolationForm>({
    resolver: zodResolver(violationFormSchema),
    defaultValues: {
      workerPk: defaultWorkerPk ? String(defaultWorkerPk) : '',
      violationName: 'forgetting_to_wipe_glasses',
      description:
        'It refers to placeholder text or images used to fill spaces on a webpage or document during the design phase. This guide will delve into what dummy content is, its importance, types',
      amount: '8',
      status: 'approved',
      date: new Date(),
      time: '3:55 P.m',
    },
  })

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.url))
    }
  }, [images])

  const onPickFiles = () => fileInputRef.current?.click()

  const onFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const next: ImageItem[] = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .map((file) => ({ file, url: URL.createObjectURL(file) }))
    setImages((prev) => [...prev, ...next])
  }

  const removeImage = (url: string) => {
    setImages((prev) => {
      const found = prev.find((p) => p.url === url)
      if (found) URL.revokeObjectURL(found.url)
      return prev.filter((p) => p.url !== url)
    })
  }

  const onSubmit = (values: ViolationForm) => {
    showSubmittedData({
      ...values,
      workerPk: Number(values.workerPk),
      pictures: images.map((i) => ({
        name: i.file.name,
        size: i.file.size,
        type: i.file.type,
      })),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className='gap-0 rounded-none p-0 sm:max-w-[520px]'
      >
        <DialogHeader className='gap-1.5 border-b px-6 py-4'>
          <DialogTitle className='text-lg font-medium'>
            Add Violation
          </DialogTitle>
          <DialogDescription className='sr-only'>
            Create a new violation for a worker
          </DialogDescription>
        </DialogHeader>

        <DialogClose asChild>
          <button
            type='button'
            className='absolute end-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background text-foreground hover:bg-accent'
            aria-label='Close'
          >
            <X className='h-4 w-4' />
          </button>
        </DialogClose>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='px-6 py-4'>
            <div className='space-y-4'>
              <FormField
                control={form.control}
                name='workerPk'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium text-muted-foreground'>
                      Worker
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='h-10 rounded-sm bg-background text-sm font-medium'>
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
                name='violationName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium text-muted-foreground'>
                      Violation Name
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className='h-10 rounded-sm bg-background text-sm font-medium'>
                          <SelectValue placeholder='Select violation' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='forgetting_to_wipe_glasses'>
                          Forgetting to wipe glasses
                        </SelectItem>
                        <SelectItem value='late_to_job'>Late to job</SelectItem>
                        <SelectItem value='no_uniform'>No uniform</SelectItem>
                        <SelectItem value='other'>Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-sm font-medium text-muted-foreground'>
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className='min-h-20 rounded-sm bg-background text-sm font-medium'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='amount'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium text-muted-foreground'>
                        Amount
                      </FormLabel>
                      <FormControl>
                        <div className='relative'>
                          <Input
                            className='h-10 rounded-sm bg-background pr-14 text-sm font-medium'
                            inputMode='decimal'
                            {...field}
                          />
                          <span className='pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground'>
                            SAR
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium text-muted-foreground'>
                        Status
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className='h-10 rounded-sm bg-background text-sm font-medium'>
                            <SelectValue placeholder='Select status' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value='approved'>Approved</SelectItem>
                          <SelectItem value='pending'>Pending</SelectItem>
                          <SelectItem value='rejected'>Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <FormField
                  control={form.control}
                  name='date'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium text-muted-foreground'>
                        Date
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type='button'
                              variant='outline'
                              className={cn(
                                'h-10 w-full justify-between rounded-sm bg-background text-sm font-medium',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              <span>
                                {field.value
                                  ? format(field.value, 'd MMMM, yyyy')
                                  : 'Pick a date'}
                              </span>
                              <ChevronDown className='h-4 w-4 opacity-50' />
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
                  name='time'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className='text-sm font-medium text-muted-foreground'>
                        Time
                      </FormLabel>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className='h-10 rounded-sm bg-background text-sm font-medium'>
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

              <div>
                <div className='text-sm font-medium text-muted-foreground'>
                  Pictures
                </div>
                <div className='mt-3 grid grid-cols-4 gap-3'>
                  {images.map((img) => (
                    <div
                      key={img.url}
                      className='relative aspect-square overflow-hidden rounded-lg border bg-muted'
                    >
                      <img
                        src={img.url}
                        alt=''
                        className='h-full w-full object-cover'
                      />
                      <button
                        type='button'
                        onClick={() => removeImage(img.url)}
                        className='absolute end-1 top-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background'
                        aria-label='Remove image'
                      >
                        <X className='h-4 w-4' />
                      </button>
                    </div>
                  ))}

                  <button
                    type='button'
                    onClick={onPickFiles}
                    className='flex aspect-square items-center justify-center rounded-lg border border-dashed bg-background hover:bg-accent'
                    aria-label='Add picture'
                  >
                    <Plus className='h-5 w-5 text-muted-foreground' />
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  multiple
                  className='hidden'
                  onChange={(e) => onFilesSelected(e.target.files)}
                />
              </div>
            </div>

            <DialogFooter className='flex-row items-center justify-between gap-6 pt-8'>
              <Button
                type='button'
                variant='outline'
                className='h-10 flex-1 rounded-sm bg-background text-sm font-medium'
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='h-10 flex-1 rounded-sm bg-[rgb(11,16,32)] text-sm font-medium text-white hover:bg-[rgb(11,16,32)]/90'
              >
                Add
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
