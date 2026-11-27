// The single app store. It is our "database": saved to localStorage so the
// app keeps its state across refreshes. Reset (demo panel) restores the seed.
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DEFAULT_USER, SEED_GROUPS, SEED_JOINED_PLAN_IDS, SEED_MESSAGES, SEED_PLANS } from '@/data/seed'
import type { CurrentUser, Filters, Group, JoinResult, Message, Plan } from '@/lib/types'
import { isFull } from '@/lib/plans'

export interface DemoFlags {
  /** Pretend there are no plans, to show the empty feed state */
  forceEmpty: boolean
  /** Make data loads fail, to show the error state */
  forceError: boolean
}

interface AppState {
  user: CurrentUser | null
  plans: Plan[]
  joinedPlanIds: string[]
  groups: Group[]
  messages: Message[]
  filters: Filters
  demo: DemoFlags
  /** Plan id whose meetup just ended; when set the "Make this weekly?" prompt shows */
  meetupPromptPlanId: string | null

  signUp: (name: string, email: string) => void
  logIn: (email: string) => void
  logOut: () => void
  updateProfile: (patch: Partial<Omit<CurrentUser, 'id'>>) => void

  setFilters: (filters: Filters) => void
  resetFilters: () => void

  joinPlan: (planId: string) => JoinResult
  leavePlan: (planId: string) => void
  createPlan: (plan: Omit<Plan, 'id' | 'hostId' | 'attendeeIds' | 'status'>) => Plan

  sendMessage: (planId: string, text: string) => void

  /** Demo trigger for Task 2: marks the meetup as finished and opens the prompt */
  endMeetup: (planId: string) => void
  makeWeekly: (planId: string) => Group | null
  dismissMeetupPrompt: () => void
  setReminder: (groupId: string, on: boolean) => void

  setDemo: (patch: Partial<DemoFlags>) => void
  resetAll: () => void
}

const defaultFilters = (user: CurrentUser | null): Filters => ({
  days: user?.campusDays ?? DEFAULT_USER.campusDays,
  timeWindows: user?.timeWindows ?? DEFAULT_USER.timeWindows,
  activities: [],
})

const freshData = () => ({
  plans: structuredClone(SEED_PLANS),
  joinedPlanIds: [...SEED_JOINED_PLAN_IDS],
  groups: structuredClone(SEED_GROUPS),
  messages: structuredClone(SEED_MESSAGES),
  filters: defaultFilters(null),
  demo: { forceEmpty: false, forceError: false },
  meetupPromptPlanId: null,
})

const nameFromEmail = (email: string) => {
  const local = email.split('@')[0] ?? 'Student'
  return local.charAt(0).toUpperCase() + local.slice(1)
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      ...freshData(),

      signUp: (name, email) => {
        const user: CurrentUser = { ...DEFAULT_USER, name, email }
        set({ user, filters: defaultFilters(user) })
      },
      logIn: (email) => {
        const user: CurrentUser = { ...DEFAULT_USER, name: nameFromEmail(email), email }
        set({ user, filters: defaultFilters(user) })
      },
      logOut: () => set({ user: null }),
      updateProfile: (patch) => {
        const user = get().user
        if (!user) return
        const next = { ...user, ...patch }
        set({ user: next, filters: defaultFilters(next) })
      },

      setFilters: (filters) => set({ filters }),
      resetFilters: () => set({ filters: defaultFilters(get().user) }),

      joinPlan: (planId) => {
        const { joinedPlanIds, plans } = get()
        if (joinedPlanIds.includes(planId)) return 'already-joined'
        const plan = plans.find((p) => p.id === planId)
        if (!plan || isFull(plan)) return 'full'
        set({
          joinedPlanIds: [...joinedPlanIds, planId],
          plans: plans.map((p) => (p.id === planId ? { ...p, attendeeIds: [...p.attendeeIds, 'me'] } : p)),
        })
        return 'joined'
      },
      leavePlan: (planId) =>
        set((s) => ({
          joinedPlanIds: s.joinedPlanIds.filter((id) => id !== planId),
          plans: s.plans.map((p) =>
            p.id === planId ? { ...p, attendeeIds: p.attendeeIds.filter((a) => a !== 'me') } : p,
          ),
        })),
      createPlan: (input) => {
        const plan: Plan = {
          ...input,
          id: `plan-${Date.now()}`,
          hostId: 'me',
          attendeeIds: ['me'],
          status: 'upcoming',
        }
        set((s) => ({ plans: [plan, ...s.plans], joinedPlanIds: [...s.joinedPlanIds, plan.id] }))
        return plan
      },

      sendMessage: (planId, text) => {
        const trimmed = text.trim()
        if (!trimmed) return
        const msg: Message = {
          id: `m-${Date.now()}`,
          planId,
          authorId: 'me',
          text: trimmed,
          at: new Date().toISOString(),
        }
        set((s) => ({ messages: [...s.messages, msg] }))
      },

      endMeetup: (planId) =>
        set((s) => ({
          plans: s.plans.map((p) => (p.id === planId ? { ...p, status: 'met' } : p)),
          meetupPromptPlanId: planId,
        })),
      makeWeekly: (planId) => {
        const { plans, groups } = get()
        const plan = plans.find((p) => p.id === planId)
        if (!plan) return null
        const existing = groups.find((g) => g.planId === planId)
        if (existing) {
          set({ meetupPromptPlanId: null })
          return existing
        }
        const group: Group = {
          id: `group-${planId}`,
          planId,
          name: plan.classTag ? `${plan.classTag} ${plan.title}` : plan.title,
          day: plan.day,
          startTime: plan.startTime,
          place: plan.place,
          memberIds: plan.attendeeIds,
          reminderOn: true,
        }
        set({ groups: [...groups, group], meetupPromptPlanId: null })
        return group
      },
      dismissMeetupPrompt: () => set({ meetupPromptPlanId: null }),
      setReminder: (groupId, on) =>
        set((s) => ({ groups: s.groups.map((g) => (g.id === groupId ? { ...g, reminderOn: on } : g)) })),

      setDemo: (patch) => set((s) => ({ demo: { ...s.demo, ...patch } })),
      resetAll: () => set({ user: null, ...freshData() }),
    }),
    { name: 'campus-connect-v1', version: 1 },
  ),
)

/** Convenience selector: has the user joined this plan? */
export const useIsJoined = (planId: string | undefined) =>
  useAppStore((s) => (planId ? s.joinedPlanIds.includes(planId) : false))
