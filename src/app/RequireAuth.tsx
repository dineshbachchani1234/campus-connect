import { Navigate, Outlet } from 'react-router'
import { useAppStore } from '@/store/useAppStore'

/** Sends signed-out visitors back to the splash screen */
export function RequireAuth() {
  const user = useAppStore((s) => s.user)
  return user ? <Outlet /> : <Navigate to="/" replace />
}
