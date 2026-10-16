const db = require('../../config/db');

class EquipmentDetailService {
    /**
     * Get single equipment post details, images, and track view
     */
    async getSingleEquipment({ id, userId }) {
        const postQuery = `
            SELECT ep.*, u.email as seller_email, u.phone as seller_phone
            FROM equipment_posts ep
            JOIN users u ON ep.seller_id = u.id
            WHERE ep.id = $1 AND ep.status != 'Archived';
        `;
        const postResult = await db.query(postQuery, [id]);
        if (postResult.rows.length === 0) {
            const err = new Error('Equipment post not found');
            err.statusCode = 404;
            throw err;
        }

        await db.query(
            `INSERT INTO engagement_metrics (equipment_post_id, view_count) VALUES ($1, 1)
             ON CONFLICT (equipment_post_id)
             DO UPDATE SET view_count = engagement_metrics.view_count + 1, updated_at = CURRENT_TIMESTAMP`,
            [id]
        );
        await db.query(`INSERT INTO analytics_events (user_id, event_type, equipment_post_id) VALUES ($1, 'view', $2)`, [userId || null, id]);

        const imagesResult = await db.query('SELECT * FROM equipment_images WHERE equipment_post_id = $1 ORDER BY display_order', [id]);
        return { post: postResult.rows[0], images: imagesResult.rows };
    }

    /**
     * Get seller's own equipment listings with metrics and active banners
     */
    async getMyEquipment({ sellerId, page = 1, limit = 10, sort = 'latest' }) {
        let queryStr = `SELECT ep.*, 
            (SELECT json_agg(json_build_object('id', ei.id, 'image_url', ei.image_url, 'media_type', ei.media_type)) FROM equipment_images ei WHERE ei.equipment_post_id = ep.id) as images,
            COALESCE(em.view_count, 0) as views_count,
            COALESCE(em.click_count, 0) as clicks_count,
            COALESCE(em.inquiry_count, 0) as inquiries_count,
            COALESCE(hb.total_banner_views, 0) as banner_views_count,
            COALESCE(hb.total_banner_clicks, 0) as banner_clicks_count,
            CASE WHEN hb.total_banner_views IS NOT NULL THEN true ELSE false END as has_active_banner,
            CASE WHEN promo.id IS NOT NULL THEN true ELSE false END as is_sponsored
            FROM equipment_posts ep
            LEFT JOIN engagement_metrics em ON em.equipment_post_id = ep.id
            LEFT JOIN (
                SELECT equipment_post_id, SUM(COALESCE(views_count, 0)) as total_banner_views, SUM(COALESCE(clicks_count, 0)) as total_banner_clicks
                FROM hero_banners WHERE equipment_post_id IS NOT NULL GROUP BY equipment_post_id
            ) hb ON hb.equipment_post_id = ep.id
            LEFT JOIN (
                SELECT DISTINCT equipment_post_id, id FROM promotions WHERE status = 'Active' AND expires_at > NOW()
            ) promo ON promo.equipment_post_id = ep.id
            WHERE ep.seller_id = $1`;

        queryStr += sort === 'oldest' ? ` ORDER BY ep.created_at ASC` : ` ORDER BY ep.created_at DESC`;
        const offset = (page - 1) * limit;
        queryStr += ` LIMIT $2 OFFSET $3`;

        const result = await db.query(queryStr, [sellerId, limit, offset]);
        const countResult = await db.query(`SELECT COUNT(*) FROM equipment_posts WHERE seller_id = $1`, [sellerId]);
        const total = parseInt(countResult.rows[0].count, 10);

        return {
            data: result.rows,
            pagination: { total, page: parseInt(page, 10), pages: Math.ceil(total / limit) }
        };
    }

    /**
     * Get similar equipment listings by category and brand
     */
    async getSimilarListings(id) {
        const postResult = await db.query('SELECT category, brand, condition FROM equipment_posts WHERE id = $1', [id]);
        if (postResult.rows.length === 0) {
            const err = new Error('Equipment post not found');
            err.statusCode = 404;
            throw err;
        }

        const { category, brand, condition } = postResult.rows[0];
        const queryStr = `
            SELECT ep.*, 
            (SELECT json_agg(json_build_object('id', ei.id, 'image_url', ei.image_url)) FROM equipment_images ei WHERE ei.equipment_post_id = ep.id) as images
            FROM equipment_posts ep
            WHERE ep.status IN ('Active', 'Sold') AND ep.id != $1 AND ep.category = $2
            ORDER BY 
                CASE WHEN ep.brand = $3 THEN 1 ELSE 0 END DESC,
                CASE WHEN ep.condition = $4 THEN 1 ELSE 0 END DESC,
                ep.created_at DESC
            LIMIT 5;
        `;
        const result = await db.query(queryStr, [id, category, brand, condition]);
        return result.rows;
    }
}

module.exports = new EquipmentDetailService();
