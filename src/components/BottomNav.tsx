import { NavLink } from 'react-router'
import { HomeIcon, UsersIcon, UserIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { to: '/home', label: 'Home', icon: HomeIcon },
  { to: '/groups', label: 'Groups', icon: UsersIcon },
  { to: '/profile', label: 'Profile', icon: UserIcon },
]

/** Bottom tab bar shown on every signed-in screen */
export function BottomNav() {
  return (
    <nav aria-label="Main" className="sticky bottom-0 z-10 border-t bg-background/95 backdrop-blur">
      <ul className="grid grid-cols-3">
        {TABS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:bg-accent',
                  isActive && 'text-primary',
                )
              }
            >
              <Icon className="size-5" aria-hidden />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
