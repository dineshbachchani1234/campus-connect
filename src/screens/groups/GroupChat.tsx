import { useEffect, useRef, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import { Link } from 'react-router'
import { LockIcon, MessageCircleIcon, SendHorizontalIcon } from 'lucide-react'
import { Screen } from '@/components/Screen'
import { ScreenHeader } from '@/components/ScreenHeader'
import { EmptyState } from '@/components/StateViews'
import { Button } from '@/components/ui/button'
import { usePlan } from '@/hooks/usePlan'
import { formatTime, personById } from '@/lib/plans'
import type { Message } from '@/lib/types'
import { cn } from '@/lib/utils'
import { useAppStore, useIsJoined } from '@/store/useAppStore'

const MAX_LENGTH = 500

const timeOf = (iso: string) => new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
const dayKey = (iso: string) => new Date(iso).toDateString()
const dayLabel = (iso: string) => {
  const d = new Date(iso)
  if (dayKey(iso) === new Date().toDateString()) return 'Today'
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

// T3 sheet 4: small group chat with message input. Owner: Saravjit.
// Feedback #2: a real text input with a label, placeholder, focus ring and a Send button.
export function GroupChat() {
  const { planId, plan } = usePlan()
  const joined = useIsJoined(planId)
  const allMessages = useAppStore((s) => s.messages)
  const sendMessage = useAppStore((s) => s.sendMessage)
  const endMeetup = useAppStore((s) => s.endMeetup)
  const [draft, setDraft] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const firstScroll = useRef(true)

  const messages = allMessages.filter((m) => m.planId === planId)

  // Keep the newest message in view: jump on open, glide on new messages
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end', behavior: firstScroll.current ? 'auto' : 'smooth' })
    firstScroll.current = false
  }, [messages.length])

  // Go back where you came from, or to the plan if the chat was opened directly
  const canGoBack = (window.history.state?.idx ?? 0) > 0
  const back = canGoBack ? true : plan ? `/plans/${plan.id}` : '/home'

  if (!plan) {
    return (
      <>
        <ScreenHeader title="Group chat" back="/home" />
        <Screen>
          <EmptyState
            title="This chat is gone"
            body="The plan may have been cancelled."
            action={
              <Button asChild>
                <Link to="/home">Back to Campus Plans</Link>
              </Button>
            }
          />
        </Screen>
      </>
    )
  }

  const memberIds = joined && !plan.attendeeIds.includes('me') ? [...plan.attendeeIds, 'me'] : plan.attendeeIds
  const isMember = joined || plan.hostId === 'me'
  const summary = (
    <Link
      to={`/plans/${plan.id}`}
      className="block truncate rounded text-sm text-muted-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      {plan.title} at {plan.place} · {plan.day} {formatTime(plan.startTime)}
    </Link>
  )

  // Safety (design principle 5): only people in the plan can read and post
  if (!isMember) {
    return (
      <>
        <ScreenHeader title={`Group chat (${memberIds.length})`} back={back} subtitle={summary} />
        <Screen>
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center">
            <LockIcon className="size-8 text-muted-foreground" aria-hidden />
            <p className="font-semibold">Join this plan to chat with the group</p>
            <p className="text-sm text-muted-foreground">Only people going can see and send messages.</p>
            <Button asChild>
              <Link to={`/plans/${plan.id}`}>See the plan</Link>
            </Button>
          </div>
        </Screen>
      </>
    )
  }

  const canSend = draft.trim().length > 0

  const send = (e?: FormEvent) => {
    e?.preventDefault()
    if (!canSend) return
    sendMessage(plan.id, draft)
    setDraft('')
    inputRef.current?.focus()
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter sends, Shift+Enter adds a new line. Ignore Enter while an IME is composing.
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      <ScreenHeader title={`Group chat (${memberIds.length})`} back={back} subtitle={summary} />

      <Screen className="gap-0 pb-2">
        {/* Facilitator only: tucked away so testers don't trip over it. Moves to the demo panel (#15). */}
        <details className="mb-3 self-center text-xs text-muted-foreground">
          <summary className="cursor-pointer rounded px-2 py-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
            Facilitator tools
          </summary>
          <Button variant="outline" size="sm" className="mt-2 h-9" onClick={() => endMeetup(plan.id)}>
            Demo: end this meetup now
          </Button>
        </details>

        {messages.length === 0 ? (
          <div className="my-auto flex flex-col items-center gap-3 px-6 py-10 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-accent text-accent-foreground">
              <MessageCircleIcon className="size-7" aria-hidden />
            </span>
            <p className="font-semibold">Say hi to the group</p>
            <p className="text-sm text-muted-foreground">
              A quick hello makes it easier to find each other at {plan.place}.
            </p>
          </div>
        ) : (
          <ol aria-label="Messages" className="mt-auto flex flex-col gap-1">
            {messages.map((m, i) => (
              <ChatItem key={m.id} message={m} prev={messages[i - 1]} />
            ))}
          </ol>
        )}
        {/* Scroll margin keeps the newest message clear of the composer (and the tab bar on phones) */}
        <div ref={endRef} className="scroll-mb-36 sm:scroll-mb-20" />
      </Screen>

      {/* Composer stays above the tab bar. On phones the page scrolls, so offset by the nav height. */}
      <form
        onSubmit={send}
        className="sticky bottom-[calc(3.5rem+1px)] z-10 flex items-end gap-2 border-t bg-background px-4 py-3 sm:bottom-0"
      >
        <label htmlFor="chat-input" className="sr-only">
          Message the group
        </label>
        <textarea
          id="chat-input"
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          onFocus={() => setTimeout(() => endRef.current?.scrollIntoView({ block: 'end' }), 300)}
          placeholder="Message the group"
          rows={1}
          maxLength={MAX_LENGTH}
          enterKeyHint="send"
          autoComplete="off"
          className={cn(
            'field-sizing-content max-h-32 min-h-11 flex-1 resize-none rounded-xl border border-input bg-transparent px-3 py-2.5',
            'text-base outline-none placeholder:text-muted-foreground',
            'focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50',
          )}
        />
        <Button type="submit" size="icon-lg" className="size-11 rounded-xl" disabled={!canSend} aria-label="Send">
          <SendHorizontalIcon className="size-5" aria-hidden />
        </Button>
      </form>
    </>
  )
}

function ChatItem({ message, prev }: { message: Message; prev?: Message }) {
  const mine = message.authorId === 'me'
  const name = mine ? 'You' : (personById(message.authorId)?.name ?? 'Student')
  const newDay = !prev || dayKey(prev.at) !== dayKey(message.at)
  // Hide the name when the same person sends several messages in a row
  const showName = !mine && (newDay || prev?.authorId !== message.authorId)

  return (
    <>
      {newDay && (
        <li className="my-2 self-center rounded-full bg-muted px-3 py-0.5 text-xs text-muted-foreground">
          {dayLabel(message.at)}
        </li>
      )}
      <li className={cn('flex max-w-[80%] flex-col gap-0.5', mine ? 'items-end self-end' : 'items-start self-start')}>
        {showName && <span className="mt-1 px-1 text-xs font-medium text-muted-foreground">{name}</span>}
        <p
          className={cn(
            'rounded-2xl px-3.5 py-2 text-sm leading-snug break-words whitespace-pre-wrap',
            mine ? 'rounded-br-md bg-primary text-primary-foreground' : 'rounded-bl-md bg-muted text-foreground',
          )}
        >
          <span className="sr-only">{name}: </span>
          {message.text}
        </p>
        <time dateTime={message.at} className="px-1 text-[11px] text-muted-foreground">
          {timeOf(message.at)}
        </time>
      </li>
    </>
  )
}
