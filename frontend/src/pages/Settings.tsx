import ProfilePictureUpload from '../components/ProfilePictureUpload'
import PronounSettings from '../components/PronounSettings'
import CountrySelect from '../components/CountrySelect'
import ChangePassword from '../components/ChangePassword'
import { useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'

export default function Settings() {
  const [activePage, setActivePage] = useState('profile')
  const [showDropdown, setShowDropdown] = useState(false)

  const settingsSwitch = () => {
    switch (activePage) {
      case 'profile':
        return (
          <>
            <h6 className="">Your Profile</h6>
            <div className="pt-4">
              <ProfilePictureUpload />
            </div>
            <div className="pt-6">
              <PronounSettings />
            </div>
            <div className="pt-6">
              <CountrySelect />
            </div>
          </>
        )
      case 'account':
        return (
          <>
            <h6 className="">Your Account</h6>
            <div className="pt-4">
              <ChangePassword />
            </div>
          </>
        )
      case 'sheets':
        return (
          <>
            <h6 className="">Sheet Preferences</h6>
          </>
        )
    }
  }

  const toggleDropdown = () => {
    setShowDropdown((showDropdown) => !showDropdown)
  }

  return (
    <div className="container mx-auto mt-4 gap-4 lg:flex">
      <div className="mb-4 lg:mb-0 lg:w-[20%]">
        <div className="flex items-center justify-between px-4">
          <h6>Settings</h6>
          <GiHamburgerMenu className="text-2xl lg:hidden" onClick={toggleDropdown} />
        </div>
        <div className={`pt-2 lg:block ${showDropdown ? 'block' : 'hidden'}`}>
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
          <div
            onClick={() => setActivePage('sheets')}
            className={`cursor-pointer rounded-md py-2 ${activePage === 'sheets' ? 'bg-white' : ''}`}
          >
            <p className="pl-8">Sheets</p>
          </div>
        </div>
      </div>
      <div className="w-full rounded-md bg-white p-4">{settingsSwitch()}</div>
    </div>
  )
}
