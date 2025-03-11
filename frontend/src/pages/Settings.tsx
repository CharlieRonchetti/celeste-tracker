import ProfilePictureUpload from '../components/ProfilePictureUpload'
import PronounSettings from '../components/PronounSettings'
import CountrySelect from '../components/CountrySelect'
import { useState } from 'react'

export default function Settings() {
  const [activePage, setActivePage] = useState('profile')

  return (
    <div className="container mx-auto mt-4 flex gap-4">
      <div className="w-[20%]">
        <h6>Settings</h6>
        <div className="pt-2">
          <div
            onClick={() => setActivePage('profile')}
            className={`cursor-pointer rounded-md py-2 ${activePage === 'profile' ? 'bg-white' : ''}`}
          >
            <p className="pl-8">Profile</p>
          </div>
          <div
            onClick={() => setActivePage('account')}
            className={`cursor-pointer rounded-md py-2 ${activePage === 'account' ? 'bg-white' : ''}`}
          >
            <p className="pl-8">Account</p>
          </div>
        </div>
      </div>
      <div className="w-full rounded-md bg-white p-4">
        <h6 className="">Your Profile</h6>
        <div className="pt-4">
          <ProfilePictureUpload />
        </div>
        <div className="pt-4">
          <PronounSettings />
        </div>
        <div className="pt-4">
          <CountrySelect />
        </div>
      </div>
    </div>
  )
}
