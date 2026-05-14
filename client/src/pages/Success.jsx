import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../config/supabase'

export default function Success() {
  const navigate = useNavigate()

  useEffect(() => {
    upgradePlan()
  }, [])

  const upgradePlan = async () => {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id

    if (userId) {
      await supabase
        .from('profiles')
        .update({ plan: 'pro' })
        .eq('id', userId)
    }

    setTimeout(() => navigate('/'), 4000)
  }

  return (
    <div className="login-page">
      <div className="login-card" style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🎉</div>
        <h1 style={{ color: '#10b981', marginBottom: '16px' }}>
          تم الاشتراك بنجاح!
        </h1>
        <p style={{ color: '#64748b' }}>
          أهلاً بك في TrendAura Pro — سيتم تحويلك للرئيسية
        </p>
      </div>
    </div>
  )
}