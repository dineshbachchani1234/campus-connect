import type { ReactNode } from 'react'
import { ConstructionIcon } from 'lucide-react'
import { Screen } from '@/components/Screen'
import { ScreenHeader } from '@/components/ScreenHeader'

interface Props {
  title: string
  /** Matches the screen name in T3 and the GitHub issue */
  screen: string
  owner: string
  back?: boolean | string
  /** Buttons that move to the next screen, so the flow works end to end today */
  children?: ReactNode
}

/**
 * Temporary stand-in for a screen that is not built yet.
 * Delete it from a screen as soon as you build the real UI.
 */
export function PlaceholderScreen({ title, screen, owner, back, children }: Props) {
  return (
    <>
      <ScreenHeader title={title} back={back} />
      <Screen>
        <div className="flex items-start gap-3 rounded-xl border border-dashed border-warning bg-warning/10 p-4 text-sm">
          <ConstructionIcon className="size-5 shrink-0" aria-hidden />
          <p>
            <strong>{screen}</strong> is a placeholder. Owner: {owner}. Links below follow the real flow.
          </p>
        </div>
        <div className="grid gap-3">{children}</div>
      </Screen>
    </>
  )
}
