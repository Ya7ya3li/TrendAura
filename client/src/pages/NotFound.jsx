import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes.js'
import Button from '../components/common/Button.jsx'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 text-center dir-rtl select-none animate-fade-in relative z-10">
      <div className="max-w-md w-full">
        <h1 className="text-7xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent tracking-tighter mb-2">404</h1>
        <h3 className="text-sm font-black text-slate-200 tracking-tight mb-2">العنوان المطلوب مفقود أو تم نقله تكتيكياً</h3>
        <p className="text-[11px] font-bold text-slate-500 max-w-xs mx-auto leading-relaxed mb-6">
          يبدو أنك سلكت مساراً برمجياً خاطئاً خارج نطاق جدران حماية TrendAura الحالية المعتمدة.
        </p>

        <Button onClick={() => navigate(ROUTES.DASHBOARD)} variant="primary" className="px-6 py-3 bg-blue-600 hover:bg-blue-700">
          العودة للمسار الآمن للرئيسية 🏠
        </Button>
      </div>
    </div>
  )
}