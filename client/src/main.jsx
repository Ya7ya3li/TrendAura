import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 🎨 استيراد شريان الستايلات والمظهر العام والـ Tailwind للمنصة ككل
import './styles/globals.css'

/**
 * TrendAura Production Environment Entry Point
 * Mounts the core architectural React tree directly into the browser root container node.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* ضخ المنظومة المركزية للمسارات والسياقات */}
    <App />
  </React.StrictMode>,
)