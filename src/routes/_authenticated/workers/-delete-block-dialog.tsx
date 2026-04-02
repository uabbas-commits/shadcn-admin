import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { toast } from 'sonner'

export function DeleteBlockDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const handleDelete = () => {
    onOpenChange(false)
    toast.success('Block deleted', {
      description: 'Connect this action to your API when ready.',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className='gap-0 rounded-none border bg-card p-6 sm:max-w-xl'
      >
        <DialogClose
          className='absolute right-4 top-4 inline-flex size-10 items-center justify-center rounded-full border border-border/60 bg-background text-muted-foreground opacity-70 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50'
        >
          <X className='size-4' />
          <span className='sr-only'>Close</span>
        </DialogClose>

        <DialogHeader className='space-y-0 pr-12 text-start'>
          <DialogTitle className='text-base font-medium leading-snug'>
            Are you sure you want to delete block?
          </DialogTitle>
        </DialogHeader>

        <DialogFooter className='mt-6 grid w-full grid-cols-2 gap-4'>
          <Button
            type='button'
            variant='outline'
            className='h-10 w-full rounded-sm bg-transparent'
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            type='button'
            variant='destructive'
            className='h-10 w-full rounded-sm'
            onClick={handleDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
