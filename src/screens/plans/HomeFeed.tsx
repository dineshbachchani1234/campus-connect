import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { CalendarDaysIcon, PlusIcon, SlidersHorizontalIcon } from 'lucide-react'
import { PlanCard } from '@/components/PlanCard'
import { Screen } from '@/components/Screen'
import { ScreenHeader } from '@/components/ScreenHeader'
import { EmptyState, ErrorState } from '@/components/StateViews'
import { Button } from '@/components/ui/button'
import { DAY_NAME, describeFilters, filtersAreCustom, groupByDay } from '@/lib/plans'
import { cn } from '@/lib/utils'
import { useFeed } from '@/services/api'
import { useAppStore } from '@/store/useAppStore'
import { FilterSheet } from '@/screens/plans/FilterSheet'

// T3 sheet 2: Campus Plans feed. Owner: Dinesh (issue #12).
// Feedback 1: plans must look tappable (PlanCard), and set apart from plain text (day headings are quiet text).
// Feedback 5: Create a plan is the first thing under the header, comes back as a floating button
// once you scroll past it, and is offered again in the empty state.

function PlanCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border bg-card p-4" aria-hidden>
      <div className="mb-3 h-5 w-16 rounded-full bg-muted" />
      <div className="mb-2 h-5 w-3/4 rounded bg-muted" />
      <div className="mb-3 h-4 w-1/2 rounded bg-muted" />
      <div className="h-7 w-24 rounded-full bg-muted" />
    </div>
  )
}

export function HomeFeed() {
  const { status, plans, error, retry } = useFeed()
  const user = useAppStore((s) => s.user)
  const filters = useAppStore((s) => s.filters)
  const joinedPlanIds = useAppStore((s) => s.joinedPlanIds)
  const resetFilters = useAppStore((s) => s.resetFilters)
  const [filterOpen, setFilterOpen] = useState(false)

  // Show the floating Create button only after the main one scrolls out of view
  const createRef = useRef<HTMLAnchorElement>(null)
  const [showFab, setShowFab] = useState(false)
  useEffect(() => {
    const el = createRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setShowFab(!entry.isIntersecting))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const summary = describeFilters(filters)
  const custom = filtersAreCustom(filters, user)
  const firstName = user?.name.split(' ')[0]
  const groups = groupByDay(plans)

  return (
    <>
      <ScreenHeader
        title="Campus Plans"
        action={
          <Button
            variant="outline"
            size="lg"
            onClick={() => setFilterOpen(true)}
            aria-label={custom ? 'Filter plans, custom filters on' : 'Filter plans'}
            className="relative"
          >
            <SlidersHorizontalIcon /> Filter
            {custom && <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-primary" aria-hidden />}
          </Button>
        }
        subtitle={
          <div className="grid gap-2">
            {firstName && (
              <p className="text-sm text-muted-foreground">
                Hi {firstName}. These plans fit the days you are on campus.
              </p>
            )}
            <button
              type="button"
              onClick={() => setFilterOpen(true)}
              className="inline-flex min-h-9 w-fit items-center gap-2 rounded-full border border-primary/20 bg-accent px-3 text-sm font-medium text-accent-foreground outline-none hover:border-primary/50 focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <CalendarDaysIcon className="size-4" aria-hidden />
              {custom ? 'Showing' : 'My days'}: {summary.days} · {summary.time}
              {summary.activities && ` · ${summary.activities}`}
            </button>
          </div>
        }
      />
      <Screen>
        <Button size="xl" asChild>
          <Link to="/create" ref={createRef}>
            <PlusIcon /> Create a plan
          </Link>
        </Button>

        <div aria-live="polite" className="sr-only">
          {status === 'success' && `${plans.length} plans found`}
        </div>

        {status === 'loading' && (
          <div className="grid gap-3" role="status" aria-label="Loading plans">
            <PlanCardSkeleton />
            <PlanCardSkeleton />
            <PlanCardSkeleton />
          </div>
        )}

        {status === 'error' && <ErrorState message={error ?? 'Unknown error'} onRetry={retry} />}

        {status === 'success' && plans.length === 0 && (
          <EmptyState
            title={custom ? 'No plans match these filters' : 'No plans on your days yet'}
            body={
              custom
                ? 'Try fewer filters, or start something yourself.'
                : 'Be the first. A small plan with two or three people is a great start.'
            }
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button asChild>
                  <Link to="/create">
                    <PlusIcon /> Create a plan
                  </Link>
                </Button>
                {custom && (
                  <Button variant="outline" onClick={resetFilters}>
                    Back to my days
                  </Button>
                )}
              </div>
            }
          />
        )}

        {status === 'success' &&
          groups.map(({ day, plans: dayPlans }) => (
            <section key={day} aria-labelledby={`day-${day}`} className="grid gap-3">
              <h2 id={`day-${day}`} className="text-sm font-semibold text-muted-foreground">
                {DAY_NAME[day]} · {dayPlans.length} {dayPlans.length === 1 ? 'plan' : 'plans'}
              </h2>
              <ul className="grid gap-3">
                {dayPlans.map((plan) => (
                  <li key={plan.id}>
                    <PlanCard plan={plan} joined={joinedPlanIds.includes(plan.id)} />
                  </li>
                ))}
              </ul>
            </section>
          ))}

        {status === 'success' && plans.length > 0 && (
          <p className="pb-2 text-center text-sm text-muted-foreground">
            Nothing fits?{' '}
            <Link to="/create" className="font-medium text-primary underline-offset-4 hover:underline">
              Create your own plan
            </Link>
          </p>
        )}

        {/* Floating Create button, appears once the main one is scrolled away */}
        <div
          className={cn(
            'pointer-events-none sticky bottom-20 z-20 -mt-4 flex justify-end transition-opacity sm:bottom-4',
            showFab ? 'opacity-100' : 'opacity-0',
          )}
          aria-hidden={!showFab}
        >
          <Button
            asChild
            size="lg"
            className={cn('h-12 rounded-full px-5 shadow-lg', showFab && 'pointer-events-auto')}
            tabIndex={showFab ? 0 : -1}
          >
            <Link to="/create" tabIndex={showFab ? 0 : -1}>
              <PlusIcon /> Create
            </Link>
          </Button>
        </div>
      </Screen>
      <FilterSheet open={filterOpen} onOpenChange={setFilterOpen} />
    </>
  )
}
