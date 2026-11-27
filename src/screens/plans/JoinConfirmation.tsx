import { Link } from 'react-router'
import { PlaceholderScreen } from '@/components/PlaceholderScreen'
import { Button } from '@/components/ui/button'
import { usePlan } from '@/hooks/usePlan'

// T3 sheet 2: "You're in". Owner: Saravjit.
// Feedback #6: Add to calendar and Message the group need clear separation and emphasis.
export function JoinConfirmation() {
  const { planId } = usePlan()
  return (
    <PlaceholderScreen title="You're in!" screen="Join confirmation" owner="Saravjit" back={`/plans/${planId}`}>
      <Button size="xl" asChild>
        <Link to={`/plans/${planId}/calendar`}>Add to calendar</Link>
      </Button>
      <Button size="xl" variant="outline" asChild>
        <Link to={`/chat/${planId}`}>Message the group</Link>
      </Button>
    </PlaceholderScreen>
  )
}
