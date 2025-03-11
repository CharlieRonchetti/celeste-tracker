import { useEffect, useState } from 'react'
import { Navigate, Link } from 'react-router'
import { useAuth } from '../context/AuthContext.tsx'

export default function Login() {
  const { userLoggedIn, signIn } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessagePassword, setErrorMessagePassword] = useState<string | null>('')
  const [errorMessageEmail, setErrorMessageEmail] = useState<string | null>('')
  const [activeError, setActiveError] = useState<boolean>(false)
  const [isSigningIn, setIsSigningIn] = useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isSigningIn) {
      setIsSigningIn(true)
      const errors = await signIn(email, password)
      setIsSigningIn(false)

      if (errors?.password) setErrorMessagePassword(errors.password)
      if (errors?.email) setErrorMessageEmail(errors.email)
    }
  }

  // Remove errors once user starts typing again
  useEffect(() => {
    setErrorMessagePassword(null)
  }, [password, email])

  // Check for any active errors
  useEffect(() => {
    if (errorMessagePassword || errorMessageEmail) {
      setActiveError(true)
      return
    }
    setActiveError(false)
  }, [errorMessagePassword, errorMessageEmail])

  return (
    <div>
      {userLoggedIn && <Navigate to={'/'} replace={true} />}

      <div className="container mx-auto mt-16 flex w-[75%] max-w-full flex-col items-center rounded-xl border-1 border-solid border-neutral-400 bg-white shadow-xl md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%]">
        <h2 className="mt-16 mb-8">Login</h2>

        <form onSubmit={onSubmit} className="flex w-full flex-col px-16">
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
              className={`block h-14 w-full appearance-none rounded-sm border-1 bg-transparent px-3 pr-12 focus:ring-0 focus:outline-none ${errorMessagePassword ? 'border-red-500 focus:border-red-500' : 'border-[#C6C6C6] focus:border-blue-500'} peer`}
            />
            <label
              htmlFor="email_input"
              className={`absolute top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text bg-white px-2 duration-300 peer-focus:px-2 ${errorMessagePassword ? 'text-red-500 focus:text-red-500' : 'text-gray-500 peer-focus:text-blue-500'} start-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4`}
            >
              Email Address
            </label>
          </div>
          <div className="relative mb-8">
            <input
              type="password"
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
            {errorMessagePassword && <p className="mt-1 ml-1 text-sm text-red-500">{errorMessagePassword}</p>}
          </div>
          <button
            type="submit"
            disabled={isSigningIn}
            className="mb-4 h-14 w-full cursor-pointer rounded-sm bg-blue-500 px-3 text-[22px] font-bold text-stone-50 transition-all duration-300 hover:bg-blue-600 hover:shadow-lg"
          >
            {isSigningIn ? 'Signing In...' : 'Sign In'}
          </button>
          <button
            type="button"
            disabled={activeError || isSigningIn}
            className={`mx-auto mb-1 max-w-fit cursor-pointer text-[14px] font-medium ${activeError ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:bg-blue-600 hover:shadow-lg'}`}
          >
            Forgot Password
          </button>
          <p className="mb-16 text-center text-[14px] text-zinc-600">
            Don't have an account?
            <span className="cursor-pointer text-black">
              <Link to="/register"> Register</Link>
            </span>
          </p>
        </form>
      </div>
    </div>
  )
}
