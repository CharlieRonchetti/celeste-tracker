import { useEffect, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import { supabase } from '../services/supabase'
import { notifySuccess, notifyError } from '../services/toastService'

export default function ChangePassword() {
  const [activeError, setActiveError] = useState<boolean>(false)
  const [password, setPassword] = useState('')
  const [confirmedPassword, setConfirmedPassword] = useState('')
  const debouncedInputPassword = useDebounce(password, 500)
  const debouncedInputConfirmedPassword = useDebounce(confirmedPassword, 500)
  const [errorMessagePassword, setErrorMessagePassword] = useState<string | null>('')
  const [errorMessageConfirmedPassword, setErrorMessageConfirmedPassword] = useState<string | null>('')

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

  const handleUpdatePassword = async () => {
    const { error } = await supabase.auth.updateUser({ password: password })

    if (error) {
      console.error('Error updating password:', error.message)
      notifyError('Something went wrong')
    } else {
      console.log('Password updated successfully.')
      notifySuccess('Password updated successfully!')
      await supabase.auth.signOut({ scope: 'others' })
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
    <div>
      <p className="regular font-bold">Change Password</p>
      <p className="tiny py-1">You’ll stay signed in here, but all other sessions will be signed out.</p>
      <div className="relative mb-4">
        <input
          type={'password'}
          id="password_input"
          autoComplete="off"
          required
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
          }}
          placeholder=" "
          className={`block h-10 w-full appearance-none rounded-sm border-1 bg-transparent px-3 pr-12 focus:ring-0 focus:outline-none ${errorMessagePassword ? 'border-red-500 focus:border-red-500' : 'border-[#C6C6C6] focus:border-blue-500'} peer`}
        />
        <label
          htmlFor="password_input"
          className={`absolute top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-text bg-white px-2 duration-300 peer-focus:px-2 ${errorMessagePassword ? 'text-red-500 focus:text-red-500' : 'text-gray-500 peer-focus:text-blue-500'} start-1 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4`}
        >
          Password
        </label>

        {errorMessagePassword && <p className="mt-1 ml-1 text-sm text-red-500">{errorMessagePassword}</p>}
      </div>
      <div className="relative">
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
          className={`block h-10 w-full appearance-none rounded-sm border-1 bg-transparent px-3 focus:ring-0 focus:outline-none ${errorMessageConfirmedPassword ? 'border-red-500 focus:border-red-500' : 'border-[#C6C6C6] focus:border-blue-500'} peer`}
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
        onClick={handleUpdatePassword}
        disabled={activeError}
        className={`mt-4 h-10 max-w-fit rounded-sm bg-blue-500 px-3 text-[18px] font-bold text-stone-50 transition-all duration-300 ${activeError || password.length === 0 || confirmedPassword.length === 0 ? 'hidden' : 'cursor-pointer hover:bg-blue-600 hover:shadow-lg'}`}
      >
        Save Password
      </button>
    </div>
  )
}
