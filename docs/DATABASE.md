# 📊 TrendAura V2 - Database Architecture & Schema

تعتمد المنصة على بنية تحتية سحابية هجينة وموزعة عبر **Supabase (PostgreSQL)**، مع تفعيل سياسات الأمان الصارمة (Row Level Security) لعزل بيانات صناع المحتوى ومنع أي تداخل رقمي بين الحسابات.

---

## 🧱 المصفوفة الهيكلية للجداول (Database Schema)

### 1. جدول الحسابات والبروفايل الرئيسي `profiles`
يخزن البيانات السيادية لصانع المحتوى ورصيده المالي من التوكنز:
* `id` (uuid, Primary Key) -> مرتبط بنظام الـ Auth المركزي لسوبابيس.
* `full_name` (text) -> الاسم المعروض للمستخدم في الترويسة والسايدبار.
* `email` (text) -> البريد الإلكتروني الموثق للعميل.
* `avatar_url` (text) -> رابط الصورة الشخصية المستضافة سحابياً في الـ Storage.
* `plan` (text) -> رتبة الباقة الحالية المعتمدة (`free` | `pro` | `viral_engine`).
* `subscription_status` (text) -> حالة الترخيص الحية للتنقل المحمي (`active` | `inactive`).
* `tokens` (integer) -> رصيد التوكنز التراكمي المتاح حالياً لمعالجة الأفكار.
* `created_at` / `updated_at` (timestamp) -> طوابع التشييد والتحديث التلقائي.

### 2. جدول السكريبتات والأرشيف `generated_scripts`
المستودع السحابي المسؤول عن تغذية شاشة السكربتات والأرشيف التاريخي:
* `id` (uuid, Primary Key) -> المعرف الفريد للسيناريو.
* `user_id` (uuid, Foreign Key) -> مرتبط برابط علاقة بجدول الـ `profiles`.
* `prompt_summary` (text) -> عنوان أو ملخص الفكرة التوليدية المعروض في القائمة.
* `content` (text) -> النص والسيناريو الكامل المولّد بواسطة محرك الذكاء الاصطناعي.
* `created_at` (timestamp) -> طابع تاريخ ووقت التوليد (يغذي عداد آخر نشاط).

### 3. جدول المقبوضات المالية وفواتير ميسر `invoices`
يغذي المقر المالي وشاشة إدارة الاشتراكات عند نجاح المعاملات البنكية:
* `id` (uuid, Primary Key) -> معرف الفاتورة الداخلي بالنظام.
* `user_id` (uuid, Foreign Key) -> مرتبط برابط علاقة بجدول الـ `profiles`.
* `payment_id` (text) -> رقم العملية الدولي والمشفر القادم من بوابة الدفع Moyasar.
* `amount` (numeric) -> المبلغ المدفوع بالعملة المحلية صافياً (SAR).
* `plan` (text) -> نوع الباقة المشتراة أو المشحونة تلقائياً.
* `created_at` (timestamp) -> تاريخ تنفيذ المعاملة البنكية بنجاح.

---

## 🛡️ سياسات الحماية وأمن البيانات السيادية (RLS SQL Scripts)
جميع الجداول مقفلة برمجياً ومحمية بسياسة عزل صارمة تمنع تسريب البيانات:

```sql
-- تفعيل جدار الحماية لجداول النظام
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- حقن سياسة العزل الحتمية لجدول المحفوظات والسيناريوهات
CREATE POLICY "Makers can only access their own viral scripts" 
ON generated_scripts 
FOR ALL 
USING (auth.uid() = user_id);