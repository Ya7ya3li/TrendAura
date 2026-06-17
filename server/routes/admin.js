import express from 'express'
import { ownerOnly } from '../middleware/owner.js'
import { authGuard } from '../middleware/auth.js'
import { supabase } from '../services/supabase.js'

const router = express.Router()

// حماية فولاذية لكل المسارات أدناه
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

// ⚡ 3. تنفيذ العمليات (Action Logger)
router.post('/action', async (req, res) => {
    const { targetUserId, action, details } = req.body
    const adminId = req.user.id

    // تنفيذ العملية (مثال: حظر)
    if (action === 'ban') {
        await supabase.from('profiles').update({ is_banned: true }).eq('id', targetUserId)
    }

    // تسجيل العملية في الأرشيف (Audit Log)
    await supabase.from('admin_logs').insert({
        admin_id: adminId,
        action: action,
        target_user_id: targetUserId,
        details: details
    })

    res.json({ success: true })
})

// 👑 السطر السحري اللي كان مفقود ومسبب الكراش
export default router;