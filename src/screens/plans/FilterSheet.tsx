import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { ACTIVITY_LABEL, DAY_NAME, describeFilters, matchesFilters, TIME_WINDOW_LABEL } from '@/lib/plans'
import { ACTIVITIES, DAYS, TIME_WINDOWS, type Filters } from '@/lib/types'
import { useAppStore } from '@/store/useAppStore'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Filter sheet: day, time, activity toggles. Owner: Dinesh (issue #13).
// Changes stay in a draft until "Show plans", and the button counts matching plans
// live, so people see the effect before they commit (feedback 4: visible feedback).

const chip =
  'h-10 rounded-full border px-4 text-sm data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'

function Group<T extends string>({
  label,
  hint,
  values,
  options,
  onChange,
  renderLabel,
  ariaLabel,
}: {
  label: string
  hint: string
  values: T[]
  options: readonly T[]
  onChange: (v: T[]) => void
  renderLabel: (v: T) => React.ReactNode
  ariaLabel?: (v: T) => string
}) {
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-1 text-sm font-semibold">
        {label} <span className="font-normal text-muted-foreground">· {hint}</span>
      </legend>
      <ToggleGroup
        type="multiple"
        value={values}
        onValueChange={(v) => onChange(v as T[])}
        className="flex-wrap"
        aria-label={label}
      >
        {options.map((o) => (
          <ToggleGroupItem key={o} value={o} className={chip} aria-label={ariaLabel?.(o)}>
            {renderLabel(o)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </fieldset>
  )
}

/** Draft state lives here and is created fresh each time the sheet opens */
function FilterForm({ onDone }: { onDone: () => void }) {
  const filters = useAppStore((s) => s.filters)
  const plans = useAppStore((s) => s.plans)
  const user = useAppStore((s) => s.user)
  const setFilters = useAppStore((s) => s.setFilters)
  const [draft, setDraft] = useState<Filters>(filters)

  const count = plans.filter((p) => p.status === 'upcoming' && matchesFilters(p, draft)).length
  const campusDays = user?.campusDays ?? []

  const apply = (next: Filters) => {
    setFilters(next)
    const d = describeFilters(next)
    toast.success(`Showing plans for ${d.days} · ${d.time}${d.activities ? ` · ${d.activities}` : ''}`)
    onDone()
  }

  return (
    <>
      <div className="grid gap-6 overflow-y-auto px-4">
        <Group
          label="Day"
          hint="your campus days are marked"
          values={draft.days}
          options={DAYS}
          onChange={(days) => setDraft({ ...draft, days })}
          ariaLabel={(d) => `${DAY_NAME[d]}${campusDays.includes(d) ? ', one of your campus days' : ''}`}
          renderLabel={(d) => (
            <>
              {d}
              {campusDays.includes(d) && <span className="size-1.5 rounded-full bg-current" aria-hidden />}
            </>
          )}
        />
        <Group
          label="Time"
          hint="pick any"
          values={draft.timeWindows}
          options={TIME_WINDOWS}
          onChange={(timeWindows) => setDraft({ ...draft, timeWindows })}
          renderLabel={(t) => TIME_WINDOW_LABEL[t]}
        />
        <Group
          label="Activity"
          hint="none picked shows all"
          values={draft.activities}
          options={ACTIVITIES}
          onChange={(activities) => setDraft({ ...draft, activities })}
          renderLabel={(a) => ACTIVITY_LABEL[a]}
        />
      </div>
      <SheetFooter className="border-t">
        <Button size="xl" onClick={() => apply(draft)} disabled={count === 0} aria-live="polite">
          {count === 0 ? 'No plans match' : `Show ${count} ${count === 1 ? 'plan' : 'plans'}`}
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            setDraft({
              days: user?.campusDays ?? [],
              timeWindows: user?.timeWindows ?? [],
              activities: [],
            })
          }
        >
          Reset to my days and hours
        </Button>
      </SheetFooter>
    </>
  )
}

export function FilterSheet({ open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="mx-auto max-h-[90dvh] max-w-(--app-max-width) rounded-t-2xl">
        <SheetHeader>
          <SheetTitle>Filter plans</SheetTitle>
          <SheetDescription>Only see plans that fit when you are on campus.</SheetDescription>
        </SheetHeader>
        {/* Remount on open so the draft starts from the current filters */}
        <FilterForm key={String(open)} onDone={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  )
}
