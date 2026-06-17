import React, { useState, useEffect } from 'react'
import { api } from '../../services/api.js' // 🔒 استخدام الـ Axios Instance الخاص بك بدلاً من Supabase
import SectionTitle from '../../components/common/SectionTitle.jsx'
import { showToast } from '../../App.jsx'

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('Users')
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)

    // الهيكل الشجري اللي طلبته
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
    }, [activeTab])

    // 🔒 جلب آمن عبر السيرفر الخاص بك وليس Supabase مباشرة
    const fetchUsersSafely = async () => {
        setLoading(true)
        try {
            const response = await api.get('/admin/users')
            if (response.data.success) {
                setUsers(response.data.users)
            }
        } catch (err) {
            showToast('خطأ في الاتصال بالخادم الآمن', 'error')
        } finally {
            setLoading(false)
        }
    }

    // 🔒 إرسال أمر للسيرفر لتنفيذ التعديل وتسجيله في admin_logs
    const handleAdminAction = async (targetUserId, actionType, details = {}) => {
        try {
            await api.post('/admin/action', { targetUserId, action: actionType, details })
            showToast('تم تنفيذ العملية وتسجيلها بالأرشيف', 'success')
            fetchUsersSafely() // تحديث الجدول
        } catch (err) {
            showToast('فشل تنفيذ العملية', 'error')
        }
    }

    const cardBase = "bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm dark:shadow-xl transition-colors duration-300"

    return (
        <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row gap-6 p-4 md:p-6 font-sans text-slate-900 dark:text-white dir-rtl text-right">

            {/* 🗂️ القائمة الجانبية للأدمن (Tree Structure) */}
            <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
                <h2 className="text-sm font-black mb-4 px-2 text-rose-600 dark:text-rose-400 border-b border-rose-100 dark:border-rose-900/50 pb-2">
                    Root Owner Hub
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
                <SectionTitle title={adminTabs.find(t => t.id === activeTab)?.label} badge="SUPER ADMIN" />

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
                                            <tr key={user.id} className="border-b border-slate-100 dark:border-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-900/20 transition-colors">
                                                <td className="py-4">
                                                    <p className="font-black text-slate-900 dark:text-white">{user.full_name}</p>
                                                    <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
                                                </td>
                                                <td className="py-4">
                                                    <p className="font-mono font-black text-emerald-600 dark:text-emerald-400">{user.tokens.toLocaleString()} T</p>
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
                                                        <button onClick={() => handleAdminAction(user.id, 'add_tokens', { amount: 1000 })} className="px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded text-[9px] font-black hover:bg-emerald-100 dark:hover:bg-emerald-500/20">➕ إضافة</button>
                                                        <button onClick={() => handleAdminAction(user.id, 'remove_tokens', { amount: 1000 })} className="px-2 py-1 bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded text-[9px] font-black hover:bg-amber-100 dark:hover:bg-amber-500/20">➖ خصم</button>
                                                        <button onClick={() => handleAdminAction(user.id, 'upgrade_plan', { plan: 'pro' })} className="px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded text-[9px] font-black hover:bg-blue-100 dark:hover:bg-blue-500/20">⬆ ترقية</button>
                                                        <button onClick={() => handleAdminAction(user.id, 'downgrade_plan')} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[9px] font-black hover:bg-slate-200 dark:hover:bg-slate-700">⬇ مجاني</button>

                                                        {user.is_banned ? (
                                                            <button onClick={() => handleAdminAction(user.id, 'unban')} className="px-2 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded text-[9px] font-black border border-emerald-200 dark:border-emerald-500/30">🔓 فك الحظر</button>
                                                        ) : (
                                                            <button onClick={() => handleAdminAction(user.id, 'ban')} className="px-2 py-1 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded text-[9px] font-black border border-rose-200 dark:border-rose-500/30">🚫 حظر</button>
                                                        )}

                                                        <button onClick={() => handleAdminAction(user.id, 'delete')} className="px-2 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded text-[9px] font-black hover:bg-red-100 dark:hover:bg-red-900/40 w-full mt-1 border border-red-200 dark:border-red-900/30">🗑 حذف الحساب نهائياً</button>
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

                {/* 🚨 قسم الطوارئ (System Controls) */}
                {activeTab === 'System' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                        <div className={`${cardBase} border-rose-200 dark:border-rose-900/50`}>
                            <h3 className="text-sm font-black text-rose-600 dark:text-rose-400 mb-6 flex items-center gap-2">
                                <span>🚨</span> مفاتيح التحكم المركزية
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl">
                                    <span className="text-xs font-black">وضع الصيانة (Maintenance)</span>
                                    <button className="px-4 py-1.5 bg-rose-600 text-white rounded-lg text-[10px] font-black">تفعيل</button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl">
                                    <span className="text-xs font-black">إيقاف محرك التوليد (AI Pause)</span>
                                    <button className="px-4 py-1.5 bg-amber-500 text-white rounded-lg text-[10px] font-black">تفعيل</button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl">
                                    <span className="text-xs font-black">إيقاف التسجيلات الجديدة</span>
                                    <button className="px-4 py-1.5 bg-slate-800 dark:bg-slate-700 text-white rounded-lg text-[10px] font-black">تفعيل</button>
                                </div>
                            </div>
                        </div>

                        <div className={`${cardBase} border-blue-200 dark:border-blue-900/50`}>
                            <h3 className="text-sm font-black text-blue-600 dark:text-blue-400 mb-6 flex items-center gap-2">
                                <span>📢</span> نظام البث العام (Announcements)
                            </h3>
                            <textarea
                                placeholder="اكتب إشعارك هنا..."
                                className="w-full h-24 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-bold mb-4 outline-none"
                            />
                            <div className="flex gap-2">
                                <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black">تفعيل ونشر البانر</button>
                                <button className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl text-[10px] font-black border border-slate-200 dark:border-slate-700">إطفاء البانر</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}