import React, { useState, useEffect, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// 🧭 استيراد سياقات إدارة الحالة العامة (Context Layer)
import AuthProvider, { AuthContext } from './context/AuthContext' // 👈 تم استدعاء السياق المركزي هنا
import { SubscriptionProvider } from './context/SubscriptionContext'
import { ThemeProvider } from './context/ThemeContext'
import { AppProvider } from './context/AppContext'

// 📂 استيراد هياكل التوزيع البصري القياسية (Layouts Layer)
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'
import LandingLayout from './layouts/LandingLayout'

// 📦 استيراد مكون التحميل المعتمد في هيكلك لمنع القفز العشوائي
import Loader from './components/common/Loader'

// 📄 استيراد كامل الصفحات الإحدى عشر المعتمدة في الهيكل (Pages Layer)
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

/**
 * 🚨 المحرك الفيدرالي لرسائل التنبيه والتوست اللحظية (Global Toast Dispatcher)
 */
export let showToast = () => {}

export default function App() {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' })

  // ربط الدالة المحلية بالمشغل العالمي المصدر للخارج
  useEffect(() => {
    showToast = (message, type = 'success') => {
      setToast({ show: true, message, type })
    }
  }, [])

  // عداد مجهري لتصفير وإخفاء رسالة التنبيه تلقائياً بعد 3.5 ثوانٍ
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, show: false }))
      }, 3500)
      return () => clearTimeout(timer)
    }
  }, [toast.show])

  return (
    <BrowserRouter>
      {/* 🧬 حقن وتكامل ترسانة مقدمي البيانات للحسابات والمظهر والمالية */}
      <AuthProvider>
        <SubscriptionProvider>
          <ThemeProvider>
            <AppProvider>
              
              {/* 🛡️ حقن الكبسولة الداخلية الحامية للمسارات بعد تمكين الـ Context */}
              <AppContent toast={toast} />

            </AppProvider>
          </ThemeProvider>
        </SubscriptionProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

/**
 * 🔐 الكبسولة السيادية لإدارة وحماية المسارات (Core Routing Hub)
 * تم فصلها لتقرأ الـ AuthContext حياً وتكسر الـ Race Condition لـجوجل كلياً.
 */
function AppContent({ toast }) {
  // نقرأ فقط حالة Auth، ولا ننتظر الـ Providers الأخرى للبدء
  const { user, loading } = useContext(AuthContext)

  // 🛡️ حماية ضد التعليق: نكتفي بانتظار التحقق من هوية المستخدم فقط
  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-slate-50">
        <Loader />
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

      {/* التوست ... (باقي الكود كما هو) */}
    </div>
  )
}function AppContent({ toast }) {
  // نقرأ فقط حالة Auth، ولا ننتظر الـ Providers الأخرى للبدء
  const { user, loading } = useContext(AuthContext)

  // 🛡️ حماية ضد التعليق: نكتفي بانتظار التحقق من هوية المستخدم فقط
  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-slate-50">
        <Loader />
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

      {/* التوست ... (باقي الكود كما هو) */}
    </div>
  )
}