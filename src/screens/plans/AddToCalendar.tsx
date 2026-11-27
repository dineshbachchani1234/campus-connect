import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { PlaceholderScreen } from '@/components/PlaceholderScreen'
import { Button } from '@/components/ui/button'
import { usePlan } from '@/hooks/usePlan'

// T3 sheet 3: event summary, reminder toggle, Done. Owner: Saravjit.
export function AddToCalendar() {
  const { planId } = usePlan()
  const navigate = useNavigate()
  return (
    <PlaceholderScreen
      title="Add to calendar"
      screen="Add to calendar"
      owner="Saravjit"
      back={`/plans/${planId}/joined`}
    >
      <Button
        size="xl"
        onClick={() => {
          toast.success('Added to your calendar')
          navigate('/home')
        }}
      >
        Done
      </Button>
    </PlaceholderScreen>
  )
}
