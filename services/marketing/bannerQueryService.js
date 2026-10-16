const db = require('../../config/db');

/**
 * BannerQueryService
 * Handles public read operations for homepage hero carousel banners
 */
class BannerQueryService {
    /**
     * Fetch active hero carousel banners for homepage
     */
    async getActiveBanners() {
        const result = await db.query(
            `SELECT id, title, subtitle, badge_text, image_url, link_url, button_text, display_order, is_active, 
                    COALESCE(views_count, 0) as views_count, COALESCE(clicks_count, 0) as clicks_count,
                    seller_id, equipment_post_id, promotion_id, created_at 
             FROM hero_banners 
             WHERE is_active = true 
             ORDER BY display_order ASC, id ASC`
        );
        return result.rows;
    }
}

module.exports = new BannerQueryService();
