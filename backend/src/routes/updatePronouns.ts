import express from 'express'
import { authenticateUser } from '../middleware/authMiddleware'
import { AuthenticatedRequest } from '../interfaces/AuthenticatedRequest.ts'
import { supabase } from '../utils/supabase.ts'

const router = express.Router()

const validPronouns = ['None', 'He/Him', 'She/Her', 'It/Its', 'They/Them', 'Any/All']

router.post('/', authenticateUser, async (req: AuthenticatedRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  if (!validPronouns.includes(req.body.newPronoun)) {
    return res.status(400).json({ error: 'Invalid pronouns' })
  }

  // Update the pronouns row
  const { data: pronounData, error: updateError } = await supabase
    .from('profiles')
    .update({ pronouns: req.body.newPronoun })
    .eq('id', req.user.id)
    .select('pronouns')
    .single()

  if (updateError) {
    console.error('Error updating avatar:', updateError.message)
  } else {
    console.log('Pronouns updated:', pronounData.pronouns)
    res.json({ pronounData })
  }
})

export default router
