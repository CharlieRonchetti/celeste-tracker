/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '../services/supabase.ts'
import { AuthContextType } from '../interfaces/AuthContextType.ts'

const API_URL = import.meta.env.VITE_API_URL

// Use this hook wherever auth is needed
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userLoggedIn, setUserLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  const [username, setUsername] = useState('')

  useEffect(() => {
    // Check if a user is already logged in
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setCurrentUser(session.user)
        setUserLoggedIn(true)
      } else {
        setCurrentUser(null)
        setUserLoggedIn(false)
      }
      setLoading(false)
    }

    fetchUser()

    const refreshSession = async () => {
      await supabase.auth.refreshSession()
    }
    refreshSession()

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setCurrentUser(session.user)
        setUserLoggedIn(true)
      } else {
        setCurrentUser(null)
        setUserLoggedIn(false)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, username: string, confirmedPassword: string) => {
    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, username, confirmedPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.log(data.error)
        return data.errors
      }

      // Store session information
      // CURRENTLY BROKEN BECAUSE EMAIL VERIFICATION IS NOT IMPLEMENTED
      if (data.session) {
        localStorage.setItem('username', username)
        await supabase.auth.setSession(data.session)
      }

      setUserLoggedIn(true)
      return null
    } catch (error) {
      if (error instanceof Error) {
        console.error('Signup error:', error.message)
      }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/api/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return data.errors
      }

      // Store session information
      if (data.session) {
        localStorage.setItem('username', data.username)
        await supabase.auth.setSession(data.session)
      }

      setUsername(data.username)
      setUserLoggedIn(true)
      return null
    } catch (error) {
      if (error instanceof Error) {
        console.error('Signin error:', error.message)
      }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setCurrentUser(null)
    setUserLoggedIn(false)

    // Ensure the browser session is cleared
    localStorage.removeItem('supabase.auth.token')
    localStorage.removeItem('username')
    localStorage.removeItem('user_settings')
    localStorage.removeItem('profile')
    sessionStorage.clear()
  }

  return (
    <AuthContext.Provider value={{ currentUser, userLoggedIn, loading, username, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}
