import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useAppStore } from '@/store/useAppStore'

// T3 sheet 4: pops up after the session ends. "Make this weekly?" Owner: Furqan.
// Opens whenever store.meetupPromptPlanId is set (demo panel or Group chat trigger).
// TODO(Furqan): show who you met, the weekly day/time, and polish copy and layout.
export function AfterMeetupPrompt() {
  const planId = useAppStore((s) => s.meetupPromptPlanId)
  const plan = useAppStore((s) => s.plans.find((p) => p.id === planId))
  const makeWeekly = useAppStore((s) => s.makeWeekly)
  const dismiss = useAppStore((s) => s.dismissMeetupPrompt)
  const navigate = useNavigate()

  return (
    <Dialog open={!!plan} onOpenChange={(open) => !open && dismiss()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make this weekly?</DialogTitle>
          <DialogDescription>Your {plan?.title.toLowerCase()} just wrapped up. (Placeholder)</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={dismiss}>
            Not now
          </Button>
          <Button
            onClick={() => {
              if (!plan) return
              makeWeekly(plan.id)
              toast.success('Weekly group created. Reminder is on.')
              navigate('/groups')
            }}
          >
            Yes, make it weekly
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
