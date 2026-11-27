import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { useAppStore } from '@/store/useAppStore'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Filter sheet: day, time, activity toggles. Owner: Dinesh.
// TODO(Dinesh): ToggleGroups for DAYS, TIME_WINDOWS, ACTIVITIES (see lib/types.ts),
// apply on "Show plans", confirm with a toast.
export function FilterSheet({ open, onOpenChange }: Props) {
  const resetFilters = useAppStore((s) => s.resetFilters)
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-w-(--app-max-width) rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Filter plans</SheetTitle>
          <SheetDescription>Placeholder. Day, time and activity toggles go here.</SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <Button
            variant="outline"
            onClick={() => {
              resetFilters()
              onOpenChange(false)
            }}
          >
            Reset to my days
          </Button>
          <Button onClick={() => onOpenChange(false)}>Show plans</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
