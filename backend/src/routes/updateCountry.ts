import express from 'express'
import { authenticateUser } from '../middleware/authMiddleware'
import { AuthenticatedRequest } from '../interfaces/AuthenticatedRequest.ts'
import { supabase } from '../utils/supabase.ts'

const router = express.Router()

router.post('/', authenticateUser, async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  // Update the country field
  const { data: countryData, error: updateError } = await supabase
    .from('profiles')
    .update({ country: req.body.countryCode })
    .eq('id', req.user.id)
    .select('country')
    .single()

  if (updateError) {
    console.error('Error updating country:', updateError.message)
  } else {
    console.log('Country updated:', countryData.country)
    res.json({ countryData })
  }
})

export default router
