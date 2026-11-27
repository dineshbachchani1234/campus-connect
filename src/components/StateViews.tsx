import type { ReactNode } from 'react'
import { AlertTriangleIcon, Loader2Icon, SearchXIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

/** Shown when a list has nothing in it. Always offer a next step. */
export function EmptyState({ title, body, action }: { title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed px-6 py-10 text-center">
      <SearchXIcon className="size-8 text-muted-foreground" aria-hidden />
      <p className="font-semibold">{title}</p>
      {body && <p className="text-sm text-muted-foreground">{body}</p>}
      {action}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center"
    >
      <AlertTriangleIcon className="size-8 text-destructive" aria-hidden />
      <p className="font-semibold">Something went wrong</p>
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  )
}

export function LoadingState({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground" role="status">
      <Loader2Icon className="size-5 animate-spin" aria-hidden />
      {label}
    </div>
  )
}
