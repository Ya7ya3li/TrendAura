import React, { useContext } from 'react'
import { ThemeContext } from '../../context/ThemeContext' // 🧬 استدعاء الشريان العالمي للمظهر والهندسة
import { showToast } from '../../App'

/**
 * TrendAura UI/UX Visual Preference Toggler - Global Theme & Geometry Edition
 * Unlocked and connected both theme colors and corner radiuses to the global context layer seamlessly.
 */
export default function ThemeSettings() {
  // ⚡ سحب الحالات والدوال العالمية للمظهر والأشكال الهندسية معاً من الـ Context
  const { theme, setTheme, roundedStyle, setRoundedStyle } = useContext(ThemeContext)

  const handleSaveThemePreferences = () => {
    const themeName = theme === 'dark' ? 'الداكن النيوني 🌌' : 'الفاتح الفاخر ☀️'
    const radiusName = roundedStyle === 'premium' ? 'الحواف الدائرية الفخمة (28px)' : 'الحواف الكلاسيكية (12px)'
    showToast(`تم حفظ تفضيلات ${themeName} وتطبيق هندسة ${radiusName} بنجاح! 🎨`, 'success')
  }

  return (
    <div className="space-y-6 text-right dir-rtl select-none animate-fade-in font-sans">
      <div>
        <h3 className="text-xs font-black text-slate-900 tracking-tight mb-1">مظهر وهندسة الواجهات</h3>
        <p className="text-[10px] font-bold text-slate-400">خصص البيئة البصرية ولوحة الألوان بما يتوافق مع راحة عينيك أثناء العمل.</p>
      </div>

      <div className="space-y-5">
        {/* أولاً: اختيار نمط المظهر العام - متصل ومحرر بالكامل */}
        <div className="flex flex-col gap-2.5">
          <label className="text-[10px] font-black text-slate-500">النمط اللوني الرئيسي</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
            
            {/* ☀️ كارت الثيم الفاتح الفاخر */}
            <div
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all active:scale-[0.99] ${
                theme === 'light'
                  ? 'bg-blue-50/50 border-blue-500 shadow-sm shadow-blue-50 text-slate-900'
                  : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">☀️</span>
                <div className="flex flex-col">
                  <span className={`text-xs font-black ${theme === 'light' ? 'text-blue-600' : 'text-slate-800'}`}>
                    فاتح فاخر (Premium Light)
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 mt-0.5">مطابق لهوية أنظمة الذكاء الاصطناعي القياسية</span>
                </div>
              </div>
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${theme === 'light' ? 'border-blue-600 bg-blue-600 text-white text-[8px]' : 'border-slate-200'}`}>
                {theme === 'light' && '✓'}
              </span>
            </div>

            {/* 🌙 كارت الثيم الداكن النيوني */}
            <div
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all active:scale-[0.99] ${
                theme === 'dark'
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/20'
                  : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">🌙</span>
                <div className="flex flex-col">
                  <span className={`text-xs font-black ${theme === 'dark' ? 'text-cyan-400' : 'text-slate-800'}`}>
                    داكن نيون (Premium Cyber Dark)
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 mt-0.5">ثيم ليلي مخصص لكبار المسوقين والمحترفين</span>
                </div>
              </div>
              <span className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${theme === 'dark' ? 'border-cyan-400 bg-cyan-400 text-slate-900 text-[8px]' : 'border-slate-200'}`}>
                {theme === 'dark' && '✓'}
              </span>
            </div>

          </div>
        </div>

        {/* ثانياً: تفضيل الحواف هندسياً - متصل الآن بالـ Context العالمي لحظياً */}
        <div className="flex flex-col gap-2.5 pt-2">
          <label className="text-[10px] font-black text-slate-500">حواف وهندسة الحاويات (Rounded Edges)</label>
          <div className="flex flex-wrap gap-3">
            {[
              { id: 'premium', label: 'كروت دائرية فخمة (28px)', desc: 'ستايل التكافؤ البصري للواجهات المعاصرة' },
              { id: 'classic', label: 'حواف حادة كلاسيك (12px)', desc: 'المظهر القياسي للمتصفحات القديمة' }
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => setRoundedStyle(opt.id)}
                className={`px-4 py-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all ${
                  roundedStyle === opt.id
                    ? 'bg-slate-900 border-slate-900 text-white shadow-md'
                    : 'bg-white border-slate-200/70 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-xs font-black tracking-tight">{opt.label}</span>
                  <span className={`text-[8px] font-bold mt-0.5 ${roundedStyle === opt.id ? 'text-slate-400' : 'text-slate-300'}`}>{opt.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* زر الحفظ المركزي والمحدث لقراءة الحالة ديناميكياً */}
      <div className="pt-4 border-t border-slate-50 flex justify-end">
        <button
          type="button"
          onClick={handleSaveThemePreferences}
          className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-[11px] rounded-xl transition-all active:scale-95 shadow-md shadow-slate-200"
        >
          حفظ وتطبيق المظهر 🎨
        </button>
      </div>
    </div>
  )
}