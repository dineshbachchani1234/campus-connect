import { BadgeCheckIcon } from 'lucide-react'

/** Shows that a person or group is made of verified Northeastern students */
export function VerifiedBadge({ label = 'Verified NU student' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-success">
      <BadgeCheckIcon className="size-3.5" aria-hidden />
      {label}
    </span>
  )
}
