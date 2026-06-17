import express from 'express'
import { ownerOnly } from '../middleware/owner.js'
import { authGuard } from '../middleware/auth.js' // 👑 تم التصحيح: استدعاء authGuard بدلاً من authenticate
import { supabase } from '../services/supabase.js' // استخدم الـ Service Role Key هنا لضمان تجاوز RLS بأمان

const router = express.Router()

// حماية فولاذية لكل المسارات أدناه باستخدام الحراس الصحيحين
router.use(authGuard, ownerOnly) // 👑 تم التصحيح هنا أيضاً

// 👥 جلب المستخدمين بأمان من السيرفر
router.get('/users', async (req, res) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('updated_at', { ascending: false }) // 👑 التعديل هنا: غيرناها إلى updated_at

    if (error) {
        console.error("❌ Supabase Admin Route Error:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
    res.json({ success: true, users: data })
})

// ⚡ تنفيذ العمليات (Action Logger)
router.post('/action', async (req, res) => {
    const { targetUserId, action, details } = req.body
    const adminId = req.user.id

    // 1. تنفيذ العملية (مثال: حظر)
    if (action === 'ban') {
        await supabase.from('profiles').update({ is_banned: true }).eq('id', targetUserId)
    }

    // 2. تسجيل العملية في الأرشيف (Audit Log)
    await supabase.from('admin_logs').insert({
        admin_id: adminId,
        action: action,
        target_user_id: targetUserId,
        details: details
    })

    res.json({ success: true })
})

export default router