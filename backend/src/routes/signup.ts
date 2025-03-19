import express from 'express'
import { supabase } from '../utils/supabase.ts'

const router = express.Router()
const redirectUrl = process.env.SUPABASE_REDIRECT_URL!

// Email Validation
const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) ? null : 'Invalid email format.'
}

// Password Validation
const validatePassword = (password: string): string | null => {
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
  if (password !== confirmedPassword) {
    return 'Passwords do not match'
  }
  return null // Passwords match
}

// Username Validation
const validateUsername = (username: string): string | null => {
  if (username.length < 3 || username.length > 20) {
    return 'Must be between 3 and 20 characters.'
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Can only contain letters, numbers, and underscores.'
  }
  return null // Username is valid
}

// Post sign up form
router.post('/', async (req, res) => {
  const { email, password, username, confirmedPassword } = req.body

  interface SignupErrors {
    email?: string
    password?: string
    username?: string
    confirmedPassword?: string
    general?: string
  }

  const errors: SignupErrors = {}

  // Validate user input
  const emailError = validateEmail(email)
  const passwordError = validatePassword(password)
  const usernameError = validateUsername(username)
  const confirmedPasswordError = validateConfirmedPassword(password, confirmedPassword)

  if (emailError) errors.email = emailError
  if (passwordError) errors.password = passwordError
  if (usernameError) errors.username = usernameError
  if (confirmedPasswordError) errors.confirmedPassword = confirmedPasswordError

  // Check if email is already used in auth.users
  const { data: existingUser, error: emailCheckError } = await supabase
    .from('user_emails')
    .select('id')
    .eq('email', email)
    .single()

  if (existingUser) {
    errors.email = 'The email you entered is already registered.'
  }

  if (errors.email || errors.password || errors.username || confirmedPasswordError) {
    return res.status(400).json({ errors })
  }

  // Attempt to create a new user in auth.users with the given details
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo: `${redirectUrl}/activated` },
  })

  if (error) {
    console.error(error)
    errors.general = error.message
    return res.status(400).json({ errors })
  }

  const user = data.user

  if (!user) {
    console.error('profile creation failed: user was null')
    errors.general = 'profile creation failed: user was null'
    return res.status(400).json({ errors })
  }

  // New profile should be inserted by SQL trigger
  // Update username of this new profile
  const { error: profileError } = await supabase.from('profiles').update({ username }).eq('id', user.id)

  // Rollback account creation if there was an account creation error to avoid hanging account data
  if (profileError) {
    console.error(`Error updating profile username: ${profileError.message}`)

    await supabase.auth.admin.deleteUser(user.id)

    errors.general = `Profile update failed, user creation rolled back.`
    return res.status(500).json({ errors })
  }

  res.status(200).json({ message: 'User created successfully', isVerified: user.user_metadata.email_verified })
})

export default router
