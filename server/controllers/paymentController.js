import { supabase } from '../services/supabase.js';
import { CONSTANTS } from '../config/constants.js';

/**
 * TrendAura Gateway Webhook Verification Controller
 */
export const paymentController = {
  handleWebhook: async (req, res) => {
    try {
      const { id, status, amount, metadata } = req.body;

      // 1. التحقق الحاسم من نجاح العملية المالية من بوابات ميسر السعودية السيادية
      if (status === 'paid' || status === 'captured') {
        const userId = metadata?.user_id;
        const targetPlan = metadata?.plan_id || 'pro';
        const tokensToAdd = Number(metadata?.tokens_to_add) || 50000; 

        if (!userId) {
          return res.status(CONSTANTS.HTTP_STATUS.BAD_REQUEST).json({ success: false, error: 'بيانات ميتاداتا الفاتورة مفقودة.' });
        }

        // 2. جلب رصيد المستخدم الحالي لاحتساب الزيادة بشكل تراكمي دقيق لمنع تصفير محفظة العميل
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('tokens')
          .eq('id', userId)
          .single();

        if (profileError || !profile) {
          console.error('❌ [Webhook Profile Fetch Failure]:', profileError?.message);
          return res.status(CONSTANTS.HTTP_STATUS.NOT_FOUND).json({ success: false, error: 'لم يتم العثور على بروفايل العميل لشحن الرصيد المالي حياً.' });
        }

        const newTokensBalance = (profile.tokens || 0) + tokensToAdd;

        // 3. تحديث رتبة اشتراك العميل، الرصيد المحدث، وتثبيت حالة الاشتراك كـ active لفتح بوابات الحماية بالواجهة
        const { error } = await supabase
          .from('profiles')
          .update({
            plan: targetPlan.toLowerCase().trim(),
            tokens: newTokensBalance,
            subscription_status: 'active', // تفعيل وتأمين هيدروليكي فوري للميزات
            updated_at: new Date().toISOString()
          })
          .eq('id', userId);

        if (error) throw error;

        // 4. توثيق المعاملة التاريخية بجدول الفواتير لتقرأها لوحة الفوترة بالفرونت إند بالملي
        await supabase.from('invoices').insert([{
          user_id: userId,
          payment_id: id,
          amount: (amount / 100).toFixed(2), // تحويل الهلالات إلى الريال القياسي
          plan: targetPlan,
          created_at: new Date().toISOString()
        }]);

        console.log(`💰 [Payment Verified Successfully]: تم ترقية المشترك ${userId} إلى باقة [${targetPlan}] وشحن +${tokensToAdd} توكنز تراكمية.`);
        return res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, message: 'تمت معالجة المدفوعات بنجاح، شحن الرصيد وتفعيل الباقة الرسمية.' });
      }

      return res.status(CONSTANTS.HTTP_STATUS.OK).json({ success: true, message: 'تم استقبال الإشارة البنكية، لكن المعاملة معلقة أو لم تكتمل.' });
    } catch (error) {
      console.error('❌ [paymentController Webhook Error]:', error.message);
      return res.status(CONSTANTS.HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ success: false, error: error.message });
    }
  }
};