import React, { createContext, useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthContext.jsx'
import { supabase } from '../config/supabase.js'
import { showToast } from '../App.jsx'

export const SubscriptionContext = createContext(null)

export const SubscriptionProvider = ({ children }) => {
  const { profile, setProfile } = useContext(AuthContext)
  const [plan, setPlan] = useState('free')
  const [status, setStatus] = useState('inactive')

  useEffect(() => {
    // 🛡️ صمام الأمان تصفير الولاية فوراً عند خروج العميل لحماية التوكنات
    if (profile && profile.id) {
      const activePlan = (profile.plan || 'free').toLowerCase().trim()
      const activeStatus = (profile.subscription_status || 'inactive').toLowerCase().trim()
      
      setPlan(activePlan)
      setStatus(activeStatus)
      console.log(`📊 [Architect Subscription Synced]: Tier [${activePlan}] | Status [${activeStatus}]`)
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

  const claimDailyReward = async () => {
    if (!profile?.id) return
    try {
      const currentTokens = profile.tokens ?? 0
      const updatedTokens = currentTokens + 2
      
      const { error } = await supabase
        .from('profiles')
        .update({ 
          tokens: updatedTokens, 
          last_login_date: new Date().toISOString().split('T')[0] 
        })
        .eq('id', profile.id)

      if (error) throw error
      
      setProfile(prev => ({ ...prev, tokens: updatedTokens }))
      if (typeof showToast === 'function') {
        showToast('تم شحن حسابك بمكافأة تسجيل الدخول اليومي (+2 توكنز)! ⚡', 'success')
      }
    } catch (err) {
      console.error('❌ [Daily Claim Error]:', err.message)
      if (typeof showToast === 'function') {
        showToast('عذراً، فشل تحديث رصيد المكافأة', 'error')
      }
    }
  }

  const buyTopUpBundle = async (bundleAmount) => {
    if (!profile?.id) return
    try {
      const currentTokens = profile.tokens ?? 0
      const updatedTokens = currentTokens + bundleAmount
      
      const { error } = await supabase
        .from('profiles')
        .update({ tokens: updatedTokens })
        .eq('id', profile.id)

      if (error) throw error
      
      setProfile(prev => ({ ...prev, tokens: updatedTokens }))
      if (typeof showToast === 'function') {
        showToast(`تمت عملية السداد بنجاح، وشحن +${bundleAmount} توكنز لحسابك الحقيقي! 💳✨`, 'success')
      }
    } catch (err) {
      console.error('❌ [Top-up Purchase Failure]:', err.message)
      if (typeof showToast === 'function') {
        showToast('حدث خطأ أثناء مزامنة الرصيد المالي المحدث', 'error')
      }
    }
  }

  return (
    <SubscriptionContext.Provider value={{ 
      plan, 
      status, 
      isPremiumActive,
      features: planFeatures[plan] || planFeatures['free'],
      claimDailyReward,   
      buyTopUpBundle      
    }}>
      {children}
    </SubscriptionContext.Provider>
  )
}