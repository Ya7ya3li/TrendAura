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

      // جلب حدود وقيود الباقة النشطة من ملف الثوابت الكلية الحامي للنظام الخلفي
      const currentLimits = CONSTANTS.PLAN_LIMITS[data.plan || 'free'] || CONSTANTS.PLAN_LIMITS['free'];

      return res.status(CONSTANTS.HTTP_STATUS.OK).json({
        success: true,
        data: {
          tier: data.plan || 'free',
          status: data.subscription_status || 'active',
          endsAt: data.current_period_end || null,
          limits: currentLimits
        }
      });
    } catch (error) {
      return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
    }
  }
};