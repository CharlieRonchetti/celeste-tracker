import { useState } from 'react'
import { useAuth } from '../context/AuthContext.tsx'

export default function Register() {
    const { signUp } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    //const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        if(!isRegistering) {
            setIsRegistering(true)
            await signUp(email, password)
        }
    }

    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Sign Up</h1>
        <p>Register your account here</p>

        <form onSubmit={onSubmit}>
            <div>
                <label>Email</label>                
                <input type="email" autoComplete="email" required value={email} onChange={(e) => {setEmail(e.target.value)}} />
            </div>
            <div>
                <label>Password</label>                
                <input type="password" autoComplete="new-password" required value={password} onChange={(e) => {setPassword(e.target.value)}} />
            </div>
            <button type="submit" disabled={isRegistering}>
                {isRegistering ? 'Signing Up...' : 'Sign Up'}
            </button>
        </form>
      </div>
    );
  }