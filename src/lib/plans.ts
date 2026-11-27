// Pure helpers for plans. No React here, so they are easy to reuse and test.
import { PEOPLE } from '@/data/seed'
import { DAYS, TIME_WINDOWS } from '@/lib/types'
import type { Activity, CurrentUser, Day, Filters, Person, Plan, TimeWindow } from '@/lib/types'

export const ACTIVITY_LABEL: Record<Activity, string> = {
  study: 'Study',
  food: 'Food',
  coffee: 'Coffee',
  fitness: 'Fitness',
  games: 'Games',
}

export const TIME_WINDOW_LABEL: Record<TimeWindow, string> = {
  morning: 'Morning (before 12)',
  afternoon: 'Afternoon (12 to 5)',
  evening: 'Evening (after 5)',
}

/** "14:00" -> "2:00 PM" */
export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number)
  const suffix = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 === 0 ? 12 : h % 12
  return `${hour}:${String(m).padStart(2, '0')} ${suffix}`
}

/** "14:00" + 60 -> "3:00 PM" */
export function endTime(hhmm: string, durationMin: number): string {
  const [h, m] = hhmm.split(':').map(Number)
  const total = h * 60 + m + durationMin
  const hh = String(Math.floor(total / 60) % 24).padStart(2, '0')
  const mm = String(total % 60).padStart(2, '0')
  return formatTime(`${hh}:${mm}`)
}

export function timeWindowOf(hhmm: string): TimeWindow {
  const h = Number(hhmm.split(':')[0])
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}

export function personById(id: string): Person | undefined {
  return PEOPLE.find((p) => p.id === id)
}

/** People going who share at least one class with the user */
export function sharedClassmates(plan: Plan, user: CurrentUser): Person[] {
  return plan.attendeeIds
    .map(personById)
    .filter((p): p is Person => !!p && p.classes.some((c) => user.classes.includes(c)))
}

export function matchesFilters(plan: Plan, filters: Filters): boolean {
  const dayOk = filters.days.length === 0 || filters.days.includes(plan.day)
  const timeOk = filters.timeWindows.length === 0 || filters.timeWindows.includes(timeWindowOf(plan.startTime))
  const activityOk = filters.activities.length === 0 || filters.activities.includes(plan.activity)
  return dayOk && timeOk && activityOk
}

export function isFull(plan: Plan): boolean {
  return plan.attendeeIds.length >= plan.maxSize
}

export const DAY_NAME: Record<Day, string> = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
}

/** "My days: Tue, Wed · Daytime" style summary for the filter chip */
export function describeFilters(filters: Filters): { days: string; time: string; activities: string } {
  const days =
    filters.days.length === 0 || filters.days.length === DAYS.length ? 'Any day' : sortDays(filters.days).join(', ')
  const tw = new Set(filters.timeWindows)
  let time: string
  if (tw.size === 0 || tw.size === TIME_WINDOWS.length) time = 'Any time'
  else if (tw.size === 2 && tw.has('morning') && tw.has('afternoon')) time = 'Daytime'
  else
    time = TIME_WINDOWS.filter((t) => tw.has(t))
      .map((t) => t[0].toUpperCase() + t.slice(1))
      .join(', ')
  const activities = filters.activities.length === 0 ? '' : filters.activities.map((a) => ACTIVITY_LABEL[a]).join(', ')
  return { days, time, activities }
}

export function sortDays(days: Day[]): Day[] {
  return [...days].sort((a, b) => DAYS.indexOf(a) - DAYS.indexOf(b))
}

/** Plans sorted by weekday then start time, grouped by day */
export function groupByDay(plans: Plan[]): { day: Day; plans: Plan[] }[] {
  const sorted = [...plans].sort(
    (a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.startTime.localeCompare(b.startTime),
  )
  const groups: { day: Day; plans: Plan[] }[] = []
  for (const p of sorted) {
    const last = groups.at(-1)
    if (last && last.day === p.day) last.plans.push(p)
    else groups.push({ day: p.day, plans: [p] })
  }
  return groups
}

/** True when filters are not the user's own campus days and hours */
export function filtersAreCustom(filters: Filters, user: CurrentUser | null): boolean {
  if (!user) return false
  const same = <T>(a: T[], b: T[]) => a.length === b.length && a.every((x) => b.includes(x))
  return (
    !same(filters.days, user.campusDays) ||
    !same(filters.timeWindows, user.timeWindows) ||
    filters.activities.length > 0
  )
}
