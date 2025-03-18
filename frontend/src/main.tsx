import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router'
import { AuthenticatedRoute } from './services/AuthenticatedRoute.tsx'
import Home from './pages/Home'
import Leaderboard from './pages/Leaderboard'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Settings from './pages/Settings'
import Navbar from './components/Navbar'
import Activated from './pages/Activated.tsx'
import ResetPassword from './pages/ResetPassword.tsx'
import UpdatePassword from './pages/UpdatePassword.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { SettingsProvider } from './context/SettingsProvider.tsx'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { ToastContainer } from './services/toastService.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <SettingsProvider>
        <BrowserRouter>
          <SpeedInsights />
          <ToastContainer />
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/user/:username" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/settings"
              element={
                <AuthenticatedRoute>
                  <Settings />
                </AuthenticatedRoute>
              }
            />
            <Route path="/activated" element={<Activated />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="/update-password"
              element={
                <AuthenticatedRoute>
                  <UpdatePassword />
                </AuthenticatedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </SettingsProvider>
    </AuthProvider>
  </StrictMode>
)
