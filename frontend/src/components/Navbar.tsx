import { Link, useNavigate } from "react-router";
import { useAuth } from '../context/AuthContext.tsx'
import { doSignOut } from '../services/auth.ts'

export default function Navbar() {
  const { userLoggedIn } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="bg-blue-500 p-4">
      <div className="container mx-auto flex justify-between">
        <div>
          <Link to="/" className="text-white font-bold">Home</Link>
          <Link to="/leaderboard" className="text-white mx-2">Leaderboard</Link>
          <Link to="/profile" className="text-white mx-2">Profile</Link>
        </div>
        <div>
          {
            userLoggedIn
              ?
              <>
                <button onClick={() => doSignOut().then(() => {navigate('/login')})} className="text-white mx-2">Logout</button>
              </>
              :
              <>
                <Link to="/login" className="text-white mx-2">Login</Link>
                <Link to="/register" className="text-white mx-2">Sign Up</Link>
              </>
          }
        </div>
      </div>
    </nav>
  );
}