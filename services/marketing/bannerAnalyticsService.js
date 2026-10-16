const db = require('../../config/db');

/**
 * BannerAnalyticsService
 * Tracks banner impressions, views, clicks, and analytics events
 */
class BannerAnalyticsService {
    /**
     * Track Banner Impression/View
     */
    async trackBannerView(id) {
        const result = await db.query(
            `UPDATE hero_banners
             SET views_count = COALESCE(views_count, 0) + 1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING id, views_count, promotion_id, equipment_post_id`,
            [id]
        );

        if (result.rows.length === 0) {
            const err = new Error('Banner not found');
            err.statusCode = 404;
            throw err;
        }

        const banner = result.rows[0];
        if (banner.promotion_id) {
            await db.query(
                `UPDATE promotions SET views_count = COALESCE(views_count, 0) + 1 WHERE id = $1`,
                [banner.promotion_id]
            );
        }

        return banner;
    }

    /**
     * Track Banner Click
     */
    async trackBannerClick(id) {
        const result = await db.query(
            `UPDATE hero_banners
             SET clicks_count = COALESCE(clicks_count, 0) + 1, updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING id, clicks_count, promotion_id, equipment_post_id`,
            [id]
        );

        if (result.rows.length === 0) {
            const err = new Error('Banner not found');
            err.statusCode = 404;
            throw err;
        }

        const banner = result.rows[0];
        if (banner.promotion_id) {
            await db.query(
                `UPDATE promotions SET clicks_count = COALESCE(clicks_count, 0) + 1 WHERE id = $1`,
                [banner.promotion_id]
            );
        }

        if (banner.equipment_post_id) {
            await db.query(
                `INSERT INTO engagement_metrics (equipment_post_id, click_count)
                 VALUES ($1, 1)
                 ON CONFLICT (equipment_post_id)
                 DO UPDATE SET click_count = COALESCE(engagement_metrics.click_count, 0) + 1, updated_at = CURRENT_TIMESTAMP`,
                [banner.equipment_post_id]
            );
            await db.query(
                `INSERT INTO analytics_events (event_type, equipment_post_id, metadata) VALUES ('banner_click', $1, $2)`,
                [banner.equipment_post_id, JSON.stringify({ banner_id: id })]
            );
        }

        return banner;
    }
}

module.exports = new BannerAnalyticsService();
