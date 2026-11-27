import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { BellIcon, BellOffIcon, CalendarDaysIcon, ClockIcon, MapPinIcon } from 'lucide-react'
import { Screen } from '@/components/Screen'
import { ScreenHeader } from '@/components/ScreenHeader'
import { EmptyState } from '@/components/StateViews'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { usePlan } from '@/hooks/usePlan'
import { downloadIcs, formatDate, nextOccurrence } from '@/lib/calendar'
import { endTime, formatTime } from '@/lib/plans'
import { cn } from '@/lib/utils'
import { useIsJoined } from '@/store/useAppStore'

const REMINDER_MINUTES = 30

type CalendarChoice = 'outlook' | 'google' | 'device'

const CALENDARS: { value: CalendarChoice; label: string; hint: string }[] = [
  { value: 'outlook', label: 'NU Outlook calendar', hint: 'Your Northeastern account' },
  { value: 'google', label: 'Google Calendar', hint: 'Your personal Google account' },
  {
    value: 'device',
    label: 'Phone calendar (.ics file)',
    hint: 'Downloads a file for Apple Calendar or any other app',
  },
]

const CALENDAR_NAME: Record<CalendarChoice, string> = {
  outlook: 'NU Outlook calendar',
  google: 'Google Calendar',
  device: 'phone calendar',
}

// T3 sheet 3: event summary, reminder toggle, Done. Owner: Saravjit.
// Feedback #4: Done gives a clear confirmation.
export function AddToCalendar() {
  const { planId, plan } = usePlan()
  const joined = useIsJoined(planId)
  const navigate = useNavigate()
  const [calendar, setCalendar] = useState<CalendarChoice>('outlook')
  const [reminderOn, setReminderOn] = useState(true)
  const start = useMemo(() => (plan ? nextOccurrence(plan.day, plan.startTime) : null), [plan])

  if (!plan || !start) {
    return (
      <>
        <ScreenHeader title="Add to calendar" back="/home" />
        <Screen>
          <EmptyState
            title="This plan is gone"
            body="It may have been cancelled."
            action={
              <Button asChild>
                <Link to="/home">Back to Campus Plans</Link>
              </Button>
            }
          />
        </Screen>
      </>
    )
  }

  const handleDone = () => {
    // Prototype: Outlook and Google are simulated. The phone option downloads a real .ics file.
    if (calendar === 'device') downloadIcs(plan, start, reminderOn ? REMINDER_MINUTES : null)
    toast.success('Added to your calendar', {
      description: `${plan.title}, ${formatDate(start)} at ${formatTime(plan.startTime)} in your ${CALENDAR_NAME[calendar]}. ${
        reminderOn ? `Reminder ${REMINDER_MINUTES} minutes before.` : 'No reminder.'
      }`,
    })
    navigate('/home')
  }

  return (
    <>
      <ScreenHeader title="Add to calendar" back={joined ? `/plans/${plan.id}/joined` : `/plans/${plan.id}`} />
      <Screen className="gap-6 pb-8">
        {/* Event summary */}
        <section aria-label="Event summary" className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <CalendarDaysIcon className="size-5" aria-hidden />
            </span>
            <p className="text-lg leading-tight font-semibold">
              {plan.title} <span className="font-normal text-muted-foreground">at {plan.place}</span>
            </p>
          </div>
          <ul className="space-y-1.5 text-sm">
            <li className="flex items-start gap-2">
              <ClockIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span>
                <span className="font-medium">{formatDate(start)}</span>, {formatTime(plan.startTime)} to{' '}
                {endTime(plan.startTime, plan.durationMin)}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              {plan.placeDetail ? `${plan.place}, ${plan.placeDetail}` : plan.place}
            </li>
          </ul>
        </section>

        {/* Calendar choice */}
        <section className="space-y-3">
          <h2 id="calendar-choice" className="font-semibold">
            Which calendar?
          </h2>
          <RadioGroup
            aria-labelledby="calendar-choice"
            value={calendar}
            onValueChange={(v) => setCalendar(v as CalendarChoice)}
            className="gap-2"
          >
            {CALENDARS.map((c) => (
              <Label
                key={c.value}
                htmlFor={`cal-${c.value}`}
                className={cn(
                  'flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 font-normal transition-colors',
                  'hover:border-primary/40',
                  calendar === c.value && 'border-primary bg-primary/5',
                )}
              >
                <RadioGroupItem id={`cal-${c.value}`} value={c.value} />
                <span className="space-y-0.5">
                  <span className="block font-medium">{c.label}</span>
                  <span className="block text-xs text-muted-foreground">{c.hint}</span>
                </span>
              </Label>
            ))}
          </RadioGroup>
        </section>

        {/* Reminder: the state is shown in words and icon as well as the switch position */}
        <section>
          <Label
            htmlFor="reminder"
            className={cn(
              'flex min-h-14 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 font-normal transition-colors',
              reminderOn && 'border-primary bg-primary/5',
            )}
          >
            {reminderOn ? (
              <BellIcon className="size-5 shrink-0 text-primary" aria-hidden />
            ) : (
              <BellOffIcon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
            )}
            <span className="flex-1 space-y-0.5">
              <span className="block font-medium">Remind me {REMINDER_MINUTES} minutes before</span>
              <span className={cn('block text-xs', reminderOn ? 'text-primary' : 'text-muted-foreground')}>
                {reminderOn
                  ? `On: we'll remind you at ${formatTime(reminderTime(plan.startTime))}`
                  : 'Off: no reminder'}
              </span>
            </span>
            <Switch id="reminder" checked={reminderOn} onCheckedChange={setReminderOn} />
          </Label>
        </section>

        <div className="mt-auto space-y-2">
          <Button size="xl" onClick={handleDone}>
            Done
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            This is a prototype. Only the phone calendar option creates a real event file.
          </p>
        </div>
      </Screen>
    </>
  )
}

/** "14:00" -> "13:30" */
function reminderTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const total = (h * 60 + m - REMINDER_MINUTES + 24 * 60) % (24 * 60)
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}
