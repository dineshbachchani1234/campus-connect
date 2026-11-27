// Builds a real .ics file for a plan, so "Add to calendar" works on a phone.
// No React here, so it is easy to reuse (e.g. for weekly groups later).
import { DAYS } from '@/lib/types'
import type { Day, Plan } from '@/lib/types'

/** The next date (today or later) that falls on this weekday, at the plan's start time */
export function nextOccurrence(day: Day, hhmm: string, from = new Date()): Date {
  const [h, m] = hhmm.split(':').map(Number)
  const target = DAYS.indexOf(day) + 1 // Mon = 1 ... Fri = 5, same as Date.getDay()
  const date = new Date(from)
  date.setHours(h, m, 0, 0)
  let diff = (target - from.getDay() + 7) % 7
  if (diff === 0 && date < from) diff = 7
  date.setDate(date.getDate() + diff)
  return date
}

/** "Tue, Dec 2" */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

const pad = (n: number) => String(n).padStart(2, '0')
/** Floating local time, e.g. 20261202T140000 (the calendar uses the phone's time zone) */
const icsDate = (d: Date) =>
  `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`
const icsText = (s: string) =>
  s
    .replaceAll('\\', '\\\\')
    .replace(/[,;]/g, (c) => `\\${c}`)
    .replace(/\n/g, '\\n')

export function buildIcs(plan: Plan, start: Date, reminderMinutes: number | null): string {
  const end = new Date(start.getTime() + plan.durationMin * 60_000)
  const location = plan.placeDetail ? `${plan.place}, ${plan.placeDetail}` : plan.place
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Campus Connect//Prototype//EN',
    'BEGIN:VEVENT',
    `UID:${plan.id}-${icsDate(start)}@campus-connect`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsText(`${plan.title} at ${plan.place}`)}`,
    `LOCATION:${icsText(location)}`,
    `DESCRIPTION:${icsText(`${plan.reason}\n\nPlanned with Campus Connect.`)}`,
  ]
  if (reminderMinutes !== null) {
    lines.push(
      'BEGIN:VALARM',
      'ACTION:DISPLAY',
      `DESCRIPTION:${icsText(plan.title)}`,
      `TRIGGER:-PT${reminderMinutes}M`,
      'END:VALARM',
    )
  }
  lines.push('END:VEVENT', 'END:VCALENDAR')
  return lines.join('\r\n')
}

/** Starts a download of the .ics file in the browser */
export function downloadIcs(plan: Plan, start: Date, reminderMinutes: number | null) {
  const blob = new Blob([buildIcs(plan, start, reminderMinutes)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${plan.id}.ics`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
