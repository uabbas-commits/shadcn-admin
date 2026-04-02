import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { Check, Expand, ExternalLink, Folder, X } from 'lucide-react'

type BookingStatus = 'completed' | 'cancelled'

export type BookingDetails = {
  pk: number
  bookingNumber: string
  status: BookingStatus
  worker: string
  location: string
  rating: number
  dateTime: Date
  customerPhone?: string
  branch?: string
  car?: string
  items?: string
  partner?: string
  uploadedBy?: string
  source?: string
  photos?: string[]
}

const statusStyles = new Map<BookingStatus, string>([
  [
    'completed',
    'border-0 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200',
  ],
  [
    'cancelled',
    'border-0 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-200',
  ],
])

function formatDate(date: Date) {
  return format(date, 'MMMM d, yyyy')
}

function formatTime(date: Date) {
  return format(date, 'h:mm a')
    .replace(/\bAM\b/, 'a.m.')
    .replace(/\bPM\b/, 'p.m.')
}

function normalizeBranchValue(branch: string | undefined) {
  const value = String(branch ?? '').trim().toLowerCase()
  if (!value) return 'main'
  if (value === 'main' || value.includes('main')) return 'main'
  if (value === 'north' || value.includes('north')) return 'north'
  return 'main'
}

export function CustomerBookingDetailsSheet({
  open,
  onOpenChange,
  booking,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  booking: BookingDetails | null
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        overlayClassName='bg-transparent'
        className='sm:max-w-md overflow-hidden [&_[data-slot="sheet-close"]]:hidden'
      >
        <SheetTitle className='sr-only'>Booking details</SheetTitle>
        <SheetDescription className='sr-only'>
          View booking details and related information
        </SheetDescription>
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

        {booking ? (
          <ScrollArea className='min-h-0 flex-1 px-4 pb-6'>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col items-center gap-3 pt-3'>
                <div className='mx-auto flex size-12 items-center justify-center rounded-full border text-muted-foreground bg-background'>
                  <Folder className='size-5' />
                </div>
                <div className='text-lg font-medium'>{booking.bookingNumber}</div>
                <Badge
                  variant='secondary'
                  className={cn(
                    'px-2.5 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200',
                    statusStyles.get(booking.status)
                  )}
                >
                  {booking.status === 'completed' ? 'Completed' : 'Cancelled'}
                </Badge>
                <Button
                  variant='link'
                  size='sm'
                  className='px-0 text-foreground underline underline-offset-2'
                >
                  <ExternalLink className='me-1.5 size-4' />
                  <span>Booking Location</span>
                </Button>
              </div>

              <Section title='Booking Informations'>
                <TwoCol>
                  <Field label='Branch'>
                    <Select defaultValue={normalizeBranchValue(booking.branch)}>
                      <SelectTrigger className='bg-card'>
                        <SelectValue placeholder='Select branch' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='main'>Main Branch</SelectItem>
                        <SelectItem value='north'>North Branch</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label='Status'>
                    <Select defaultValue={booking.status}>
                      <SelectTrigger className='bg-card'>
                        <SelectValue placeholder='Select status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='completed'>Completed</SelectItem>
                        <SelectItem value='cancelled'>Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label='Worker'>
                    <Select defaultValue={booking.worker}>
                      <SelectTrigger className='bg-card'>
                        <SelectValue placeholder='Select worker' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='14-Rabie'>14-Rabie</SelectItem>
                        <SelectItem value='81-Mohamed'>81-Mohamed</SelectItem>
                        <SelectItem value='90-Demo'>90-Demo</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label='Customer'>
                    <Select defaultValue={booking.customerPhone ?? '+96538920'}>
                      <SelectTrigger className='bg-card'>
                        <SelectValue placeholder='Select customer' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='+96538920'>+96538920</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label='Date'>
                    <Select defaultValue={formatDate(booking.dateTime)}>
                      <SelectTrigger className='bg-card'>
                        <SelectValue placeholder='Select date' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={formatDate(booking.dateTime)}>
                          {formatDate(booking.dateTime)}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label='Time'>
                    <Select defaultValue={formatTime(booking.dateTime)}>
                      <SelectTrigger className='bg-card'>
                        <SelectValue placeholder='Select time' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={formatTime(booking.dateTime)}>
                          {formatTime(booking.dateTime)}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <FullCol>
                    <Field label='Location'>
                      <Input readOnly value={booking.location} className='bg-card' />
                    </Field>
                  </FullCol>
                </TwoCol>
              </Section>

              <Section title='Booking Summary'>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='rounded-lg border border-border/60 bg-background p-4'>
                    <div className='text-base font-medium'>{String(booking.pk)}</div>
                    <div className='mt-2 text-sm text-muted-foreground'>PK</div>
                  </div>
                  <div className='rounded-lg border border-border/60 bg-background p-4'>
                    <div className='text-base font-medium'>{booking.car ?? 'A4 (2023)'}</div>
                    <div className='mt-2 text-sm text-muted-foreground'>Car</div>
                  </div>
                  <div className='rounded-lg border border-border/60 bg-background p-4'>
                    <div className='text-base font-medium'>
                      {booking.items ?? 'Claro-lavender sc..'}
                    </div>
                    <div className='mt-2 text-sm text-muted-foreground'>Items</div>
                  </div>
                  <div className='rounded-lg border border-border/60 bg-background p-4'>
                    <div className='text-base font-medium'>
                      {booking.source ?? 'Customer Service'}
                    </div>
                    <div className='mt-2 text-sm text-muted-foreground'>Source</div>
                  </div>
                </div>
              </Section>

              <Section title='Booking Reviews'>
                <div className='grid grid-cols-2 gap-3'>
                  <div className='rounded-lg border border-border/60 bg-background p-4'>
                    <div className='text-base font-medium'>{String(booking.rating)}</div>
                    <div className='mt-2 text-sm text-muted-foreground'>Rating</div>
                  </div>
                  <div className='rounded-lg border border-border/60 bg-background p-4'>
                    <div className='text-base font-medium'>N/A</div>
                    <div className='mt-2 text-sm text-muted-foreground'>Review Feedback</div>
                  </div>
                  <div className='col-span-2 rounded-lg border border-border/60 bg-background p-4'>
                    <div className='text-base font-medium'>
                      In the digital world, dummy content is a term ......
                    </div>
                    <div className='mt-2 text-sm text-muted-foreground'>Content</div>
                  </div>
                </div>
              </Section>

              <div className='flex items-center justify-between'>
                <div className='text-sm font-medium text-muted-foreground'>Booking Photos</div>
                <div className='flex size-8 flex-none items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600'>
                  <Check className='size-5' />
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                <div className='rounded-lg border border-border/60 bg-background p-4'>
                  <div className='text-base font-normal'>
                    {booking.uploadedBy ?? '+9637202892'}
                  </div>
                  <div className='mt-2 text-sm text-muted-foreground'>Uploaded By</div>
                </div>
                <div className='rounded-lg border border-border/60 bg-background p-4'>
                  <div className='text-base font-normal'>
                    {booking.source ?? 'Customer Service'}
                  </div>
                  <div className='mt-2 text-sm text-muted-foreground'>Source</div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-3'>
                {(booking.photos && booking.photos.length > 0
                  ? booking.photos
                  : [
                      'https://images.unsplash.com/photo-1542362567-b07e54358753?q=80&w=1200&auto=format&fit=crop',
                      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=1200&auto=format&fit=crop',
                    ]
                ).map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className='aspect-[16/10] overflow-hidden rounded-xl bg-muted'
                  >
                    <img
                      src={src}
                      alt={`booking photo ${i + 1}`}
                      loading='lazy'
                      className='h-full w-full object-cover'
                    />
                  </div>
                ))}
              </div>
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

function TwoCol({ children }: { children: React.ReactNode }) {
  return <div className='grid gap-3 sm:grid-cols-2'>{children}</div>
}

function FullCol({ children }: { children: React.ReactNode }) {
  return <div className='sm:col-span-2'>{children}</div>
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className='grid gap-1.5'>
      {label ? (
        <Label className='text-xs font-medium text-muted-foreground'>{label}</Label>
      ) : null}
      {children}
    </div>
  )
}
