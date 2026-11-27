import { useParams } from 'react-router'
import { useAppStore } from '@/store/useAppStore'

/** Reads :planId from the URL and returns that plan (or undefined if not found) */
export function usePlan() {
  const { planId } = useParams()
  const plan = useAppStore((s) => s.plans.find((p) => p.id === planId))
  return { planId, plan }
}
