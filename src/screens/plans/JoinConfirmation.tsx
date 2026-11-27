import { Link, Navigate } from 'react-router'
import { CalendarPlusIcon, ClockIcon, MapPinIcon, MessageCircleIcon, PartyPopperIcon } from 'lucide-react'
import { AvatarStack } from '@/components/AvatarStack'
import { Screen } from '@/components/Screen'
import { ScreenHeader } from '@/components/ScreenHeader'
import { EmptyState } from '@/components/StateViews'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { Button } from '@/components/ui/button'
import { usePlan } from '@/hooks/usePlan'
import { endTime, formatTime, personById } from '@/lib/plans'
import { useIsJoined } from '@/store/useAppStore'

// T3 sheet 2: "You're in". Owner: Saravjit.
// Feedback #6: Add to calendar and Message the group need clear separation and emphasis.
export function JoinConfirmation() {
  const { planId, plan } = usePlan()
  const joined = useIsJoined(planId)

  if (!plan) {
    return (
      <>
        <ScreenHeader title="You're in!" back="/home" />
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

  // Opened this URL without joining (e.g. after leaving): send them to the plan instead
  if (!joined) return <Navigate to={`/plans/${plan.id}`} replace />

  const others = plan.attendeeIds.filter((id) => id !== 'me')
  const names = others.map((id) => personById(id)?.name).filter((n): n is string => !!n)
  const goingLine =
    names.length === 0
      ? "You're the first one in. Others can join until the plan fills up."
      : names.length === 1
        ? `${names[0]} is going too.`
        : `${names.slice(0, -1).join(', ')} and ${names.at(-1)} are going too.`

  return (
    <>
      <ScreenHeader title="You're in!" back={`/plans/${plan.id}`} />
      <Screen className="gap-6 pb-8">
        {/* Success moment */}
        <section className="flex flex-col items-center gap-3 pt-4 text-center" role="status">
          <span className="flex size-16 items-center justify-center rounded-full bg-success/15 text-success">
            <PartyPopperIcon className="size-8" aria-hidden />
          </span>
          <h2 className="text-2xl font-semibold">You're in!</h2>
          <p className="text-muted-foreground">
            See you {plan.day} {formatTime(plan.startTime)} at {plan.place}.
          </p>
        </section>

        {/* Summary card */}
        <section aria-label="Plan summary" className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
          <p className="text-lg leading-tight font-semibold">
            {plan.title} <span className="font-normal text-muted-foreground">at {plan.place}</span>
          </p>
          <ul className="space-y-1.5 text-sm">
            <li className="flex items-start gap-2">
              <ClockIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              {plan.day}, {formatTime(plan.startTime)} to {endTime(plan.startTime, plan.durationMin)}
            </li>
            <li className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              {plan.placeDetail ? `${plan.place}, ${plan.placeDetail}` : plan.place}
            </li>
          </ul>
          <div className="flex items-center gap-3 border-t pt-3">
            <AvatarStack ids={plan.attendeeIds.includes('me') ? plan.attendeeIds : [...plan.attendeeIds, 'me']} />
            <div className="min-w-0 space-y-0.5">
              <p className="text-sm">{goingLine}</p>
              {names.length > 0 && <VerifiedBadge label="All verified NU students" />}
            </div>
          </div>
        </section>

        {/* Feedback #6: two clearly different actions, with space and a line saying what each does */}
        <section aria-label="Next steps" className="space-y-5">
          <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">What's next</h3>
          <div className="space-y-2">
            <Button size="xl" asChild>
              <Link to={`/plans/${plan.id}/calendar`}>
                <CalendarPlusIcon aria-hidden /> Add to calendar
              </Link>
            </Button>
            <p className="text-center text-sm text-muted-foreground">Save it to your calendar with a reminder.</p>
          </div>
          <div className="space-y-2">
            <Button size="xl" variant="outline" asChild>
              <Link to={`/chat/${plan.id}`}>
                <MessageCircleIcon aria-hidden /> Message the group
              </Link>
            </Button>
            <p className="text-center text-sm text-muted-foreground">Say hi or ask where to find everyone.</p>
          </div>
        </section>

        <div className="mt-auto text-center">
          <Button variant="link" asChild className="h-11">
            <Link to="/home">Back to Campus Plans</Link>
          </Button>
        </div>
      </Screen>
    </>
  )
}
