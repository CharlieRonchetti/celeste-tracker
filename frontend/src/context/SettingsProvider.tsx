import { ReactNode, useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from '../context/AuthContext'
import { SettingsContext } from './SettingsContext'
import { UserSettingsType } from '../interfaces/UserSettingsType'
import { getProfile } from '../services/api.ts'

interface SettingsProviderProps {
  children: ReactNode
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const { currentUser, loading } = useAuth()
  const [settings, setSettings] = useState<UserSettingsType | null>(() => {
    // Attempt to load from local storage first to avoid API call
    const storedSettings = localStorage.getItem('user_settings')
    return storedSettings ? JSON.parse(storedSettings) : null
  })
  const [avatar, setAvatar] = useState<string | undefined>(undefined)
  const [pronouns, setPronouns] = useState<string | undefined>('None')
  const [country, setCountry] = useState<string | undefined>('None')

  useEffect(() => {
    const fetchSettings = async () => {
      // Fetch settings from DB if they weren't found in local storage
      if (!currentUser?.id || loading) return

      if (settings) return

      // Check if the user has a row in user_settings table
      const { data: userSettingsData, error: fetchError } = await supabase
        .from('user_settings')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (userSettingsData) {
        setSettings(userSettingsData)
        localStorage.setItem('user_settings', JSON.stringify(userSettingsData))
        return
      }

      // Ignore multiple or row not found errors
      if (!userSettingsData) {
        if (fetchError && fetchError.code !== 'PGRST116') {
          console.error('Error fetching settings:', fetchError.message)
          return
        }

        // If they don't create one and return
        const defaultSettings = {
          id: currentUser.id,
          theme: 'light',
        }

        const { error: insertError } = await supabase.from('user_settings').insert([defaultSettings])

        if (insertError) {
          console.error('Error inserting default settings:', insertError.message)
          return
        }

        localStorage.setItem('user_settings', JSON.stringify(defaultSettings))
        const storedSettings = localStorage.getItem('user_settings')
        if (storedSettings) {
          setSettings(JSON.parse(storedSettings))
        }
      }
    }

    fetchSettings()

    // Fetch user profile data
    const fetchProfile = async () => {
      if (currentUser) {
        const profile = await getProfile(currentUser)
        if (profile) {
          setAvatar(profile.avatar)
          setPronouns(profile.pronouns)
          setCountry(profile.country)
        }
      }
    }

    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]) // Settings dependency is redundant here

  // Reset settings when user logs out
  useEffect(() => {
    if (!currentUser) {
      setSettings(null)
    }
  }, [currentUser])

  // Update settings
  const updateSetting = (key: string, value: unknown) => {
    const updatedSettings = { ...settings, [key]: value }

    localStorage.setItem('user_settings', JSON.stringify(updatedSettings))
    const storedSettings = localStorage.getItem('user_settings')
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings))
    }

    supabase // Update database entry for the setting
      .from('user_settings')
      .update({ [key]: value })
      .match({ id: currentUser?.id })
  }

  return (
    <SettingsContext.Provider
      value={{ settings, updateSetting, avatar, setAvatar, pronouns, setPronouns, country, setCountry }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
