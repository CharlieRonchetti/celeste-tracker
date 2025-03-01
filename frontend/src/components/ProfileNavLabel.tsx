import pfpPlacehold from '../assets/image.png'
import { useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext.tsx'
import { FaUser } from 'react-icons/fa'
import { IoMdSettings } from 'react-icons/io'
import { IoLogOut } from 'react-icons/io5'
import { IoIosArrowDown } from 'react-icons/io'
import { useEffect, useState, useRef } from 'react'

export default function ProfileNavLabel() {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [isTouch, setIsTouch] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Detect if device is touchscreen
  useEffect(() => {
    setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  const toggleDropdown = () => {
    if (!isTouch) return // return if device isn't touchscreen
    setIsOpen((prev) => !prev)
  }

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="group relative" ref={dropdownRef}>
      <div className="flex items-center gap-1">
        <img src={pfpPlacehold} onClick={() => toggleDropdown()} className="h-10 rounded-lg"></img>
        <IoIosArrowDown
          className={`scale-100 rotate-0 text-gray-300 transition-all duration-600 ease-in-out group-hover:rotate-540 ${isOpen ? 'rotate-540' : 'roate-0'}`}
        />
      </div>

      <div
        className={`absolute left-1/2 mt-2 w-30 -translate-x-1/2 scale-95 ${isOpen ? 'pointer-events-auto scale-100 opacity-100' : 'pointer-events-none scale-95 opacity-0'} rounded-lg bg-white shadow-lg transition-all duration-200 group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 before:absolute before:-top-2 before:left-0 before:h-2 before:w-full before:bg-transparent`}
      >
        <ul className="p-1">
          <li
            className="flex cursor-pointer items-center gap-1 rounded-lg px-4 py-2 hover:bg-gray-100"
            onClick={() => navigate('/profile')}
          >
            <FaUser /> Profile
          </li>
          <li
            className="flex cursor-pointer items-center gap-1 rounded-lg px-4 py-2 hover:bg-gray-100"
            onClick={() => navigate('/settings')}
          >
            <IoMdSettings />
            Settings
          </li>
          <li
            className="flex cursor-pointer items-center gap-1 rounded-lg px-4 py-2 hover:bg-gray-100"
            onClick={() =>
              signOut().then(() => {
                navigate('/login')
              })
            }
          >
            <IoLogOut />
            Logout
          </li>
        </ul>
      </div>
    </div>
  )
}
