import { useNavigate } from 'react-router'
import { PlaceholderScreen } from '@/components/PlaceholderScreen'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/store/useAppStore'

// T3 sheet 1: name, NU email, password, Create account. Feedback #2 (real inputs, focus, errors)
export function SignUp() {
  const signUp = useAppStore((s) => s.signUp)
  const navigate = useNavigate()
  return (
    <PlaceholderScreen title="Sign up" screen="Sign up" owner="Furqan" back="/">
      <Button
        size="xl"
        onClick={() => {
          signUp('Maya Chen', 'chen.maya@northeastern.edu')
          navigate('/home')
        }}
      >
        Create account (demo user)
      </Button>
    </PlaceholderScreen>
  )
}
