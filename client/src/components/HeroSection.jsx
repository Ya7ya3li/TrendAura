import { useEffect } from 'react' // 🟢 تم إضافة الاستدعاء الصحيح هنا لمنع الكراش
import { useNavigate } from 'react-router-dom'

export default function HeroSection() {
  const navigate = useNavigate()

  // تعريف حركة النبض (Pulse) بالكود لتعمل تلقائياً وبأمان
  useEffect(() => {
    // التأكد من وجود StyleSheet متاح لمنع أي خطأ برمي
    if (document.styleSheets && document.styleSheets.length > 0) {
      const styleSheet = document.styleSheets[0];
      const keyframes = `
        @keyframes pulseAnimation {
          0% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
          100% { opacity: 0.6; transform: scale(1); }
        }
      `;
      try {
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
      } catch (e) {
        console.log("Animation injected");
      }
    }
  }, []);

  return (
    <section style={{
      backgroundColor: '#0f172a',
      minHeight: '85vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      direction: 'rtl',
      fontFamily: 'system-ui, sans-serif',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* تأثير الإضاءة الخلفية الناعمة (Glow Effect) */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(15,23,42,0) 70%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* 1. الشارة العلوية الصغيرة (Micro-Badge) */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        border: '1px solid rgba(168, 85, 247, 0.2)',
        padding: '6px 16px',
        borderRadius: '9999px',
        color: '#c084fc',
        fontSize: '0.9rem',
        fontWeight: '500',
        marginBottom: '25px',
        zIndex: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <span>✨ مستقبل صناعة المحتوى الذكي</span>
      </div>

      {/* 2. العنوان الرئيسي الخارق (Headline) */}
      <h1 style={{
        fontSize: 'clamp(2rem, 5vw, 3.8rem)',
        fontWeight: '900',
        color: '#f8fafc',
        maxWidth: '850px',
        lineHeight: '1.2',
        marginBottom: '20px',
        zIndex: 2,
        letterSpacing: '-0.02em'
      }}>
        حوّل أفكارك إلى سيناريوهات <span style={{
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: '900'
        }}>فيروسية (Viral)</span> تتصدر التريند
      </h1>

      {/* 3. العنوان الفرعي الذكي (Sub-headline) */}
      <p style={{
        fontSize: 'clamp(1rem, 2vw, 1.25rem)',
        color: '#94a3b8',
        maxWidth: '650px',
        lineHeight: '1.6',
        marginBottom: '40px',
        zIndex: 2,
        padding: '0 10px'
      }}>
        منصة تمنحك قوة الذكاء الاصطناعي المتقدم لصياغة سكريبتات للملايين؛ ترفع معدل الاحتفاظ بالجمهور وتفجر مشاهداتك بضغطة زر.
      </p>

      {/* 4. زر اتخاذ الإجراء المتوهج (Primary CTA Button) */}
      <button
        onClick={() => navigate('/pricing')}
        style={{
          background: 'linear-gradient(135deg, #a855f7, #ec4899)',
          color: '#fff',
          padding: '18px 42px',
          borderRadius: '16px',
          border: 'none',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 0 25px rgba(168, 85, 247, 0.4), 0 4px 15px rgba(236, 72, 153, 0.3)',
          transition: 'all 0.3s ease',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.03)'
          e.currentTarget.style.boxShadow = '0 0 35px rgba(168, 85, 247, 0.6), 0 6px 20px rgba(236, 72, 153, 0.4)'
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
          e.currentTarget.style.boxShadow = '0 0 25px rgba(168, 85, 247, 0.4), 0 4px 15px rgba(236, 72, 153, 0.3)'
        }}
      >
        <span>ابدأ صناعة محتواك مجاناً</span>
        <span style={{ fontSize: '1.3rem' }}>💎</span>
      </button>

      {/* 5. المعاينة البصرية الفخمة جداً والمتحركة بالكود (Borderless App Mockup) */}
      <div style={{
        marginTop: '60px',
        width: '100%',
        maxWidth: '1100px',
        borderRadius: '24px', 
        border: '1px solid rgba(255, 255, 255, 0.05)', 
        background: '#1e293b', 
        padding: '6px', 
        boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 50px rgba(168, 85, 247, 0.15)',
        zIndex: 2,
        aspectRatio: '16/9',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        transition: 'all 0.5s ease'
      }}>
        
        {/* محتوى الواجهة التفاعلية الوهمية الفخمة */}
        <div style={{
          width: '100%',
          height: '100%',
          borderRadius: '18px',
          backgroundColor: '#0f172a', 
          display: 'flex',
          direction: 'rtl',
          fontFamily: 'system-ui, sans-serif',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 25px rgba(0,0,0,0.4)'
        }}>
          
          {/* القائمة الجانبية الوهمية */}
          <div style={{
            width: '22%',
            borderLeft: '1px solid #1e293b',
            padding: '25px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '15px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #a855f7, #ec4899)', boxShadow: '0 0 10px rgba(168,85,247,0.3)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <div style={{ height: '9px', width: '70px', backgroundColor: '#f8fafc', borderRadius: '4px' }} />
                <div style={{ height: '7px', width: '45px', backgroundColor: '#475569', borderRadius: '4px' }} />
              </div>
            </div>
            {[ {icon: '🏠', active: true}, {icon: '🤖', active: false}, {icon: '🕒', active: false}, {icon: '💳', active: false} ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: item.active ? '#1e293b' : 'transparent',
                padding: item.active ? '12px' : '0',
                borderRadius: '10px'
              }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
                <div style={{ height: '8px', flexGrow: 1, backgroundColor: item.active ? '#a855f7' : '#334155', borderRadius: '4px', opacity: item.active ? 1 : 0.6 }} />
              </div>
            ))}
          </div>

          {/* منطقة المحتوى الوهمية الفخمة */}
          <div style={{ flexGrow: 1, padding: '35px 45px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <span style={{ fontSize: '1.8rem' }}>🤖</span>
              <div style={{ flexGrow: 1, height: '45px', backgroundColor: '#1e293b', borderRadius: '14px', border: '1px solid #334155', display: 'flex', alignItems: 'center', padding: '0 18px' }}>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>الموضوع: سكريبت لمنتج عطر رجالي غامض وجذاب...</p>
              </div>
              <div style={{ width: '65px', height: '45px', borderRadius: '14px', background: 'linear-gradient(135deg, #a855f7, #ec4899)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 15px rgba(168,85,247,0.3)' }}>
                <span style={{ fontSize: '1.2rem' }}>💎</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
                <p style={{ color: '#ec4899', fontSize: '0.95rem', fontWeight: 'bold', margin: 0, animation: 'pulseAnimation 1.5s infinite' }}>جاري صناعة السكريبت Viral... 🚀</p>
                <div style={{ height: '1px', flexGrow: 1, background: 'linear-gradient(to left, rgba(236,72,153,0.3), transparent)', margin: '0 18px' }} />
            </div>

            <div style={{
              flexGrow: 1,
              borderRadius: '16px',
              padding: '1.5px', 
              background: 'linear-gradient(135deg, rgba(168,85,247,0.4), rgba(236,72,153,0.4))',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.1)'
            }}>
                <div style={{
                    backgroundColor: '#1e293b', 
                    borderRadius: '14px',
                    width: '100%',
                    height: '100%',
                    padding: '25px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyItems: 'between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '1.2rem', color: '#a855f7' }}>✅</span>
                            <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#f8fafc', margin: 0 }}>سكريبت جاهز للاستخدام!</p>
                        </div>
                        <span style={{ fontSize: '0.85rem', color: '#64748b', marginRight: 'auto' }}>13:45</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#a855f7', border: '1px solid rgba(168,85,247,0.3)', padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap', opacity: 0.8 }}>ث0:03 (Hook)</span>
                            <div style={{ height: '10px', width: '20px', backgroundColor: '#a855f7', borderRadius: '2px' }} />
                            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0, textAlign: 'right' }}>ثانية وحدة! هذا العطر يخلي الكل يلتفت لك... غامض، جذاب، وفواح طوال اليوم.</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#ec4899', border: '1px solid rgba(236,72,153,0.3)', padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap', opacity: 0.8 }}>ث0:07 (بصري)</span>
                            <div style={{ height: '10px', width: '20px', backgroundColor: '#ec4899', borderRadius: '2px' }} />
                            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0, textAlign: 'right' }}>[مشهد بطيء: رذاذ العطر يتطاير على خلفية داكنة متوهجة. انتقال سريع لصورة رجل واثق بنفسه].</p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '0.8rem', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.3)', padding: '2px 8px', borderRadius: '4px', whiteSpace: 'nowrap', opacity: 0.8 }}>ث0:15 (الختام)</span>
                            <div style={{ height: '10px', width: '20px', backgroundColor: '#38bdf8', borderRadius: '2px' }} />
                            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: 0, textAlign: 'right' }}>اسم العطر هو [الاسم]. متوفر الحين. الرابط في البايو! 🛒🔥📈</p>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

    </section>
  )
}