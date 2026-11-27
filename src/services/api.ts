// Fake async data layer. Screens load data through here instead of reading
// the store directly when they need loading and error states. If we ever add
// a real backend, only this file changes.
import { useEffect, useMemo, useState } from 'react'
import { useAppStore } from '@/store/useAppStore'
import { matchesFilters } from '@/lib/plans'
import type { Plan } from '@/lib/types'

const FAKE_DELAY_MS = 500

const wait = (ms = FAKE_DELAY_MS) => new Promise((r) => setTimeout(r, ms))

export class ApiError extends Error {}

export async function fetchFeed(): Promise<Plan[]> {
  await wait()
  const { plans, filters, demo } = useAppStore.getState()
  if (demo.forceError) throw new ApiError('Could not load plans. Check your connection and try again.')
  if (demo.forceEmpty) return []
  return plans.filter((p) => p.status === 'upcoming' && matchesFilters(p, filters))
}

type Status = 'loading' | 'success' | 'error'

interface Result {
  request: object
  status: Exclude<Status, 'loading'>
  plans: Plan[]
  error?: string
}

/**
 * Loads the filtered feed and reloads when filters, plans or demo flags change.
 * Returns { status, plans, error, retry }.
 */
export function useFeed() {
  const filters = useAppStore((s) => s.filters)
  const plans = useAppStore((s) => s.plans)
  const demo = useAppStore((s) => s.demo)
  const [attempt, setAttempt] = useState(0)
  // A new object each time an input changes; a result only counts if it was made for this request.
  const request = useMemo(() => ({ filters, plans, demo, attempt }), [filters, plans, demo, attempt])
  const [result, setResult] = useState<Result | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchFeed()
      .then((list) => !cancelled && setResult({ request, status: 'success', plans: list }))
      .catch((e: Error) => !cancelled && setResult({ request, status: 'error', plans: [], error: e.message }))
    return () => {
      cancelled = true
    }
  }, [request])

  const current = result?.request === request ? result : null
  return {
    status: (current?.status ?? 'loading') as Status,
    plans: current?.plans ?? [],
    error: current?.error,
    retry: () => setAttempt((n) => n + 1),
  }
}
