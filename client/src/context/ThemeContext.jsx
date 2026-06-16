import React, { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // 1. قراءة التفضيل المحفوظ
    const savedTheme = localStorage.getItem('trendaura-theme')
    if (savedTheme) return savedTheme
    
    // 2. إذا كان مستخدم جديد، اقرأ ثيم جهازه تلقائياً
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    
    return 'dark' // القيمة الاحتياطية الأخيرة
  })

  const [roundedStyle, setRoundedStyle] = useState(() => {
    return localStorage.getItem('trendaura-rounded-style') || 'premium'
  })

  useEffect(() => {
    const root = window.document.documentElement
    
    // تنظيف مباشر وأنيق يعتمد على الـ CSS فقط
    if (theme === 'dark') {
      root.classList.remove('light')
      root.classList.add('dark')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
      root.style.colorScheme = 'light'
    }
    
    localStorage.setItem('trendaura-theme', theme)
  }, [theme])

  useEffect(() => {
    const root = window.document.documentElement
    if (roundedStyle === 'premium') {
      root.classList.remove('radius-classic')
      root.classList.add('radius-premium')
    } else {
      root.classList.remove('radius-premium')
      root.classList.add('radius-classic')
    }
    localStorage.setItem('trendaura-rounded-style', roundedStyle)
  }, [roundedStyle])

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      isDark: theme === 'dark',
      roundedStyle,      
      setRoundedStyle    
    }}>
      {children}
    </ThemeContext.Provider>
  )
}