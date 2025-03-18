import { useEffect, useState } from 'react'
import resetSvg from '../assets/reset.svg'
import { BiShow } from 'react-icons/bi'
import { BiHide } from 'react-icons/bi'
import { useDebounce } from '../hooks/useDebounce'
import { supabase } from '../services/supabase'
import { useNavigate } from 'react-router'

export default function UpdatePassword() {
  const navigate = useNavigate()

  const [errorMessagePassword, setErrorMessagePassword] = useState<string | null>('')
  const [errorMessageConfirmedPassword, setErrorMessageConfirmedPassword] = useState<string | null>('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const debouncedInputPassword = useDebounce(password, 500)
  const debouncedInputConfirmedPassword = useDebounce(confirmedPassword, 500)
  const [activeError, setActiveError] = useState<boolean>(false)

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

  const handleSubmit = async () => {
    const { error } = await supabase.auth.updateUser({ password: password })

    if (error) {
      console.error('Error updating password:', error.message)
    } else {
      console.log('Password updated successfully.')
      await supabase.auth.signOut({ scope: 'global' })
      navigate('/login')
    }
  }

  useEffect(() => {
    setErrorMessagePassword(validatePassword(debouncedInputPassword))
  }, [debouncedInputPassword])

  useEffect(() => {
    setErrorMessageConfirmedPassword(validateConfirmedPassword(debouncedInputPassword, debouncedInputConfirmedPassword))
  }, [debouncedInputConfirmedPassword, debouncedInputPassword])

  useEffect(() => {
    if (errorMessageConfirmedPassword || errorMessagePassword) {
      setActiveError(true)
      return
    }
    setActiveError(false)
  }, [errorMessageConfirmedPassword, errorMessagePassword])

  return (
    <div className="container mx-auto mt-16 flex w-[75%] max-w-full flex-col items-center rounded-xl border-1 border-solid border-neutral-400 bg-white shadow-xl md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%]">
      <div className="mt-16 flex w-full flex-col items-center justify-center px-16">
        <img src={resetSvg} alt="Email sent icon" width={80} className="mb-4" />
        <h3 className="mb-4">Change Your Password</h3>
        <p className="mb-8 text-center">Enter your new password below.</p>
        <div className="relative mb-8 w-full">
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
        <div className="relative mb-8 w-full">
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
          onClick={handleSubmit}
          disabled={activeError}
          type="submit"
          className={`mb-16 h-14 w-full cursor-pointer rounded-sm bg-blue-500 px-3 text-[22px] font-bold text-stone-50 transition-all duration-300 ${activeError ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:bg-blue-600 hover:shadow-lg'}`}
        >
          Change Password
        </button>
      </div>
    </div>
  )
}
