import { GroupCard } from '@/components/GroupCard'
import { PlaceholderScreen } from '@/components/PlaceholderScreen'
import { EmptyState } from '@/components/StateViews'
import { useAppStore } from '@/store/useAppStore'

// T3 sheet 4: standing weekly groups, next session with reminder, + New group. Owner: Furqan.
export function MyGroups() {
  const groups = useAppStore((s) => s.groups)
  return (
    <PlaceholderScreen title="My Groups" screen="My Groups" owner="Furqan">
      {groups.length === 0 ? (
        <EmptyState title="No weekly groups yet" body="After a plan meets, you can turn it into a weekly group." />
      ) : (
        groups.map((g) => <GroupCard key={g.id} group={g} />)
      )}
    </PlaceholderScreen>
  )
}
