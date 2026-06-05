import { supabase } from '../services/supabase.js';
import { CONSTANTS } from '../config/constants.js';

/**
 * TrendAura Token & Generation Quota Tracker Controller
 */
export const usageController = {
  getDailyUsage: async (req, res) => {
    try {
      const userId = req.user.id;
      const today = new Date().toISOString().split('T')[0]; // لقط التاريخ الحالي بصيغة لقمة الـ ISO

      // جلب عدد السكريبتات المستهلكة لليوم من مستودع الـ user_usage
      const { data, error } = await supabase
        .from('user_usage')
        .select('generation_count')
        .eq('user_id', userId)
        .eq('usage_date', today)
        .maybeSingle();

      if (error) throw error;

      const currentCount = data ? data.generation_count : 0;

      return res.status(CONSTANTS.HTTP_STATUS.OK).json({
        success: true,
        data: {
          used: currentCount,
          date: today
        }
      });
    } catch (error) {
      return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
    }
  }
};