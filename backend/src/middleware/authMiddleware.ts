import { Request, Response, NextFunction } from 'express'
import { supabase } from '../utils/supabase.ts'
import { AuthenticatedRequest } from '../interfaces/AuthenticatedRequest.ts'

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // Validate token with Supabase
    const { data, error } = await supabase.auth.getUser(token)

    if (error || !data.user) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    // Attach user to request
    ;(req as AuthenticatedRequest).user = data.user
    next()
  } catch (err) {
    res.status(500).json({ error: 'Authentication error' })
  }
}
