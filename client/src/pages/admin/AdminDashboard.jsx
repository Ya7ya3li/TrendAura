import React, { useState, useEffect } from 'react'
import { supabase } from '../../config/supabase.js'
import { api } from '../../services/api.js'
import SectionTitle from '../../components/common/SectionTitle.jsx'
import { showToast } from '../../App.jsx'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('Dashboard')
    const [users, setUsers] = useState([])
    const [invoices, setInvoices] = useState([])
    const [stats, setStats] = useState(null)
    const [analytics, setAnalytics] = useState(null) // 👑 بيانات الإحصائيات
    const [aiUsage, setAiUsage] = useState(null) // 👑 بيانات استهلاك الذكاء الاصطناعي
    const [loading, setLoading] = useState(true)

    const adminTabs = [
        { id: 'Dashboard', icon: '📊', label: 'اللوحة الرئيسية' },
        { id: 'Users', icon: '👥', label: 'إدارة المستخدمين' },
        { id: 'Invoices', icon: '💳', label: 'الفواتير والأرباح' },
        { id: 'Analytics', icon: '📈', label: 'الإحصائيات' },
        { id: 'AI_Usage', icon: '🧠', label: 'استهلاك الذكاء الاصطناعي' },
        { id: 'Notifications', icon: '🔔', label: 'الإشعارات' },
        { id: 'System', icon: '🚨', label: 'مفاتيح النظام (طوارئ)' },
        { id: 'Logs', icon: '📋', label: 'سجل العمليات (Logs)' }
    ]

    useEffect(() => {
        if (activeTab === 'Users') fetchUsersSafely()
        if (activeTab === 'Dashboard') fetchStatsSafely()
        if (activeTab === 'Invoices') fetchInvoicesSafely()
        if (activeTab === 'Analytics') fetchAnalyticsSafely() // 👑 تفعيل الإحصائيات
        if (activeTab === 'AI_Usage') fetchAiUsageSafely()   // 👑 تفعيل الذكاء الاصطناعي
    }, [activeTab])

    const fetchStatsSafely = async () => {
        setLoading(true); try { const { data: { session } } = await supabase.auth.getSession(); const res = await api.get('/admin/stats', { headers: { Authorization: `Bearer ${session?.access_token}` } }); if (res.success) setStats(res.stats); } catch (err) { } finally { setLoading(false); }
    }
    const fetchUsersSafely = async () => {
        setLoading(true); try { const { data: { session } } = await supabase.auth.getSession(); const res = await api.get('/admin/users', { headers: { Authorization: `Bearer ${session?.access_token}` } }); if (res.success) setUsers(res.users); } catch (err) { } finally { setLoading(false); }
    }
    const fetchInvoicesSafely = async () => {
        setLoading(true); try { const { data: { session } } = await supabase.auth.getSession(); const res = await api.get('/admin/invoices', { headers: { Authorization: `Bearer ${session?.access_token}` } }); if (res.success) setInvoices(res.invoices); } catch (err) { } finally { setLoading(false); }
    }

    // 👑 جلب بيانات الإحصائيات (Analytics)
    const fetchAnalyticsSafely = async () => {
        setLoading(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const response = await api.get('/admin/analytics', {
                headers: { Authorization: `Bearer ${session?.access_token}` }
            })
            if (response.success) setAnalytics(response.analytics)
        } catch (err) {
            showToast('خطأ في جلب بيانات الإحصائيات', 'error')
        } finally {
            setLoading(false)
        }
    }

    // 👑 جلب بيانات استهلاك الذكاء الاصطناعي (AI Usage)
    const fetchAiUsageSafely = async () => {
        setLoading(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const response = await api.get('/admin/ai-usage', {
                headers: { Authorization: `Bearer ${session?.access_token}` }
            })
            if (response.success) setAiUsage(response.aiStats)
        } catch (err) {
            showToast('خطأ في سحب بيانات الاستهلاك', 'error')
        } finally {
            setLoading(false)
        }
    }

    const handleAdminAction = async (targetUserId, actionType, details = {}) => {
        if (actionType === 'delete' && !window.confirm('🚨 تحذير صارم: هل أنت متأكد من حذف هذا الحساب نهائياً؟')) return;
        try {
            const { data: { session } } = await supabase.auth.getSession(); await api.post('/admin/action', { targetUserId, action: actionType, details }, { headers: { Authorization: `Bearer ${session?.access_token}` } }); showToast('تمت العملية', 'success'); if (activeTab === 'Users') fetchUsersSafely();
        } catch (err) { showToast('فشل العملية', 'error') }
    }

    const cardBase = "bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl transition-colors duration-300"

    // دالة لحساب أقصى قيمة للرسم البياني ديناميكياً
    const maxChartValue = analytics?.chartData?.reduce((max, d) => Math.max(max, d.users), 0) || 1;

    return (
        <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row gap-6 p-4 md:p-6 font-sans text-slate-900 dark:text-white dir-rtl text-right">
            {/* 🗂️ القائمة الجانبية */}
            <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
                <h2 className="text-sm font-black mb-4 px-2 text-rose-600 dark:text-rose-400 border-b border-rose-100 dark:border-rose-900/50 pb-2">TrendAura Command Center</h2>
                {adminTabs.map(tab => (
                    <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`w-full text-right px-4 py-3 rounded-2xl text-[11px] font-black transition-all flex items-center gap-3 ${activeTab === tab.id ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60'}`}>
                        <span className="text-sm">{tab.icon}</span><span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* 🖥️ مساحة العرض الرئيسية */}
            <div className="flex-1 min-w-0">
                <div className="mb-6 flex justify-between items-center">
                    <SectionTitle title={adminTabs.find(t => t.id === activeTab)?.label} badge="SUPER ADMIN" />
                    {activeTab === 'Notifications' || activeTab === 'System' || activeTab === 'Logs' ? (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-full animate-pulse">قيد الربط ⏳</span>
                    ) : null}
                </div>

                {/* 1️⃣ اللوحة الرئيسية */}
                {activeTab === 'Dashboard' && (
                    <div className="animate-fade-in space-y-6">
                        {loading || !stats ? (
                            <div className={`${cardBase} py-12 text-center text-slate-400 text-xs font-bold animate-pulse`}>جاري حساب البيانات...</div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    <div className={`${cardBase} border-blue-200 dark:border-blue-900/50`}><p className="text-xs font-bold text-slate-500 mb-1">إجمالي المستخدمين</p><h3 className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.totalUsers}</h3></div>
                                    <div className={`${cardBase} border-emerald-200 dark:border-emerald-900/50`}><p className="text-xs font-bold text-slate-500 mb-1">النشطين</p><h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.activeUsers}</h3></div>
                                    <div className={`${cardBase} border-amber-200 dark:border-amber-900/50`}><p className="text-xs font-bold text-slate-500 mb-1">الباقات المدفوعة</p><h3 className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.paidUsers}</h3></div>
                                    <div className={`${cardBase} border-purple-200 dark:border-purple-900/50`}><p className="text-xs font-bold text-slate-500 mb-1">التوكنز المتداولة</p><h3 className="text-2xl font-black text-purple-600 font-mono">{stats.totalTokens?.toLocaleString()}</h3></div>
                                    <div className={`${cardBase} border-rose-200 dark:border-rose-900/50`}><p className="text-xs font-bold text-slate-500 mb-1">المحظورة</p><h3 className="text-2xl font-black text-rose-600">{stats.bannedUsers}</h3></div>
                                </div>
                                <div className={`${cardBase}`}>
                                    <h3 className="text-sm font-black mb-4 text-slate-800 dark:text-slate-200">⏱️ أحدث الأعضاء المنضمين للنظام حالياً</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-right text-xs">
                                            <thead>
                                                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 pb-2">
                                                    <th className="pb-3 font-bold">المستند الحركي</th>
                                                    <th className="pb-3 font-bold">الإيميل الرسمي</th>
                                                    <th className="pb-3 font-bold">الباقة الحالية</th>
                                                    <th className="pb-3 font-bold text-left">تاريخ الإنشاء</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {stats.recentUsers?.map(user => (
                                                    <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-900/10">
                                                        <td className="py-3 font-black text-slate-900 dark:text-white">{user.full_name || 'بدون اسم'}</td>
                                                        <td className="py-3 font-mono text-slate-500 dark:text-slate-400">{user.email}</td>
                                                        <td className="py-3"><span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-cyan-400 px-2 py-0.5 rounded text-[9px] font-black uppercase">{user.plan}</span></td>
                                                        <td className="py-3 font-mono text-slate-400 text-left">{new Date(user.updated_at).toLocaleDateString('ar-SA')}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* 2️⃣ إدارة المستخدمين */}
                {activeTab === 'Users' && (
                    <div className={`${cardBase} animate-fade-in`}>
                        <div className="overflow-x-auto">
                            <table className="w-full text-right text-xs">
                                <thead><tr className="border-b text-slate-500"><th className="pb-4">المستخدم</th><th className="pb-4">الرصيد/الباقة</th><th className="pb-4">الحالة</th><th className="pb-4 text-center">أزرار التحكم</th></tr></thead>
                                <tbody>{users.map(u => (
                                    <tr key={u.id} className="border-b">
                                        <td className="py-4"><p className="font-black">{u.full_name}</p><p className="text-[9px] text-slate-500">{u.email}</p></td>
                                        <td className="py-4"><p className="font-mono text-emerald-600">{u.tokens?.toLocaleString() || 0} T</p><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[8px] font-black uppercase mt-1 inline-block">{u.plan}</span></td>
                                        <td className="py-4">{u.is_banned ? <span className="text-rose-500 text-[10px] font-black">محظور 🚫</span> : <span className="text-emerald-500 text-[10px] font-black">نشط ✅</span>}</td>
                                        <td className="py-4 text-center">
                                            <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[280px] mx-auto">
                                                <button onClick={() => handleAdminAction(u.id, 'add_tokens', { amount: 5000 })} className="px-2 py-1 bg-emerald-50 text-emerald-600 rounded text-[9px] font-black">➕ 5k</button>
                                                <button onClick={() => handleAdminAction(u.id, 'remove_tokens', { amount: 5000 })} className="px-2 py-1 bg-amber-50 text-amber-600 rounded text-[9px] font-black">➖ 5k</button>
                                                <button onClick={() => handleAdminAction(u.id, 'upgrade_plan', { plan: 'viral_engine' })} className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-[9px] font-black">⬆ ترقية</button>
                                                <button onClick={() => handleAdminAction(u.id, 'downgrade_plan')} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[9px] font-black">⬇ مجاني</button>
                                                <button onClick={() => handleAdminAction(u.id, u.is_banned ? 'unban' : 'ban')} className={`px-2 py-1 rounded text-[9px] font-black border ${u.is_banned ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>{u.is_banned ? '🔓 فك الحظر' : '🚫 حظر'}</button>
                                                <button onClick={() => handleAdminAction(u.id, 'delete')} className="px-2 py-1 bg-red-50 text-red-600 rounded text-[9px] font-black w-full mt-1 border border-red-200">🗑️ حذف</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 3️⃣ الفواتير والأرباح (بالتعديل الصحيح للهللة) */}
                {activeTab === 'Invoices' && (
                    <div className={`${cardBase} animate-fade-in`}>
                        <table className="w-full text-right text-xs">
                            <thead><tr className="border-b text-slate-500"><th className="pb-4">المعرف</th><th className="pb-4">المبلغ</th><th className="pb-4">الحالة</th><th className="pb-4 text-left">التاريخ</th></tr></thead>
                            <tbody>{invoices.map(i => (
                                <tr key={i.id} className="border-b">
                                    <td className="py-4 font-mono">#{i.id?.substring(0, 8).toUpperCase()}</td>
                                    {/* 👑 هنا التعديل اللي سويناه بدون قسمة 100 */}
                                    <td className="py-4 font-black text-emerald-600">{Number(i.amount).toFixed(2)} {i.currency || 'SAR'}</td>
                                    <td className="py-4"><span className={`px-2 py-0.5 rounded text-[10px] font-black ${i.status === 'paid' || i.status === 'captured' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{i.status === 'paid' || i.status === 'captured' ? 'مدفوعة ✅' : i.status}</span></td>
                                    <td className="py-4 font-mono text-slate-400 text-left">{new Date(i.updated_at || i.created_at).toLocaleDateString('ar-SA')}</td>
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                )}

                {/* 4️⃣ الإحصائيات المتقدمة (Analytics) الفعالة 100% */}
                {activeTab === 'Analytics' && (
                    <div className="grid grid-cols-1 gap-6 animate-fade-in">
                        {loading || !analytics ? (
                            <div className={`${cardBase} py-12 text-center text-slate-400 text-xs font-bold animate-pulse`}>جاري تحليل البيانات الزمنية...</div>
                        ) : (
                            <>
                                {/* رسم بياني مبسط لنمو المستخدمين */}
                                <div className={`${cardBase}`}>
                                    <h3 className="text-sm font-black text-blue-600 mb-6">📈 رسم بياني: نمو المشتركين شهرياً</h3>
                                    <div className="flex items-end gap-2 h-40 border-b border-slate-200 dark:border-slate-800 pb-2">
                                        {analytics.chartData.map((data, index) => (
                                            <div key={index} className="flex flex-col items-center flex-1 group">
                                                <div
                                                    className="w-full max-w-[40px] bg-blue-500/20 hover:bg-blue-500 transition-all rounded-t-sm relative"
                                                    style={{ height: `${(data.users / maxChartValue) * 100}%`, minHeight: '10%' }}
                                                >
                                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">{data.users}</span>
                                                </div>
                                                <span className="text-[8px] font-bold text-slate-400 mt-2">{data.month.substring(5)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4 flex justify-between text-xs font-bold text-slate-500">
                                        <span>إجمالي الأشهر المسجلة: {analytics.chartData.length}</span>
                                        <span>أعلى قمة تسجيل: {maxChartValue} مستخدم</span>
                                    </div>
                                </div>

                                {/* توزيع الباقات */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className={`${cardBase} text-center border-slate-200 dark:border-slate-700`}><p className="text-xs font-bold text-slate-500 mb-2">الباقة المجانية</p><h3 className="text-2xl font-black text-slate-700 dark:text-slate-300">{analytics.distribution.free}</h3></div>
                                    <div className={`${cardBase} text-center border-blue-200 dark:border-blue-900/50`}><p className="text-xs font-bold text-slate-500 mb-2">باقة Pro</p><h3 className="text-2xl font-black text-blue-600 dark:text-blue-400">{analytics.distribution.pro}</h3></div>
                                    <div className={`${cardBase} text-center border-emerald-200 dark:border-emerald-900/50`}><p className="text-xs font-bold text-slate-500 mb-2">Viral Engine</p><h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{analytics.distribution.viral}</h3></div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* 5️⃣ استهلاك الذكاء الاصطناعي الفعال 100% */}
                {activeTab === 'AI_Usage' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
                        {loading || !aiUsage ? (
                            <div className="col-span-full py-12 text-center text-slate-400 text-xs font-bold animate-pulse">جاري جلب معدلات استهلاك الخوارزمية...</div>
                        ) : (
                            <>
                                <div className={`${cardBase} border-purple-200 dark:border-purple-900/50`}>
                                    <p className="text-xs font-bold text-slate-500 mb-1">عمليات التوليد اليوم</p>
                                    <h3 className="text-3xl font-black text-purple-600 dark:text-purple-400">{aiUsage.todayGenerations}</h3>
                                </div>
                                <div className={`${cardBase} border-indigo-200 dark:border-indigo-900/50`}>
                                    <p className="text-xs font-bold text-slate-500 mb-1">التوليد هذا الشهر</p>
                                    <h3 className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{aiUsage.monthGenerations}</h3>
                                </div>
                                <div className={`${cardBase} border-rose-200 dark:border-rose-900/50`}>
                                    <p className="text-xs font-bold text-slate-500 mb-1">الرصيد المحروق (Tokens)</p>
                                    <h3 className="text-3xl font-black text-rose-600 dark:text-rose-400 font-mono">-{aiUsage.totalTokensBurned}</h3>
                                </div>
                                <div className={`${cardBase} border-amber-200 dark:border-amber-900/50`}>
                                    <p className="text-xs font-bold text-slate-500 mb-1">فشل الـ API التقديري</p>
                                    <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400">{aiUsage.estimatedFailures}</h3>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* التبويبات المتبقية كنماذج عرض آمنة */}
                {activeTab === 'Notifications' && (
                    <div className={`${cardBase} h-48 flex items-center justify-center text-slate-400 text-xs font-bold animate-fade-in`}>🔔 بث الإشعارات لجميع المتصفحات الحية قيد الربط...</div>
                )}
                {activeTab === 'System' && (
                    <div className={`${cardBase} h-48 flex items-center justify-center text-slate-400 text-xs font-bold animate-fade-in`}>🚨 مفاتيح الطوارئ والإيقاف الفيدرالي قيد الربط...</div>
                )}
                {activeTab === 'Logs' && (
                    <div className={`${cardBase} h-48 flex items-center justify-center text-slate-400 text-xs font-bold animate-fade-in`}>📋 أرشيف الحركات الإدارية الدقيقة قيد الربط...</div>
                )}

            </div>
        </div>
    )
}