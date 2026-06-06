import React, { createContext, useState, useEffect } from 'react'

export const ThemeContext = createContext(null)

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('trendaura-theme') || 'dark'
  })

  const [roundedStyle, setRoundedStyle] = useState(() => {
    return localStorage.getItem('trendaura-rounded-style') || 'premium'
  })

  useEffect(() => {
    const root = window.document.documentElement
    if (theme === 'dark') {
      root.classList.remove('light')
      root.classList.add('dark')
      root.style.setProperty('--bg-main', '#020617')
      root.style.setProperty('--text-main', '#f8fafc')
      root.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      root.classList.add('light')
      root.style.setProperty('--bg-main', '#f8fafc')
      root.style.setProperty('--text-main', '#0f172a')
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