// Facilitator panel for test sessions (issue #15). Participants never see it
// unless demo mode is on. Open it with ?demo=1 or a long press on a screen title.
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { DownloadIcon, FlaskConicalIcon, PlayIcon, RotateCcwIcon, SquareIcon, Trash2Icon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { demoParam, useDemoMode } from '@/lib/demoMode'
import { eventLog, labelFor, summarize, useSessionLog } from '@/lib/eventLog'
import { formatTime } from '@/lib/plans'
import { useAppStore } from '@/store/useAppStore'

const TASKS = [
  { id: 'task-1', label: 'Task 1: Find and join a plan' },
  { id: 'task-2', label: 'Task 2: Make it weekly' },
  { id: 'task-3', label: 'Task 3: Create a plan' },
]

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3">
      <h3 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{title}</h3>
      {children}
    </section>
  )
}

function SwitchRow({
  id,
  label,
  hint,
  checked,
  onChange,
}: {
  id: string
  label: string
  hint: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <Label htmlFor={id}>{label}</Label>
        <p className="text-xs text-muted-foreground">{hint}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  )
}

/** Watches the URL for ?demo=1 and logs screens and taps while demo mode is on */
function useDemoTracking() {
  const { pathname, search } = useLocation()
  const enabled = useDemoMode((s) => s.enabled)
  const setEnabled = useDemoMode((s) => s.setEnabled)

  useEffect(() => {
    const param = demoParam(search)
    if (param !== null) setEnabled(param)
  }, [search, setEnabled])

  useEffect(() => {
    if (enabled) eventLog.add({ type: 'screen', path: pathname })
  }, [enabled, pathname])

  useEffect(() => {
    if (!enabled) return
    const onClick = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (!target || target.closest('[data-demo-panel]')) return
      const el = target.closest('button, a, [role="button"], [role="switch"], [role="radio"], input, select, textarea')
      if (!el) return
      eventLog.add({ type: 'tap', path: window.location.pathname, label: labelFor(el) })
    }
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [enabled])

  // Shift+D opens the panel on a laptop, unless the user is typing
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName))) return
      if (e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        useDemoMode.getState().openPanel()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])
}

export function DemoPanel() {
  useDemoTracking()
  const navigate = useNavigate()
  const { enabled, panelOpen, setPanelOpen, setEnabled } = useDemoMode()
  const log = useSessionLog()

  const user = useAppStore((s) => s.user)
  const plans = useAppStore((s) => s.plans)
  const joinedPlanIds = useAppStore((s) => s.joinedPlanIds)
  const groups = useAppStore((s) => s.groups)
  const demo = useAppStore((s) => s.demo)
  const { setDemo, resetAll, logIn, endMeetup } = useAppStore.getState()

  const meetable = plans.filter((p) => joinedPlanIds.includes(p.id) && p.status === 'upcoming')
  const [meetupPlanId, setMeetupPlanId] = useState<string>('')
  const selectedMeetup = meetable.find((p) => p.id === meetupPlanId) ?? meetable[0]
  const [confirmReset, setConfirmReset] = useState(false)

  const summary = summarize(log)
  const activeTask = summary.find((t) => t.outcome === 'in progress')

  if (!enabled) return null

  const close = () => setPanelOpen(false)

  return (
    <>
      {/* Hidden while a task runs so the participant is not distracted. Use a long press or Shift+D instead. */}
      {!activeTask && (
        <button
          type="button"
          onClick={() => setPanelOpen(true)}
          aria-label="Open demo panel"
          className="fixed bottom-20 left-3 z-40 inline-flex items-center gap-1.5 rounded-full border border-warning bg-warning/90 px-3 py-1.5 text-xs font-semibold text-foreground shadow-md outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          data-demo-panel
        >
          <FlaskConicalIcon className="size-3.5" aria-hidden />
          Demo
        </button>
      )}

      <Sheet open={panelOpen} onOpenChange={setPanelOpen}>
        <SheetContent
          side="right"
          className="w-full overflow-y-auto sm:max-w-sm"
          data-demo-panel
          // Do not jump into the Participant field, so a shortcut key is not typed into it
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>Demo panel</SheetTitle>
            <SheetDescription>Facilitator tools. Participants should not see this.</SheetDescription>
          </SheetHeader>

          <div className="grid gap-6 px-4 pb-8">
            <Section title="Participant">
              <div className="grid gap-1.5">
                <Label htmlFor="demo-participant">Participant ID</Label>
                <Input
                  id="demo-participant"
                  placeholder="P1"
                  value={log.participant}
                  onChange={(e) => eventLog.setParticipant(e.target.value)}
                />
              </div>
            </Section>

            <Section title="Tasks">
              {activeTask ? (
                <div className="grid gap-2 rounded-lg border p-3">
                  <p className="text-sm">
                    Running: <strong>{TASKS.find((t) => t.id === activeTask.task)?.label}</strong>
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {(
                      [
                        ['success', 'Success'],
                        ['helped', 'Needed help'],
                        ['gave-up', 'Gave up'],
                      ] as const
                    ).map(([outcome, label]) => (
                      <Button
                        key={outcome}
                        size="sm"
                        variant={outcome === 'success' ? 'default' : 'outline'}
                        onClick={() => {
                          eventLog.add({ type: 'task-end', task: activeTask.task, outcome })
                          toast.info(`${activeTask.task} ended: ${label}`)
                        }}
                      >
                        <SquareIcon /> {label}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid gap-2">
                  {TASKS.map((t) => (
                    <Button
                      key={t.id}
                      variant="outline"
                      className="justify-start"
                      onClick={() => {
                        eventLog.add({ type: 'task-start', task: t.id })
                        close()
                      }}
                    >
                      <PlayIcon /> Start {t.label}
                    </Button>
                  ))}
                </div>
              )}
            </Section>

            <Section title="Task 2 trigger">
              {meetable.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Join a plan first. The prompt only appears for plans the participant is going to.
                </p>
              ) : (
                <>
                  <div className="grid gap-1.5">
                    <Label htmlFor="demo-meetup">Plan that just met</Label>
                    <Select value={selectedMeetup?.id} onValueChange={setMeetupPlanId}>
                      <SelectTrigger id="demo-meetup" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {meetable.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.title}, {p.place} ({p.day} {formatTime(p.startTime)})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => {
                      if (!selectedMeetup) return
                      eventLog.add({ type: 'note', text: `Facilitator ended meetup ${selectedMeetup.id}` })
                      endMeetup(selectedMeetup.id)
                      close()
                    }}
                  >
                    End this meetup now
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Shows the "Make this weekly?" prompt on the current screen.
                  </p>
                </>
              )}
            </Section>

            <Section title="Edge states">
              <SwitchRow
                id="demo-empty"
                label="Empty feed"
                hint="Home shows no plans"
                checked={demo.forceEmpty}
                onChange={(v) => setDemo({ forceEmpty: v })}
              />
              <SwitchRow
                id="demo-error"
                label="Network error"
                hint="Home fails to load plans"
                checked={demo.forceError}
                onChange={(v) => setDemo({ forceError: v })}
              />
            </Section>

            <Section title="App data">
              <p className="text-sm text-muted-foreground">
                {user ? `Signed in as ${user.name}` : 'Signed out'} · {joinedPlanIds.length} joined · {groups.length}{' '}
                weekly groups
              </p>
              {!user && (
                <Button
                  variant="outline"
                  onClick={() => {
                    logIn('chen.maya@northeastern.edu')
                    navigate('/home')
                    close()
                  }}
                >
                  Skip sign up (log in as Maya)
                </Button>
              )}
              <Button
                variant={confirmReset ? 'destructive' : 'outline'}
                onClick={() => {
                  if (!confirmReset) {
                    setConfirmReset(true)
                    return
                  }
                  resetAll()
                  setConfirmReset(false)
                  eventLog.add({ type: 'note', text: 'App data reset' })
                  navigate('/')
                  close()
                  toast.success('App reset. Ready for the next participant.')
                }}
                onBlur={() => setConfirmReset(false)}
              >
                <RotateCcwIcon /> {confirmReset ? 'Tap again to reset everything' : 'Reset all app data'}
              </Button>
            </Section>

            <Section title="Session log">
              <p className="text-sm text-muted-foreground">{log.events.length} events recorded</p>
              {summary.length > 0 && (
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-muted-foreground">
                    <tr>
                      <th className="py-1 font-medium">Task</th>
                      <th className="py-1 font-medium">Time</th>
                      <th className="py-1 font-medium">Taps</th>
                      <th className="py-1 font-medium">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {summary.map((t, i) => (
                      <tr key={i} className="border-t">
                        <td className="py-1">{t.task}</td>
                        <td className="py-1">{t.seconds === null ? '...' : `${t.seconds}s`}</td>
                        <td className="py-1">{t.taps}</td>
                        <td className="py-1">{t.outcome}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => eventLog.download()} disabled={log.events.length === 0}>
                  <DownloadIcon /> Download
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    eventLog.clear()
                    toast.info('Session log cleared')
                  }}
                  disabled={log.events.length === 0}
                >
                  <Trash2Icon /> Clear log
                </Button>
              </div>
            </Section>

            <Separator />
            <Button
              variant="ghost"
              onClick={() => {
                setEnabled(false)
                toast.info('Demo mode off')
              }}
            >
              Turn off demo mode
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
