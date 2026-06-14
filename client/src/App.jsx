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
import Support from './pages/Support' // 🌟 استدعاء صفحة الدعم الفني الجديدة المخصصة
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
              <AppContent />
              
              {/* نظام إشعارات عائم مستقر زجاجياً بأيقونات SVG */}
              {toast.show && (
                <div className={`fixed bottom-6 left-6 z-[9999] px-6 py-3 rounded-2xl shadow-2xl text-xs font-bold text-white backdrop-blur-md border animate-fade-in flex items-center gap-2 ${
                  toast.type === 'success' ? 'bg-green-600/90 border-green-500/30' : 'bg-rose-600/90 border-rose-500/30'
                }`}>
                  <svg className="w-4 h-4 shrink-0 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    {toast.type === 'success' 
                      ? <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      : <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    }
                  </svg>
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

function AppContent() {
  const { user, profile, initialized } = useContext(AuthContext)
  const userPlan = (profile?.plan || 'free').toLowerCase().trim()

  if (!initialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center dir-rtl">
        <div className="flex flex-col items-center gap-4">
          <svg className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-xs font-bold tracking-wide animate-pulse">جاري تهيئة الخوادم ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans antialiased relative selection:bg-blue-500/20 selection:text-blue-400">
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
          <Route path={ROUTES.PRICING} element={<Pricing />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
          <Route path={ROUTES.SUBSCRIPTION} element={<SubscriptionManagement />} />
          
          {/* 🔒 جدار حماية صارم لمنع الدخول العشوائي عبر الروابط المباشرة لغير المشتركين */}
          <Route path={ROUTES.HISTORY} element={userPlan !== 'free' ? <History /> : <Navigate to={ROUTES.PRICING} replace />} />
          <Route path="/support" element={userPlan !== 'free' ? <Support /> : <Navigate to={ROUTES.PRICING} replace />} />
        </Route>

        <Route path={ROUTES.SUCCESS} element={<Success />} />
        <Route path={ROUTES.MAINTENANCE} element={<Maintenance />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Routes>
    </div>
  )
}