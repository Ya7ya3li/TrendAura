import { supabase } from '../config/supabase'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { generateScript, fetchTrends, fetchHashtags } from '../services/api'
import { showToast } from '../App'
import { plans } from '../utils/plans' // 🟢 استدعاء مسمى صحيح بالأقواس الحاصرة
import FeatureGuard from '../components/FeatureGuard' // 🟢 استدعاء صحيح لحارس الميزات

export default function Dashboard() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState('')
  const [hook, setHook] = useState('')
  const [loadingTrends, setLoadingTrends] = useState(false)
  const maxChars = 200

  const [currentUser, setCurrentUser] = useState(null)
  const [userPlan, setUserPlan] = useState('free')

  const [trends, setTrends] = useState([
    'الحرب الاقتصادية العالمية',
    'أسرار الذكاء الصناعي',
    'نظرية نهاية الإنترنت',
    'ما يحدث خلف الكواليس',
    'أقوى الأحداث السياسية',
    'الترندات الغامضة',
  ])

  const [hashtags, setHashtags] = useState([
    '#ترند', '#اكسبلور', '#السعودية',
    '#تيك_توك', '#viral', '#fyp', '#trend', '#اخبار'
  ])

  const postTimes = [
    { time: '9:00 PM', power: '98%', color: '#10b981' },
    { time: '6:00 PM', power: '92%', color: '#f59e0b' },
    { time: '12:00 AM', power: '88%', color: '#8b5cf6' },
  ]

  useEffect(() => {
    initUserAndData()
  }, [])

  const initUserAndData = async () => {
    const { data: authData } = await supabase.auth.getUser()
    let currentPlan = 'free'
    let userId = null

    if (authData?.user) {
      setCurrentUser(authData.user)
      userId = authData.user.id
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', authData.user.id)
        .maybeSingle()
        
      currentPlan = profileData?.plan?.toLowerCase()?.trim() || 'free'
      setUserPlan(currentPlan)
    }

    loadTrends(null, userId, currentPlan)
    loadHashtags(null, userId, currentPlan)
  }

  const loadTrends = async (topic = null, uId = currentUser?.id, plan = userPlan) => {
    setLoadingTrends(true)
    const data = await fetchTrends(topic, uId, plan)
    if (data && data.length > 0) setTrends(data)
    setLoadingTrends(false)
  }

  const loadHashtags = async (topic = null, uId = currentUser?.id, plan = userPlan) => {
    const data = await fetchHashtags(topic, uId, plan)
    if (data && data.length > 0) setHashtags(data)
  }

  const refreshTrends = async () => {
    setLoadingTrends(true)
    await loadTrends(prompt, currentUser?.id, userPlan)
    await loadHashtags(prompt, currentUser?.id, userPlan)
    setLoadingTrends(false)
  }

  const generate = async () => {
    if (!prompt) return

    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user) {
      showToast('سجّل دخول أولاً لتولّد السكربتات', 'warning')
      setTimeout(() => { window.location.href = '/login' }, 1500)
      return
    }

    setLoading(true)
    const userId = authData.user.id

    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    const currentPlan = profileData?.plan?.toLowerCase()?.trim() || 'free'
    setUserPlan(currentPlan)
    
    const planConfig = plans.find(p => 
      p.id === currentPlan || 
      (currentPlan === 'pro_viral' && p.id === 'viral_engine') ||
      (currentPlan === 'viral engine' && p.id === 'viral_engine')
    ) || plans[0]

    const isPaidPlan = planConfig.tier > 1

    if (planConfig.id === 'free') {
      const now = new Date()
      const resetDate = profileData?.count_reset_date ? new Date(profileData.count_reset_date) : now

      if (now.getMonth() !== resetDate.getMonth() || now.getFullYear() !== resetDate.getFullYear()) {
        await supabase
          .from('profiles')
          .update({ monthly_count: 0, count_reset_date: now.toISOString() })
          .eq('id', userId)
        profileData.monthly_count = 0
      }

      const currentCount = profileData?.monthly_count || 0

      if (currentCount >= planConfig.maxGenerations) {
        setLoading(false)
        showToast('وصلت للحد المجاني — اشترك للحصول على وصول لامحدود', 'warning')
        setTimeout(() => { window.location.href = '/pricing' }, 2000)
        return
      }

      await supabase.from('profiles').update({ monthly_count: currentCount + 1 }).eq('id', userId)
    }

    let premiumAIInstructions = ''
    if (planConfig.viralMode) {
      premiumAIInstructions = `
- تفعيل محرك الفايرال الخارق (Viral Engine Activated) 🚀
- اجعل الهوك هجومي، غامض ومثير جداً للجدل في أول 3 ثواني لمنع التمرير مطلقاً.
- هندس تباعد أسطر النص لرفع معدلات الاحتفاظ والـ Retention لأعلى مستوى.
- صغ السيناريو بأسلوب ترندي متفجر مخصص للانتشار المليوني السريع.
- أضف حبكة غير متوقعة في المنتصف لجلب آلاف التعليقات التفاعلية.
`
    } else if (planConfig.id === 'pro') {
      premiumAIInstructions = `
- Rx استخدام Hooks احترافية وعناوين جذابة تشد انتباه المشاهدين بسرعة.
- ركز على تحسين الجودة اللغوية للسيناريو ليكون جذاب وسلس ومقنع للنشر.
`
    } else {
      premiumAIInstructions = `
- صياغة أفكار وسيناريوهات أساسية ومبسطة ومناسبة للمبتدئين.
`
    }

    const formattedPrompt = `
اصنع سكربت تيك توك احترافي جداً باللهجة العربية.

الموضوع:
${prompt}

الشروط الأساسية والاحترافية المفعّلة للحساب:
${premiumAIInstructions}
- بداية صادمة
- سكربت طويل نسبيًا
- لا تختصر التفاصيل
- استخدم أسلوب سرد احترافي
- خلي النص تصاعدي ويزيد الحماس
- أضف حقائق أو تفاصيل مثيرة
- اجعل المشاهد يكمل للنهاية
- النهاية تكون قوية أو صادمة
- اجعل السكربت بطول 250 إلى 400 كلمة
- مناسب لفيديو 60 ثانية
- لا تستخدم Markdown
- لا تستخدم نجوم أو رموز

اكتب الرد بهذا الشكل فقط:

HOOK:
...

SCRIPT:
...
`

    const result = await generateScript(formattedPrompt, userId, currentPlan)

    const hookMatch = result.match(/HOOK:(.*?)(SCRIPT:|$)/s)
    const scriptMatch = result.match(/SCRIPT:(.*)/s)

    const hookText = hookMatch ? hookMatch[1].replace(/\*/g, '').trim() : ''
    const scriptText = scriptMatch ? scriptMatch[1].replace(/\*/g, '').trim() : result

    setHook(hookText)
    setScript(scriptText)

    if (isPaidPlan) {
      await supabase.from('history').insert([{
        prompt,
        hook: hookText,
        script: scriptText,
        user_id: userId
      }])
    }

    const newTrends = await fetchTrends(prompt, userId, currentPlan)
    if (newTrends && newTrends.length > 0) setTrends(newTrends)
    
    const newTags = await fetchHashtags(prompt, userId, currentPlan)
    if (newTags && newTags.length > 0) setHashtags(newTags)

    setLoading(false)
    showToast('تم توليد السكريبت ✨', 'success')
  }

  const copyScript = () => {
    navigator.clipboard.writeText(hook + '\n\n' + script)
    showToast('تم نسخ السكريبت', 'success')
  }

  const exportPDF = () => {
    if (!hook && !script) {
      showToast('ولّد سكريبت أولاً', 'warning')
      return
    }

    const content = `
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; color: #0f172a; line-height: 2; direction: rtl; }
          h1 { color: #7c3aed; font-size: 28px; margin-bottom: 10px; }
          .label { background: #7c3aed; color: white; padding: 6px 16px; border-radius: 999px; font-size: 14px; font-weight: bold; display: inline-block; margin-bottom: 12px; margin-top: 24px; }
          .box { background: #f8fafc; border-right: 4px solid #7c3aed; padding: 20px; border-radius: 12px; font-size: 16px; white-space: pre-line; }
          .topic { color: #64748b; font-size: 16px; margin-bottom: 30px; }
          .footer { margin-top: 40px; color: #94a3b8; font-size: 13px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
        </style>
      </head>
      <body>
        <h1>TrendAura</h1>
        <p class="topic">📌 الموضوع: ${prompt}</p>
        <div class="label">🎯 الهوك</div>
        <div class="box">${hook}</div>
        <div class="label">📝 السكريبت</div>
        <div class="box">${script}</div>
        <div class="footer">تم التوليد بواسطة TrendAura — ${new Date().toLocaleDateString('ar-SA')}</div>
      </body>
      </html>
    `

    const win = window.open('', '_blank')
    win.document.write(content)
    win.document.close()
    win.print()
  }

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">

        {/* ===== HERO SECTION ===== */}
        <div className="new-hero">
          <div className="new-hero-header">
            <div className="new-hero-badge">
              <span>✦</span> صناعة المحتوى بالذكاء الاصطناعي
            </div>
            <div className="new-hero-logo">
              <div className="new-hero-logo-icon">
                <svg viewBox="0 0 60 60" width="80" height="80">
                  <defs>
                    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6"/>
                      <stop offset="100%" stopColor="#06b6d4"/>
                    </linearGradient>
                  </defs>
                  <polygon points="30,5 55,50 5,50" fill="url(#logoGrad)" opacity="0.9"/>
                  <polygon points="30,15 50,50 10,50" fill="url(#logoGrad)" opacity="0.5"/>
                </svg>
              </div>
              <div className="new-hero-logo-text">
                <span className="logo-trend">Trend</span>
                <span className="logo-aura">Aura</span>
              </div>
            </div>
          </div>

          <div className="new-hero-title">
            <h1>اكتب فكرة المحتوى</h1>
            <p>حول فكرتك إلى سكربت احترافي <span className="highlight-text">جاهز للنشر</span> ويجذب المشاهدات</p>
          </div>

          <div className="new-hero-input-box">
            <div className="new-hero-input-header">
              <span>أدخل فكرتك هنا</span>
              <span className="input-edit-icon">✏️</span>
            </div>
            <textarea
              className="new-hero-textarea"
              placeholder="مثال: حلل آخر الأحداث السياسية بطريقة فكاهية أو اصنع قصة مرعبة قصيرة..."
              value={prompt}
              onChange={(e) => {
                if (e.target.value.length <= maxChars) setPrompt(e.target.value)
              }}
              rows={4}
            />
            <div className="new-hero-input-footer">
              <span className={`char-count ${prompt.length >= maxChars ? 'limit' : ''}`}>
                {prompt.length}/{maxChars}
              </span>
              <span className="magic-icon">✨</span>
            </div>
          </div>

          <div className="new-hero-features">
            <div className="hero-feature"><span>✓</span> جاهز للنشر</div>
            <div className="hero-feature"><span>🚀</span> مصمم للانتشار</div>
            <div className="hero-feature"><span>📄</span> سكربت جذاب</div>
          </div>

          <button className="new-generate-btn" onClick={generate} disabled={loading || !prompt}>
            <div className="new-generate-btn-icon">⚡</div>
            <span>{loading ? 'جاري التوليد...' : '✨ توليد السكريت الآن'}</span>
            {loading && <span className="spinner" />}
          </button>

          <div className="new-hero-footer">
            تم تطويره لأصحاب المحتوى
            <span>• ذكي ❤️</span>
            <span>• سريع ⚡</span>
            <span>• أمن 🛡️</span>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="glass-card">
            <h3>📝 السكريبت المقترح</h3>
            {hook || script ? (
              <div className="script-box">
                <div className="script-section">
                  <span className="script-label">الهوك</span>
                  <p>{hook}</p>
                </div>
                <div className="script-section">
                  <span className="script-label">السكريبت</span>
                  <p>{script}</p>
                </div>
                <button className="copy-btn" onClick={copyScript}>📋 نسخ السكريبت</button>
                
                <FeatureGuard currentPlan={userPlan} minRequiredPlan="pro" featureName="تصدير السكريبتات كـ PDF">
                  <button className="export-btn" onClick={exportPDF} style={{ marginTop: '8px' }}>📄 تصدير PDF</button>
                </FeatureGuard>
              </div>
            ) : (
              <p className="empty-state">اكتب فكرة واضغط توليد لتظهر هنا</p>
            )}
          </div>

          <div className="glass-card">
            <div className="card-header">
              <h3>🔥 أفكار ترند</h3>
              <button className="refresh-btn" onClick={refreshTrends} disabled={loadingTrends}>
                {loadingTrends ? '⏳' : '🔄'}
              </button>
            </div>
            {loadingTrends ? (
              <div className="loading-trends"><span className="spinner" /> جاري تحديث الترندات...</div>
            ) : (
              trends.map((item, index) => (
                <div className="trend-item" key={index}>
                  <span className="trend-num">{index + 1}</span>
                  <p>{item}</p>
                </div>
              ))
            )}
          </div>

          <div className="glass-card">
            <h3>⏰ أفضل أوقات النشر</h3>
            {postTimes.map((item, index) => (
              <div className="time-item" key={index}>
                <div className="time-left">
                  <span className="time-dot" style={{ background: item.color }} />
                  <span className="time-val">{item.time}</span>
                </div>
                <span className="time-power" style={{ color: item.color }}>{item.power}</span>
              </div>
            ))}
          </div>

          <div className="glass-card">
            <div className="card-header">
              <h3>🏷️ هاشتاقات ترند</h3>
              <button className="refresh-btn" onClick={refreshTrends} disabled={loadingTrends}>
                {loadingTrends ? '⏳' : '🔄'}
              </button>
            </div>
            <div className="tags">
              {hashtags.map((tag, index) => (
                <span className="tag" key={index}>{tag}</span>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <FeatureGuard currentPlan={userPlan} minRequiredPlan="viral_engine" featureName="محرك أفكار وتحليل الـ Viral">
              <div>
                <h3 style={{ color: '#f8fafc', margin: '0 0 10px 0' }}>🚀 أدوات الـ Viral Engine النشطة</h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '0 0 15px 0' }}>المحرك جاري تحليله المتقدم للهوكس الآن لرفع نسب البقاء والاحتفاظ (Retention).</p>
                <button className="new-generate-btn" style={{ padding: '10px 16px', fontSize: '0.9rem' }}>
                  🔥 فحص احتمالية صعود المقطع للتريند
                </button>
              </div>
            </FeatureGuard>
          </div>

        </div>
      </main>
    </div>
  )
}