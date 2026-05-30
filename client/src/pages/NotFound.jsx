import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'

/**
 * TrendAura Minimalist Architectural 404 Route Fallback
 */
export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 text-center dir-rtl select-none animate-fade-in">
      <div className="max-w-md w-full">
        <h1 className="text-7xl font-black text-gradient-premium tracking-tighter mb-2">404</h1>
        <h3 className="text-sm font-black text-slate-800 tracking-tight mb-2">العنوان المكتوب مفقود أو تم نقله</h3>
        <p className="text-[11px] font-bold text-slate-400 max-w-xs mx-auto leading-relaxed mb-6">
          يبدو أنك سلكت مساراً برمجياً خاطئاً خارج نطاق جدران حماية TrendAura الحالية.
        </p>

        <Button onClick={() => navigate('/dashboard')} variant="primary" className="px-6 py-3">
          العودة للمسار الآمن للرئيسية 🏠
        </Button>
      </div>
    </div>
  )
}