import express from 'express'
import { supabase } from '../utils/supabase.ts'

const router = express.Router()

// Post sign up form
router.post('/', async (req, res) => {
  const { email, password } = req.body

  interface SigninErrors {
    email?: string
    password?: string
  }

  const errors: SigninErrors = {}

  // Attempt to sign the user in
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error && error.message.includes('Invalid login credentials')) {
    errors.password = 'Incorrect email or password. Please try again.'
  }

  if (errors.email || errors.password) {
    return res.status(400).json({ errors })
  }

  const userID = data.user?.id

  const { data: profileData, error: usernameError } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', userID)
    .single()

  if (usernameError) {
    console.error('Error fetching username:', usernameError.message)
    return res.status(500).json({ error: 'Failed to retrieve username' })
  }

  res
    .status(200)
    .json({ message: 'User successfully signed in', session: data.session, username: profileData.username })
})

export default router
