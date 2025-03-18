import { supabase } from '../services/supabase.ts'
import { User } from '@supabase/supabase-js'

const API_URL = import.meta.env.VITE_API_URL

// Fetch all runs
export async function getRuns() {
  const token = (await supabase.auth.getSession()).data.session?.access_token

  const response = await fetch(`${API_URL}/api/runs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    if (response.status === 401) {
      console.warn('Unauthorized: Please log in.')
      return
    } else {
      console.error(`Error ${response.status}: Failed to fetch runs`)
      return
    }
  }
  return response.json()
}

// Submit a new run
export async function submitRun(runData: { user_id: number; category: string; time: string }) {
  const response = await fetch(`${API_URL}/runs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(runData),
  })
  if (!response.ok) throw new Error('Failed to submit run')
  return response.json()
}

export async function getProfile(currentUser: User | null) {
  // Function to populate profile related data in settings context
  // from local storage or db if local storage is not populated

  // Get user's avatar
  if (localStorage.getItem('profile')) {
    const profileFromLocalStorage = localStorage.getItem('profile')
    if (profileFromLocalStorage) {
      return JSON.parse(profileFromLocalStorage)
    } else {
      return null
    }
  } else {
    console.log('Attempting to get users profile')
    const { data: profileData, error: fetchError } = await supabase
      .from('profiles')
      .select()
      .eq('id', currentUser?.id)
      .single()

    if (fetchError) {
      console.error('Error fetching profile:', fetchError.message)
      return
    }

    if (profileData === null) return

    if (profileData) {
      localStorage.setItem('profile', JSON.stringify(profileData))
      localStorage.setItem('username', profileData.username)

      const profileFromLocalStorage = localStorage.getItem('profile')
      if (profileFromLocalStorage) {
        return JSON.parse(profileFromLocalStorage)
      } else {
        return
      }
    }
  }
}
