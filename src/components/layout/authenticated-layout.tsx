import { useEffect } from 'react'
import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { Bell } from 'lucide-react'
import { getCookie } from '@/lib/cookies'
import { cn } from '@/lib/utils'
import { useDirection } from '@/context/direction-provider'
import { LayoutProvider } from '@/context/layout-provider'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/app-sidebar'
import { Header } from '@/components/layout/header'
import { SkipToMain } from '@/components/skip-to-main'

type AuthenticatedLayoutProps = {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const defaultOpen = getCookie('sidebar_state') !== 'false'
  const { dir, setDir } = useDirection()
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    const prevBodyLayout = document.body.dataset.layout
    const prevHtmlLayout = document.documentElement.dataset.layout

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    document.body.dataset.layout = 'app'
    document.documentElement.dataset.layout = 'app'

    return () => {
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow

      if (prevBodyLayout === undefined) {
        delete document.body.dataset.layout
      } else {
        document.body.dataset.layout = prevBodyLayout
      }

      if (prevHtmlLayout === undefined) {
        delete document.documentElement.dataset.layout
      } else {
        document.documentElement.dataset.layout = prevHtmlLayout
      }
    }
  }, [])

  const breadcrumbs: Array<{ label: string; to?: string }> =
    {
      '/customers': [{ label: 'Home', to: '/' }, { label: 'Customers' }],
      '/customers/details': [
        { label: 'Home', to: '/' },
        { label: 'Customers', to: '/customers' },
        { label: 'Details' },
      ],
      '/bookings/details': [
        { label: 'Home', to: '/' },
        { label: 'Bookings' },
        { label: 'Booking details' },
      ],
      '/workers': [{ label: 'Home', to: '/' }, { label: 'Workers' }],
      '/workers/details': [
        { label: 'Home', to: '/' },
        { label: 'Workers', to: '/workers' },
        { label: 'Details' },
      ],
      '/violations': [{ label: 'Home', to: '/' }, { label: 'Violations' }],
      '/blocks': [{ label: 'Home', to: '/' }, { label: 'Blocks' }],
      '/tasks': [{ label: 'Home', to: '/' }, { label: 'Tasks' }],
    }[pathname] ?? [{ label: 'Home', to: '/' }]

  return (
    <LayoutProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipToMain />
        <AppSidebar />
        <SidebarInset
          className={cn(
            '@container/content',
            'h-svh overflow-hidden',
            'peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]'
          )}
        >
          <Header fixed className='border-b bg-card'>
            <div className='text-sm text-muted-foreground'>
              {breadcrumbs.map((item, index) => (
                <span key={`${item.label}-${index}`}>
                  {index > 0 && ' / '}
                  {item.to ? (
                    <Link to={item.to} className='hover:text-foreground'>
                      {item.label}
                    </Link>
                  ) : (
                    <span className='text-foreground'>{item.label}</span>
                  )}
                </span>
              ))}
            </div>
            <div className='ms-auto flex items-center gap-2 sm:gap-4'>
              <div className='flex items-center rounded-md border p-0.5'>
                <Button
                  type='button'
                  variant={dir === 'ltr' ? 'secondary' : 'ghost'}
                  size='sm'
                  className='h-7 rounded-sm px-2'
                  onClick={() => setDir('ltr')}
                >
                  En
                </Button>
                <Button
                  type='button'
                  variant={dir === 'rtl' ? 'secondary' : 'ghost'}
                  size='sm'
                  className='h-7 rounded-sm px-2'
                  onClick={() => setDir('rtl')}
                >
                  Ar
                </Button>
              </div>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                aria-label='Notifications'
              >
                <Bell />
              </Button>
              <Avatar className='size-8 border bg-background'>
                <AvatarFallback className='bg-transparent text-xs font-medium'>
                  CN
                </AvatarFallback>
              </Avatar>
            </div>
          </Header>
          <div
            id='content-scroll'
            className='min-h-0 flex-1 overflow-y-auto bg-[rgb(250,250,250)] dark:bg-background'
          >
            {children ?? <Outlet />}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </LayoutProvider>
  )
}
