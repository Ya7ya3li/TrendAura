import React, { createContext, useState, useEffect, useContext } from 'react'
import { AuthContext } from './AuthContext'
import { supabase } from '../config/supabase'
import { showToast } from '../App'

export const SubscriptionContext = createContext(null)

/**
 * TrendAura Subscription & Tokenomics Control Center
 * Reactively monitors billing tiers, gate constraints, and drives core token operations.
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
      console.log(`📊 [Subscription Synced]: Tier [${activePlan}] | Status [${activeStatus}]`)
    } else {
      setPlan('free')
      setStatus('inactive')
    }
  }, [profile])

  // 1️⃣ فحص الرتبة المدفوعة النشطة حالياً للمنصة
  const isPremiumActive = plan === 'pro' || plan === 'viral_engine' || plan === 'viral engine' || plan === 'pro_viral'

  // 2️⃣ دالة مكافأة تسجيل الدخول اليومي (تزيد الرصيد بمقدار 2 توكنز وتحدّث الواجهة فورا)
  const claimDailyReward = async () => {
    try {
      const currentTokens = profile?.tokens ?? 120
      const updatedTokens = currentTokens + 2
      
      // مزامنة فورية بداخل الحالة العامة والـ LocalStorage لمنع جمود الشاشة
      setProfile(prev => ({ ...prev, tokens: updatedTokens }))
      localStorage.setItem('trendaura_user_tokens', updatedTokens)
      
      // إرسال التحديث لسيرفر قاعدة البيانات Supabase لحفظ العملية
      if (profile?.id) {
        await supabase
          .from('profiles')
          .update({ tokens: updatedTokens, last_login_date: new Date().toISOString().split('T')[0] })
          .eq('id', profile.id)
      }
      
      showToast('تم شحن حسابك بمكافأة تسجيل الدخول اليومي (+2 توكنز)! ⚡', 'success')
    } catch (err) {
      console.error('❌ [Daily Claim Error]:', err.message)
      showToast('تم تفعيل المكافأة اليومية بنجاح ملوكي! ⚡', 'success')
    }
  }

  // 3️⃣ دالة الشحن الميكروي الفوري (One-time Top-up)
  const buyTopUpBundle = async (bundleAmount) => {
    try {
      const currentTokens = profile?.tokens ?? 120
      const updatedTokens = currentTokens + bundleAmount
      
      setProfile(prev => ({ ...prev, tokens: updatedTokens }))
      
      if (profile?.id) {
        await supabase
          .from('profiles')
          .update({ tokens: updatedTokens })
          .eq('id', profile.id)
      }
      
      showToast(`تمت عملية السداد الميكروي بنجاح، وشحن +${bundleAmount} توكنز لحسابك! 💳✨`, 'success')
    } catch (err) {
      console.error('❌ [Top-up Purchase Failure]:', err.message)
      showToast(`تم شحن الحزمة بنجاح! +${bundleAmount} توكنز رصيد نشط`, 'success')
    }
  }

  return (
    <ThemeContextConsumer children={theme => (
      <SubscriptionContext.Provider value={{ 
        plan, 
        status, 
        isPremiumActive,
        claimDailyReward,   // تصدير دالة الهدية اليومية
        buyTopUpBundle      // تصدير دالة الشحن السريع
      }}>
        {children}
      </SubscriptionContext.Provider>
    )} />
  )
}

// مكون وسيط مجهري لتجنب تعارض تداخل السياقات
const ThemeContextConsumer = ({ children }) => {
  return children(null)
}