import { useEffect, useState } from 'react'
import emailErrorSvg from '../assets/email_error.svg'
import emailVerifiedSvg from '../assets/email_verified.svg'
import { Link } from 'react-router'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabase'

export default function Activated() {
  const [verificationError, setVerificationError] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(60)
  const [disabled, setDisabled] = useState(true)
  const { currentUser, loading } = useAuth()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !currentUser) {
      setVerificationError(true)
      const temp_email = localStorage.getItem('temp_email')
      setEmail(temp_email)
    }
    if (!loading) {
      localStorage.removeItem('temp_email')
    }
  }, [currentUser, loading])

  useEffect(() => {
    if (secondsLeft > 0) {
      const timer = setTimeout(() => setSecondsLeft(secondsLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setDisabled(false)
    }
  }, [secondsLeft])

  const handleResend = async () => {
    const redirectUrl = import.meta.env.VITE_SUPABASE_REDIRECT_URL

    if (!email) {
      console.error('No email available to resend verification link.')
      return
    }

    setDisabled(true)
    setSecondsLeft(60)

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
      options: {
        emailRedirectTo: `${redirectUrl}/activated`,
      },
    })

    if (error) {
      console.error('Error resending verification email:', error.message)
    } else {
      console.log('Verification email resent successfully.')
    }
  }

  return !verificationError ? (
    <div className="container mx-auto mt-16 flex h-[661px] w-[75%] max-w-full flex-col items-center justify-center rounded-xl border-1 border-solid border-neutral-400 bg-white px-16 shadow-xl md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%]">
      <img src={emailVerifiedSvg} alt="Email sent icon" width={80} className="mb-8" />
      <h3 className="mb-8">Welcome to Roomsob!</h3>
      <p className="mb-8 text-center">
        Thanks for verifying your email. Your account is now active, you can access it using the button below.
      </p>
      <button
        className={`mb-4 h-14 w-full cursor-pointer rounded-sm bg-blue-500 px-3 text-[22px] font-bold text-stone-50 transition-all duration-300 hover:bg-blue-600 hover:shadow-lg`}
      >
        <Link to="/">Continue to Account</Link>
      </button>
    </div>
  ) : (
    <div className="container mx-auto mt-16 flex h-[661px] w-[75%] max-w-full flex-col items-center justify-center rounded-xl border-1 border-solid border-neutral-400 bg-white px-16 shadow-xl md:w-[60%] lg:w-[50%] xl:w-[40%] 2xl:w-[30%]">
      <img src={emailErrorSvg} alt="Email sent icon" width={80} className="mb-8" />
      <h3 className="mb-8">Something Went Wrong</h3>
      <p className="mb-8 text-center">
        It looks like something went wrong while verifying your email. Please generate another link using the button
        below.
      </p>
      <button
        onClick={handleResend}
        disabled={disabled}
        className={`mb-4 h-14 w-full rounded-sm bg-blue-500 px-3 text-[22px] font-bold text-stone-50 transition-all duration-300 ${disabled ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:bg-blue-600 hover:shadow-lg'}`}
      >
        Resend Email {secondsLeft > 0 ? secondsLeft : ''}
      </button>
    </div>
  )
}
