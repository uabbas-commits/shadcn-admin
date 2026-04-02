import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Worker } from '@/routes/_authenticated/workers/-workers-data'
import { WorkerBlocksTab } from './-blocks-tab'
import { WorkerProfileTab } from './-profile-tab'
import { WorkerViolationsTab } from './-violations-tab'

export const workerDetailsTabs = ['profile', 'violations', 'blocks'] as const
export type WorkerDetailsTabId = (typeof workerDetailsTabs)[number]

type WorkerDetailsTabsProps = {
  worker: Worker
  tab: WorkerDetailsTabId
  onTabChange: (nextTab: string) => void
}

export function WorkerDetailsTabs({ worker, tab, onTabChange }: WorkerDetailsTabsProps) {
  return (
    <Tabs value={tab} onValueChange={onTabChange} className='gap-4'>
      <TabsList className='rounded-sm bg-slate-100 dark:bg-muted/60'>
        <TabsTrigger value='profile' className='rounded-sm font-medium'>
          Profile
        </TabsTrigger>
        <TabsTrigger value='violations' className='rounded-sm font-medium'>
          Violations
        </TabsTrigger>
        <TabsTrigger value='blocks' className='rounded-sm font-medium'>
          Blocks
        </TabsTrigger>
      </TabsList>

      <TabsContent value='profile'>
        <WorkerProfileTab worker={worker} />
      </TabsContent>

      <TabsContent value='violations'>
        <WorkerViolationsTab count={worker.violations} workerPk={worker.pk} />
      </TabsContent>

      <TabsContent value='blocks'>
        <WorkerBlocksTab count={worker.blocks} workerPk={worker.pk} />
      </TabsContent>
    </Tabs>
  )
}
