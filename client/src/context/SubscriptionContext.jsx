import React, { createContext, useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthContext'
import { supabase } from '../config/supabase'
import { showToast } from '../App'

export const SubscriptionContext = createContext(null)

/**
 * TrendAura Subscription & Tokenomics Control Center (Enterprise Certified)
 */
export const SubscriptionProvider = ({ children }) => {
  const { profile, setProfile } = useContext(AuthContext)
  const [plan, setPlan] = useState('free')
  const [status, setStatus] = useState('inactive')

  useEffect(() => {
    if (profile) {
      const activePlan = (profile.plan || 'free').toLowerCase().trim()
      const activeStatus = (profile.subscription_status || 'inactive').toLowerCase().trim()
      
      setPlan(activePlan)
      setStatus(activeStatus)
      console.log(`📊 [Architect Subscription Synced]: Tier [${activePlan}] | Status [${activeStatus}]`)
    }
  }, [profile])

  // مصفوفة الصلاحيات الحقيقية للخطط التجارية لمنع التلاعب بالمميزات
  const planFeatures = {
    free: { maxScriptsPerDay: 3, hasViralEngine: false, hasAdvancedHashtags: false },
    pro: { maxScriptsPerDay: 50, hasViralEngine: false, hasAdvancedHashtags: true },
    viral_engine: { maxScriptsPerDay: 999, hasViralEngine: true, hasAdvancedHashtags: true }
  }

  const isPremiumActive = status === 'active' || status === 'paid' || plan === 'pro' || plan === 'viral_engine'

  // دالة مكافأة تسجيل الدخول اليومي
  const claimDailyReward = async () => {
    if (!profile?.id) return
    try {
      const currentTokens = profile.tokens ?? 0
      const updatedTokens = currentTokens + 2
      
      const { error } = await supabase
        .from('profiles')
        .update({ tokens: updatedTokens, last_login_date: new Date().toISOString().split('T')[0] })
        .eq('id', profile.id)

      if (error) throw error
      
      setProfile(prev => ({ ...prev, tokens: updatedTokens }))
      showToast('تم شحن حسابك بمكافأة تسجيل الدخول اليومي (+2 توكنز)! ⚡', 'success')
    } catch (err) {
      console.error('❌ [Daily Claim Error]:', err.message)
      showToast('عذراً، فشل تحديث رصيد المكافأة بالسيرفر', 'error')
    }
  }

  // دالة الشحن الميكروي الفوري المتوافقة مع Moyasar
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
      showToast(`تمت عملية السداد بنجاح، وشحن +${bundleAmount} توكنز لحسابك الحقيقي! 💳✨`, 'success')
    } catch (err) {
      console.error('❌ [Top-up Purchase Failure]:', err.message)
      showToast('حدث خطأ أثناء مزامنة الرصيد المالي المحدث', 'error')
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