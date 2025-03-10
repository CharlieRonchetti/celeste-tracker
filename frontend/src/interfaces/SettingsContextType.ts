import { UserSettingsType } from './UserSettingsType'

export interface SettingsContextType {
  settings: UserSettingsType | null
  updateSetting: (key: string, value: unknown) => void
  avatar: string | undefined
  setAvatar: React.Dispatch<React.SetStateAction<string | undefined>>
  pronouns: string | undefined
  setPronouns: React.Dispatch<React.SetStateAction<string | undefined>>
}
