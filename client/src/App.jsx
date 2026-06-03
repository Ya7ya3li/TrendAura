import React, { useState, useEffect, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider, { AuthContext } from './context/AuthContext'
import { SubscriptionProvider } from './context/SubscriptionContext'
import { ThemeProvider } from './context/ThemeContext'
import { AppProvider } from './context/AppContext'
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'
import LandingLayout from './layouts/LandingLayout'
import Landing from './pages/Landing'
import Dashboard from './pages/Dashboard'
import History from './pages/History'
import Login from './pages/Login'
import Register from './pages/Register'
import Pricing from './pages/Pricing'
import Settings from './pages/Settings'
import SubscriptionManagement from './pages/SubscriptionManagement'
import Success from './pages/Success'
import NotFound from './pages/NotFound'
import Maintenance from './pages/Maintenance'

export let showToast = () => {}

export default function App() {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    showToast = (message, type = 'success') => {
      setToast({ show: true, message, type })
    }
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <ThemeProvider>
            <AppProvider>
              <AppContent toast={toast} />
            </AppProvider>
          </ThemeProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

function AppContent({ toast }) {
  const { user, loading } = useContext(AuthContext)

  // تم استبدال الـ  المعلق بنص بسيط جداً لضمان عدم تعليق الموقع
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        جاري تهيئة البيانات...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 font-sans antialiased relative">
      <Routes>
        <Route element={<LandingLayout />}>
          <Route path="/" element={<Landing />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" replace />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" replace />} />
        </Route>
        <Route element={user ? <DashboardLayout /> : <Navigate to="/login" replace />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/billing" element={<SubscriptionManagement />} />
        </Route>
        <Route path="/success" element={<Success />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </div>
  )
}