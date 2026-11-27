import { Link } from 'react-router'
import { BellIcon, BellOffIcon, MapPinIcon, RepeatIcon, UsersIcon } from 'lucide-react'
import { formatTime } from '@/lib/plans'
import type { Group } from '@/lib/types'

/** A standing weekly group in My Groups */
export function GroupCard({ group }: { group: Group }) {
  return (
    <Link
      to={`/chat/${group.planId}`}
      className="block rounded-xl border bg-card p-4 shadow-sm transition-all outline-none hover:border-primary/40 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <p className="text-base font-semibold">{group.name}</p>
      <div className="mt-2 grid gap-1 text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <RepeatIcon className="size-4" aria-hidden /> Weekly, {group.day} {formatTime(group.startTime)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <MapPinIcon className="size-4" aria-hidden /> {group.place}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <UsersIcon className="size-4" aria-hidden /> {group.memberIds.length} members
        </span>
        <span className="inline-flex items-center gap-1.5">
          {group.reminderOn ? (
            <BellIcon className="size-4" aria-hidden />
          ) : (
            <BellOffIcon className="size-4" aria-hidden />
          )}
          Reminder {group.reminderOn ? 'on' : 'off'}
        </span>
      </div>
    </Link>
  )
}
