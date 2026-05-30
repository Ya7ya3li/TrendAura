import React, { createContext, useState } from 'react'

export const AppContext = createContext(null)

/**
 * TrendAura Application UI Sync Context Provider
 * Manages operational transient viewport parameters (Drawers, Global Modals, Toast Queues).
 */
export const AppProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [globalLoading, setGlobalLoading] = useState(false)
  const [activeDashboardSection, setActiveDashboardSection] = useState('generator') // generator | analytical-suite

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