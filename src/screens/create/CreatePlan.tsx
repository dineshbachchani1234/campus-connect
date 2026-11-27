import { useNavigate } from 'react-router'
import { PlaceholderScreen } from '@/components/PlaceholderScreen'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/useAppStore'

// T3 sheet 3: activity, place, day/time, who can join, size, Post plan. Owner: Furqan.
// Feedback #2 (real inputs) and #4 (confirmation).
export function CreatePlan() {
  const createPlan = useAppStore((s) => s.createPlan)
  const navigate = useNavigate()
  return (
    <PlaceholderScreen title="Create a plan" screen="Create a plan" owner="Furqan" back="/home">
      <Button
        size="xl"
        onClick={() => {
          const plan = createPlan({
            title: 'Study group',
            activity: 'study',
            place: 'Snell Library',
            day: 'Wed',
            startTime: '15:00',
            durationMin: 60,
            reason: 'Work on the T4 report',
            visibility: 'class',
            classTag: 'CS 5340',
            maxSize: 5,
          })
          navigate(`/create/posted/${plan.id}`)
        }}
      >
        Post a sample plan
      </Button>
    </PlaceholderScreen>
  )
}
