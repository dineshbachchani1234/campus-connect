// Realistic starting data. Reset from the demo panel restores exactly this.
import type { CurrentUser, Group, Message, Person, Plan } from '@/lib/types'

export const PEOPLE: Person[] = [
  {
    id: 'aditi',
    name: 'Aditi R.',
    pronouns: 'she/her',
    program: 'MS Computer Science',
    classes: ['CS 5340', 'CS 5200'],
    verified: true,
  },
  {
    id: 'rahul',
    name: 'Rahul M.',
    pronouns: 'he/him',
    program: 'MS Data Science',
    classes: ['CS 5340'],
    verified: true,
  },
  {
    id: 'sofia',
    name: 'Sofia L.',
    pronouns: 'she/her',
    program: 'MS Human Computer Interaction',
    classes: ['CS 5340', 'ARTG 5100'],
    verified: true,
  },
  {
    id: 'kwame',
    name: 'Kwame A.',
    pronouns: 'he/him',
    program: 'MS Information Systems',
    classes: ['INFO 6150'],
    verified: true,
  },
  {
    id: 'lena',
    name: 'Lena P.',
    pronouns: 'they/them',
    program: 'MS Computer Science',
    classes: ['CS 5200'],
    verified: true,
  },
  {
    id: 'omar',
    name: 'Omar H.',
    pronouns: 'he/him',
    program: 'MS Cybersecurity',
    classes: ['CY 5010'],
    verified: true,
  },
  {
    id: 'mei',
    name: 'Mei T.',
    pronouns: 'she/her',
    program: 'MS Computer Science',
    classes: ['CS 5340'],
    verified: true,
  },
]

/** Default demo user (matches persona Maya: Tue and Wed, daytime only) */
export const DEFAULT_USER: Omit<CurrentUser, 'name' | 'email'> = {
  id: 'me',
  campusDays: ['Tue', 'Wed'],
  timeWindows: ['morning', 'afternoon'],
  classes: ['CS 5340', 'CS 5200'],
}

export const SEED_PLANS: Plan[] = [
  {
    id: 'snell-study',
    title: 'Study group',
    activity: 'study',
    place: 'Snell Library',
    placeDetail: '1st floor, near the cafe',
    day: 'Tue',
    startTime: '14:00',
    durationMin: 60,
    hostId: 'aditi',
    attendeeIds: ['aditi', 'rahul', 'mei'],
    reason: 'Review for the CS 5340 midterm together',
    visibility: 'class',
    classTag: 'CS 5340',
    maxSize: 5,
    status: 'upcoming',
  },
  {
    id: 'curry-lunch',
    title: 'Lunch',
    activity: 'food',
    place: 'Curry Student Center',
    placeDetail: 'Food court, 2nd floor tables',
    day: 'Wed',
    startTime: '12:30',
    durationMin: 45,
    hostId: 'sofia',
    attendeeIds: ['sofia', 'lena'],
    reason: 'Quick lunch between classes, no pressure to talk shop',
    visibility: 'anyone',
    maxSize: 6,
    status: 'upcoming',
  },
  {
    id: 'marino-gym',
    title: 'Gym session',
    activity: 'fitness',
    place: 'Marino Recreation Center',
    placeDetail: 'Meet at the front desk',
    day: 'Tue',
    startTime: '11:00',
    durationMin: 60,
    hostId: 'kwame',
    attendeeIds: ['kwame', 'omar', 'rahul', 'lena'],
    reason: 'Beginner friendly workout, we take turns spotting',
    visibility: 'anyone',
    maxSize: 6,
    status: 'upcoming',
  },
  {
    id: 'coffee-isec',
    title: 'Coffee break',
    activity: 'coffee',
    place: 'ISEC',
    placeDetail: 'Atrium coffee stand',
    day: 'Wed',
    startTime: '10:00',
    durationMin: 30,
    hostId: 'lena',
    // Includes 'me' because SEED_JOINED_PLAN_IDS has this plan; the two must agree
    attendeeIds: ['lena', 'aditi', 'me'],
    reason: 'Coffee before the 10:30 lecture',
    visibility: 'class',
    classTag: 'CS 5200',
    maxSize: 4,
    status: 'upcoming',
  },
  {
    id: 'board-games',
    title: 'Board games',
    activity: 'games',
    place: 'Curry Student Center',
    placeDetail: 'Room 333',
    day: 'Thu',
    startTime: '13:00',
    durationMin: 90,
    hostId: 'omar',
    attendeeIds: ['omar', 'mei'],
    reason: 'Catan and snacks, newcomers welcome',
    visibility: 'anyone',
    maxSize: 6,
    status: 'upcoming',
  },
  {
    id: 'evening-run',
    title: 'Evening run',
    activity: 'fitness',
    place: 'Carter Field',
    day: 'Tue',
    startTime: '18:30',
    durationMin: 45,
    hostId: 'rahul',
    attendeeIds: ['rahul'],
    reason: 'Easy 5k loop along the Fens',
    visibility: 'anyone',
    maxSize: 8,
    status: 'upcoming',
  },
]

/** Plans the demo user has already joined, so the "already enrolled" state is visible right away */
export const SEED_JOINED_PLAN_IDS: string[] = ['coffee-isec']

export const SEED_GROUPS: Group[] = []

/**
 * ISO time a number of minutes before the app loaded. Seed messages use this so
 * they always read as recent ("Today, 1:10 PM") instead of a fixed date that can
 * land in the future or long ago during a test session.
 */
const minutesAgo = (min: number) => new Date(Date.now() - min * 60_000).toISOString()

export const SEED_MESSAGES: Message[] = [
  { id: 'm1', planId: 'snell-study', authorId: 'aditi', text: 'See you at 2!', at: minutesAgo(52) },
  {
    id: 'm2',
    planId: 'snell-study',
    authorId: 'rahul',
    text: 'Bringing my notes from week 6',
    at: minutesAgo(50),
  },
  {
    id: 'm3',
    planId: 'coffee-isec',
    authorId: 'lena',
    text: 'I will grab the table by the window',
    at: minutesAgo(20),
  },
]
