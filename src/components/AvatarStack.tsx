import { personById } from '@/lib/plans'

const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

/** Small overlapping circles with initials, for "who is going" */
export function AvatarStack({ ids, max = 4 }: { ids: string[]; max?: number }) {
  const shown = ids.slice(0, max)
  const extra = ids.length - shown.length
  return (
    <div className="flex -space-x-2" aria-hidden>
      {shown.map((id) => {
        const name = id === 'me' ? 'You' : (personById(id)?.name ?? '?')
        return (
          <span
            key={id}
            className="flex size-7 items-center justify-center rounded-full border-2 border-background bg-accent text-[10px] font-semibold text-accent-foreground"
          >
            {initials(name)}
          </span>
        )
      })}
      {extra > 0 && (
        <span className="flex size-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-semibold">
          +{extra}
        </span>
      )}
    </div>
  )
}
