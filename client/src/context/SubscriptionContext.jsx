import React, { createContext, useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthContext.jsx'
import { showToast } from '../App.jsx'

export const SubscriptionContext = createContext(null)

export const SubscriptionProvider = ({ children }) => {
  const { profile, setProfile } = useContext(AuthContext)
  const [plan, setPlan] = useState('free')
  const [status, setStatus] = useState('inactive')
  const [loadingAction, setLoadingAction] = useState(false)

  useEffect(() => {
    if (profile && profile.id) {
      const activePlan = (profile.plan || 'free').toLowerCase().trim()
      const activeStatus = (profile.subscription_status || 'inactive').toLowerCase().trim()
      
      setPlan(activePlan)
      setStatus(activeStatus)
      console.log(`📊 [Subscription Synced]: Tier [${activePlan}] | Status [${activeStatus}]`)
    } else {
      setPlan('free')
      setStatus('inactive')
    }
  }, [profile])

  const planFeatures = {
    free: { maxScriptsPerDay: 3, hasViralEngine: false, hasAdvancedHashtags: false },
    pro: { maxScriptsPerDay: 50, hasViralEngine: false, hasAdvancedHashtags: true },
    viral_engine: { maxScriptsPerDay: 999, hasViralEngine: true, hasAdvancedHashtags: true }
  }

  const isPremiumActive = status === 'active' || status === 'paid' || plan === 'pro' || plan === 'viral_engine'

  /**
   * ⚡ استدعاء مكافأة تسجيل الدخول اليومي عبر الباك إند
   */
  const claimDailyReward = async () => {
    if (!profile?.id) return
    setLoadingAction(true)
    try {
      const response = await fetch('/api/subscription/claim-daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      const result = await response.json()

      if (!response.ok) throw new Error(result.error || 'فشلت المزامنة')

      setProfile(prev => ({ ...prev, tokens: result.tokens, last_login_date: new Date().toISOString().split('T')[0] }))
      if (typeof showToast === 'function') {
        showToast(result.message || 'تم شحن حسابك بمكافأة تسجيل الدخول! ⚡', 'success')
      }
    } catch (err) {
      console.error('❌ [Daily Claim Error]:', err.message)
      if (typeof showToast === 'function') {
        showToast(err.message || 'عذراً، فشل تحديث رصيد المكافأة', 'error')
      }
    } finally {
      setLoadingAction(false)
    }
  }

  return (
    <SubscriptionContext.Provider value={{ 
      plan, 
      status, 
      isPremiumActive,
      features: planFeatures[plan] || planFeatures['free'],
      claimDailyReward,
      loadingAction
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}