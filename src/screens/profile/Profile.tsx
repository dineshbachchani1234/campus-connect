import { useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { LogOutIcon, PlusIcon, ShieldCheckIcon, XIcon } from 'lucide-react'
import { FormField } from '@/components/FormField'
import { Screen } from '@/components/Screen'
import { ScreenHeader } from '@/components/ScreenHeader'
import { VerifiedBadge } from '@/components/VerifiedBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { TIME_WINDOW_LABEL } from '@/lib/plans'
import { DAYS, TIME_WINDOWS, type Day, type TimeWindow } from '@/lib/types'
import { useAppStore } from '@/store/useAppStore'

// Profile: campus days, hours, classes, log out. Owner: Dinesh (issue #14).
// Campus days and hours drive the default Home feed (design principle 1),
// and classes drive "shares your class" on plans (principle 2).

const chip =
  'h-11 rounded-full border px-4 text-sm data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'

const sameSet = <T,>(a: T[], b: T[]) => a.length === b.length && a.every((x) => b.includes(x))

/** Course codes like "CS 5340", "cs5340" or "INFO 6150" */
const normalizeClass = (raw: string) => {
  const m = raw
    .trim()
    .toUpperCase()
    .match(/^([A-Z]{2,4})\s*-?\s*(\d{4})$/)
  return m ? `${m[1]} ${m[2]}` : null
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3 rounded-xl border bg-card p-4" aria-label={title}>
      <h2 className="font-semibold">{title}</h2>
      {children}
    </section>
  )
}

export function Profile() {
  const user = useAppStore((s) => s.user)
  const joinedCount = useAppStore((s) => s.joinedPlanIds.length)
  const groupCount = useAppStore((s) => s.groups.length)
  const updateProfile = useAppStore((s) => s.updateProfile)
  const logOut = useAppStore((s) => s.logOut)
  const navigate = useNavigate()

  const [days, setDays] = useState<Day[]>(user?.campusDays ?? [])
  const [times, setTimes] = useState<TimeWindow[]>(user?.timeWindows ?? [])
  const [classInput, setClassInput] = useState('')
  const [classError, setClassError] = useState<string>()

  if (!user) return null

  const scheduleChanged = !sameSet(days, user.campusDays) || !sameSet(times, user.timeWindows)
  const scheduleError =
    days.length === 0 ? 'Pick at least one day.' : times.length === 0 ? 'Pick at least one time of day.' : undefined

  const saveSchedule = () => {
    if (scheduleError) return
    const ordered = DAYS.filter((d) => days.includes(d))
    updateProfile({ campusDays: ordered, timeWindows: TIME_WINDOWS.filter((t) => times.includes(t)) })
    toast.success(`Saved. Your feed now shows plans on ${ordered.join(', ')}.`)
  }

  const addClass = () => {
    const code = normalizeClass(classInput)
    if (!code) {
      setClassError('Use a course code like CS 5340.')
      return
    }
    if (user.classes.includes(code)) {
      setClassError(`${code} is already on your list.`)
      return
    }
    updateProfile({ classes: [...user.classes, code] })
    setClassInput('')
    setClassError(undefined)
    toast.success(`Added ${code}`)
  }

  const removeClass = (code: string) => {
    updateProfile({ classes: user.classes.filter((c) => c !== code) })
    toast(`Removed ${code}`, {
      action: {
        label: 'Undo',
        onClick: () => updateProfile({ classes: [...(useAppStore.getState().user?.classes ?? []), code] }),
      },
    })
  }

  const initials = user.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <>
      <ScreenHeader title="Profile" />
      <Screen>
        <div className="flex items-center gap-4">
          <span
            className="flex size-14 shrink-0 items-center justify-center rounded-full bg-accent text-lg font-semibold text-accent-foreground"
            aria-hidden
          >
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-semibold">{user.name}</p>
            <p className="truncate text-sm text-muted-foreground">{user.email}</p>
            <VerifiedBadge label="Verified Northeastern student" />
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {joinedCount} {joinedCount === 1 ? 'plan' : 'plans'} joined · {groupCount} weekly{' '}
          {groupCount === 1 ? 'group' : 'groups'}
        </p>

        <Card title="When you are on campus">
          <p className="-mt-2 text-sm text-muted-foreground">Your Home feed starts with these days and hours.</p>
          <fieldset className="grid gap-2">
            <legend className="mb-1 text-sm font-medium">Days</legend>
            <ToggleGroup type="multiple" value={days} onValueChange={(v) => setDays(v as Day[])} className="flex-wrap">
              {DAYS.map((d) => (
                <ToggleGroupItem key={d} value={d} className={chip}>
                  {d}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </fieldset>
          <fieldset className="grid gap-2">
            <legend className="mb-1 text-sm font-medium">Times</legend>
            <ToggleGroup
              type="multiple"
              value={times}
              onValueChange={(v) => setTimes(v as TimeWindow[])}
              className="flex-wrap"
            >
              {TIME_WINDOWS.map((t) => (
                <ToggleGroupItem key={t} value={t} className={chip}>
                  {TIME_WINDOW_LABEL[t]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </fieldset>
          {scheduleChanged && scheduleError && (
            <p className="text-sm text-destructive" role="alert">
              {scheduleError}
            </p>
          )}
          <div className="flex gap-2">
            <Button onClick={saveSchedule} disabled={!scheduleChanged || !!scheduleError} size="lg">
              Save changes
            </Button>
            {scheduleChanged && (
              <Button
                variant="ghost"
                size="lg"
                onClick={() => {
                  setDays(user.campusDays)
                  setTimes(user.timeWindows)
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </Card>

        <Card title="Your classes">
          <p className="-mt-2 text-sm text-muted-foreground">
            We use these to show who shares a class with you. Only the course code is shown.
          </p>
          {user.classes.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {user.classes.map((c) => (
                <li
                  key={c}
                  className="inline-flex h-9 items-center gap-1 rounded-full border bg-secondary pr-1 pl-3 text-sm"
                >
                  {c}
                  <Button variant="ghost" size="icon-sm" aria-label={`Remove ${c}`} onClick={() => removeClass(c)}>
                    <XIcon />
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No classes yet.</p>
          )}
          <form
            className="flex items-start gap-2"
            onSubmit={(e) => {
              e.preventDefault()
              addClass()
            }}
          >
            <div className="flex-1">
              <FormField label="Add a class" error={classError}>
                <Input
                  className="h-11"
                  placeholder="CS 5340"
                  value={classInput}
                  autoCapitalize="characters"
                  onChange={(e) => {
                    setClassInput(e.target.value)
                    setClassError(undefined)
                  }}
                />
              </FormField>
            </div>
            <Button type="submit" variant="outline" className="mt-6 h-11" disabled={!classInput.trim()}>
              <PlusIcon /> Add
            </Button>
          </form>
        </Card>

        <div className="flex gap-3 rounded-xl border border-success/30 bg-success/5 p-4 text-sm">
          <ShieldCheckIcon className="size-5 shrink-0 text-success" aria-hidden />
          <p>
            Only verified Northeastern students can see your plans. We never show where you live, just the campus spot
            you pick for a plan.
          </p>
        </div>

        <Button
          variant="outline"
          size="xl"
          onClick={() => {
            logOut()
            toast.info('You are logged out')
            navigate('/')
          }}
        >
          <LogOutIcon /> Log out
        </Button>
      </Screen>
    </>
  )
}
