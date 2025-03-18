import { useEffect, useState } from 'react'
import resetSvg from '../assets/reset.svg'
import { supabase } from '../services/supabase'
import { useDebounce } from '../hooks/useDebounce.ts'

const redirectUrl = import.meta.env.VITE_SUPABASE_REDIRECT_URL!

export default function ResetPassword() {
  const [email, setEmail] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(0)
  const [disabled, setDisabled] = useState(false)
  const [errorMessageEmail, setErrorMessageEmail] = useState<string | null>('')

  const debouncedInputEmail = useDebounce(email, 500)

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setDisabled(false)
    }
  }, [secondsLeft])

  useEffect(() => {
    setErrorMessageEmail(validateEmail(debouncedInputEmail))
  }, [debouncedInputEmail])

  const validateEmail = (email: string): string | null => {
    if (email.length === 0) {
      return null
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) ? null : 'Invalid email format.'
  }

  const handleSubmit = async () => {
    if (!email) {
      console.error('No email provided')
      return
    }

    if (validateEmail(email)) {
      console.error('Invalid email format')
      return
    }

    setDisabled(true)
    setSecondsLeft(60)

    console.log(redirectUrl)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${redirectUrl}/update-password`,
    })

    if (error) {
      console.error('Error resending verification email:', error.message)
    } else {
      console.log('Verification email resent successfully.')
    }
  }

  return (
    <div className="container mx-auto mt-16 flex w-[75%] max-w-full flex-col items-center rounded-xl border-1 border-solid border-neutral-400 bg-white shadow-xl md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%]">
      <div className="mt-16 flex w-full flex-col items-center justify-center px-16">
        <img src={resetSvg} alt="Email sent icon" width={80} className="mb-4" />
        <h3 className="mb-4">Reset Password</h3>
        <p className="mb-8 text-center">Enter the email you registered with below to receive your reset link.</p>
        <div className="relative mb-8 w-full">
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
        <button
          onClick={handleSubmit}
          disabled={disabled}
          type="submit"
          className={`mb-16 h-14 w-full cursor-pointer rounded-sm bg-blue-500 px-3 text-[22px] font-bold text-stone-50 transition-all duration-300 ${disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:bg-blue-600 hover:shadow-lg'}`}
        >
          Send Link {secondsLeft > 0 ? secondsLeft : ''}
        </button>
      </div>
    </div>
  )
}
