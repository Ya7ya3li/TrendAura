useEffect(() => {
  let active = true

  const initializeAuth = async () => {
    console.log("🚀 [AURA DIAGNOSTIC]: انطلاق عملية تهيئة الحساب والتحقق...")
    
    // ⏱️ صمام أمان زمني قاطع: لو علقت أي دالة في السيستم لأكثر من 4 ثوانٍ، فك التحميل فوراً واكشف الجاني
    const timeoutId = setTimeout(() => {
      if (active) {
        console.warn("⚠️ [AURA TIMEOUT]: التحقق أخذ وقت طويل! تم فك حظر الشاشة إجبارياً عبر صمام الأمان.");
        setLoading(false);
      }
    }, 4000);

    try {
      console.log("🔍 [AURA STEP 1]: جاري طلب الجلسة (Session) من سوبابيس...")
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error("❌ [AURA ERROR - Session]:", sessionError.message)
      }
      console.log("📦 [AURA STEP 2]: تم استقبال الجلسة بنجاح. حالة المستخدم:", session ? "مسجل دخول" : "زائر / لا يوجد جلسة")

      if (session?.user && active) {
        setUser(session.user)
        console.log("📡 [AURA STEP 3]: جاري استدعاء fetchProfile للـ UID الجاري:", session.user.id)
        
        // هنا نقطة الفحص الحسم: انتظر السيرفر
        const p = await fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
        console.log("📥 [AURA STEP 4]: اكتمل استدعاء البيانات من الجدول. النتيجة:", p ? "نجاح وجلب البروفايل" : "فشل / رجع Null")
        
        if (active && p) setProfile(p)
      }
    } catch (e) {
      console.error("❌ [AURA FATAL CRASH]: حدث كراش غير متوقع في خط التحقق:", e)
    } finally {
      clearTimeout(timeoutId); // إلغاء المؤقت فوراً لأن العملية نجحت ومرت بسلام
      if (active) {
        console.log("🏁 [AURA STEP 5]: انتهت تهيئة الأوث بنجاح. تحويل loading إلى false.")
        setLoading(false)
      }
    }
  }

  initializeAuth()

  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    console.log("🔄 [AURA AUTH CHANGE]: تغيرت حالة الجلسة إلى:", event)
    if (session?.user) {
      if (active) setUser(session.user)
      const p = await fetchProfile(session.user.id, session.user.email, session.user.user_metadata)
      if (active && p) setProfile(p)
    } else {
      if (active) {
        setUser(null)
        setProfile(null)
      }
    }
  })

  return () => {
    active = false
    subscription.unsubscribe()
  }
}, [])