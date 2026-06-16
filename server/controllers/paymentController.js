import { supabase } from '../services/supabase.js';
import { CONSTANTS } from '../config/constants.js';
import crypto from 'crypto';

/**
 * TrendAura Gateway Webhook & Invoice Generation Controller
 * تفعيل الرصد الهيدروليكي للمدفوعات وحقن التوكنز في سوبابيس بأمان 100%
 */
export const paymentController = {
  /**
   * 💸 إنشاء وتأمين فاتورة دفع جديدة عبر بوابة ميسر مع تفعيل وضع المحاكاة الديناميكي التلقائي
   */
  createInvoice: async (req, res) => {
    try {
      // 👈 استلام productType من الفرونت إند
      const { amount, planName, userId, productType } = req.body;
      const moyasarKey = process.env.MOYASAR_SECRET_KEY || '';
      const origin = req.headers.origin || 'https://trendaura-two.vercel.app';

      if (!userId) {
        return res.status(400).json({ success: false, error: 'المستخدم غير ممرر بشكل صحيح.' });
      }

      const cleanPlan = String(planName || 'pro').toLowerCase().trim();
      
      // 🛡️ الحصن البرمجي: توزين حزم التوكنز على المسطرة
      let calculatedTokens = 0; 
      
      if (cleanPlan === 'viral_engine' || cleanPlan === 'viral engine') {
        calculatedTokens = 10000; 
      } else if (cleanPlan === 'pro') {
        calculatedTokens = 1000;  
      } else if (cleanPlan === 'token_booster') {
        calculatedTokens = 5000;  
      } else if (cleanPlan === 'free') {
        calculatedTokens = 0;
      }

      const cleanAmountHalalas = Math.round(Number(amount) * 100);

      if (isNaN(cleanAmountHalalas) || cleanAmountHalalas < 100) {
        return res.status(400).json({ success: false, error: 'مبلغ الفاتورة غير صالح، الحد الأدنى 1 ريال سعودي.' });
      }

      if (!moyasarKey) {
        const mockInvoiceId = `sim_invoice_${crypto.randomUUID().slice(0, 8)}`;
        const simulatedUrl = `${origin}/success?payment_id=${mockInvoiceId}&amount=${amount}&plan=${cleanPlan}`;
        
        return res.status(200).json({
          success: true,
          invoiceUrl: simulatedUrl,
          message: 'تم إطلاق وضع السداد المحاكي بنجاح.'
        });
      }

      // 🧠 الميتاداتا الصارمة مع محدد نوع المنتج
      const strictMetadata = {
        user_id: String(userId),
        plan_id: String(cleanPlan),
        tokens_to_add: String(calculatedTokens),
        product_type: String(productType || (cleanPlan === 'token_booster' ? 'tokens' : 'subscription'))
      };

      const response = await fetch('https://api.moyasar.com/v1/invoices', {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${Buffer.from(moyasarKey + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: cleanAmountHalalas, 
          currency: 'SAR',
          description: `TrendAura - ${cleanPlan.toUpperCase()} Pack Activation`,
          callback_url: `${origin}/success`, 
          metadata: strictMetadata
        })
      });

      const paymentData = await response.json();
      if (!response.ok) {
        console.error('❌ [Moyasar API Response Error]:', paymentData);
        throw new Error(paymentData.message || 'Moyasar Ingestion Fault');
      }

      return res.status(200).json({
        success: true,
        invoiceUrl: paymentData.url 
      });

    } catch (error) {
      console.error('❌ [paymentController createInvoice Error]:', error.message);
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  /**
   * 🔍 استعلام مالي آمن للتحقق من الفاتورة
   */
  verifyPaymentStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const moyasarKey = process.env.MOYASAR_SECRET_KEY || '';

      if (!moyasarKey) {
        return res.status(200).json({ success: true, status: 'paid' });
      }

      const response = await fetch(`https://api.moyasar.com/v1/payments/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${Buffer.from(moyasarKey + ':').toString('base64')}`
        }
      });

      const paymentData = await response.json();
      return res.status(200).json({ success: true, status: paymentData.status });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  },

  /**
   * 🔔 استقبال إشارات السداد (Webhooks) من ميسر وحقن رصيد التوكنز وتفعيل الباقات
   */
  handleWebhook: async (req, res) => {
    try {
      const paymentData = req.body.data || req.body;
      const { id, status, amount, metadata } = paymentData;

      if (status === 'paid' || status === 'captured') {
        
        // 🚀 1. الحماية ضد التكرار (Idempotency Check)
        const { data: existingInvoice } = await supabase
          .from('invoices')
          .select('id')
          .eq('payment_id', id)
          .maybeSingle();

        if (existingInvoice) {
          console.log(`[Webhook] Payment ${id} already processed. Skipping to prevent double-charging.`);
          return res.status(200).json({ success: true, message: 'Already processed' });
        }

        let userId = metadata?.user_id;
        let targetPlan = metadata?.plan_id || 'pro';
        let tokensToAdd = Number(metadata?.tokens_to_add) || 0; 
        let productType = metadata?.product_type || 'subscription';

        if (!userId && paymentData.invoice_id) {
          try {
            const moyasarKey = process.env.MOYASAR_SECRET_KEY || '';
            const invResponse = await fetch(`https://api.moyasar.com/v1/invoices/${paymentData.invoice_id}`, {
              method: 'GET',
              headers: {
                'Authorization': `Basic ${Buffer.from(moyasarKey + ':').toString('base64')}`
              }
            });
            if (invResponse.ok) {
              const invData = await invResponse.json();
              userId = invData.metadata?.user_id;
              targetPlan = invData.metadata?.plan_id || 'pro';
              tokensToAdd = Number(invData.metadata?.tokens_to_add) || 0;
              productType = invData.metadata?.product_type || 'subscription';
            }
          } catch (fetchInvErr) {
            console.error('❌ [Webhook Fetch Invoice Error]:', fetchInvErr.message);
          }
        }

        if (!userId) {
          return res.status(400).json({ success: false, error: 'بيانات ميتاداتا الفاتورة مفقودة.' });
        }

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('tokens')
          .eq('id', userId)
          .single();

        if (profileError || !profile) {
          return res.status(404).json({ success: false, error: 'لم يتم العثور على بروفايل العميل.' });
        }

        const newTokensBalance = (profile.tokens || 0) + tokensToAdd;
        const isSubscription = productType === 'subscription';

        // 🚀 2. فصل التوكنز عن الاشتراكات (The Golden Rule)
        const profileUpdates = {
          tokens: newTokensBalance,
          updated_at: new Date().toISOString()
        };

        if (isSubscription) {
          profileUpdates.plan = targetPlan.toLowerCase().trim();
          profileUpdates.subscription_status = 'active';
        }

        const { error } = await supabase.from('profiles').update(profileUpdates).eq('id', userId);
        if (error) throw error;

        const { error: invoiceError } = await supabase.from('invoices').insert([{
          user_id: userId,
          payment_id: id,
          amount: (amount / 100).toFixed(2),
          plan_type: targetPlan.toUpperCase().trim(),
          created_at: new Date().toISOString()
        }]);

        if (invoiceError) throw new Error(`Supabase Invoice Failed: ${invoiceError.message}`);

        console.log(`💰 [Payment Verified]: Processed ${productType} for user ${userId}. Tokens added: ${tokensToAdd}`);
        return res.status(200).json({ success: true, message: 'تمت معالجة المدفوعات بنجاح.' });
      }

      return res.status(200).json({ success: true, message: 'المعاملة معلقة أو لم تكتمل.' });
    } catch (error) {
      console.error('❌ [paymentController Webhook Error]:', error.message);
      return res.status(500).json({ success: false, error: error.message });
    }
  }
};