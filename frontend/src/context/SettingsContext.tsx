import { createContext } from 'react'
import { SettingsContextType } from '../interfaces/SettingsContextType'

export const SettingsContext = createContext<SettingsContextType | null>(null)
