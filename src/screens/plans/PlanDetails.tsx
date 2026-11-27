import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { PlaceholderScreen } from '@/components/PlaceholderScreen'
import { EmptyState } from '@/components/StateViews'
import { Button } from '@/components/ui/button'
import { usePlan } from '@/hooks/usePlan'
import { useAppStore, useIsJoined } from '@/store/useAppStore'

// T3 sheet 2: plan name, time and place, who is going, why meet, Join. Owner: Saravjit.
// Feedback #3: already enrolled state. Feedback #4: confirmation on join.
export function PlanDetails() {
  const { planId, plan } = usePlan()
  const joined = useIsJoined(planId)
  const joinPlan = useAppStore((s) => s.joinPlan)
  const navigate = useNavigate()

  if (!plan) {
    return (
      <EmptyState
        title="This plan is gone"
        body="It may have been cancelled."
        action={
          <Button asChild>
            <Link to="/home">Back to Campus Plans</Link>
          </Button>
        }
      />
    )
  }

  return (
    <PlaceholderScreen title="Plan details" screen="Plan details" owner="Saravjit" back="/home">
      <p className="font-semibold">
        {plan.title} at {plan.place}
      </p>
      <Button
        size="xl"
        variant={joined ? 'secondary' : 'default'}
        onClick={() => {
          const result = joinPlan(plan.id)
          if (result === 'already-joined') toast.info("You're already in this plan")
          else if (result === 'full') toast.error('This plan is full')
          else navigate(`/plans/${plan.id}/joined`)
        }}
      >
        {joined ? "You're already in (tap to test)" : 'Join this plan'}
      </Button>
    </PlaceholderScreen>
  )
}
