import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'

function RequireAuth() {
  const { authStatus } = useAuth()
  const location = useLocation()

  if (authStatus === 'checking') {
    return null
  }

  if (authStatus === 'guest') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default RequireAuth
