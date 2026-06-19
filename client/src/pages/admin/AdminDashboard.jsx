import React, { useState, useEffect } from 'react'
import { supabase } from '../../config/supabase.js'
import { api } from '../../services/api.js'
import SectionTitle from '../../components/common/SectionTitle.jsx'
import { showToast } from '../../App.jsx'

// مكون أيقونات SVG مركزي لتنظيف الكود
const Icon = ({ path, className = "w-5 h-5" }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
)

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('Dashboard')
    const [users, setUsers] = useState([])
    const [invoices, setInvoices] = useState([])
    const [stats, setStats] = useState(null)
    const [analytics, setAnalytics] = useState(null)
    const [aiUsage, setAiUsage] = useState(null)
    const [logs, setLogs] = useState([])
    const [systemSettings, setSystemSettings] = useState({ maintenance: false, ai_engine: true })
    const [loading, setLoading] = useState(true)

    const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '' })

    // 🛸 مصفوفة الأقسام مع SVGs مخصصة
    const adminTabs = [
        { id: 'Dashboard', icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z", label: 'مركز القيادة' },
        { id: 'Users', icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z", label: 'إدارة الكيانات' },
        { id: 'Invoices', icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z", label: 'تدفق الأموال' },
        { id: 'Analytics', icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6", label: 'رادار النمو' },
        { id: 'AI_Usage', icon: "M13 10V3L4 14h7v7l9-11h-7z", label: 'طاقة الذكاء الاصطناعي' },
        { id: 'Notifications', icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9", label: 'البث العام' },
        { id: 'System', icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z", label: 'بروتوكول الطوارئ' },
        { id: 'Logs', icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", label: 'أرشيف العمليات' }
    ]

    useEffect(() => {
        if (activeTab === 'Users') fetchUsersSafely()
        if (activeTab === 'Dashboard') fetchStatsSafely()
        if (activeTab === 'Invoices') fetchInvoicesSafely()
        if (activeTab === 'Analytics') fetchAnalyticsSafely()
        if (activeTab === 'AI_Usage') fetchAiUsageSafely()
        if (activeTab === 'Logs') fetchLogsSafely()
        if (activeTab === 'System') fetchSystemSafely()
    }, [activeTab])

    const fetchStatsSafely = async () => { setLoading(true); try { const { data: { session } } = await supabase.auth.getSession(); const res = await api.get('/admin/stats', { headers: { Authorization: `Bearer ${session?.access_token}` } }); if (res.success) setStats(res.stats); } catch (err) { } finally { setLoading(false); } }
    const fetchUsersSafely = async () => { setLoading(true); try { const { data: { session } } = await supabase.auth.getSession(); const res = await api.get('/admin/users', { headers: { Authorization: `Bearer ${session?.access_token}` } }); if (res.success) setUsers(res.users); } catch (err) { } finally { setLoading(false); } }
    const fetchInvoicesSafely = async () => { setLoading(true); try { const { data: { session } } = await supabase.auth.getSession(); const res = await api.get('/admin/invoices', { headers: { Authorization: `Bearer ${session?.access_token}` } }); if (res.success) setInvoices(res.invoices); } catch (err) { } finally { setLoading(false); } }
    const fetchAnalyticsSafely = async () => { setLoading(true); try { const { data: { session } } = await supabase.auth.getSession(); const res = await api.get('/admin/analytics', { headers: { Authorization: `Bearer ${session?.access_token}` } }); if (res.success) setAnalytics(res.analytics); } catch (err) { } finally { setLoading(false); } }
    const fetchAiUsageSafely = async () => { setLoading(true); try { const { data: { session } } = await supabase.auth.getSession(); const res = await api.get('/admin/ai-usage', { headers: { Authorization: `Bearer ${session?.access_token}` } }); if (res.success) setAiUsage(res.aiStats); } catch (err) { } finally { setLoading(false); } }
    const fetchLogsSafely = async () => { setLoading(true); try { const { data: { session } } = await supabase.auth.getSession(); const res = await api.get('/admin/logs', { headers: { Authorization: `Bearer ${session?.access_token}` } }); if (res.success) setLogs(res.logs); } catch (err) { } finally { setLoading(false); } }
    const fetchSystemSafely = async () => { setLoading(true); try { const { data: { session } } = await supabase.auth.getSession(); const res = await api.get('/admin/system', { headers: { Authorization: `Bearer ${session?.access_token}` } }); if (res.success) setSystemSettings(res.settings); } catch (err) { } finally { setLoading(false); } }

    const handleAdminAction = async (targetUserId, actionType, details = {}) => {
        if (actionType === 'delete' && !window.confirm('🚨 تحذير صارم: هل أنت متأكد من سحق هذا الكيان نهائياً من قاعدة البيانات؟')) return;
        try { const { data: { session } } = await supabase.auth.getSession(); await api.post('/admin/action', { targetUserId, action: actionType, details }, { headers: { Authorization: `Bearer ${session?.access_token}` } }); showToast('تم تنفيذ الأمر', 'success'); if (activeTab === 'Users') fetchUsersSafely(); } catch (err) { showToast('فشل التنفيذ', 'error') }
    }

    const handleSystemToggle = async (feature, currentStatus) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await api.post('/admin/system/toggle', { feature, status: !currentStatus }, { headers: { Authorization: `Bearer ${session?.access_token}` } });
            if (res.success) { setSystemSettings(res.settings); showToast('تم تغيير حالة البروتوكول', 'success'); }
        } catch (err) { showToast('فشل التعديل', 'error'); }
    }

    const handleBroadcast = async () => {
        if (!broadcastForm.title || !broadcastForm.message) return showToast('يرجى تعبئة الحقول', 'error');
        try {
            const { data: { session } } = await supabase.auth.getSession();
            await api.post('/admin/broadcast', broadcastForm, { headers: { Authorization: `Bearer ${session?.access_token}` } });
            showToast('تم إرسال الإشارة عبر النطاق', 'success');
            setBroadcastForm({ title: '', message: '' });
        } catch (err) { showToast('فشل الإرسال', 'error'); }
    }

    // 🛸 معمارية البطاقات الزجاجية والمضيئة
    const cardBase = "bg-[#0B1221]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.4)] relative overflow-hidden transition-all duration-300 hover:border-cyan-500/30 hover:shadow-[0_0_20px_rgba(6,182,212,0.15)] group"
    const maxChartValue = analytics?.chartData?.reduce((max, d) => Math.max(max, d.users), 0) || 1;

    return (
        // 🌌 الحاوية الرئيسية: خلفية داكنة قاتمة مع شبكة مخفية (Cyberpunk Vibe)
        <div className="min-h-screen bg-[#050A14] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#0A1628] via-[#050A14] text-slate-300 dir-rtl text-right font-sans selection:bg-cyan-500/30 selection:text-cyan-200">

            {/* Header / Nav */}
            <header className="border-b border-white/5 bg-[#0B1221]/50 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-[1400px] mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                        </div>
                        <h1 className="text-lg font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 uppercase">
                            TrendAura // Core
                        </h1>
                    </div>
                    <span className="px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[10px] font-mono tracking-widest uppercase shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                        System Online
                    </span>
                </div>
            </header>

            <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row gap-6 p-4 md:p-6">

                {/* 🗂️ القائمة الجانبية (Sidebar) */}
                <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
                    {adminTabs.map(tab => (
                        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                            className={`w-full text-right px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-3 border ${activeTab === tab.id
                                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                : 'border-transparent text-slate-500 hover:text-slate-300 hover:bg-white/5 hover:border-white/10'
                                }`}>
                            <Icon path={tab.icon} className="w-5 h-5 opacity-80" />
                            <span className="tracking-wide">{tab.label}</span>
                            {activeTab === tab.id && <div className="mr-auto w-1 h-4 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]"></div>}
                        </button>
                    ))}
                </div>

                {/* 🖥️ مساحة العرض الرئيسية */}
                <div className="flex-1 min-w-0">
                    <div className="mb-6 flex justify-between items-center">
                        <h2 className="text-2xl font-black text-white flex items-center gap-3">
                            <Icon path={adminTabs.find(t => t.id === activeTab)?.icon} className="w-8 h-8 text-cyan-500" />
                            {adminTabs.find(t => t.id === activeTab)?.label}
                        </h2>
                    </div>

                    {/* 1️⃣ اللوحة الرئيسية */}
                    {activeTab === 'Dashboard' && (
                        <div className="animate-fade-in space-y-6">
                            {loading || !stats ? (
                                <div className={`${cardBase} flex justify-center py-12`}><div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                        <div className={`${cardBase}`}><div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div><p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Total Entities</p><h3 className="text-2xl font-black text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">{stats.totalUsers}</h3></div>
                                        <div className={`${cardBase}`}><div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div><p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Active Nodes</p><h3 className="text-2xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">{stats.activeUsers}</h3></div>
                                        <div className={`${cardBase}`}><div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div><p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Pro Subnets</p><h3 className="text-2xl font-black text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]">{stats.paidUsers}</h3></div>
                                        <div className={`${cardBase}`}><div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div><p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Tokens Circulating</p><h3 className="text-2xl font-black text-purple-400 font-mono drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]">{stats.totalTokens?.toLocaleString()}</h3></div>
                                        <div className={`${cardBase}`}><div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div><p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Isolated</p><h3 className="text-2xl font-black text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.5)]">{stats.bannedUsers}</h3></div>
                                    </div>
                                    <div className={`${cardBase}`}>
                                        <h3 className="text-xs font-black tracking-widest uppercase mb-4 text-slate-400 flex items-center gap-2"><Icon path="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" className="w-4 h-4" /> Recent Connections</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-right text-xs">
                                                <thead><tr className="border-b border-white/5 text-slate-600 uppercase tracking-wider text-[10px]"><th className="pb-3 font-medium">Entity Name</th><th className="pb-3 font-medium">Network ID</th><th className="pb-3 font-medium">Clearance</th></tr></thead>
                                                <tbody>{stats.recentUsers?.map(u => (
                                                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                                        <td className="py-3 font-bold text-slate-200">{u.full_name || 'Anonymous Node'}</td>
                                                        <td className="py-3 font-mono text-cyan-500/70">{u.email}</td>
                                                        <td className="py-3"><span className="border border-blue-500/30 bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">{u.plan}</span></td>
                                                    </tr>
                                                ))}</tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* 2️⃣ إدارة الكيانات (المستخدمين) */}
                    {activeTab === 'Users' && (
                        <div className={`${cardBase} animate-fade-in`}>
                            <div className="overflow-x-auto">
                                <table className="w-full text-right text-xs">
                                    <thead><tr className="border-b border-white/10 text-slate-500 text-[10px] uppercase tracking-widest"><th className="pb-4 font-medium">الكيان</th><th className="pb-4 font-medium">الموارد / الصلاحية</th><th className="pb-4 font-medium">حالة الاتصال</th><th className="pb-4 text-center font-medium">لوحة التحكم التنفيذية</th></tr></thead>
                                    <tbody>{users.map(u => (
                                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                            <td className="py-4"><p className="font-bold text-slate-200">{u.full_name}</p><p className="text-[10px] font-mono text-cyan-600/70 mt-1">{u.email}</p></td>
                                            <td className="py-4"><p className="font-mono text-emerald-400">{u.tokens?.toLocaleString() || 0} T</p><span className="border border-blue-500/30 bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider mt-1 inline-block">{u.plan}</span></td>
                                            <td className="py-4">
                                                {u.is_banned ?
                                                    <span className="flex items-center gap-1 text-rose-500 text-[10px] font-black"><span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> محظور</span> :
                                                    <span className="flex items-center gap-1 text-emerald-500 text-[10px] font-black"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"></span> متصل</span>}
                                            </td>
                                            <td className="py-4 text-center">
                                                <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[280px] mx-auto">
                                                    <button onClick={() => handleAdminAction(u.id, 'add_tokens', { amount: 5000 })} className="flex items-center gap-1 px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded hover:bg-emerald-500/20 text-[9px] font-bold"><Icon path="M12 4v16m8-8H4" className="w-3 h-3" /> 5k</button>
                                                    <button onClick={() => handleAdminAction(u.id, 'remove_tokens', { amount: 5000 })} className="flex items-center gap-1 px-2 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded hover:bg-amber-500/20 text-[9px] font-bold"><Icon path="M20 12H4" className="w-3 h-3" /> 5k</button>
                                                    <button onClick={() => handleAdminAction(u.id, 'upgrade_plan', { plan: 'viral_engine' })} className="flex items-center gap-1 px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded hover:bg-blue-500/20 text-[9px] font-bold"><Icon path="M5 10l7-7m0 0l7 7m-7-7v18" className="w-3 h-3" /> ترقية</button>
                                                    <button onClick={() => handleAdminAction(u.id, 'downgrade_plan')} className="flex items-center gap-1 px-2 py-1 bg-slate-500/10 text-slate-400 border border-slate-500/20 rounded hover:bg-slate-500/20 text-[9px] font-bold"><Icon path="M19 14l-7 7m0 0l-7-7m7 7V3" className="w-3 h-3" /> تنزيل</button>
                                                    <button onClick={() => handleAdminAction(u.id, u.is_banned ? 'unban' : 'ban')} className={`flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold border ${u.is_banned ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border-rose-500/30'}`}>
                                                        <Icon path={u.is_banned ? "M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" : "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"} className="w-3 h-3" />
                                                        {u.is_banned ? 'إلغاء الحظر' : 'حظر الشبكة'}
                                                    </button>
                                                    <button onClick={() => handleAdminAction(u.id, 'delete')} className="flex items-center justify-center gap-1 px-2 py-1 bg-red-600/20 text-red-400 rounded hover:bg-red-600/30 text-[9px] font-bold w-full mt-1 border border-red-500/30 transition-all">
                                                        <Icon path="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" className="w-3 h-3" /> سحق البيانات
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}</tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* 3️⃣ الفواتير */}
                    {activeTab === 'Invoices' && (
                        <div className={`${cardBase} animate-fade-in`}>
                            <table className="w-full text-right text-xs">
                                <thead><tr className="border-b border-white/10 text-slate-500 text-[10px] uppercase tracking-widest"><th className="pb-4 font-medium">معرف المعاملة</th><th className="pb-4 font-medium">الكمية</th><th className="pb-4 font-medium">الحالة</th></tr></thead>
                                <tbody>{invoices.map(i => (
                                    <tr key={i.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                                        <td className="py-4 font-mono text-slate-400">#{i.id?.substring(0, 8).toUpperCase()}</td>
                                        <td className="py-4 font-black text-emerald-400 drop-shadow-[0_0_5px_rgba(16,185,129,0.3)]">{Number(i.amount).toFixed(2)} {i.currency || 'SAR'}</td>
                                        <td className="py-4"><span className={`px-2 py-1 rounded border text-[9px] font-black uppercase tracking-wide ${i.status === 'paid' || i.status === 'captured' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
                                            {i.status === 'paid' || i.status === 'captured' ? 'CLEARED' : i.status}
                                        </span></td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    )}

                    {/* 4️⃣ رادار النمو */}
                    {activeTab === 'Analytics' && (
                        <div className="grid grid-cols-1 gap-6 animate-fade-in">
                            {loading || !analytics ? <div className={`${cardBase} flex justify-center py-12`}><div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin"></div></div> : (
                                <div className={`${cardBase}`}>
                                    <h3 className="text-xs font-black tracking-widest text-cyan-400 uppercase mb-8 flex items-center gap-2"><Icon path="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" className="w-4 h-4" /> Network Expansion Rate</h3>
                                    <div className="flex items-end gap-2 h-40 border-b border-white/10 pb-2 relative">
                                        {/* خطوط الشبكة الخلفية */}
                                        <div className="absolute inset-0 flex flex-col justify-between opacity-10 pointer-events-none">
                                            <div className="w-full border-t border-cyan-500 border-dashed"></div>
                                            <div className="w-full border-t border-cyan-500 border-dashed"></div>
                                            <div className="w-full border-t border-cyan-500 border-dashed"></div>
                                        </div>
                                        {analytics.chartData.map((data, idx) => (
                                            <div key={idx} className="flex flex-col items-center flex-1 group z-10">
                                                <div className="w-full max-w-[40px] bg-gradient-to-t from-cyan-600/20 to-cyan-400/80 hover:to-cyan-300 transition-all rounded-t-sm relative border-t border-cyan-300/50" style={{ height: `${(data.users / maxChartValue) * 100}%`, minHeight: '10%' }}>
                                                    <span className="absolute -top-7 left-1/2 -translate-x-1/2 text-[10px] font-mono font-black text-cyan-300 opacity-0 group-hover:opacity-100 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">{data.users}</span>
                                                </div>
                                                <span className="text-[8px] font-mono tracking-wider text-slate-500 mt-2">{data.month.substring(5)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 5️⃣ طاقة الذكاء */}
                    {activeTab === 'AI_Usage' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                            {loading || !aiUsage ? <div className="col-span-full py-12 text-center text-cyan-500/50 text-xs font-bold font-mono">LOADING DATA_CORE...</div> : (
                                <>
                                    <div className={`${cardBase}`}><div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div><p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">24h Compute</p><h3 className="text-4xl font-black text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]">{aiUsage.todayGenerations}</h3></div>
                                    <div className={`${cardBase}`}><div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div><p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Monthly Cycle</p><h3 className="text-4xl font-black text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]">{aiUsage.monthGenerations}</h3></div>
                                    <div className={`${cardBase}`}><div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div><p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Tokens Incinerated</p><h3 className="text-4xl font-black text-rose-500 font-mono drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">-{aiUsage.totalTokensBurned}</h3></div>
                                </>
                            )}
                        </div>
                    )}

                    {/* 6️⃣ الإشعارات */}
                    {activeTab === 'Notifications' && (
                        <div className={`${cardBase} max-w-2xl animate-fade-in`}>
                            <h3 className="text-xs font-black tracking-widest text-cyan-400 uppercase mb-6 flex items-center gap-2"><Icon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" className="w-4 h-4" /> Global Broadcast Signal</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[9px] uppercase tracking-widest font-bold text-slate-500 mb-2">Signal Header</label>
                                    <input type="text" value={broadcastForm.title} onChange={e => setBroadcastForm({ ...broadcastForm, title: e.target.value })} placeholder="SYS_UPDATE_V2.0" className="w-full bg-[#050A14] border border-white/10 rounded-lg p-3 text-sm text-cyan-100 font-mono outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all" />
                                </div>
                                <div>
                                    <label className="block text-[9px] uppercase tracking-widest font-bold text-slate-500 mb-2">Payload Data</label>
                                    <textarea value={broadcastForm.message} onChange={e => setBroadcastForm({ ...broadcastForm, message: e.target.value })} placeholder="Enter broadcast payload..." className="w-full h-32 bg-[#050A14] border border-white/10 rounded-lg p-3 text-sm text-cyan-100 font-mono outline-none resize-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all" />
                                </div>
                                <button onClick={handleBroadcast} className="flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600/20 border border-cyan-500/50 text-cyan-400 rounded-lg text-xs font-black uppercase tracking-widest w-full hover:bg-cyan-500 hover:text-[#050A14] transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_25px_rgba(6,182,212,0.6)]">
                                    <Icon path="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" className="w-4 h-4" /> Initiate Broadcast
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 7️⃣ مفاتيح الطوارئ (Cyberpunk Style) */}
                    {activeTab === 'System' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                            {/* تأثير خلفية تحذيرية */}
                            <div className={`${cardBase} border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.1)] relative overflow-hidden`}>
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 to-rose-500"></div>
                                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(244,63,94,0.03)_10px,rgba(244,63,94,0.03)_20px)] pointer-events-none"></div>

                                <h3 className="text-xs font-black tracking-widest uppercase text-rose-500 mb-8 flex items-center gap-2">
                                    <Icon path="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" className="w-5 h-5" />
                                    Federal Kill Switches
                                </h3>

                                <div className="space-y-4 relative z-10">
                                    <div className="flex items-center justify-between p-4 bg-[#050A14]/80 backdrop-blur-md rounded-xl border border-rose-500/10">
                                        <div>
                                            <p className="text-xs font-bold text-slate-200 tracking-wide">Global Lockdown (Maintenance)</p>
                                            <p className="text-[9px] font-mono text-slate-500 mt-1">Disconnects all nodes instantly</p>
                                        </div>
                                        <button onClick={() => handleSystemToggle('maintenance', systemSettings.maintenance)} className={`relative flex items-center gap-2 px-4 py-2 rounded border text-[10px] font-black tracking-widest uppercase transition-all ${systemSettings.maintenance ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)]' : 'bg-transparent text-slate-500 border-slate-700 hover:border-slate-500'}`}>
                                            {systemSettings.maintenance && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>}
                                            {systemSettings.maintenance ? 'LOCKED DOWN' : 'ARM SYSTEM'}
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 bg-[#050A14]/80 backdrop-blur-md rounded-xl border border-rose-500/10">
                                        <div>
                                            <p className="text-xs font-bold text-slate-200 tracking-wide">AI Core Engine</p>
                                            <p className="text-[9px] font-mono text-slate-500 mt-1">Halt all generative processes</p>
                                        </div>
                                        <button onClick={() => handleSystemToggle('ai_engine', systemSettings.ai_engine)} className={`relative flex items-center gap-2 px-4 py-2 rounded border text-[10px] font-black tracking-widest uppercase transition-all ${!systemSettings.ai_engine ? 'bg-rose-500 text-white border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.6)]' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30'}`}>
                                            {!systemSettings.ai_engine && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>}
                                            {systemSettings.ai_engine ? 'CORE ACTIVE' : 'CORE HALTED'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 8️⃣ أرشيف العمليات */}
                    {activeTab === 'Logs' && (
                        <div className={`${cardBase} animate-fade-in`}>
                            <h3 className="text-xs font-black tracking-widest uppercase text-cyan-400 mb-6 flex items-center gap-2"><Icon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" className="w-4 h-4" /> System Audit Trail</h3>
                            {loading ? (
                                <div className="py-12 text-center text-cyan-500/50 font-mono text-xs font-bold animate-pulse">DECRYPTING_LOGS...</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-right text-xs">
                                        <thead>
                                            <tr className="border-b border-white/10 text-slate-500 text-[10px] uppercase tracking-widest">
                                                <th className="pb-4 font-medium">Tx ID</th>
                                                <th className="pb-4 font-medium">Executed Protocol</th>
                                                <th className="pb-4 font-medium">Target Node</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {logs.map((log, i) => (
                                                <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                                                    <td className="py-4 font-mono text-slate-500 text-[10px]">#{log.id || i}</td>
                                                    <td className="py-4">
                                                        <span className="bg-[#050A14] border border-slate-800 text-cyan-400 px-2 py-1 rounded text-[9px] font-black font-mono tracking-wider">
                                                            {log.action}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 font-mono text-slate-400 text-[10px]">{log.target_user_id?.substring(0, 8)}</td>
                                                </tr>
                                            ))}
                                            {logs.length === 0 && (
                                                <tr>
                                                    <td colSpan="3" className="py-8 text-center text-slate-600 font-mono text-[10px] uppercase tracking-widest">No terminal records found.</td>
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
        </div>
    )
}