import { useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { supabase } from '../services/supabase.ts'
import { useAuth } from '../context/AuthContext'
import defaultpfp from '../assets/image.png'
import { useSettings } from '../hooks/useSettings.ts'
import { notifySuccess, notifyError } from '../services/toastService'

const API_URL = import.meta.env.VITE_API_URL

export default function ProfilePictureUpload() {
  const { currentUser } = useAuth()
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { avatar, setAvatar } = useSettings()
  const [avatarError, setAvatarError] = useState<string | null>('')
  const [imageSelected, setImageSelected] = useState<boolean>(false)

  const onDrop = async (acceptedFiles: File[]) => {
    const pfp = acceptedFiles[0]
    if (!pfp) return

    setImageSelected(true)

    const reader = new FileReader()
    reader.onload = () => {
      setImagePreview(reader.result as string)
      uploadImage(pfp)
    }
    reader.readAsDataURL(pfp)
    setAvatarError('')
  }

  const onDropRejected = (fileRejections: FileRejection[]) => {
    if (fileRejections.length > 0) {
      const { errors } = fileRejections[0]

      errors.map((err) => {
        if (err.code === 'file-too-large') {
          setAvatarError('File is too large. Maximum size is 3mb.')
        } else if (err.code === 'file-invalid-type') {
          setAvatarError('Invalid file format. Only JPEG, PNG and WEBP are accepted.')
        } else if (err.code === 'too-many-files') {
          setAvatarError('You can only upload one file at a time.')
        } else {
          setAvatarError('An unknown error occurred, please try again.')
        }
      })
    }
  }

  const uploadImage = async (img: File) => {
    const formData = new FormData()
    const token = (await supabase.auth.getSession()).data.session?.access_token
    formData.append('file', img)

    try {
      // Send the image to backend for cropping and supabase upload
      const response = await fetch(`${API_URL}/api/upload-image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const data = await response.json()
      if (response.ok) {
        setAvatar(data.uploadedUrl)
        const profileFromLocalStorage = localStorage.getItem('profile')
        const profile = profileFromLocalStorage ? JSON.parse(profileFromLocalStorage) : {}
        profile.avatar = data.uploadedUrl
        localStorage.setItem('profile', JSON.stringify(profile))
      } else {
        console.error('Image upload failed:', data.message)
        notifyError('Something went wrong')
      }

      // Update the avatar row for to the new URL in the profiles table
      const { data: avatarData, error: fetchError } = await supabase
        .from('profiles')
        .update({ avatar: data.uploadedUrl })
        .eq('id', currentUser?.id)

      if (fetchError) {
        console.error('Error updating avatar:', fetchError.message)
        notifyError('Something went wrong')
      } else {
        console.log('Avatar updated:', avatarData)
        notifySuccess('Avatar updated successfully!')
      }
    } catch (error) {
      console.error('Error uploading image: ', error)
      notifyError('Something went wrong')
    }
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
    },
    maxSize: 3 * 1024 * 1024, // 3MB limit
    multiple: false,
  })

  return (
    <div>
      <p className="regular font-bold">Avatar</p>
      <p className="tiny py-1">Max size: 3mb, Optimal dimensions: 230x230px, Accepted formats: JPEG, PNG, WEBP</p>
      <div className="relative sm:flex sm:gap-4">
        {/* Upload Box */}
        <div
          {...getRootProps()}
          className={`mb-4 flex h-56 w-56 cursor-pointer items-center justify-center rounded-lg bg-[#edf1f5] sm:mb-0 ${!imageSelected ? "after:absolute after:h-50 after:w-50 after:border-2 after:border-dashed after:border-gray-400 after:content-['']" : ''} hover:bg-gray-100`}
        >
          <input {...getInputProps()} />
          {imagePreview ? (
            <img src={imagePreview} alt="Preview" className="h-full w-full rounded-lg object-cover" />
          ) : (
            <p className="items-center p-6 text-center">Drop image here or click to upload</p>
          )}
        </div>

        {/* Current Profile Picture */}
        <div className="h-56 w-56 overflow-hidden rounded-lg">
          <img src={avatar || defaultpfp} alt="Profile" className="h-full w-full object-cover" />
        </div>
      </div>
      <p className="tiny text-red-500">{avatarError}</p>
    </div>
  )
}
