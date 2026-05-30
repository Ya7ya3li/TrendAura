import React, { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext(null)

/**
 * TrendAura Aesthetic Theme & Geometry Manager - Unlocked Dual Engine
 * Global context manager controlling color themes and container corner radiuses seamlessly.
 */
export const ThemeProvider = ({ children }) => {
  // 1️⃣ محرك المظهر اللوني النشط (light / dark)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('trendaura-theme') || 'dark'
  })

  // 2️⃣ محرك هندسة وحواف الحاويات العالمي (premium / classic)
  const [roundedStyle, setRoundedStyle] = useState(() => {
    return localStorage.getItem('trendaura-rounded-style') || 'premium'
  })

  // مراقبة وحقن مغيرات الألوان في جذر المتصفح
  useEffect(() => {
    const root = window.document.documentElement
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

  // 📐 مراقبة وحقن الكلاسات الهندسية للحواف بداخل جذر المتصفح لحظياً
  useEffect(() => {
    const root = window.document.documentElement
    if (roundedStyle === 'premium') {
      root.classList.remove('radius-classic')
      root.classList.add('radius-premium') // حقن كلاس الحواف الدائرية الفخمة 28px
    } else {
      root.classList.remove('radius-premium')
      root.classList.add('radius-classic') // حقن كلاس الحواف الحادة الكلاسيكية 12px
    }
    localStorage.setItem('trendaura-rounded-style', roundedStyle)
  }, [roundedStyle])

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      setTheme, 
      isDark: theme === 'dark',
      roundedStyle,       // تصدير حالة الحواف للخارج
      setRoundedStyle     // تصدير دالة التحكم بالحواف للخارج
    }}>
      {children}
    </ThemeContext.Provider>
  )
}