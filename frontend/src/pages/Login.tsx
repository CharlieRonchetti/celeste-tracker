import { doSignInWithEmailAndPassword } from "../services/auth"
import { useState } from 'react'
import { useAuth } from '../context/AuthContext.tsx'
import { Navigate } from "react-router";


export default function Login() {
    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    //const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        if(!isSigningIn) {
            setIsSigningIn(true)
            console.log("attempting to sign in")
            await doSignInWithEmailAndPassword(email, password)
        }
    }

    return (
      <div>
        {userLoggedIn && (<Navigate to={'/'} replace={true} />)}

        <div className="p-4">
            <h1 className="text-2xl font-bold">Login</h1>
            <p>Login to your account here</p>

            <form onSubmit={onSubmit}>
                <div>
                    <label>Email</label>                
                    <input type="email" autoComplete="email" required value={email} onChange={(e) => {setEmail(e.target.value)}} />
                </div>
                <div>
                    <label>Password</label>                
                    <input type="password" autoComplete="current-password" required value={password} onChange={(e) => {setPassword(e.target.value)}} />
                </div>
                <button type="submit" disabled={isSigningIn}>
                    {isSigningIn ? 'Signing In...' : 'Sign In'}
                </button>
            </form>
        </div>
      </div>
      
    );
  }