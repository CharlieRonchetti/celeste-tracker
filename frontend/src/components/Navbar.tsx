import { Link, useNavigate } from 'react-router'
import { useAuth } from '../context/AuthContext.tsx'

export default function Navbar() {
  const { userLoggedIn, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between">
        <div>
          <Link to="/" className="font-bold text-white">
            Home
          </Link>
          <Link to="/leaderboard" className="mx-2 text-white">
            Leaderboard
          </Link>
          <Link to="/profile" className="mx-2 text-white">
            Profile
          </Link>
        </div>
        <div>
          {userLoggedIn ? (
            <>
              <button
                onClick={() =>
                  signOut().then(() => {
                    navigate('/login')
                  })
                }
                className="mx-2 cursor-pointer text-white"
              >
                Logout
              </button>
            </>
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
