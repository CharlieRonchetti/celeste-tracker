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
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error && error.message.includes('Invalid login credentials')) {
    errors.password = 'Incorrect email or password. Please try again.'
  }

  if (errors.email || errors.password) {
    return res.status(400).json({ errors })
  }

  res.status(200).json({ message: 'User successfully signed in' })
})

export default router
