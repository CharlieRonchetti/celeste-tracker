import { Navigate } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { ReactNode } from 'react'

interface AuthenticatedRouteProps {
  children: ReactNode
}

export const AuthenticatedRoute = ({ children }: AuthenticatedRouteProps) => {
  const { currentUser } = useAuth()
  if (!currentUser) {
    return <Navigate to="/login"></Navigate>
  }
  return children
}
