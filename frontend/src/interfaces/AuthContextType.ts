import { User } from '@supabase/supabase-js'

interface SignupErrors {
  username?: string
  email?: string
  password?: string
  confirmedPassword?: string
}

interface SigninErrors {
  email?: string
  password?: string
}

export interface AuthContextType {
  currentUser: User | null
  userLoggedIn: boolean
  loading: boolean
  signUp: (email: string, password: string, username: string, confirmedPassword: string) => Promise<SignupErrors | null>
  signIn: (email: string, password: string) => Promise<SigninErrors | null>
  signOut: () => Promise<void>
}
