import { useNavigate } from 'react-router-dom'
import { getPlanTier } from '../utils/plans' // 🟢 استدعاء مسمى صحيح بالأقواس الحاصرة

export default function FeatureGuard({ currentPlan, minRequiredPlan, featureName, children }) {
  const navigate = useNavigate()

  const userTier = getPlanTier(currentPlan)
  const requiredTier = getPlanTier(minRequiredPlan)

  if (userTier >= requiredTier) {
    return <>{children}</>
  }

  return (
    <div style={{
      width: '100%',
      backgroundColor: '#1e293b',
      borderRadius: '20px',
      border: '1px dashed rgba(168, 85, 247, 0.3)',
      padding: '40px 20px',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      <div style={{
        position: 'absolute',
        width: '150px',
        height: '150px',
        background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      <div style={{ fontSize: '3rem', zIndex: 2 }}>🔒</div>
      <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', fontWeight: 'bold', margin: 0, zIndex: 2 }}>
        ميزة {featureName} مقفلة
      </h3>
      <p style={{ color: '#94a3b8', fontSize: '0.92rem', margin: 0, maxWidth: '380px', lineHeight: '1.6', zIndex: 2 }}>
        هذه الأدوات الحصرية متاحة فقط لمشتركي باقة{' '}
        <span style={{ 
          background: minRequiredPlan === 'viral_engine' ? 'linear-gradient(135deg, #ff4b2b, #ff416c)' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold'
        }}>
          {minRequiredPlan === 'viral_engine' ? 'Viral Engine ⚡' : 'Pro ✨'}
        </span>{' '}
        وما فوق.
      </p>

      <button
        onClick={() => navigate('/pricing')}
        style={{
          marginTop: '10px',
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          color: '#fff',
          padding: '12px 28px',
          borderRadius: '12px',
          border: 'none',
          fontWeight: 'bold',
          fontSize: '0.95rem',
          cursor: 'pointer',
          boxShadow: '0 0 15px rgba(168, 85, 247, 0.3)',
          transition: 'all 0.2s ease',
          zIndex: 2
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
      >
        ترقية الاشتراك الآن 💎
      </button>
    </div>
  )
}