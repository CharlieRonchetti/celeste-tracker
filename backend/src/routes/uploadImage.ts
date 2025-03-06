import express from 'express'
import { supabase } from '../utils/supabase.ts'
import multer from 'multer'
import sharp from 'sharp'
import path from 'path'
import { authenticateUser } from '../middleware/authMiddleware'
import { AuthenticatedRequest } from '../interfaces/AuthenticatedRequest.ts'

const router = express.Router()
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/', authenticateUser, upload.single('file'), async (req: AuthenticatedRequest, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Fetch old pfp if one exists
    const { data: avatarData, error: fetchError } = await supabase
      .from('profiles')
      .select('avatar')
      .eq('id', req.user.id)
      .single()

    if (fetchError) {
      console.error('Error fetching avatar:', fetchError.message)
      return res.status(500).json({ message: 'Error fetching avatar' })
    }

    const oldAvatarUrl = avatarData?.avatar

    // Delete the old avatar if it exists
    if (oldAvatarUrl) {
      const oldFilePath = oldAvatarUrl.split('/storage/v1/object/public/assets/')[1]
      const { error: removeError } = await supabase.storage.from('assets').remove([oldFilePath])

      if (removeError) {
        console.error('Error removing avatar:', removeError.message)
        return res.status(500).json({ message: 'Error removing avatar' })
      }
    }

    const fileBuffer = req.file.buffer

    // Crop image with sharp
    const croppedImage = await sharp(fileBuffer).resize(230, 230).toFormat('webp').webp({ quality: 80 }).toBuffer()

    // Upload the image to supabase
    const { data, error } = await supabase.storage
      .from('assets')
      .upload(`profile-pics/${req.user.id}-${Date.now()}.webp`, croppedImage, {
        contentType: 'image/webp',
        cacheControl: '5',
        upsert: true,
      })

    if (error) {
      throw new Error(error.message)
    }

    // Get the URL of the image
    const { data: urlData } = supabase.storage.from('assets').getPublicUrl(data.path)
    const uploadedUrl = urlData.publicUrl

    // Send the URL to the frontend
    res.json({ uploadedUrl })
  } catch (error) {
    console.error('Error processing image: ', error)
    res.status(500).json({ message: 'Error processing image', error: error.message })
  }
})

export default router
