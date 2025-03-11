import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext.tsx'
import ProfileNavLabel from './ProfileNavLabel.tsx'

export default function Navbar() {
  const { userLoggedIn } = useAuth()

  return (
    <nav className="bg-[#030f24] p-3">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <Link to="/" className="font-bold text-white">
            Home
          </Link>
          <Link to="/leaderboard" className="mx-2 text-white">
            Leaderboard
          </Link>
          <Link to="/user" className="mx-2 text-white">
            Profile
          </Link>
        </div>
        <div>
          {userLoggedIn ? (
            <div className="flex gap-4">
              <ProfileNavLabel />
            </div>
          ) : (
            <>
              <Link to="/login" className="mx-2 text-white">
                Login
              </Link>
              <Link to="/register" className="mx-2 text-white">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
