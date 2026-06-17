import express from 'express'
import { ownerOnly } from '../middleware/owner.js'
import { authenticate } from '../middleware/auth.js'
import { supabase } from '../services/supabase.js' // استخدم الـ Service Role Key هنا لضمان تجاوز RLS بأمان

const router = express.Router()

// حماية فولاذية لكل المسارات أدناه
router.use(authenticate, ownerOnly)

// 👥 جلب المستخدمين بأمان من السيرفر
router.get('/users', async (req, res) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, plan, tokens, is_banned, created_at')
        .order('created_at', { ascending: false })

    if (error) return res.status(400).json({ success: false, error })
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