import { useNavigate } from 'react-router'
import { PlaceholderScreen } from '@/components/PlaceholderScreen'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/useAppStore'

// Profile: campus days, hours, classes, log out. Owner: Dinesh.
export function Profile() {
  const user = useAppStore((s) => s.user)
  const logOut = useAppStore((s) => s.logOut)
  const resetAll = useAppStore((s) => s.resetAll)
  const navigate = useNavigate()
  return (
    <PlaceholderScreen title="Profile" screen="Profile" owner="Dinesh">
      <p>
        {user?.name} ({user?.email})
      </p>
      <p className="text-sm text-muted-foreground">Campus days: {user?.campusDays.join(', ')}</p>
      <Button
        variant="outline"
        onClick={() => {
          logOut()
          navigate('/')
        }}
      >
        Log out
      </Button>
      <Button
        variant="destructive"
        onClick={() => {
          resetAll()
          navigate('/')
        }}
      >
        Reset all demo data
      </Button>
    </PlaceholderScreen>
  )
}
