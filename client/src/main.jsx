import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'
// 1️⃣ استيراد موفر خدمة جوجل للـ Auth
import { GoogleOAuthProvider } from '@react-oauth/google'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 2️⃣ تغليف التطبيق بالكامل بالـ Client ID الخاص بـ TrendAura */}
    <GoogleOAuthProvider clientId="319881034898-468o83emu41afpkc2c5pk7cst3csrdsr.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
)