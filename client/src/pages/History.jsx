import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import { supabase } from '../config/supabase'

export default function History() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getHistory()
  }, [])

  const getHistory = async () => {
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData?.user?.id

    const { data, error } = await supabase
      .from('history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.log(error)
      setItems([])
    } else {
      setItems(data || [])
    }

    setLoading(false)
  }

  // حسابات الإحصائيات
  const totalScripts = items.length

  const totalWords = items.reduce((acc, item) => {
    const words = (item.script || '').split(' ').filter(w => w.length > 0).length
    return acc + words
  }, 0)

  const lastActivity = items.length > 0
    ? new Date(items[0].created_at).toLocaleDateString('ar-SA')
    : 'لا يوجد'

  const topTopics = items
    .map(i => i.prompt)
    .slice(0, 3)

  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">

        <div className="topbar">
          <div>
            <h1>📋 سجل التوليدات</h1>
            <p>كل السكريبتات اللي ولّدتها</p>
          </div>
        </div>

        {/* لوحة الإحصائيات */}
        <div className="stats-grid">

          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-info">
              <span className="stat-num">{totalScripts}</span>
              <span className="stat-label">سكريبت مولّد</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💬</div>
            <div className="stat-info">
              <span className="stat-num">{totalWords.toLocaleString()}</span>
              <span className="stat-label">كلمة إجمالاً</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🕒</div>
            <div className="stat-info">
              <span className="stat-num" style={{ fontSize: '18px' }}>{lastActivity}</span>
              <span className="stat-label">آخر نشاط</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🔥</div>
            <div className="stat-info">
              <span className="stat-num">{topTopics.length > 0 ? topTopics[0]?.slice(0, 15) + '...' : 'لا يوجد'}</span>
              <span className="stat-label">أحدث موضوع</span>
            </div>
          </div>

        </div>

        {/* السكريبتات */}
        {loading ? (
          <div className="loading-trends">
            <span className="spinner" /> جاري التحميل...
          </div>
        ) : (
          <div className="dashboard-grid">
            {items.length > 0 ? (
              items.map((item) => (
                <div className="glass-card" key={item.id}>

                  <div className="history-topic">
                    📌 {item.prompt}
                  </div>

                  <div className="script-section" style={{ marginTop: '14px' }}>
                    <span className="script-label">الهوك</span>
                    <p style={{ color: '#c4b5fd', lineHeight: '2', marginTop: '8px' }}>
                      {item.hook}
                    </p>
                  </div>

                  <div className="script-section" style={{ marginTop: '14px' }}>
                    <span className="script-label">السكريبت</span>
                    <p style={{ lineHeight: '2', marginTop: '8px', color: '#cbd5e1' }}>
                      {item.script}
                    </p>
                  </div>

                  <p className="history-date">
                    🕒 {new Date(item.created_at).toLocaleDateString('ar-SA')}
                  </p>

                </div>
              ))
            ) : (
              <p className="empty-state">لا يوجد توليدات محفوظة بعد</p>
            )}
          </div>
        )}

      </main>
    </div>
  )
}