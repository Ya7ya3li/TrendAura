// 📊 مسار جلب إحصائيات اللوحة الرئيسية المتقدمة
router.get('/stats', async (req, res) => {
    try {
        // 1. حساب إجمالي المستخدمين
        const { count: totalUsers, error: err1 } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true });

        // 2. حساب المستخدمين المحظورين
        const { count: bannedUsers, error: err2 } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .eq('is_banned', true);

        // 3. حساب الباقات المدفوعة
        const { count: paidUsers, error: err3 } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })
            .neq('plan', 'free');

        // 4. سحب التوكنز لحساب إجمالي الأرصدة في النظام
        const { data: tokensData, error: err4 } = await supabase
            .from('profiles')
            .select('tokens');

        // 5. جلب آخر 5 مستخدمين سجلوا في النظام بالتفصيل
        const { data: recentUsers, error: err5 } = await supabase
            .from('profiles')
            .select('id, full_name, email, plan, updated_at')
            .order('updated_at', { ascending: false })
            .limit(5);

        if (err1 || err2 || err3 || err4 || err5) {
            throw (err1 || err2 || err3 || err4 || err5);
        }

        // حساب مجموع التوكنز برمجياً بدقة
        const totalTokens = tokensData?.reduce((sum, row) => sum + (row.tokens || 0), 0) || 0;

        res.json({
            success: true,
            stats: {
                totalUsers: totalUsers || 0,
                activeUsers: (totalUsers || 0) - (bannedUsers || 0),
                paidUsers: paidUsers || 0,
                bannedUsers: bannedUsers || 0,
                totalTokens: totalTokens,
                recentUsers: recentUsers || []
            }
        });
    } catch (error) {
        console.error("❌ Stats Fetch Error:", error);
        res.status(400).json({ success: false, error: error.message });
    }
});