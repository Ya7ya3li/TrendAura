import express from 'express'
import { ownerOnly } from '../middleware/owner.js'
import { authGuard } from '../middleware/auth.js'
import { supabase } from '../services/supabase.js' // يعتمد على الـ Service Role Key لتجاوز جدار حماية RLS والحذف المركزي

const router = express.Router()

// حماية فولاذية فيدرالية لكل المسارات أدناه
router.use(authGuard, ownerOnly)

// 📊 1. مسار جلب إحصائيات اللوحة الرئيسية المتقدمة
router.get('/stats', async (req, res) => {
    try {
        const { count: totalUsers, error: err1 } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
        const { count: bannedUsers, error: err2 } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_banned', true);
        const { count: paidUsers, error: err3 } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('plan', 'free');
        const { data: tokensData, error: err4 } = await supabase.from('profiles').select('tokens');
        const { data: recentUsers, error: err5 } = await supabase.from('profiles').select('id, full_name, email, plan, updated_at').order('updated_at', { ascending: false }).limit(5);

        if (err1 || err2 || err3 || err4 || err5) throw (err1 || err2 || err3 || err4 || err5);

        const totalTokens = tokensData?.reduce((sum, row) => sum + (row.tokens || 0), 0) || 0;

        res.json({
            success: true,
            stats: {
                totalUsers: totalUsers || 0,
                activeUsers: (totalUsers || 0) - (bannedUsers || 0),
                paidUsers: paidUsers || 0,
                bannedUsers: bannedUsers || 0,
                totalTokens: totalTokens,
                recentUsers: recentUsers || []
            }
        });
    } catch (error) {
        console.error("❌ Stats Fetch Error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// 👥 2. جلب المستخدمين بأمان من السيرفر
router.get('/users', async (req, res) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false })

    if (error) {
        console.error("❌ Supabase Admin Route Error:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
    res.json({ success: true, users: data })
})

// ⚡ 3. تنفيذ عمليات مصفوفة التحكم بالكامل (Action Matrix Controller)
router.post('/action', async (req, res) => {
    try {
        const { targetUserId, action, details } = req.body
        const adminId = req.user.id

        // جلب بيانات ملف المستخدم الحالية لضمان دقة العمليات الحسابية للأرصدة
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', targetUserId)
            .single();

        if (fetchError || !profile) {
            return res.status(404).json({ success: false, message: 'المستخدم المستهدف غير موجود في قاعدة البيانات.' });
        }

        let updateData = {};

        // تحليل العملية المطلوبة بالملي وتنفيذها شرطياً
        if (action === 'ban') {
            updateData.is_banned = true;
        } else if (action === 'unban') {
            updateData.is_banned = false;
        } else if (action === 'add_tokens') {
            const amount = Number(details?.amount) || 0;
            updateData.tokens = (profile.tokens || 0) + amount;
        } else if (action === 'remove_tokens') {
            const amount = Number(details?.amount) || 0;
            updateData.tokens = Math.max(0, (profile.tokens || 0) - amount);
        } else if (action === 'upgrade_plan') {
            updateData.plan = details?.plan || 'viral_engine';
        } else if (action === 'downgrade_plan') {
            updateData.plan = 'free';
        } else if (action === 'delete') {
            // سحق الحساب نهائياً من نظام المصادقة المركزي ومن ثم جدول البيانات الشخصية بالـ Service Role
            const { error: deleteAuthError } = await supabase.auth.admin.deleteUser(targetUserId);
            const { error: deleteProfileError } = await supabase.from('profiles').delete().eq('id', targetUserId);

            if (deleteAuthError || deleteProfileError) {
                throw (deleteAuthError || deleteProfileError);
            }
        }

        // تنفيذ التحديث في قاعدة البيانات لجميع العمليات عدا الحذف النهائي
        if (action !== 'delete') {
            const { error: updateError } = await supabase
                .from('profiles')
                .update(updateData)
                .eq('id', targetUserId);

            if (updateError) throw updateError;
        }

        // تسجيل العملية في أرشيف الأمن والرقابة الشامل للنظام (Audit Log)
        await supabase.from('admin_logs').insert({
            admin_id: adminId,
            action: action,
            target_user_id: targetUserId,
            details: details
        });

        res.json({ success: true });
    } catch (error) {
        console.error("❌ Admin Action Core Error:", error);
        res.status(400).json({ success: false, message: error.message });
    }
});

// 💳 4. مسار جلب الفواتير والعمليات المالية الحية (الفواتير والأرباح)
router.get('/invoices', async (req, res) => {
    try {
        // جلب البيانات المالية التاريخية من جدول الفواتير المعتمد في نظام ميسر (سواء تم تسميته invoices أو payments)
        const { data: invoices, error } = await supabase
            .from('invoices')
            .select('*')
            .order('updated_at', { ascending: false });

        if (error) {
            // جدار حماية تراجعي: إذا كان الجدول مسجلاً باسم payments يتم سحبه فوراً لتجنب انهيار الصفحة
            const { data: fallbackPayments, error: fallbackError } = await supabase
                .from('payments')
                .select('*')
                .order('updated_at', { ascending: false });

            if (fallbackError) throw error;
            return res.json({ success: true, invoices: fallbackPayments || [] });
        }

        res.json({ success: true, invoices: invoices || [] });
    } catch (error) {
        console.error("❌ Invoices Query Failure:", error);
        res.status(400).json({ success: false, message: error.message });
    }
});

export default router;