import { useState } from 'react'
import { Link } from 'react-router'
import { PlusIcon, SlidersHorizontalIcon } from 'lucide-react'
import { PlanCard } from '@/components/PlanCard'
import { Screen } from '@/components/Screen'
import { ScreenHeader } from '@/components/ScreenHeader'
import { EmptyState, ErrorState, LoadingState } from '@/components/StateViews'
import { Button } from '@/components/ui/button'
import { useFeed } from '@/services/api'
import { useAppStore } from '@/store/useAppStore'
import { FilterSheet } from '@/screens/plans/FilterSheet'

// T3 sheet 2: Campus Plans feed. Owner: Dinesh.
// Feedback #1 (cards look tappable) and #5 (Create is easy to find).
// TODO(Dinesh): filter chip design, sticky create button, empty/error polish.
export function HomeFeed() {
  const { status, plans, error, retry } = useFeed()
  const filters = useAppStore((s) => s.filters)
  const joinedPlanIds = useAppStore((s) => s.joinedPlanIds)
  const [filterOpen, setFilterOpen] = useState(false)

  const chip = `My days: ${filters.days.join(', ') || 'Any'} · ${filters.timeWindows.length === 2 && !filters.timeWindows.includes('evening') ? 'Daytime' : filters.timeWindows.join(', ') || 'Any time'}`

  return (
    <>
      <ScreenHeader
        title="Campus Plans"
        subtitle={
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="inline-flex min-h-9 items-center gap-2 rounded-full border bg-accent px-3 text-sm font-medium text-accent-foreground outline-none hover:border-primary/40 focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <SlidersHorizontalIcon className="size-4" aria-hidden />
            {chip}
          </button>
        }
        action={
          <Button variant="outline" onClick={() => setFilterOpen(true)}>
            <SlidersHorizontalIcon /> Filter
          </Button>
        }
      />
      <Screen>
        <Button size="xl" asChild>
          <Link to="/create">
            <PlusIcon /> Create a plan
          </Link>
        </Button>
        {status === 'loading' && <LoadingState label="Finding plans on your days" />}
        {status === 'error' && <ErrorState message={error ?? 'Unknown error'} onRetry={retry} />}
        {status === 'success' && plans.length === 0 && (
          <EmptyState
            title="No plans on your days yet"
            body="Try another day or time, or start one yourself."
            action={
              <Button asChild>
                <Link to="/create">Create a plan</Link>
              </Button>
            }
          />
        )}
        {status === 'success' && (
          <ul className="grid gap-3">
            {plans.map((plan) => (
              <li key={plan.id}>
                <PlanCard plan={plan} joined={joinedPlanIds.includes(plan.id)} />
              </li>
            ))}
          </ul>
        )}
      </Screen>
      <FilterSheet open={filterOpen} onOpenChange={setFilterOpen} />
    </>
  )
}
