import { createBrowserRouter } from 'react-router'
import { AppShell } from '@/app/AppShell'
import { RequireAuth } from '@/app/RequireAuth'
import { Splash } from '@/screens/onboarding/Splash'
import { SignUp } from '@/screens/onboarding/SignUp'
import { LogIn } from '@/screens/onboarding/LogIn'
import { HomeFeed } from '@/screens/plans/HomeFeed'
import { PlanDetails } from '@/screens/plans/PlanDetails'
import { JoinConfirmation } from '@/screens/plans/JoinConfirmation'
import { AddToCalendar } from '@/screens/plans/AddToCalendar'
import { CreatePlan } from '@/screens/create/CreatePlan'
import { PlanPosted } from '@/screens/create/PlanPosted'
import { GroupChat } from '@/screens/groups/GroupChat'
import { MyGroups } from '@/screens/groups/MyGroups'
import { Profile } from '@/screens/profile/Profile'
import { NotFound } from '@/screens/NotFound'

// One route per T3 paper screen. The Filter sheet and the After-the-meetup
// prompt are overlays, so they live inside HomeFeed and AppShell.
export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/', element: <Splash /> },
      { path: '/signup', element: <SignUp /> },
      { path: '/login', element: <LogIn /> },
      {
        element: <RequireAuth />,
        children: [
          { path: '/home', element: <HomeFeed /> },
          { path: '/plans/:planId', element: <PlanDetails /> },
          { path: '/plans/:planId/joined', element: <JoinConfirmation /> },
          { path: '/plans/:planId/calendar', element: <AddToCalendar /> },
          { path: '/create', element: <CreatePlan /> },
          { path: '/create/posted/:planId', element: <PlanPosted /> },
          { path: '/chat/:planId', element: <GroupChat /> },
          { path: '/groups', element: <MyGroups /> },
          { path: '/profile', element: <Profile /> },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
])
