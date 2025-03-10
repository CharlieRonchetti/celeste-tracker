import { useSettings } from '../hooks/useSettings'
import ProfilePictureUpload from '../components/ProfilePictureUpload'
import PronounSettings from '../components/PronounSettings'

export default function Settings() {
  const { settings } = useSettings()

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Your Settings</h1>
      <p>{settings?.theme}</p>
      <p className="regular font-bold">Avatar</p>
      <p className="tiny">Max size: 3mb, Optimal dimensions: 230x230px, Accepted formats: JPEG, PNG, WEBP</p>
      <ProfilePictureUpload />
      <PronounSettings />
    </div>
  )
}
