// Shared data types. Every screen and the store use these.

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const
export type Day = (typeof DAYS)[number]

export const TIME_WINDOWS = ['morning', 'afternoon', 'evening'] as const
export type TimeWindow = (typeof TIME_WINDOWS)[number]

export const ACTIVITIES = ['study', 'food', 'coffee', 'fitness', 'games'] as const
export type Activity = (typeof ACTIVITIES)[number]

export interface Person {
  id: string
  name: string
  pronouns?: string
  program: string
  /** Course codes, used to show "shares your class" */
  classes: string[]
  verified: boolean
}

export interface CurrentUser {
  id: 'me'
  name: string
  email: string
  campusDays: Day[]
  timeWindows: TimeWindow[]
  classes: string[]
}

export interface Plan {
  id: string
  title: string
  activity: Activity
  place: string
  placeDetail?: string
  day: Day
  /** 24h "HH:MM" */
  startTime: string
  durationMin: number
  hostId: string
  attendeeIds: string[]
  /** Why meet, shown on Plan details */
  reason: string
  visibility: 'class' | 'anyone'
  classTag?: string
  maxSize: number
  /** Set once the meetup has happened (drives the after-meetup prompt) */
  status: 'upcoming' | 'met'
}

export interface Group {
  id: string
  planId: string
  name: string
  day: Day
  startTime: string
  place: string
  memberIds: string[]
  reminderOn: boolean
}

export interface Message {
  id: string
  planId: string
  authorId: string
  text: string
  /** ISO timestamp */
  at: string
}

export interface Filters {
  days: Day[]
  timeWindows: TimeWindow[]
  activities: Activity[]
}

export type JoinResult = 'joined' | 'already-joined' | 'full'
