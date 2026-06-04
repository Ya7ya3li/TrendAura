import React, { useState, useEffect, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider, { AuthContext } from './context/AuthContext'
import { SubscriptionProvider } from './context/SubscriptionContext'
import { ThemeProvider } from './context/ThemeContext'
import { AppProvider } from './context/AppProvider' // تم مطابقتها مع ملف AppContext الهيكلي
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
              
              {/* نظام إشعارات المظهر العائم المستقر زجاجياً */}
              {toast.show && (
                <div className={`fixed bottom-6 left-6 z-[9999] px-6 py-3 rounded-2xl shadow-2xl text-xs font-bold text-white backdrop-blur-md border animate-fade-in ${
                  toast.type === 'success' ? 'bg-green-600/90 border-green-500/30' : 'bg-rose-600/90 border-rose-500/30'
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

function AppContent() {
  const { user, loading } = useContext(AuthContext)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center dir-rtl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-xs font-bold tracking-wide animate-pulse">جاري تهيئة خوادم تريند اورا...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 font-sans antialiased relative selection:bg-blue-500/20 selection:text-blue-400">
      <Routes>
        {/* قطاع المسارات العامة التسويقية */}
        <Route element={<LandingLayout />}>
          <Route path={ROUTES.LANDING} element={<Landing />} />
        </Route>

        {/* قطاع حماية المصادقة العكسية (يُمنع المسجل من الدخول هنا) */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={!user ? <Login /> : <Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.REGISTER} element={!user ? <Register /> : <Navigate to={ROUTES.DASHBOARD} replace />} />
        </Route>

        {/* قطاع لوحة التحكم المحمي بالكامل (توجيه صارم للداخل والخارج) */}
        <Route element={user ? <DashboardLayout /> : <Navigate to={ROUTES.LOGIN} replace />}>
          <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
          <Route path={ROUTES.HISTORY} element={<History />} />
          <Route path={ROUTES.PRICING} element={<Pricing />} />
          <Route path={ROUTES.SETTINGS} element={<Settings />} />
          <Route path={ROUTES.SUBSCRIPTION} element={<SubscriptionManagement />} />
        </Route>

        {/* مسارات الأنظمة المستقلة */}
        <Route path={ROUTES.SUCCESS} element={<Success />} />
        <Route path={ROUTES.MAINTENANCE} element={<Maintenance />} />
        <Route path={ROUTES.NOT_FOUND} element={<NotFound />} />
        <Route path="*" element={<Navigate to={ROUTES.NOT_FOUND} replace />} />
      </Routes>
    </div>
  )
}