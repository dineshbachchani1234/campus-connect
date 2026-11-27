import { Link } from 'react-router'
import { PlaceholderScreen } from '@/components/PlaceholderScreen'
import { Button } from '@/components/ui/button'

// T3 sheet 1: app name, tagline, Get started, I already have an account
export function Splash() {
  return (
    <PlaceholderScreen title="Campus Connect" screen="Splash / welcome" owner="Furqan">
      <p className="text-muted-foreground">Find your people on campus.</p>
      <Button size="xl" asChild>
        <Link to="/signup">Get started</Link>
      </Button>
      <Button size="xl" variant="outline" asChild>
        <Link to="/login">I already have an account</Link>
      </Button>
    </PlaceholderScreen>
  )
}
