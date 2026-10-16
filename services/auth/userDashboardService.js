const db = require('../../config/db');

class UserDashboardService {
    /**
     * Get user dashboard statistics
     */
    async getDashboard(userId) {
        const postsRes = await db.query(
            "SELECT COUNT(*) FROM equipment_posts WHERE seller_id = $1 AND status != 'Archived'",
            [userId]
        );
        const inquiriesRes = await db.query(
            "SELECT COUNT(*) FROM inquiries WHERE seller_id = $1 OR buyer_id = $1",
            [userId]
        );

        const metricsRes = await db.query(`
            SELECT 
                COALESCE(SUM(em.view_count), 0) as total_views,
                COALESCE(SUM(em.click_count), 0) as total_clicks
            FROM equipment_posts ep
            LEFT JOIN engagement_metrics em ON em.equipment_post_id = ep.id
            WHERE ep.seller_id = $1 AND ep.status != 'Archived'
        `, [userId]);

        const bannerRes = await db.query(`
            SELECT 
                COALESCE(SUM(views_count), 0) as banner_views,
                COALESCE(SUM(clicks_count), 0) as banner_clicks
            FROM hero_banners
            WHERE seller_id = $1 OR equipment_post_id IN (SELECT id FROM equipment_posts WHERE seller_id = $1)
        `, [userId]);

        const totalViews = parseInt(metricsRes.rows[0].total_views, 10);
        const totalClicks = parseInt(metricsRes.rows[0].total_clicks, 10);
        const bannerViews = parseInt(bannerRes.rows[0].banner_views, 10);
        const bannerClicks = parseInt(bannerRes.rows[0].banner_clicks, 10);

        return {
            message: 'Welcome to Dashboard',
            stats: {
                totalPosts: parseInt(postsRes.rows[0].count, 10),
                totalInquiries: parseInt(inquiriesRes.rows[0].count, 10),
                totalViews,
                totalClicks,
                bannerViews,
                bannerClicks,
                productCtr: totalViews > 0 ? parseFloat(((totalClicks / totalViews) * 100).toFixed(1)) : 0,
                bannerCtr: bannerViews > 0 ? parseFloat(((bannerClicks / bannerViews) * 100).toFixed(1)) : 0
            }
        };
    }
}

module.exports = {
    UserDashboardService,
    userDashboardService: new UserDashboardService()
};
