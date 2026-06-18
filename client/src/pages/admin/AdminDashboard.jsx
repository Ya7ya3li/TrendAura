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
    const [analytics, setAnalytics] = useState(null)
    const [aiUsage, setAiUsage] = useState(null)
    const [logs, setLogs] = useState([]) // 👑 أرشيف العمليات
    const [systemSettings, setSystemSettings] = useState({ maintenance: false, ai_engine: true }) // 👑 حالة النظام
    const [loading, setLoading] = useState(true)

    // 👑 فورم الإشعارات
    const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '' })

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
        if (activeTab === 'Analytics') fetchAnalyticsSafely()
        if (activeTab === 'AI_Usage') fetchAiUsageSafely()
        if (activeTab === 'Logs') fetchLogsSafely() // 👑 تفعيل السجلات
        if (activeTab === 'System') fetchSystemSafely() // 👑 تفعيل مفاتيح النظام
    }, [activeTab])

    const fetchStatsSafely = async () => { setLoading(true); try { const { data: { session } } = await supabase.auth.getSession(); const res = await api.get('/admin/stats', { headers: { Authorization: `Bearer ${session?.access_token}` } }); if (res.success) setStats(res.stats); } catch (err) { } finally { setLoading(false); } }
    const fetchUsersSafely = async () => { setLoading(true); try { const { data: { session } } = await supabase.auth.getSession(); const res = await api.get('/admin/users', { headers: { Authorization: `Bearer ${session?.access_token}` } }); if (res.success) setUsers(res.users); } catch (err) { } finally { setLoading(false); } }
    const fetchInvoicesSafely = async () => { setLoading(true); try { const { data: { session } } = await supabase.auth.getSession(); const res = await api.get('/admin/invoices', { headers: { Authorization: `Bearer ${session?.access_token}` } }); if (res.success) setInvoices(res.invoices); } catch (err) { } finally { setLoading(false); } }
    const fetchAnalyticsSafely = async () => { setLoading(true); try { const { data: { session } } = await supabase.auth.getSession(); const res = await api.get('/admin/analytics', { headers: { Authorization: `Bearer ${session?.access_token}` } }); if (res.success) setAnalytics(res.analytics); } catch (err) { } finally { setLoading(false); } }
    const fetchAiUsageSafely = async () => { setLoading(true); try { const { data: { session } } = await supabase.auth.getSession(); const res = await api.get('/admin/ai-usage', { headers: { Authorization: `Bearer ${session?.access_token}` } }); if (res.success) setAiUsage(res.aiStats); } catch (err) { } finally { setLoading(false); } }

    // 👑 جلب سجلات العمليات
    const fetchLogsSafely = async () => { setLoading(true); try { const { data: { session } } = await supabase.auth.getSession(); const res = await api.get('/admin/logs', { headers: { Authorization: `Bearer ${session?.access_token}` } }); if (res.success) setLogs(res.logs); } catch (err) { } finally { setLoading(false); } }

    // 👑 جلب حالة النظام
    const fetchSystemSafely = async () => { setLoading(true); try { const { data: { session } } = await supabase.auth.getSession(); const res = await api.get('/admin/system', { headers: { Authorization: `Bearer ${session?.access_token}` } }); if (res.success) setSystemSettings(res.settings); } catch (err) { } finally { setLoading(false); } }

    const handleAdminAction = async (targetUserId, actionType, details = {}) => {
        if (actionType === 'delete' && !window.confirm('🚨 تحذير صارم: هل أنت متأكد من حذف هذا الحساب نهائياً؟')) return;
        try { const { data: { session } } = await supabase.auth.getSession(); await api.post('/admin/action', { targetUserId, action: actionType, details }, { headers: { Authorization: `Bearer ${session?.access_token}` } }); showToast('تمت العملية', 'success'); if (activeTab === 'Users') fetchUsersSafely(); } catch (err) { showToast('فشل العملية', 'error') }
    }

    // 👑 مفاتيح النظام (إيقاف/تشغيل)
    const handleSystemToggle = async (feature, currentStatus) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await api.post('/admin/system/toggle', { feature, status: !currentStatus }, { headers: { Authorization: `Bearer ${session?.access_token}` } });
            if (res.success) { setSystemSettings(res.settings); showToast('تم تغيير حالة النظام بنجاح', 'success'); }
        } catch (err) { showToast('فشل التعديل', 'error'); }
    }

    // 👑 إطلاق البث
    const handleBroadcast = async () => {
        if (!broadcastForm.title || !broadcastForm.message) return showToast('يرجى ملء الحقول', 'error');
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await api.post('/admin/broadcast', broadcastForm, { headers: { Authorization: `Bearer ${session?.access_token}` } });
            showToast('تم إرسال البث العام بنجاح 🚀', 'success');
            setBroadcastForm({ title: '', message: '' });
        } catch (err) { showToast('فشل إرسال البث', 'error'); }
    }

    const cardBase = "bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl transition-colors duration-300"
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
                </div>

                {/* 1️⃣ اللوحة الرئيسية */}
                {activeTab === 'Dashboard' && (
                    <div className="animate-fade-in space-y-6">
                        {loading || !stats ? (
                            <div className={`${cardBase} py-12 text-center text-slate-400 text-xs font-bold animate-pulse`}>جاري حساب البيانات...</div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    <div className={`${cardBase} border-blue-200 dark:border-blue-900/50`}><p className="text-xs font-bold text-slate-500 mb-1">إجمالي المستخدمين</p><h3 className="text-2xl font-black text-blue-600">{stats.totalUsers}</h3></div>
                                    <div className={`${cardBase} border-emerald-200 dark:border-emerald-900/50`}><p className="text-xs font-bold text-slate-500 mb-1">النشطين</p><h3 className="text-2xl font-black text-emerald-600">{stats.activeUsers}</h3></div>
                                    <div className={`${cardBase} border-amber-200 dark:border-amber-900/50`}><p className="text-xs font-bold text-slate-500 mb-1">الباقات المدفوعة</p><h3 className="text-2xl font-black text-amber-600">{stats.paidUsers}</h3></div>
                                    <div className={`${cardBase} border-purple-200 dark:border-purple-900/50`}><p className="text-xs font-bold text-slate-500 mb-1">التوكنز المتداولة</p><h3 className="text-2xl font-black text-purple-600 font-mono">{stats.totalTokens?.toLocaleString()}</h3></div>
                                    <div className={`${cardBase} border-rose-200 dark:border-rose-900/50`}><p className="text-xs font-bold text-slate-500 mb-1">المحظورة</p><h3 className="text-2xl font-black text-rose-600">{stats.bannedUsers}</h3></div>
                                </div>
                                <div className={`${cardBase}`}>
                                    <h3 className="text-sm font-black mb-4 text-slate-800 dark:text-slate-200">⏱️ أحدث الأعضاء</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-right text-xs">
                                            <thead><tr className="border-b text-slate-500"><th className="pb-3">المستخدم</th><th className="pb-3">الإيميل</th><th className="pb-3">الباقة</th></tr></thead>
                                            <tbody>{stats.recentUsers?.map(u => (
                                                <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 dark:border-slate-800/30 dark:hover:bg-slate-900/10">
                                                    <td className="py-3 font-black">{u.full_name || 'بدون اسم'}</td>
                                                    <td className="py-3 font-mono text-slate-500">{u.email}</td>
                                                    <td className="py-3"><span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[9px] font-black uppercase">{u.plan}</span></td>
                                                </tr>
                                            ))}</tbody>
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

                {/* 3️⃣ الفواتير والأرباح */}
                {activeTab === 'Invoices' && (
                    <div className={`${cardBase} animate-fade-in`}>
                        <table className="w-full text-right text-xs">
                            <thead><tr className="border-b text-slate-500"><th className="pb-4">المعرف</th><th className="pb-4">المبلغ</th><th className="pb-4">الحالة</th></tr></thead>
                            <tbody>{invoices.map(i => (
                                <tr key={i.id} className="border-b">
                                    <td className="py-4 font-mono">#{i.id?.substring(0, 8).toUpperCase()}</td>
                                    <td className="py-4 font-black text-emerald-600">{Number(i.amount).toFixed(2)} {i.currency || 'SAR'}</td>
                                    <td className="py-4"><span className={`px-2 py-0.5 rounded text-[10px] font-black ${i.status === 'paid' || i.status === 'captured' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{i.status === 'paid' || i.status === 'captured' ? 'مدفوعة ✅' : i.status}</span></td>
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                )}

                {/* 4️⃣ الإحصائيات */}
                {activeTab === 'Analytics' && (
                    <div className="grid grid-cols-1 gap-6 animate-fade-in">
                        {loading || !analytics ? <div className={`${cardBase} py-12 text-center text-slate-400 text-xs font-bold animate-pulse`}>جاري تحليل البيانات...</div> : (
                            <>
                                <div className={`${cardBase}`}>
                                    <h3 className="text-sm font-black text-blue-600 mb-6">📈 نمو المشتركين شهرياً</h3>
                                    <div className="flex items-end gap-2 h-40 border-b border-slate-200 pb-2">
                                        {analytics.chartData.map((data, idx) => (
                                            <div key={idx} className="flex flex-col items-center flex-1 group">
                                                <div className="w-full max-w-[40px] bg-blue-500/20 hover:bg-blue-500 transition-all rounded-t-sm relative" style={{ height: `${(data.users / maxChartValue) * 100}%`, minHeight: '10%' }}>
                                                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-500 opacity-0 group-hover:opacity-100">{data.users}</span>
                                                </div>
                                                <span className="text-[8px] font-bold text-slate-400 mt-2">{data.month.substring(5)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* 5️⃣ استهلاك الذكاء الاصطناعي */}
                {activeTab === 'AI_Usage' && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fade-in">
                        {loading || !aiUsage ? <div className="col-span-full py-12 text-center text-slate-400 text-xs font-bold">جاري الجلب...</div> : (
                            <>
                                <div className={`${cardBase} border-purple-200`}><p className="text-xs font-bold text-slate-500">اليوم</p><h3 className="text-3xl font-black text-purple-600">{aiUsage.todayGenerations}</h3></div>
                                <div className={`${cardBase} border-indigo-200`}><p className="text-xs font-bold text-slate-500">الشهر</p><h3 className="text-3xl font-black text-indigo-600">{aiUsage.monthGenerations}</h3></div>
                                <div className={`${cardBase} border-rose-200`}><p className="text-xs font-bold text-slate-500">التوكنز المحروقة</p><h3 className="text-3xl font-black text-rose-600 font-mono">-{aiUsage.totalTokensBurned}</h3></div>
                            </>
                        )}
                    </div>
                )}

                {/* 6️⃣ الإشعارات (جديد وفعال) */}
                {activeTab === 'Notifications' && (
                    <div className={`${cardBase} max-w-2xl animate-fade-in`}>
                        <h3 className="text-sm font-black text-blue-600 mb-6 flex items-center gap-2"><span>📢</span> إرسال بث عام لجميع المستخدمين</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-1">عنوان الإشعار</label>
                                <input type="text" value={broadcastForm.title} onChange={e => setBroadcastForm({ ...broadcastForm, title: e.target.value })} placeholder="مثال: تحديث جديد للنظام 🚀" className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm font-bold outline-none" />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-slate-500 mb-1">نص الرسالة</label>
                                <textarea value={broadcastForm.message} onChange={e => setBroadcastForm({ ...broadcastForm, message: e.target.value })} placeholder="اكتب تفاصيل الإشعار هنا..." className="w-full h-32 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-3 text-sm font-bold outline-none resize-none" />
                            </div>
                            <button onClick={handleBroadcast} className="px-6 py-3 bg-blue-600 text-white rounded-xl text-xs font-black w-full hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                                إطلاق البث العام 🚀
                            </button>
                        </div>
                    </div>
                )}

                {/* 7️⃣ مفاتيح النظام (جديد وفعال) */}
                {activeTab === 'System' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        <div className={`${cardBase} border-rose-200 dark:border-rose-900/50 relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-rose-500 to-red-600"></div>
                            <h3 className="text-sm font-black text-rose-600 dark:text-rose-400 mb-6 flex items-center gap-2"><span>🚨</span> مفاتيح الإيقاف الفيدرالية (Kill Switches)</h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">وضع الصيانة (Maintenance)</p>
                                        <p className="text-[9px] text-slate-500 mt-1">يمنع المستخدمين من الدخول للمنصة</p>
                                    </div>
                                    <button onClick={() => handleSystemToggle('maintenance', systemSettings.maintenance)} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-colors ${systemSettings.maintenance ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30' : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}>
                                        {systemSettings.maintenance ? 'مُفعل (مغلق) 🔴' : 'إيقاف 🟢'}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <div>
                                        <p className="text-xs font-black text-slate-800 dark:text-slate-200">محرك الذكاء الاصطناعي</p>
                                        <p className="text-[9px] text-slate-500 mt-1">إيقاف التوليد لتخفيف الضغط أو الأخطاء</p>
                                    </div>
                                    <button onClick={() => handleSystemToggle('ai_engine', systemSettings.ai_engine)} className={`px-4 py-2 rounded-lg text-[10px] font-black transition-colors ${!systemSettings.ai_engine ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/30' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'}`}>
                                        {systemSettings.ai_engine ? 'يعمل 🟢' : 'مُعطل 🔴'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 8️⃣ سجل العمليات (جديد وفعال) */}
                {activeTab === 'Logs' && (
                    <div className={`${cardBase} animate-fade-in`}>
                        <h3 className="text-sm font-black mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2"><span>📋</span> أرشيف العمليات الإدارية الدقيقة (Audit Trail)</h3>
                        {loading ? (
                            <div className="py-12 text-center text-slate-400 text-xs font-bold animate-pulse">جاري سحب السجلات...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-right text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                                            <th className="pb-4 font-bold">المعرف</th>
                                            <th className="pb-4 font-bold">الإجراء (Action)</th>
                                            <th className="pb-4 font-bold">المستهدف</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.map((log, i) => (
                                            <tr key={i} className="border-b border-slate-100 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-900/10">
                                                <td className="py-4 font-mono text-slate-400 text-[10px]">#{log.id || i}</td>
                                                <td className="py-4">
                                                    <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded text-[9px] font-black font-mono">
                                                        {log.action}
                                                    </span>
                                                </td>
                                                <td className="py-4 font-mono text-blue-500 text-[10px]">{log.target_user_id?.substring(0, 8)}</td>
                                            </tr>
                                        ))}
                                        {logs.length === 0 && (
                                            <tr>
                                                <td colSpan="3" className="py-8 text-center text-slate-400 font-bold text-xs">لا توجد سجلات محفوظة حالياً أو أن الجدول قيد الإنشاء.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}