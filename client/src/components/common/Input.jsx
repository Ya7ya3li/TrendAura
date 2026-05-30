import React from 'react'

/**
 * TrendAura Premium UI Custom Input Field
 * Resolves Vite's import analysis missing dependency issue.
 */
export default function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  icon,
  disabled = false,
  readOnly = false,
  required = false,
  className = ''
}) {
  return (
    <div className={`flex flex-col gap-2 w-full text-right dir-rtl font-sans ${className}`}>
      {/* عرض عنوان الحقل العلوي إذا تم تمريره */}
      {label && (
        <label className="text-[10px] font-black text-slate-500 select-none">
          {label} {required && <span className="text-rose-500">*</span>}
        </label>
      )}
      
      <div className="relative w-full">
        {/* حقن الأيقونة التعبيرية بشكل عائم داخل الحقل من اليمين */}
        {icon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs select-none pointer-events-none">
            {icon}
          </span>
        )}
        
        {/* عنصر الإدخال الرئيسي المصقول هندسياً */}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={`w-full bg-slate-50 text-slate-800 py-3 rounded-xl border border-slate-200/60 text-xs font-bold outline-none focus:bg-white focus:border-blue-500 transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
            icon ? 'pr-10 pl-4' : 'px-4'
          }`}
        />
      </div>
    </div>
  )
}