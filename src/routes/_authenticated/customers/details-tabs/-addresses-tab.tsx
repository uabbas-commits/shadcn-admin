import { useMemo } from 'react'
import { format } from 'date-fns'
import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Card, CardContent } from '@/components/ui/card'

type CustomerAddress = {
  id: string
  location: string
  name: string
  dateCreated: Date
}

function formatAddressDate(date: Date) {
  return format(date, 'MMM. d, yyyy, h:mm a')
    .replace(/\bAM\b/, 'a.m.')
    .replace(/\bPM\b/, 'p.m.')
}

export function CustomerAddressesTab() {
  const data = useMemo<CustomerAddress[]>(
    () => [
      {
        id: 'home',
        location: '3885 Al Bandariyyah Street Al Falah Riyadh 13314',
        name: 'Home',
        dateCreated: new Date('2025-10-02T23:44:00'),
      },
      {
        id: 'home-2',
        location: '3885 Al Bandariyyah Street Al Falah Riyadh 13314',
        name: 'Home',
        dateCreated: new Date('2025-10-02T23:44:00'),
      },
    ],
    []
  )

  return (
    <div className='grid gap-6 sm:grid-cols-2'>
      {data.map((item) => (
        <AddressCard key={item.id} address={item} />
      ))}
    </div>
  )
}

function AddressCard({ address }: { address: CustomerAddress }) {
  return (
    <Card className='rounded-sm border-0 bg-transparent shadow-none'>
      <CardContent className='p-4'>
        <div className='relative aspect-[16/7] w-full overflow-hidden rounded-sm bg-transparent'>
          <MapPlaceholder className='absolute inset-0' />
          <div className='absolute inset-0 bg-gradient-to-b from-transparent to-transparent' />
          <div className='absolute left-1/2 top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background/70 shadow-sm backdrop-blur'>
            <MapPin className='size-4 text-foreground/70' />
          </div>
        </div>

        <div className='mt-4 grid gap-3'>
          <FieldBox label='Location' value={address.location} />
          <FieldBox label='Name' value={address.name} />
          <FieldBox label='Date Created' value={formatAddressDate(address.dateCreated)} />
        </div>
      </CardContent>
    </Card>
  )
}

function FieldBox({ label, value }: { label: string; value: string }) {
  return (
    <div className='rounded-sm border border-sky-100/80 p-4 dark:border-border/60'>
      <div className='text-sm font-medium text-foreground'>{value}</div>
      <div className='mt-2 text-xs font-medium text-muted-foreground'>{label}</div>
    </div>
  )
}

function MapPlaceholder({ className }: { className?: string }) {
  return (
    <svg
      viewBox='0 0 800 320'
      preserveAspectRatio='none'
      className={cn('h-full w-full opacity-70', className)}
      aria-hidden='true'
      focusable='false'
    >
      <rect x='0' y='0' width='800' height='320' fill='hsl(var(--muted))' />
      <g stroke='hsl(var(--border))' strokeWidth='1' opacity='0.9'>
        <path d='M0 40 H800' />
        <path d='M0 90 H800' />
        <path d='M0 140 H800' />
        <path d='M0 190 H800' />
        <path d='M0 240 H800' />
        <path d='M0 290 H800' />
        <path d='M90 0 V320' />
        <path d='M190 0 V320' />
        <path d='M290 0 V320' />
        <path d='M390 0 V320' />
        <path d='M490 0 V320' />
        <path d='M590 0 V320' />
        <path d='M690 0 V320' />
      </g>
      <g stroke='hsl(var(--muted-foreground))' strokeWidth='2' opacity='0.25'>
        <path d='M-40 260 C 160 180, 260 220, 420 140 S 680 120, 860 60' />
        <path d='M-20 120 C 160 80, 260 120, 420 70 S 680 30, 860 10' />
      </g>
    </svg>
  )
}
