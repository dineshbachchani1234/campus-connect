import { Link } from 'react-router'
import { Screen } from '@/components/Screen'
import { EmptyState } from '@/components/StateViews'
import { Button } from '@/components/ui/button'

export function NotFound() {
  return (
    <Screen className="justify-center">
      <EmptyState
        title="Page not found"
        body="This link does not go anywhere in Campus Connect."
        action={
          <Button asChild>
            <Link to="/home">Back to Campus Plans</Link>
          </Button>
        }
      />
    </Screen>
  )
}
