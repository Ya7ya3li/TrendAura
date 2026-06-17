import { supabase } from '../services/supabase.js'

export const ownerOnly = async (req, res, next) => {
    try {
        const userId = req.user.id

        const { data } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single()

        if (data?.role !== 'super_owner') {
            return res.status(403).json({ success: false, message: 'Access Denied: Super Owner Only' })
        }

        next()
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Server Security Exception' })
    }
}