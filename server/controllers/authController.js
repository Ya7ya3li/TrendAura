import { supabase } from '../services/supabase.js';
import { CONSTANTS } from '../config/constants.js';

/**
 * TrendAura Identity & Access Control Controller
 */
export const authController = {
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      // جلب بيانات المستخدم وجدول الصلاحيات من سوبابيس
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, plan, created_at')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        return res.status(CONSTANTS.HTTP_STATUS.NOT_FOUND).json({ success: false, error: 'الملف الشخصي غير موجود.' });
      }

      return res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, profile });
    } catch (error) {
      return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { full_name } = req.body;

      if (!full_name || !full_name.trim()) {
        return res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'الاسم مطلوب.' });
      }

      const { data, error } = await supabase
        .from('profiles')
        .update({ full_name: full_name.trim() })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, data });
    } catch (error) {
      return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
    }
  }
};