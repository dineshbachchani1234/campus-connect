import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import { ChevronLeftIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Props {
  title: string
  /** Show a back button. Pass a path to go somewhere specific, or true for browser back */
  back?: boolean | string
  /** Optional element on the right, e.g. a Filter button */
  action?: ReactNode
  subtitle?: ReactNode
}

/** Title bar at the top of each screen */
export function ScreenHeader({ title, back, action, subtitle }: Props) {
  const navigate = useNavigate()
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 px-4 pt-4 pb-3 backdrop-blur">
      <div className="flex min-h-10 items-center gap-2">
        {back && (
          <Button
            variant="ghost"
            size="icon-lg"
            aria-label="Go back"
            className="-ml-2"
            onClick={() => (typeof back === 'string' ? navigate(back) : navigate(-1))}
          >
            <ChevronLeftIcon className="size-5" />
          </Button>
        )}
        <h1 className="flex-1 truncate text-xl font-semibold">{title}</h1>
        {action}
      </div>
      {subtitle && <div className="mt-2">{subtitle}</div>}
    </header>
  )
}
