import { supabase } from '../services/supabase.js';
import { CONSTANTS } from '../config/constants.js';

/**
 * TrendAura Identity & Access Control Controller
 */
export const authController = {
  /**
   * جلب بيانات الملف الشخصي كاملة دون بتر لمنع وميض وتصفير عدادات الفرونت إند
   */
  getProfile: async (req, res) => {
    try {
      const userId = req.user.id;

      // 🏆 تم سحق الثغرة: إضافة الحقول السيادية كاملة لضمان عدم ضياع الصور والتوكنز عند الـ refresh
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, plan, tokens, avatar_url, subscription_status, created_at')
        .eq('id', userId)
        .single();

      if (error || !profile) {
        return res.status(CONSTANTS.HTTP_STATUS.NOT_FOUND).json({ 
          success: false, 
          error: 'الملف الشخصي لصانع المحتوى غير موجود بقاعدة البيانات.' 
        });
      }

      return res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, profile });
    } catch (error) {
      return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
    }
  },

  /**
   * تحديث الاسم الكريم للمبدع وتطهيره برمجياً
   */
  updateProfile: async (req, res) => {
    try {
      const userId = req.user.id;
      const { full_name } = req.body;

      if (!full_name || !full_name.trim()) {
        return res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'الاسم مطلوب لإتمام عملية التحديث.' });
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