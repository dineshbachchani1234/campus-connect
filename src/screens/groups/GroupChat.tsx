import { PlaceholderScreen } from '@/components/PlaceholderScreen'
import { Button } from '@/components/ui/button'
import { usePlan } from '@/hooks/usePlan'
import { useAppStore } from '@/store/useAppStore'
import { personById } from '@/lib/plans'

// T3 sheet 4: small group chat with message input. Owner: Saravjit.
export function GroupChat() {
  const { planId, plan } = usePlan()
  const allMessages = useAppStore((s) => s.messages)
  const messages = allMessages.filter((m) => m.planId === planId)
  const endMeetup = useAppStore((s) => s.endMeetup)
  return (
    <PlaceholderScreen
      title={`Group chat (${plan?.attendeeIds.length ?? 0})`}
      screen="Group chat"
      owner="Saravjit"
      back
    >
      <ul className="grid gap-1 text-sm">
        {messages.map((m) => (
          <li key={m.id}>
            <strong>{m.authorId === 'me' ? 'You' : personById(m.authorId)?.name}:</strong> {m.text}
          </li>
        ))}
      </ul>
      {planId && (
        <Button variant="outline" onClick={() => endMeetup(planId)}>
          Demo: end this meetup now
        </Button>
      )}
    </PlaceholderScreen>
  )
}
