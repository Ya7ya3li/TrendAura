import React from 'react'

/**
 * TrendAura Premium UI Custom Input Field - Dual Theme
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
    <div className={`flex flex-col gap-2 w-full text-right dir-rtl font-sans transition-colors ${className}`}>
      {label && (
        <label className="text-[10px] font-black text-slate-600 dark:text-slate-400 select-none transition-colors">
          {label} {required && <span className="text-rose-500 font-sans">*</span>}
        </label>
      )}
      
      <div className="relative w-full">
        {/* حقن الأيقونة برمجياً كعنصر SVG عائم */}
        {icon && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-4 h-4 flex items-center justify-center select-none pointer-events-none z-10 transition-colors">
            {icon}
          </span>
        )}
        
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          className={`w-full bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-200 py-3 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
            icon ? 'pr-11 pl-4' : 'px-4'
          }`}
        />
      </div>
    </div>
  )
}