import React, { useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext.jsx'
import { showToast } from '../../App.jsx'

/**
 * TrendAura UI/UX Visual Preference Toggler - Dual Theme Edition
 */
export default function ThemeSettings() {
  const { theme, setTheme, roundedStyle, setRoundedStyle } = useContext(ThemeContext)

  const handleSaveThemePreferences = () => {
    const themeName = theme === 'dark' ? 'الداكن' : 'الفاتح'
    const radiusName = roundedStyle === 'premium' ? 'الحواف الدائرية' : 'الحواف الكلاسيكية'
    if (typeof showToast === 'function') {
      showToast(`تم حفظ مظهرك المفضل ${themeName} وتطبيق ${radiusName} بنجاح!`, 'success')
    }
  }

  return (
    <div className="space-y-6 text-right dir-rtl select-none animate-fade-in font-sans transition-colors duration-300">
      <div>
        <h3 className="text-xs font-black text-slate-900 dark:text-white tracking-tight mb-1 transition-colors">مظهر وهندسة الواجهات </h3>
        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 transition-colors">خصص البيئة البصرية ولوحة الألوان البنيوية بما يتوافق مع راحة عينيك أثناء هندسة السكريبتات.</p>
      </div>

      <div className="space-y-5">
        <div className="flex flex-col gap-2.5">
          <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 transition-colors">النمط اللوني الرئيسي للمنصة</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            
            {/* ☀️ كارت الثيم الفاتح */}
            <div
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all active:scale-[0.99] ${
                theme === 'light'
                  ? 'bg-blue-50/50 dark:bg-slate-900 border-blue-500 text-slate-900 dark:text-white shadow-sm dark:shadow-md'
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className={`w-5 h-5 shrink-0 transition-colors ${theme === 'light' ? 'text-amber-500' : 'text-amber-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div className="flex flex-col text-right">
                  <span className={`text-xs font-black transition-colors ${theme === 'light' ? 'text-blue-600 dark:text-blue-400' : 'text-slate-900 dark:text-white'}`}>
                      (Premium Light)
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-500 mt-0.5 transition-colors">مطابق لهوية قنوات الذكاء الاصطناعي القياسية</span>
                </div>
              </div>
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${theme === 'light' ? 'border-blue-500 bg-blue-500 text-white text-[8px]' : 'border-slate-300 dark:border-slate-800'}`}>
                {theme === 'light' && '✓'}
              </span>
            </div>

            {/* 🌙 كارت الثيم الداكن  */}
            <div
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all active:scale-[0.99] ${
                theme === 'dark'
                  ? 'bg-slate-900 border-cyan-500 text-white shadow-md'
                  : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-cyan-500 dark:text-cyan-400 shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
                <div className="flex flex-col text-right">
                  <span className={`text-xs font-black transition-colors ${theme === 'dark' ? 'text-cyan-400' : 'text-slate-900 dark:text-white'}`}>
                      (Premium Cyber Dark)
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 dark:text-slate-500 mt-0.5 transition-colors">ثيم ليلي مخصص لكبار صناع المحتوى والمحترفين</span>
                </div>
              </div>
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${theme === 'dark' ? 'border-cyan-400 bg-cyan-400 text-slate-950 text-[8px]' : 'border-slate-300 dark:border-slate-800'}`}>
                {theme === 'dark' && '✓'}
              </span>
            </div>

          </div>
        </div>

        <div className="flex flex-col gap-2.5 pt-2">
          <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 transition-colors">حواف وهندسة كتل الحاويات (Rounded Edges)</label>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'premium', label: 'كروت منحنية', desc: 'ستايل التكافؤ البصري للواجهات المعاصرة العريضة' },
              { id: 'classic', label: 'حواف حادة', desc: 'المظهر المعياري الثابت للمتصفحات القديمة' }
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => setRoundedStyle(opt.id)}
                className={`px-4 py-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                  roundedStyle === opt.id
                    ? 'bg-blue-50/50 dark:bg-slate-900 border-blue-200 dark:border-slate-800 text-blue-700 dark:text-white shadow-sm dark:shadow-md'
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-900/60 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                <div className="flex flex-col text-right">
                  <span className="text-xs font-black tracking-tight transition-colors">{opt.label}</span>
                  <span className={`text-[8px] font-bold mt-0.5 transition-colors ${roundedStyle === opt.id ? 'text-slate-500 dark:text-slate-400' : 'text-slate-400 dark:text-slate-500'}`}>{opt.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-end transition-colors">
        <button
          type="button"
          onClick={handleSaveThemePreferences}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black text-[11px] rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-500/20 border-none outline-none"
        >
          حفظ وتطبيق التفضيلات
        </button>
      </div>
    </div>
  )
}