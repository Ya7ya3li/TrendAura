import { supabase } from '../config/supabase'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { generateScript, fetchTrends, fetchHashtags } from '../services/api'

export default function Dashboard() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [script, setScript] = useState('')
  const [hook, setHook] = useState('')
  const [loadingTrends, setLoadingTrends] = useState(false)

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
    loadTrends()
    loadHashtags()
  }, [])

  const loadTrends = async () => {
    setLoadingTrends(true)
    const data = await fetchTrends()
    if (data.length > 0) setTrends(data)
    setLoadingTrends(false)
  }

  const loadHashtags = async () => {
    const data = await fetchHashtags()
    if (data.length > 0) setHashtags(data)
  }

  const refreshTrends = async () => {
    setLoadingTrends(true)
    const data = await fetchTrends(prompt)
    if (data.length > 0) setTrends(data)
    const tags = await fetchHashtags(prompt)
    if (tags.length > 0) setHashtags(tags)
    setLoadingTrends(false)
  }

  const generate = async () => {
    if (!prompt) return

    // تحقق من تسجيل الدخول
    const { data: authData } = await supabase.auth.getUser()
    if (!authData?.user) {
      alert('🔒 لازم تسجل دخول أولاً عشان تولّد سكربتات')
      window.location.href = '/login'
      return
    }

    setLoading(true)
    const userId = authData.user.id

    // تحقق من الخطة والعداد
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    const isPro = profileData?.plan?.toUpperCase() === 'PRO'

    if (!isPro) {
      const now = new Date()
      const resetDate = profileData?.count_reset_date
        ? new Date(profileData.count_reset_date)
        : now

      if (
        now.getMonth() !== resetDate.getMonth() ||
        now.getFullYear() !== resetDate.getFullYear()
      ) {
        await supabase
          .from('profiles')
          .update({ monthly_count: 0, count_reset_date: now.toISOString() })
          .eq('id', userId)
        profileData.monthly_count = 0
      }

      const currentCount = profileData?.monthly_count || 0

      if (currentCount >= 5) {
        setLoading(false)
        alert('⚠️ وصلت للحد المجاني (5 سكربتات شهرياً)\n\nاشترك في PRO للحصول على سكربتات غير محدودة 🚀')
        window.location.href = '/pricing'
        return
      }

      await supabase
        .from('profiles')
        .update({ monthly_count: currentCount + 1 })
        .eq('id', userId)
    }

    const result = await generateScript(
`
اصنع سكربت تيك توك احترافي جداً باللهجة العربية.

الموضوع:
${prompt}

الشروط:

- هوك ناري قصير جداً
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
    )

    const hookMatch = result.match(/HOOK:(.*?)(SCRIPT:|$)/s)
    const scriptMatch = result.match(/SCRIPT:(.*)/s)

    const hookText = hookMatch ? hookMatch[1].replace(/\*/g, '').trim() : ''
    const scriptText = scriptMatch ? scriptMatch[1].replace(/\*/g, '').trim() : result

    setHook(hookText)
    setScript(scriptText)

    await supabase.from('history').insert([{
      prompt,
      hook: hookText,
      script: scriptText,
      user_id: userId
    }])

    const newTrends = await fetchTrends(prompt)
    if (newTrends.length > 0) setTrends(newTrends)
    const newTags = await fetchHashtags(prompt)
    if (newTags.length > 0) setHashtags(newTags)

    setLoading(false)
  }

  const copyScript = () => {
    navigator.clipboard.writeText(hook + '\n\n' + script)
    alert('تم نسخ السكربت ✅')
  }

  const exportPDF = () => {
    if (!hook && !script) {
      alert('ولّد سكريبت أولاً')
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

        <div className="topbar">
          <div>
            <h1>مرحباً 👋</h1>
            <p>مساعدك الذكي لصناعة المحتوى</p>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-inner">
            <div className="hero-robot">
              <img src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png" alt="robot" />
            </div>
            <div className="hero-right">
              <h2>اكتب فكرة المحتوى</h2>
              <textarea
                className="prompt-input"
                placeholder="مثال: حلل آخر الأحداث السياسية، أو اصنع قصة مرعبة قصيرة..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onInput={(e) => {
                  e.target.style.height = 'auto'
                  e.target.style.height = e.target.scrollHeight + 'px'
                }}
                rows={3}
              />
              <button className="generate-btn" onClick={generate} disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <span className="spinner" /> جاري التوليد...
                  </span>
                ) : (
                  '✨ توليد السكريبت'
                )}
              </button>
            </div>
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
                <button className="copy-btn" onClick={copyScript}>
                  📋 نسخ السكريبت
                </button>
                <button className="export-btn" onClick={exportPDF}>
                  📄 تصدير PDF
                </button>
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
              <div className="loading-trends">
                <span className="spinner" /> جاري تحديث الترندات...
              </div>
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

        </div>
      </main>
    </div>
  )
}