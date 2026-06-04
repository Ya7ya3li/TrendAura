import React, { createContext, useState } from 'react'

export const AppContext = createContext(null)

export const AppProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [globalLoading, setGlobalLoading] = useState(false)
  const [activeDashboardSection, setActiveDashboardSection] = useState('generator')

  const toggleSidebar = () => setSidebarOpen(prev => !prev)

  return (
    <AppContext.Provider value={{
      sidebarOpen,
      setSidebarOpen,
      toggleSidebar,
      globalLoading,
      setGlobalLoading,
      activeDashboardSection,
      setActiveDashboardSection
    }}>
      {children}
    </AppContext.Provider>
  )
}