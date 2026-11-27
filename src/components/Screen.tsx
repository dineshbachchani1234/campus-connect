import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/** Scrollable body of a screen with consistent padding */
export function Screen({ children, className }: { children: ReactNode; className?: string }) {
  return <main className={cn('flex flex-1 flex-col gap-4 px-4 py-4', className)}>{children}</main>
}
