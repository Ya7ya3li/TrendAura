import { supabase } from '../services/supabase.js';
import { CONSTANTS } from '../config/constants.js';

/**
 * TrendAura Subscription Entitlements Management Controller
 */
export const subscriptionController = {
  checkSubscriptionDetails: async (req, res) => {
    try {
      const userId = req.user.id;

      const { data, error } = await supabase
        .from('profiles')
        .select('plan, subscription_status, current_period_end')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // جلب حدود الباقة الحالية الثابتة من ملف الإعدادات الكلية
      const currentLimits = CONSTANTS.PLAN_LIMITS[data.plan || 'free'];

      return res.status(CONSTANTS.HTTP_STATUS.OK).json({
        success: true,
        data: {
          tier: data.plan,
          status: data.subscription_status || 'active',
          endsAt: data.current_period_end,
          limits: currentLimits
        }
      });
    } catch (error) {
      return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
    }
  }
};