import { supabase } from '../services/supabase.js';
import { CONSTANTS } from '../config/constants.js';

export const subscriptionController = {
  /**
   * 👑 الاستعلام الفوري عن قيود ومميزات باقة الاشتراك النشطة
   */
  checkSubscriptionDetails: async (req, res) => {
    try {
      const userId = req.user.id;

      const { data, error } = await supabase
        .from('profiles')
        .select('plan, subscription_status, current_period_end')
        .eq('id', userId)
        .single();

      if (error) throw error;

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
  },

  /**
   * ⚡ حقن مكافأة تسجيل الدخول اليومي بأمان من جهة السيرفر
   */
  claimDailyReward: async (req, res) => {
    try {
      const userId = req.user.id;
      const todayStr = new Date().toISOString().split('T')[0];

      // جلب البروفايل للتحقق من تاريخ آخر جلب للمكافأة
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('tokens, last_login_date')
        .eq('id', userId)
        .single();

      if (fetchError || !profile) {
        return res.status(CONSTANTS.HTTP_STATUS.NOT_FOUND).json({ success: false, error: 'لم يتم العثور على حساب المستخدم.' });
      }

      if (profile.last_login_date === todayStr) {
        return res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'لقد قمت بالمطالبة بمكافأتك اليومية مسبقاً!' });
      }

      const updatedTokens = (profile.tokens || 0) + 2;

      // تحديث السجل بأمان عبر السيرفر
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          tokens: updatedTokens, 
          last_login_date: todayStr 
        })
        .eq('id', userId);

      if (updateError) throw updateError;

      return res.status(CONSTANTS.HTTP_STATUS.OK).json({ 
        success: true, 
        tokens: updatedTokens, 
        message: 'تم شحن مكافأة تسجيل الدخول اليومي (+2 توكنز) بنجاح!' 
      });
    } catch (error) {
      return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
    }
  },

  /**
   * 💳 إلغاء الاشتراك النشط بأمان وتصفير رتبة الحساب إلى مجاني
   */
  cancelSubscription: async (req, res) => {
    try {
      const userId = req.user.id;

      const { error } = await supabase
        .from('profiles')
        .update({ 
          plan: 'free', 
          subscription_status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;

      return res.status(CONSTANTS.HTTP_STATUS.OK).json({ 
        success: true, 
        message: 'تم إلغاء الاشتراك الحالي بنجاح وإعادتك للباقة المجانية.' 
      });
    } catch (error) {
      return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
    }
  }
};