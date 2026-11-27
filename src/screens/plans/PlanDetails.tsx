import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import {
  BookOpenIcon,
  CalendarPlusIcon,
  CheckCircle2Icon,
  ClockIcon,
  MapPinIcon,
  MessageCircleIcon,
  UsersIcon,
} from 'lucide-react'
import { AvatarStack } from '@/components/AvatarStack'
import { Screen } from '@/components/Screen'
import { ScreenHeader } from '@/components/ScreenHeader'
import { EmptyState } from '@/components/StateViews'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { usePlan } from '@/hooks/usePlan'
import { ACTIVITY_LABEL, endTime, formatTime, isFull, personById, sharedClassmates } from '@/lib/plans'
import type { Day } from '@/lib/types'
import { useAppStore, useIsJoined } from '@/store/useAppStore'

const DAY_NAME: Record<Day, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
}

// T3 sheet 2: plan name, time and place, who is going, why meet, Join. Owner: Saravjit.
// Feedback #3: already enrolled state. Feedback #4: confirmation on join.
export function PlanDetails() {
  const { planId, plan } = usePlan()
  const joined = useIsJoined(planId)
  const user = useAppStore((s) => s.user)
  const joinPlan = useAppStore((s) => s.joinPlan)
  const leavePlan = useAppStore((s) => s.leavePlan)
  const navigate = useNavigate()
  const [leaveOpen, setLeaveOpen] = useState(false)

  if (!plan) {
    return (
      <>
        <ScreenHeader title="Plan details" back="/home" />
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

  // Make sure "you" show up in the list once you have joined
  const goingIds = joined && !plan.attendeeIds.includes('me') ? [...plan.attendeeIds, 'me'] : plan.attendeeIds
  const full = isFull(plan) && !joined
  const spotsLeft = Math.max(plan.maxSize - goingIds.length, 0)
  const host = plan.hostId === 'me' ? null : personById(plan.hostId)
  const isHost = plan.hostId === 'me'
  const classmates = user ? sharedClassmates(plan, user) : []

  const handleJoin = () => {
    const result = joinPlan(plan.id)
    if (result === 'already-joined') {
      toast.info("You're already in this plan", { description: 'No need to join twice. See you there!' })
    } else if (result === 'full') {
      toast.error('This plan is full', { description: 'Try another plan or create your own.' })
    } else {
      toast.success(`You joined ${plan.title}`, {
        description: `${DAY_NAME[plan.day]} at ${formatTime(plan.startTime)}, ${plan.place}`,
      })
      navigate(`/plans/${plan.id}/joined`)
    }
  }

  const handleLeave = () => {
    leavePlan(plan.id)
    setLeaveOpen(false)
    toast(`You left ${plan.title}`, { description: 'You can join again any time there is a spot.' })
  }

  return (
    <>
      <ScreenHeader title="Plan details" back="/home" />
      <Screen className="gap-5 pb-8">
        {/* Title block */}
        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{ACTIVITY_LABEL[plan.activity]}</Badge>
            {plan.classTag && <Badge variant="outline">{plan.classTag}</Badge>}
            {joined && (
              <Badge className="bg-success text-success-foreground">
                <CheckCircle2Icon aria-hidden /> You're going
              </Badge>
            )}
            {full && <Badge variant="destructive">Full</Badge>}
          </div>
          <h2 className="text-2xl leading-tight font-semibold">
            {plan.title} <span className="font-normal text-muted-foreground">at {plan.place}</span>
          </h2>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <ClockIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span>
                <span className="font-medium">{DAY_NAME[plan.day]}</span>, {formatTime(plan.startTime)} to{' '}
                {endTime(plan.startTime, plan.durationMin)}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span>
                <span className="font-medium">{plan.place}</span>
                {plan.placeDetail && <span className="text-muted-foreground">, {plan.placeDetail}</span>}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <UsersIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden />
              <span>
                Hosted by <span className="font-medium">{isHost ? 'you' : (host?.name ?? 'a student')}</span> ·{' '}
                {goingIds.length} of {plan.maxSize} spots
                {spotsLeft > 0 && <span className="text-muted-foreground"> ({spotsLeft} left)</span>}
              </span>
            </li>
          </ul>
        </section>

        <Separator />

        {/* Who's going (design principle 2: show who is going before you commit) */}
        <section aria-labelledby="whos-going" className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 id="whos-going" className="font-semibold">
              Who's going ({goingIds.length})
            </h3>
            <AvatarStack ids={goingIds} max={5} />
          </div>
          {classmates.length > 0 && (
            <p className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-sm text-accent-foreground">
              <BookOpenIcon className="size-4" aria-hidden />
              {classmates.length === 1
                ? `${classmates[0].name} shares your class`
                : `${classmates.length} share your class`}
            </p>
          )}
          <ul className="divide-y rounded-xl border">
            {goingIds.map((id) => {
              if (id === 'me') {
                return (
                  <li key={id} className="flex items-center justify-between gap-2 px-3 py-2.5">
                    <span className="font-medium">You</span>
                    {isHost && <Badge variant="outline">Host</Badge>}
                  </li>
                )
              }
              const person = personById(id)
              if (!person) return null
              const shared = classmates.some((c) => c.id === id)
              return (
                <li key={id} className="flex items-center justify-between gap-2 px-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate font-medium">
                      {person.name}{' '}
                      {person.pronouns && (
                        <span className="text-sm font-normal text-muted-foreground">({person.pronouns})</span>
                      )}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {person.program}
                      {shared && ' · shares your class'}
                    </p>
                    {person.verified && <VerifiedBadge />}
                  </div>
                  {id === plan.hostId && <Badge variant="outline">Host</Badge>}
                </li>
              )
            })}
          </ul>
        </section>

        {/* Why meet */}
        <section aria-labelledby="why-meet" className="space-y-2">
          <h3 id="why-meet" className="font-semibold">
            Why meet
          </h3>
          <p className="rounded-xl bg-muted px-4 py-3 text-sm leading-relaxed">{plan.reason}</p>
        </section>

        {/* Action area */}
        <section aria-live="polite" className="mt-auto space-y-3">
          {joined ? (
            // Feedback #3: a clear "already enrolled" state instead of a second Join button
            <>
              <div
                role="status"
                className="flex items-start gap-3 rounded-xl border border-success/50 bg-success/10 p-4"
              >
                <CheckCircle2Icon className="mt-0.5 size-5 shrink-0 text-success" aria-hidden />
                <div>
                  <p className="font-semibold">You're going</p>
                  <p className="text-sm text-muted-foreground">
                    You already joined this plan, so there is nothing else to do. See you {DAY_NAME[plan.day]}!
                  </p>
                </div>
              </div>
              <Button asChild size="xl">
                <Link to={`/chat/${plan.id}`}>
                  <MessageCircleIcon aria-hidden /> Message the group
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link to={`/plans/${plan.id}/calendar`}>
                  <CalendarPlusIcon aria-hidden /> Add to calendar
                </Link>
              </Button>
              {!isHost && (
                <Button
                  variant="ghost"
                  className="h-11 w-full text-muted-foreground"
                  onClick={() => setLeaveOpen(true)}
                >
                  Leave plan
                </Button>
              )}
            </>
          ) : full ? (
            <>
              <Button size="xl" disabled>
                This plan is full
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                All {plan.maxSize} spots are taken.{' '}
                <Link to="/create" className="font-medium text-primary underline-offset-4 hover:underline">
                  Create your own plan
                </Link>
              </p>
            </>
          ) : (
            <>
              <Button size="xl" onClick={handleJoin}>
                Join this plan
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                Only verified Northeastern students can see and join plans.
              </p>
            </>
          )}
        </section>
      </Screen>

      <Dialog open={leaveOpen} onOpenChange={setLeaveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave this plan?</DialogTitle>
            <DialogDescription>
              {plan.title} on {DAY_NAME[plan.day]} at {formatTime(plan.startTime)}. The group will see one less person
              going.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="h-11">
                Stay in the plan
              </Button>
            </DialogClose>
            <Button variant="destructive" className="h-11" onClick={handleLeave}>
              Leave plan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
