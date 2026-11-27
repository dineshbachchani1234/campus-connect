import { Link } from 'react-router'
import { CheckIcon, ChevronRightIcon, ClockIcon, MapPinIcon } from 'lucide-react'
import { AvatarStack } from '@/components/AvatarStack'
import { Badge } from '@/components/ui/badge'
import { ACTIVITY_LABEL, formatTime, isFull } from '@/lib/plans'
import type { Plan } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Props {
  plan: Plan
  joined?: boolean
}

/**
 * A tappable plan in the feed.
 * Feedback #1: on paper, plans did not look tappable. This card has a border,
 * shadow, hover lift, focus ring, a chevron and the whole card is one link.
 */
export function PlanCard({ plan, joined = false }: Props) {
  const full = isFull(plan) && !joined
  return (
    <Link
      to={`/plans/${plan.id}`}
      aria-label={`${plan.title} at ${plan.place}, ${plan.day} ${formatTime(plan.startTime)}, ${plan.attendeeIds.length} going${joined ? ', you are going' : ''}`}
      className={cn(
        'group block rounded-xl border bg-card p-4 shadow-sm transition-all outline-none',
        'hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md',
        'focus-visible:ring-3 focus-visible:ring-ring/50 active:translate-y-0',
        joined && 'border-success/50 bg-success/5',
      )}
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{ACTIVITY_LABEL[plan.activity]}</Badge>
            {plan.classTag && <Badge variant="outline">{plan.classTag}</Badge>}
            {joined && (
              <Badge className="bg-success text-success-foreground">
                <CheckIcon aria-hidden /> You're going
              </Badge>
            )}
            {full && <Badge variant="destructive">Full</Badge>}
          </div>
          <p className="text-base leading-tight font-semibold">
            {plan.title} <span className="font-normal text-muted-foreground">at {plan.place}</span>
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <ClockIcon className="size-4" aria-hidden />
              {plan.day} {formatTime(plan.startTime)}
            </span>
            <span className="inline-flex items-center gap-1">
              <MapPinIcon className="size-4" aria-hidden />
              {plan.placeDetail ?? plan.place}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <AvatarStack ids={plan.attendeeIds} />
            <span className="text-sm">{plan.attendeeIds.length} going</span>
          </div>
        </div>
        <ChevronRightIcon
          className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
          aria-hidden
        />
      </div>
    </Link>
  )
}
