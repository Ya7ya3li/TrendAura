import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

/**
 * TrendAura Core Sovereign Supabase Database Connector Client
 * Initialized with higher administrative service role capabilities to bypass RLS bounds safely from the خادم.
 */
if (!env.supabaseUrl || !env.supabaseServiceKey) {
  console.error('🚨 [Supabase Critical Config Error]: روابط الاتصال والمفاتيح السرية السيادية مفقودة بملف السيرفر الـ .env!');
}

export const supabase = createClient(env.supabaseUrl, env.supabaseServiceKey, {
  auth: {
    persistSession: false, // السيرفر لا يحتاج لحفظ جلسات التخزين محلياً كالفرونت إند
    autoRefreshToken: false
  }
});