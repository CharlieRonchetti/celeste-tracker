import { useSettings } from '../hooks/useSettings'
import ProfilePictureUpload from '../components/ProfilePictureUpload'

export default function Settings() {
  const { settings } = useSettings()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Your Settings</h1>
      <p>{settings?.theme}</p>
      <ProfilePictureUpload />
    </div>
  )
}
