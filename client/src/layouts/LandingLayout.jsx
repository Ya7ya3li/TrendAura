import React from 'react'
import { Outlet } from 'react-router-dom'

/**
 * TrendAura Marketing Landing Container Wrapper
 * Eradicates structural viewport scopes for full-width marketing deliveries.
 */
export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col dir-rtl text-right font-sans selection:bg-blue-100 overflow-x-hidden antialiased">
      {/* حقن خلاصة أجزاء وعناصر شاشة العرض التسويقية والفوتر */}
      <div className="w-full flex-1 flex flex-col">
        <Outlet />
      </div>
    </div>
  )
}