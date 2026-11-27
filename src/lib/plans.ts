// Pure helpers for plans. No React here, so they are easy to reuse and test.
import { PEOPLE } from '@/data/seed'
import type { Activity, CurrentUser, Filters, Person, Plan, TimeWindow } from '@/lib/types'

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
