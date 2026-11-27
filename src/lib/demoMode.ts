// Demo mode: facilitator tools for test sessions. Off for participants by
// default. Turn on with ?demo=1 in the URL or a long press on any screen title.
// Lives in sessionStorage, so closing the tab turns it off again.
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

interface DemoModeState {
  enabled: boolean
  panelOpen: boolean
  setEnabled: (enabled: boolean) => void
  openPanel: () => void
  setPanelOpen: (open: boolean) => void
}

export const useDemoMode = create<DemoModeState>()(
  persist(
    (set) => ({
      enabled: false,
      panelOpen: false,
      setEnabled: (enabled) => set((s) => ({ enabled, panelOpen: enabled ? s.panelOpen : false })),
      openPanel: () => set({ enabled: true, panelOpen: true }),
      setPanelOpen: (panelOpen) => set({ panelOpen }),
    }),
    {
      name: 'campus-connect-demo-mode',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (s) => ({ enabled: s.enabled }),
    },
  ),
)

/** Reads ?demo=1 or ?demo=0 from a URL search string */
export function demoParam(search: string): boolean | null {
  const v = new URLSearchParams(search).get('demo')
  if (v === '1' || v === 'true') return true
  if (v === '0' || v === 'false') return false
  return null
}
