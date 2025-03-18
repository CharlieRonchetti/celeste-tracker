/* eslint-disable react-refresh/only-export-components */
import toast, { Toaster } from 'react-hot-toast'

export const notifySuccess = (message: string) =>
  toast.success(message, {
    duration: 3000,
    position: 'top-center',
    style: {
      background: '#f0f9eb',
      color: '#61d345',
    },
  })

export const notifyError = (message: string) =>
  toast.error(message, {
    duration: 3000,
    position: 'top-center',
    style: {
      background: '#f9ebeb',
      color: '#ff4b4b',
    },
  })

export const ToastContainer = () => (
  <Toaster
    toastOptions={{
      className: '',
      style: {
        fontSize: '14px',
        fontWeight: 'bold',
        borderRadius: '8px',
        padding: '12px 16px',
      },
    }}
  />
)
