import { useNavigate } from 'react-router'
import { PlaceholderScreen } from '@/components/PlaceholderScreen'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/useAppStore'

// T3 sheet 1: Welcome back, email, password, Log in. Feedback #2
export function LogIn() {
  const logIn = useAppStore((s) => s.logIn)
  const navigate = useNavigate()
  return (
    <PlaceholderScreen title="Welcome back" screen="Log in" owner="Furqan" back="/">
      <Button
        size="xl"
        onClick={() => {
          logIn('chen.maya@northeastern.edu')
          navigate('/home')
        }}
      >
        Log in (demo user)
      </Button>
    </PlaceholderScreen>
  )
}
