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
import { ROUTES } from './constants/routes'

export let showToast = () => {}

export default function App() {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  useEffect(() => {
    showToast = (message, type = 'success') => {
      setToast({ show: true, message, type })
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000)
    }
  }, [])

  return (
    <BrowserRouter>
      <AuthProvider>
        <SubscriptionProvider>
          <ThemeProvider>
            <AppProvider>
              <AppContent toast={toast} />
              
              {/* المكون المفقود (Toast Component) */}
              {toast.show && (
                <div className={`fixed bottom-6 left-6 z-[9999] px-6 py-3 rounded-2xl shadow-2xl text-[11px] font-bold text-white animate-fade-in ${
                  toast.type === 'success' ? 'bg-green-600' : 'bg-rose-600'
                }`}>
                  {toast.message}
                </div>
              )}
            </AppProvider>
          </ThemeProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

function AppContent({ toast }) {
  const { user, loading } = useContext(AuthContext)

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
          <Route path={ROUTES.LANDING} element={<Landing />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={!user ? <Login /> : <Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.REGISTER} element={!user ? <Register /> : <Navigate to={ROUTES.DASHBOARD} replace />} />
        </Route>
        <Route element={user ? <DashboardLayout /> : <Navigate to={ROUTES.LOGIN} replace />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.HISTORY} element={<History />} />
          <Route path={ROUTES.PRICING} element={<Pricing />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
          <Route path={ROUTES.SUBSCRIPTION} element={<SubscriptionManagement />} />
        </Route>
        <Route path={ROUTES.SUCCESS} element={<Success />} />
        <Route path={ROUTES.MAINTENANCE} element={<Maintenance />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Routes>
    </div>
  )
}