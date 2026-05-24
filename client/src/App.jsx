import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import History from './pages/History'
import Settings from './pages/Settings'
import Pricing from './pages/Pricing'
import Success from './pages/Success'
import HeroSection from './components/HeroSection' // 🟢 واجهة الـ Hero الجديدة
import SubscriptionManagement from './pages/SubscriptionManagement' // 💳 الإضافة هنا: استيراد صفحة إدارة الاشتراك الجديدة!

export let showToast = () => {}

function Toast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    showToast = (message, type = 'success') => {
      const id = Date.now()
      setToasts(prev => [...prev, { id, message, type }])
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, 3500)
    }
  }, [])

  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#8b5cf6'
  }

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: '💡'
  }

  return (
    <div style={{
      position: 'fixed',
      top: '24px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 99999,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      alignItems: 'center',
      pointerEvents: 'none'
    }}>
      {toasts.map(toast => (
        <div key={toast.id} style={{
          background: 'rgba(15,23,42,0.97)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${colors[toast.type]}50`,
          borderRadius: '16px',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '15px',
          fontWeight: '600',
          color: 'white',
          boxShadow: `0 8px 32px ${colors[toast.type]}40`,
          animation: 'slideDown 0.3s ease',
          minWidth: '280px',
          maxWidth: '360px',
          justifyContent: 'center',
          direction: 'rtl'
        }}>
          <span style={{ fontSize: '20px' }}>{icons[toast.type]}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        {/* 🟢 الرابط الرئيسي للموقع يعرض الواجهة التسويقية الخارقة مباشرة */}
        <Route path="/" element={<HeroSection />} /> 

        {/* 🟢 لوحة التحكم (الـ Dashboard) الآمنة للمشتركين */}
        <Route path="/dashboard" element={<Dashboard />} /> 
        
        {/* 💳 السحر هنا: تسجيل المسار الآمن لصفحة إدارة الاشتراك المطلب هندسياً */}
        <Route path="/subscription-management" element={<SubscriptionManagement />} /> 

        {/* باقي مساراتك المستقرة والمحمية كما هي بالملّي */}
        <Route path="/login" element={<Login />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/success" element={<Success />} />
        
        {/* 🟢 المسار الآمن وتجربة واجهتك التسويقية بنظام الـ SaaS */}
        <Route path="/landing" element={<HeroSection />} /> 
      </Routes>
    </BrowserRouter>
  )
}