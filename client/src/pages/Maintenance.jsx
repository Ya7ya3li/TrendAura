import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '../constants/routes.js'
import Button from '../components/common/Button.jsx'

export default function Maintenance() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 text-center dir-rtl select-none animate-scale-up relative z-10">
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/60 rounded-[32px] p-8 max-w-md w-full shadow-2xl">
        <div className="text-3xl mb-3 filter drop-shadow-md">🛠️</div>
        <h2 className="text-sm font-black text-white tracking-tight mb-1">المنظومة تحت التحديث والتحقين السريع</h2>
        <p className="text-[10px] font-bold text-slate-400 max-w-xs mx-auto leading-relaxed mb-6">
          نقوم حالياً بحقن وتوسيع خوادم محرك الفايرال لتوفير سرعة توليد مضاعفة ومستقرة لصناع المحتوى المحترفين. لن نستغرق طويلاً.
        </p>

        <Button onClick={() => navigate(ROUTES.DASHBOARD)} variant="secondary" className="w-full py-2.5 border-slate-800 text-slate-300">
          إعادة فحص جهوزية السيرفر حياً 🔄
        </Button>
      </div>
    </div>
  )
}