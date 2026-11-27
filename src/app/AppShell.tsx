import { Outlet, useLocation } from 'react-router'
import { BottomNav } from '@/components/BottomNav'
import { DemoPanel } from '@/components/DemoPanel'
import { Toaster } from '@/components/ui/sonner'
import { AfterMeetupPrompt } from '@/screens/groups/AfterMeetupPrompt'

/** Screens without the bottom tab bar */
const NO_NAV = ['/', '/signup', '/login']

/**
 * Wraps every screen. On a phone it fills the screen; on a laptop it shows a
 * centered phone-sized frame, so testers see the same layout everywhere.
 */
export function AppShell() {
  const { pathname } = useLocation()
  const showNav = !NO_NAV.includes(pathname)
  return (
    <div className="min-h-dvh bg-muted sm:flex sm:items-center sm:justify-center sm:py-8">
      <div className="relative mx-auto flex min-h-dvh w-full max-w-(--app-max-width) flex-col bg-background sm:min-h-[820px] sm:overflow-hidden sm:rounded-[2rem] sm:border sm:shadow-xl">
        <div className="flex flex-1 flex-col sm:max-h-[820px] sm:overflow-y-auto">
          <Outlet />
        </div>
        {showNav && <BottomNav />}
        <AfterMeetupPrompt />
        <DemoPanel />
        <Toaster />
      </div>
    </div>
  )
}
