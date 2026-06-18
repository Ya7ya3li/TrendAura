import React, { useState, useEffect } from 'react'
import { supabase } from '../../config/supabase.js'
import { api } from '../../services/api.js'
import SectionTitle from '../../components/common/SectionTitle.jsx'
import { showToast } from '../../App.jsx'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('Dashboard')
    const [users, setUsers] = useState([])
    const [invoices, setInvoices] = useState([]) // 👑 مصفوفة الفواتير الحية من قاعدة البيانات
    const [stats, setStats] = useState(null)
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
        if (activeTab === 'Invoices') fetchInvoicesSafely() // 👑 تفعيل جلب الفواتير لحظياً عند فتح التبويب
    }, [activeTab])

    const fetchStatsSafely = async () => {
        setLoading(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const response = await api.get('/admin/stats', {
                headers: { Authorization: `Bearer ${session?.access_token}` }
            })
            if (response.success) setStats(response.stats)
        } catch (err) {
            console.error("❌ Stats Error:", err)
        } finally {
            setLoading(false)
        }
    }

    const fetchUsersSafely = async () => {
        setLoading(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const response = await api.get('/admin/users', {
                headers: { Authorization: `Bearer ${session?.access_token}` }
            })
            if (response.success) setUsers(response.users)
        } catch (err) {
            showToast('خطأ في جلب بيانات المستخدمين', 'error')
        } finally {
            setLoading(false)
        }
    }

    // 👑 جلب الفواتير والعمليات المالية الحية من السيرفر
    const fetchInvoicesSafely = async () => {
        setLoading(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const response = await api.get('/admin/invoices', {
                headers: { Authorization: `Bearer ${session?.access_token}` }
            })
            if (response.success) setInvoices(response.invoices)
        } catch (err) {
            showToast('خطأ في الاتصال بسجلات الفواتير السيادية', 'error')
        } finally {
            setLoading(false)
        }
    }

    // ⚡ مصفوفة التحكم المركزية الفعالة بالكامل الحين
    const handleAdminAction = async (targetUserId, actionType, details = {}) => {
        // حماية تأكيدية قبل الحذف الفيدرالي للحساب
        if (actionType === 'delete' && !window.confirm('🚨 تحذير صارم: هل أنت متأكد من حذف هذا الحساب نهائياً من جذوره؟ لا يمكن التراجع!')) return;

        try {
            const { data: { session } } = await supabase.auth.getSession()
            await api.post('/admin/action',
                { targetUserId, action: actionType, details },
                { headers: { Authorization: `Bearer ${session?.access_token}` } }
            )
            showToast('تم معالجة العملية وتدوينها بالأرشيف بنجاح', 'success')
            if (activeTab === 'Users') fetchUsersSafely()
            if (activeTab === 'Dashboard') fetchStatsSafely()
        } catch (err) {
            showToast('فشل السيرفر في معالجة العملية الأمنية', 'error')
        }
    }

    const cardBase = "bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl transition-colors duration-300"

    return (
        <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row gap-6 p-4 md:p-6 font-sans text-slate-900 dark:text-white dir-rtl text-right">

            {/* 🗂️ القائمة الجانبية */}
            <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
                <h2 className="text-sm font-black mb-4 px-2 text-rose-600 dark:text-rose-400 border-b border-rose-100 dark:border-rose-900/50 pb-2">
                    TrendAura Command Center
                </h2>
                {adminTabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`w-full text-right px-4 py-3 rounded-2xl text-[11px] font-black transition-all flex items-center gap-3 ${activeTab === tab.id
                            ? 'bg-rose-600 text-white shadow-lg shadow-rose-500/20'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900/60 hover:text-slate-900 dark:hover:text-white'
                            }`}
                    >
                        <span className="text-sm">{tab.icon}</span>
                        <span>{tab.label}</span>
                    </button>
                ))}
            </div>

            {/* 🖥️ مساحة العرض الرئيسية */}
            <div className="flex-1 min-w-0">
                <div className="mb-6 flex justify-between items-center">
                    <SectionTitle title={adminTabs.find(t => t.id === activeTab)?.label} badge="SUPER ADMIN" />
                    {activeTab !== 'Users' && activeTab !== 'Dashboard' && activeTab !== 'Invoices' && activeTab !== 'System' && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-black rounded-full animate-pulse">
                            نموذج عرض (قيد الربط مع السيرفر) ⏳
                        </span>
                    )}
                </div>

                {/* 1️⃣ اللوحة الرئيسية */}
                {activeTab === 'Dashboard' && (
                    <div className="animate-fade-in space-y-6">
                        {loading || !stats ? (
                            <div className={`${cardBase} py-12 text-center text-slate-400 text-xs font-bold animate-pulse`}>جاري حساب البيانات الفيدرالية الحية...</div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    <div className={`${cardBase} border-blue-200 dark:border-blue-900/50`}>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">إجمالي المستخدمين</p>
                                        <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400">{stats.totalUsers}</h3>
                                    </div>
                                    <div className={`${cardBase} border-emerald-200 dark:border-emerald-900/50`}>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">المستخدمين النشطين</p>
                                        <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.activeUsers}</h3>
                                    </div>
                                    <div className={`${cardBase} border-amber-200 dark:border-amber-900/50`}>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">الباقات المدفوعة</p>
                                        <h3 className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.paidUsers}</h3>
                                    </div>
                                    <div className={`${cardBase} border-purple-200 dark:border-purple-900/50`}>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">التوكنز المتداولة</p>
                                        <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">{stats.totalTokens?.toLocaleString()}</h3>
                                    </div>
                                    <div className={`${cardBase} border-rose-200 dark:border-rose-900/50`}>
                                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">الحسابات المحظورة</p>
                                        <h3 className="text-2xl font-black text-rose-600 dark:text-rose-400">{stats.bannedUsers}</h3>
                                    </div>
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

                {/* 2️⃣ إدارة المستخدمين الفعالة 100% الحين */}
                {activeTab === 'Users' && (
                    <div className={`${cardBase} animate-fade-in`}>
                        {loading ? (
                            <div className="py-12 text-center text-slate-400 text-xs font-bold animate-pulse">جاري سحب البيانات المشفرة...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-right text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                                            <th className="pb-4 font-black">المستخدم</th>
                                            <th className="pb-4 font-black">الرصيد/الباقة</th>
                                            <th className="pb-4 font-black">الحالة</th>
                                            <th className="pb-4 font-black text-center">أزرار التحكم (Action Matrix)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map(user => (
                                            <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-900/20">
                                                <td className="py-4">
                                                    <p className="font-black text-slate-900 dark:text-white">{user.full_name}</p>
                                                    <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
                                                </td>
                                                <td className="py-4">
                                                    <p className="font-mono font-black text-emerald-600 dark:text-emerald-400">{user.tokens?.toLocaleString() || 0} T</p>
                                                    <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-cyan-400 px-2 py-0.5 rounded text-[8px] font-black uppercase mt-1 inline-block">{user.plan}</span>
                                                </td>
                                                <td className="py-4">
                                                    {user.is_banned
                                                        ? <span className="text-rose-500 text-[10px] font-black bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded">محظور 🚫</span>
                                                        : <span className="text-emerald-500 text-[10px] font-black">نشط ✅</span>
                                                    }
                                                </td>
                                                <td className="py-4">
                                                    <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-[280px] mx-auto">
                                                        <button onClick={() => handleAdminAction(user.id, 'add_tokens', { amount: 5000 })} className="px-2 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded text-[9px] font-black hover:bg-emerald-100">➕ 5k توكنز</button>
                                                        <button onClick={() => handleAdminAction(user.id, 'remove_tokens', { amount: 5000 })} className="px-2 py-1 bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 rounded text-[9px] font-black hover:bg-amber-100">➖ 5k توكنز</button>
                                                        <button onClick={() => handleAdminAction(user.id, 'upgrade_plan', { plan: 'viral_engine' })} className="px-2 py-1 bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 rounded text-[9px] font-black hover:bg-blue-100">⬆ ترقية لـ Viral</button>
                                                        <button onClick={() => handleAdminAction(user.id, 'downgrade_plan')} className="px-2 py-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 rounded text-[9px] font-black hover:bg-slate-200">⬇ خطة مجانية</button>
                                                        <button onClick={() => handleAdminAction(user.id, user.is_banned ? 'unban' : 'ban')} className={`px-2 py-1 rounded text-[9px] font-black border ${user.is_banned ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                                                            {user.is_banned ? '🔓 فك الحظر' : '🚫 حظر مركز'}
                                                        </button>
                                                        <button onClick={() => handleAdminAction(user.id, 'delete')} className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-[9px] font-black hover:bg-red-100 w-full mt-1 border border-red-200">🗑️ حذف الحساب فورا</button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* 3️⃣ الفواتير والأرباح الفعالة 100% الحين */}
                {activeTab === 'Invoices' && (
                    <div className={`${cardBase} animate-fade-in`}>
                        <h3 className="text-sm font-black mb-4 text-slate-800 dark:text-slate-200">💳 كشف الفواتير الحية وعمليات سداد ميسر</h3>
                        {loading ? (
                            <div className="py-12 text-center text-slate-400 text-xs font-bold animate-pulse">جاري جلب الفواتير والعمليات النقدية الحية...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-right text-xs">
                                    <thead>
                                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                                            <th className="pb-4 font-bold">معرف الفاتورة (Invoice ID)</th>
                                            <th className="pb-4 font-bold">المبلغ المدفوع</th>
                                            <th className="pb-4 font-bold">حالة السداد</th>
                                            <th className="pb-4 font-bold text-left">تاريخ الحركة</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map((inv) => (
                                            <tr key={inv.id} className="border-b border-slate-100 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-900/10">
                                                <td className="py-4 font-mono text-slate-600 dark:text-slate-400 text-xs font-bold">#{inv.id?.substring(0, 8).toUpperCase()}</td>
                                                <td className="py-4 font-black text-emerald-600 dark:text-emerald-400 font-mono">
                                                    {Number(inv.amount).toFixed(2)} {inv.currency || 'SAR'}
                                                </td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black ${inv.status === 'paid' || inv.status === 'captured'
                                                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400'
                                                        : 'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400'
                                                        }`}>
                                                        {inv.status === 'paid' || inv.status === 'captured' ? 'مدفوعة وجاهزة ✅' : inv.status}
                                                    </span>
                                                </td>
                                                <td className="py-4 font-mono text-slate-400 text-left">
                                                    {new Date(inv.updated_at || inv.created_at).toLocaleDateString('ar-SA')}
                                                </td>
                                            </tr>
                                        ))}
                                        {invoices.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="py-12 text-center text-slate-400 font-bold">لا توجد أي فواتير مسجلة في النظام حتى الآن.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* باقي التبويبات كنماذج عرض آمنة */}
                {activeTab === 'Analytics' && (
                    <div className={`${cardBase} h-48 flex items-center justify-center text-slate-400 text-xs font-bold animate-fade-in`}>📈 الرسوم البيانية المتطورة قيد الربط البرمجي...</div>
                )}
                {activeTab === 'AI_Usage' && (
                    <div className={`${cardBase} h-48 flex items-center justify-center text-slate-400 text-xs font-bold animate-fade-in`}>🧠 مراقبة استهلاك خوارزمية السكريبتات الذكية قيد الربط...</div>
                )}
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