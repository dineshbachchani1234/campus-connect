// Session log for high fidelity testing.
// Records task markers, screen changes and taps with timestamps so we can
// measure time on task and see where participants hesitated. Kept apart from
// the app store so "Reset all data" between participants does not wipe it.
import { useSyncExternalStore } from 'react'

export type LogEvent =
  | { type: 'task-start'; at: string; task: string }
  | { type: 'task-end'; at: string; task: string; outcome: 'success' | 'gave-up' | 'helped' }
  | { type: 'screen'; at: string; path: string }
  | { type: 'tap'; at: string; path: string; label: string }
  | { type: 'note'; at: string; text: string }

export interface SessionLog {
  participant: string
  startedAt: string
  events: LogEvent[]
}

const KEY = 'campus-connect-session-log'
const listeners = new Set<() => void>()

const empty = (): SessionLog => ({ participant: '', startedAt: new Date().toISOString(), events: [] })

function read(): SessionLog {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as SessionLog) : empty()
  } catch {
    return empty()
  }
}

let cache: SessionLog = read()

function write(next: SessionLog) {
  cache = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // Storage full or blocked: keep logging in memory
  }
  listeners.forEach((l) => l())
}

type NewEvent = LogEvent extends infer E ? (E extends LogEvent ? Omit<E, 'at'> : never) : never

export const eventLog = {
  get: () => cache,
  add(event: NewEvent) {
    write({ ...cache, events: [...cache.events, { ...event, at: new Date().toISOString() } as LogEvent] })
  },
  setParticipant(participant: string) {
    write({ ...cache, participant })
  },
  clear() {
    write({ ...empty(), participant: cache.participant })
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
  /** Downloads the log as JSON, named after the participant */
  download() {
    const name = `campus-connect-${cache.participant || 'session'}-${cache.startedAt.slice(0, 10)}.json`
    const blob = new Blob([JSON.stringify({ ...cache, summary: summarize(cache) }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    a.click()
    URL.revokeObjectURL(url)
  },
}

export function useSessionLog() {
  return useSyncExternalStore(eventLog.subscribe, eventLog.get)
}

export interface TaskSummary {
  task: string
  seconds: number | null
  outcome: string
  taps: number
  screens: number
}

/** Time on task, taps and screens visited for each task in the log */
export function summarize(log: SessionLog): TaskSummary[] {
  const out: TaskSummary[] = []
  let current: { task: string; start: number; taps: number; screens: number } | null = null
  for (const e of log.events) {
    if (e.type === 'task-start') {
      current = { task: e.task, start: Date.parse(e.at), taps: 0, screens: 0 }
    } else if (current && e.type === 'tap') {
      current.taps++
    } else if (current && e.type === 'screen') {
      current.screens++
    } else if (current && e.type === 'task-end' && e.task === current.task) {
      out.push({
        task: current.task,
        seconds: Math.round((Date.parse(e.at) - current.start) / 1000),
        outcome: e.outcome,
        taps: current.taps,
        screens: current.screens,
      })
      current = null
    }
  }
  if (current) {
    out.push({
      task: current.task,
      seconds: null,
      outcome: 'in progress',
      taps: current.taps,
      screens: current.screens,
    })
  }
  return out
}

/** Short readable name for a tapped element */
export function labelFor(el: Element): string {
  const aria = el.getAttribute('aria-label')
  const text = (el.textContent ?? '').replace(/\s+/g, ' ').trim()
  return (aria || text || el.tagName.toLowerCase()).slice(0, 80)
}
