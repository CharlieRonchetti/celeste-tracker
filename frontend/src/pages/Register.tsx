import { useState, useEffect } from 'react'
import { Navigate, Link } from 'react-router'
import { useAuth } from '../context/AuthContext.tsx'
import { useDebounce } from '../hooks/useDebounce.ts'
import { BiShow } from 'react-icons/bi'
import { BiHide } from 'react-icons/bi'

export default function Register() {
  const { signUp, userLoggedIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const debouncedInputUsername = useDebounce(username, 500)
  const debouncedInputPassword = useDebounce(password, 500)
  const debouncedInputConfirmedPassword = useDebounce(confirmedPassword, 500)
  const [errorMessageUsername, setErrorMessageUsername] = useState<string | null>('')
  const [errorMessagePassword, setErrorMessagePassword] = useState<string | null>('')
  const [errorMessageConfirmedPassword, setErrorMessageConfirmedPassword] = useState<string | null>('')
  const [errorMessageEmail, setErrorMessageEmail] = useState<string | null>('')
  const [activeError, setActiveError] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isRegistering) {
      setIsRegistering(true)
      const errors = await signUp(email, password, username, confirmedPassword)
      setIsRegistering(false)

      if (errors?.username) setErrorMessageUsername(errors.username)
      if (errors?.password) setErrorMessagePassword(errors.password)
      if (errors?.email) setErrorMessageEmail(errors.email)
      if (errors?.confirmedPassword) setErrorMessageConfirmedPassword(errors.confirmedPassword)
    }
  }

  const validateUsername = (username: string): string | null => {
    if (username.length === 0) {
      return null
    }

    if (username.length < 3 || username.length > 20) {
      return 'Must be between 3 and 20 characters.'
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return 'Can only contain letters, numbers, and underscores.'
    }
    return null // Username is valid
  }

  const validatePassword = (password: string): string | null => {
    if (password.length === 0) {
      return null
    }

    if (password.length < 8) {
      return 'Must be at least 8 characters long.'
    }
    if (!/[A-Z]/.test(password)) {
      return 'Must contain at least one uppercase letter.'
    }
    if (!/[a-z]/.test(password)) {
      return 'Must contain at least one lowercase letter.'
    }
    if (!/[0-9]/.test(password)) {
      return 'Must contain at least one number.'
    }
    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'Must contain at least one special character.'
    }
    return null // Password is valid
  }

  const validateConfirmedPassword = (password: string, confirmedPassword: string): string | null => {
    if (confirmedPassword.length === 0) {
      return null
    }

    if (password !== confirmedPassword) {
      return 'Passwords do not match.'
    }

    return null // Password is valid
  }

  // Debounce input on input fields
  useEffect(() => {
    setErrorMessageUsername(validateUsername(debouncedInputUsername))
  }, [debouncedInputUsername])

  useEffect(() => {
    setErrorMessagePassword(validatePassword(debouncedInputPassword))
  }, [debouncedInputPassword])

  useEffect(() => {
    setErrorMessageConfirmedPassword(validateConfirmedPassword(debouncedInputPassword, debouncedInputConfirmedPassword))
  }, [debouncedInputConfirmedPassword, debouncedInputPassword])

  // Check for any active errors
  useEffect(() => {
    if (errorMessageConfirmedPassword || errorMessagePassword || errorMessageUsername) {
      setActiveError(true)
      return
    }
    setActiveError(false)
  }, [errorMessageConfirmedPassword, errorMessagePassword, errorMessageUsername])

  return (
    <div>
      {userLoggedIn && <Navigate to={'/'} replace={true} />}

      <div className="container mx-auto mt-16 flex w-[75%] max-w-full flex-col items-center rounded-xl border-1 border-solid border-neutral-400 bg-white shadow-xl md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%]">
        <h2 className="mt-16 mb-8">Register</h2>

        <form onSubmit={onSubmit} className="flex w-full flex-col px-16">
          <div className="relative mb-8">
            <input
              type="text"
              id="username_input"
              autoComplete="off"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
              }}
              placeholder=" "
              className={`block h-14 w-full appearance-none rounded-sm border-1 bg-transparent px-3 focus:ring-0 focus:outline-none ${errorMessageUsername ? 'border-red-500 focus:border-red-500' : 'border-[#C6C6C6] focus:border-blue-500'} peer`}
            />
            <label
              htmlFor="username_input"
              className={`absolute top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text bg-white px-2 duration-300 peer-focus:px-2 ${errorMessageUsername ? 'text-red-500 focus:text-red-500' : 'text-gray-500 peer-focus:text-blue-500'} start-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4`}
            >
              Username
            </label>
            {errorMessageUsername && <p className="mt-1 ml-1 text-sm text-red-500">{errorMessageUsername}</p>}
          </div>
          <div className="relative mb-8">
            <input
              type="email"
              id="email_input"
              autoComplete="off"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              placeholder=" "
              className={`block h-14 w-full appearance-none rounded-sm border-1 bg-transparent px-3 focus:ring-0 focus:outline-none ${errorMessageEmail ? 'border-red-500 focus:border-red-500' : 'border-[#C6C6C6] focus:border-blue-500'} peer`}
            />
            <label
              htmlFor="email_input"
              className={`absolute top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text bg-white px-2 duration-300 peer-focus:px-2 ${errorMessageEmail ? 'text-red-500 focus:text-red-500' : 'text-gray-500 peer-focus:text-blue-500'} start-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4`}
            >
              Email Address
            </label>
            {errorMessageEmail && <p className="mt-1 ml-1 text-sm text-red-500">{errorMessageEmail}</p>}
          </div>
          <div className="relative mb-8">
            <input
              type={showPassword === false ? 'password' : 'text'}
              id="password_input"
              autoComplete="off"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              placeholder=" "
              className={`block h-14 w-full appearance-none rounded-sm border-1 bg-transparent px-3 pr-12 focus:ring-0 focus:outline-none ${errorMessagePassword ? 'border-red-500 focus:border-red-500' : 'border-[#C6C6C6] focus:border-blue-500'} peer`}
            />
            <label
              htmlFor="password_input"
              className={`absolute top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text bg-white px-2 duration-300 peer-focus:px-2 ${errorMessagePassword ? 'text-red-500 focus:text-red-500' : 'text-gray-500 peer-focus:text-blue-500'} start-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4`}
            >
              Password
            </label>
            {showPassword === false ? (
              <BiShow
                className={`absolute right-3 ${errorMessagePassword ? 'top-[28px]' : 'top-1/2'} -translate-y-1/2 transform cursor-pointer text-gray-500`}
                size={25}
                onClick={() => setShowPassword(true)}
              />
            ) : (
              <BiHide
                className={`absolute right-3 ${errorMessagePassword ? 'top-[28px]' : 'top-1/2'} -translate-y-1/2 transform cursor-pointer text-gray-500`}
                size={25}
                onClick={() => setShowPassword(false)}
              />
            )}
            {errorMessagePassword && <p className="mt-1 ml-1 text-sm text-red-500">{errorMessagePassword}</p>}
          </div>
          <div className="relative mb-8">
            <input
              type="password"
              id="confirm_password_input"
              autoComplete="off"
              required
              value={confirmedPassword}
              onChange={(e) => {
                setConfirmedPassword(e.target.value)
              }}
              placeholder=" "
              className={`block h-14 w-full appearance-none rounded-sm border-1 bg-transparent px-3 focus:ring-0 focus:outline-none ${errorMessageConfirmedPassword ? 'border-red-500 focus:border-red-500' : 'border-[#C6C6C6] focus:border-blue-500'} peer`}
            />
            <label
              htmlFor="confirm_password_input"
              className={`absolute top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text bg-white px-2 duration-300 peer-focus:px-2 ${errorMessageConfirmedPassword ? 'text-red-500 focus:text-red-500' : 'text-gray-500 peer-focus:text-blue-500'} start-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4`}
            >
              Confirm Password
            </label>
            {errorMessageConfirmedPassword && (
              <p className="mt-1 ml-1 text-sm text-red-500">{errorMessageConfirmedPassword}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={activeError || isRegistering}
            className={`mb-4 h-14 w-full rounded-sm bg-blue-500 px-3 text-[22px] font-bold text-stone-50 transition-all duration-300 ${activeError ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:bg-blue-600 hover:shadow-lg'}`}
          >
            {isRegistering ? 'Signing Up...' : 'Sign Up'}
          </button>
          <p className="mb-16 text-center text-[14px] text-zinc-600">
            Already made an account?{' '}
            <span className="cursor-pointer text-black">
              <Link to="/login">Login</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}
