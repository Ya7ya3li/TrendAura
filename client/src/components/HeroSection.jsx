import { useEffect } from 'react' 
import { useNavigate } from 'react-router-dom'

export default function HeroSection() {
  const navigate = useNavigate()

  useEffect(() => {
    if (document.styleSheets && document.styleSheets.length > 0) {
      const styleSheet = document.styleSheets[0];
      const keyframes = `
        @keyframes pulseGlow {
          0% { transform: scale(1); opacity: 0.4; }
          50% { transform: scale(1.05); opacity: 0.7; }
          100% { transform: scale(1); opacity: 0.4; }
        }
      `;
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
      } catch (e) {
        console.log("Animation ready");
      }
    }
  }, []);

  return (
    <section style={{
      backgroundColor: '#060913',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 4% 40px 4%',
      direction: 'rtl',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
      overflow: 'hidden',
      boxSizing: 'border-box'
    }}>
      
      {/* ===== الإضاءة الخلفية المحيطية الكبرى لمجسم التطبيق ===== */}
      <div style={{
        position: 'absolute',
        bottom: '10%',
        left: '15%',
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* ===== المحتوى المركزي (التصميم المرن المقسم لجهتين) ===== */}
      <div style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '1280px',
        zIndex: 2,
        gap: '40px',
        boxSizing: 'border-box'
      }}>
        
        {/* ---------------- 📝 الجهة اليمنى: العناوين والنصوص والكروت ---------------- */}
        <div style={{
          flex: '1 1 500px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          textAlign: 'right'
        }}>
          
          {/* الشارة الصغيرة الفوقية */}
          <div style={{
            background: 'linear-gradient(90deg, rgba(30,41,59,0.5) 0%, rgba(15,23,42,0.8) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '6px 16px',
            borderRadius: '999px',
            color: '#cbd5e1',
            fontSize: '0.85rem',
            fontWeight: '600',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ color: '#d946ef' }}>✨</span> منصة الذكاء الاصطناعي لصناع المحتوى
          </div>

          {/* العنوان الرئيسي المتوهج اللامع */}
          <h1 style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
            fontWeight: '900',
            color: '#ffffff',
            lineHeight: '1.25',
            margin: '0 0 20px 0',
            letterSpacing: '-0.5px'
          }}>
            حَوِّل فكرتك إلى <br />
            <span style={{ 
              background: 'linear-gradient(to right, #b55fe6, #d946ef)', 
              WebkitBackgroundClip: 'text', 
              WebkitTextFillColor: 'transparent' 
            }}>سكريبت فايرل</span> <br />
            خلال ثوانٍ <span style={{ color: '#a855f7' }}>⚡</span>
          </h1>

          {/* النص الوصفي الفرعي النظيف */}
          <p style={{
            fontSize: '1.05rem',
            color: '#94a3b8',
            lineHeight: '1.7',
            maxWidth: '520px',
            margin: '0 0 35px 0'
          }}>
            أنشئ سكريبتات قصيرة، هوكات قوية، وتحليلات ذكية مصممة خصيصاً لتيك توك، يوتيوب شورتس، وإنستغرام ريلز.
          </p>

          {/* أزرار العمليات المركزية (CTA Row) */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '45px', width: '100%' }}>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #d946ef 100%)',
                color: '#fff',
                padding: '14px 32px',
                borderRadius: '14px',
                border: 'none',
                fontSize: '1.05rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(124, 58, 237, 0.35)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>✨ ابدأ التوليد الآن</span>
            </button>

            <button
              onClick={() => navigate('/pricing')}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                color: '#f1f5f9',
                padding: '14px 28px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                fontSize: '1.05rem',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>▶ مشاهدة التجربة</span>
            </button>
          </div>

          {/* شبكة الكروت الثلاثة الذكية (Stats Grid) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', width: '100%', maxWidth: '520px' }}>
            
            {/* كرت 1 */}
            <div style={{ background: '#0b1120', border: '1px solid rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>+50K</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>سكريبت تم توليده</div>
            </div>

            {/* كرت 2 */}
            <div style={{ background: '#0b1120', border: '1px solid rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>92%</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>رضا المستخدمين</div>
            </div>

            {/* كرت 3 */}
            <div style={{ background: '#0b1120', border: '1px solid rgba(255, 255, 255, 0.03)', padding: '16px', borderRadius: '16px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#a855f7', marginBottom: '4px' }}>AI</div>
              <div style={{ fontSize: '0.78rem', color: '#64748b' }}>تحليل فايرل ذكي</div>
            </div>

          </div>

        </div>

        {/* ---------------- 💻 الجهة اليسرى: مجسّم شاشة تطبيق الـ Viral Engine الخرافية ---------------- */}
        <div style={{
          flex: '1 1 550px',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          
          {/* حلقة النيون البنفسجية المتوهجة أسفل الكرت الخارجي */}
          <div style={{
            position: 'absolute',
            width: '105%',
            height: '105%',
            borderRadius: '28px',
            border: '2px solid #a855f7',
            opacity: 0.4,
            filter: 'blur(12px)',
            pointerEvents: 'none',
            zIndex: 1
          }} />

          {/* حاوية الكرت الزجاجي الرئيسي للتطبيق */}
          <div style={{
            width: '100%',
            backgroundColor: '#090e1a',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            borderRadius: '24px',
            boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
            padding: '24px',
            zIndex: 2,
            display: 'flex',
            gap: '20px',
            boxSizing: 'border-box'
          }}>
            
            {/* التبويب الداخلي الأيسر (Sidebar Tabs) */}
            <div style={{
              width: '28%',
              borderLeft: '1px solid rgba(255,255,255,0.04)',
              paddingLeft: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px' }}>
                <span style={{ color: '#ef4444' }}>⚡</span> Viral Engine
              </div>
              
              {[
                { title: 'تحليل الفايرل', active: true, icon: '📈' },
                { title: 'الهوكات', active: false, icon: '🎯' },
                { title: 'السكريبتات', active: false, icon: '📝' },
                { title: 'الأفكار', active: false, icon: '💡' },
                { title: 'المفضلة', active: false, icon: '⭐' }
              ].map((tab, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  backgroundColor: tab.active ? 'rgba(168,85,247,0.08)' : 'transparent',
                  color: tab.active ? '#c084fc' : '#64748b',
                  fontSize: '0.8rem',
                  fontWeight: tab.active ? 'bold' : '500',
                  cursor: 'default'
                }}>
                  <span>{tab.icon}</span>
                  <span>{tab.title}</span>
                </div>
              ))}
            </div>

            {/* منطقة الفحص البياني اليمنى (Main Board View) */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* هيدر التحليل الرئيسي */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#f8fafc', fontSize: '0.9rem', fontWeight: 'bold' }}>تحليل احتمال الانتشار</span>
                <span style={{ color: '#64748b', fontSize: '0.75rem' }}>مباشر لايف</span>
              </div>

              {/* قسم الدائرة الرقمية مع بارات الفحص الملونة */}
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                
                {/* دائرة النسبة المركزية الفخمة (84%) */}
                <div style={{
                  width: '110px',
                  height: '110px',
                  borderRadius: '50%',
                  background: 'conic-gradient(#a855f7 0% 84%, rgba(255,255,255,0.03) 84% 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <div style={{
                    width: '94px',
                    height: '94px',
                    borderRadius: '50%',
                    backgroundColor: '#090e1a',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff' }}>84%</span>
                    <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '2px' }}>احتمالية الترند</span>
                  </div>
                </div>

                {/* مؤشرات البارات الجانبية الأربعة */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '160px' }}>
                  
                  {[
                    { label: 'قوة الهوك', val: '92%', color: 'linear-gradient(90deg, #a855f7, #ec4899)' },
                    { label: 'معدل الاحتفاظ', val: '78%', color: 'linear-gradient(90deg, #7c3aed, #3b82f6)' },
                    { label: 'وضوح الرسالة', val: '85%', color: 'linear-gradient(90deg, #06b6d4, #10b981)' },
                    { label: 'قوة الـ CTA', val: '80%', color: 'linear-gradient(90deg, #3b82f6, #06b6d4)' }
                  ].map((bar, idx) => (
                    <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94a3b8' }}>
                        <span>{bar.label}</span>
                        <span style={{ fontWeight: 'bold' }}>{bar.val}</span>
                      </div>
                      <div style={{ width: '100%', height: '5px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '99px', overflow: 'hidden' }}>
                        <div style={{ width: bar.val, height: '100%', background: bar.color, borderRadius: '99px' }} />
                      </div>
                    </div>
                  ))}

                </div>
              </div>

              {/* المؤشر السفلي لقوة المقطع الحالية */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                <span>التقييم الفيروسي:</span>
                <span style={{ background: 'rgba(16px, 185px, 129px, 0.1)', color: '#10b981', padding: '2px 8px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.75rem' }}>🔥 ممتاز</span>
              </div>

              {/* كرت النصيحة الهندسية السفلي الذكي */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px solid rgba(255, 255, 255, 0.04)',
                borderRadius: '14px',
                padding: '12px 14px',
                display: 'flex',
                gap: '12px',
                alignItems: 'center'
              }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>🎯</div>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'bold', marginBottom: '2px' }}>نصيحة لتحسين الانتشار</div>
                  <p style={{ color: '#cbd5e1', fontSize: '0.75rem', margin: 0, lineHeight: '1.4' }}>السكريبت قوي جداً! جرب إضافة سؤال تفاعلي في بداية الفيديو لزيادة نسب الاحتفاظ والـ Retention لأطول فترة ممكنة.</p>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* ===== 🌍 البار السفلي المخصص للشركاء ومنصات النشر ===== */}
      <div style={{
        marginTop: '70px',
        borderTop: '1px solid rgba(255, 255, 255, 0.03)',
        paddingTop: '25px',
        width: '100%',
        maxWidth: '1200px',
        textAlign: 'center',
        zIndex: 2
      }}>
        <p style={{ color: '#475569', fontSize: '0.82rem', margin: '0 0 16px 0', fontWeight: '500' }}>مستهدف ومعتمد من قبل آلاف صناع المحتوى عبر المنصات العالمية</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', color: '#334155', fontSize: '0.85rem', flexWrap: 'wrap', fontWeight: '600' }}>
          <span>🎵 TikTok</span>
          <span>📺 YouTube Shorts</span>
          <span>📸 Instagram Reels</span>
          <span>👥 Content Creators</span>
        </div>
      </div>

    </section>
  )
}