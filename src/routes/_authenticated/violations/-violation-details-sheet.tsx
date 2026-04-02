import { Check, Expand, Plus, TriangleAlert, X } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetTitle } from '@/components/ui/sheet'

export type ViolationDetailsData = {
  code: number
  name: string
  description: string
  categoryLabel: string
  amountLabel: string
  statusLabel: string
  statusBadgeClassName: string
  dateAddedLabel: string
  photos: string[]
}

export function ViolationDetailsSheet({
  open,
  onOpenChange,
  violation,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  violation: ViolationDetailsData | null
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side='right'
        overlayClassName='bg-transparent'
        className='sm:max-w-md overflow-hidden [&_[data-slot="sheet-close"]]:hidden'
      >
        <SheetTitle className='sr-only'>Violation details</SheetTitle>
        <SheetDescription className='sr-only'>
          View violation details and related information
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

        {violation ? (
          <ScrollArea className='min-h-0 flex-1 px-4 pb-6'>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col items-center gap-3 pt-3'>
                <div className='mx-auto flex size-12 items-center justify-center rounded-full border bg-background text-muted-foreground'>
                  <TriangleAlert className='size-5' />
                </div>
                <div className='text-lg font-medium'>{String(violation.code)}</div>
                <Badge variant='secondary' className={violation.statusBadgeClassName}>
                  {violation.statusLabel}
                </Badge>
              </div>

              <Section title='Violation Informations'>
                <div className='grid gap-3'>
                  <InfoBox label='Name' value={violation.name} />
                  <InfoBox label='Description' value={violation.description} />
                  <div className='grid gap-3 sm:grid-cols-2'>
                    <InfoBox label='Category' value={violation.categoryLabel} />
                    <InfoBox label='Amount' value={violation.amountLabel} />
                  </div>
                  <InfoBox label='Date Joined' value={violation.dateAddedLabel} />
                </div>
              </Section>

              <div className='flex items-center justify-between'>
                <div className='text-sm font-medium text-muted-foreground'>Violation Photos</div>
                <div className='flex size-8 flex-none items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200'>
                  <Check className='size-5' />
                </div>
              </div>

              <div className='grid grid-cols-3 gap-3'>
                {violation.photos.map((src) => (
                  <ThumbTile key={`${violation.code}-${src}`} showRemove>
                    <img src={src} alt='' className='h-full w-full object-cover' />
                  </ThumbTile>
                ))}
                <AddThumbTile />
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

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-sm border border-border/60 bg-card p-3'>
      <div className='text-sm font-medium text-foreground'>{value}</div>
      <div className='mt-2 text-xs font-medium text-muted-foreground'>{label}</div>
    </div>
  )
}

function ThumbTile({
  children,
  showRemove,
}: {
  children?: React.ReactNode
  showRemove?: boolean
}) {
  return (
    <div className='relative aspect-[16/10] overflow-hidden rounded-sm border border-border/60 bg-muted'>
      {children}
      {showRemove ? (
        <button
          type='button'
          className='absolute right-1 top-1 inline-flex size-6 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm hover:bg-background'
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
      className='flex aspect-[16/10] items-center justify-center rounded-sm border border-dashed bg-transparent hover:bg-accent'
      aria-label='Add picture'
    >
      <Plus className='size-5 text-muted-foreground' />
    </button>
  )
}
