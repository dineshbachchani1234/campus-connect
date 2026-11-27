import { Link } from 'react-router'
import { PlaceholderScreen } from '@/components/PlaceholderScreen'
import { Button } from '@/components/ui/button'
import { usePlan } from '@/hooks/usePlan'

// T3 sheet 3: summary, visible to your class, Back to home. Owner: Furqan.
export function PlanPosted() {
  const { plan } = usePlan()
  return (
    <PlaceholderScreen title="Plan posted" screen="Plan posted" owner="Furqan">
      {plan && (
        <p>
          {plan.title} at {plan.place}, {plan.day}
        </p>
      )}
      <Button size="xl" asChild>
        <Link to="/home">Back to home</Link>
      </Button>
    </PlaceholderScreen>
  )
}
