const db = require('../../config/db');
const promotionPlanService = require('./promotionPlanService');

/**
 * PromotionRequestService
 * Handles seller promotion submissions and seller promotion history with metrics
 */
class PromotionRequestService {
    /**
     * Submit a promotion request for a listing
     */
    async requestPromotion({ sellerId, equipment_post_id, plan_id }) {
        const isGlobal = await promotionPlanService.isGloballyEnabled();
        if (!isGlobal) throw Object.assign(new Error('Paid promotions are currently disabled globally by the administrator.'), { statusCode: 403 });

        const isAllowed = await promotionPlanService.isUserAllowed(sellerId);
        if (!isAllowed) throw Object.assign(new Error('You do not have permission to use paid promotions. Please request access from the administrator.'), { statusCode: 403 });

        if (!equipment_post_id || !plan_id) throw Object.assign(new Error('equipment_post_id and plan_id are required'), { statusCode: 400 });

        const postCheck = await db.query(
            `SELECT id FROM equipment_posts WHERE id = $1 AND seller_id = $2 AND status != 'Archived'`,
            [equipment_post_id, sellerId]
        );
        if (postCheck.rows.length === 0) throw Object.assign(new Error('Equipment not found or does not belong to you'), { statusCode: 404 });

        const planCheck = await db.query(
            `SELECT id, type, price, duration_days, name FROM promotion_plans WHERE id = $1 AND is_active = true`,
            [plan_id]
        );
        if (planCheck.rows.length === 0) throw Object.assign(new Error('Promotion plan not found'), { statusCode: 404 });
        const plan = planCheck.rows[0];

        const existing = await db.query(
            `SELECT id FROM promotions WHERE equipment_post_id = $1 AND type = $2 AND status IN ('Pending', 'Active')`,
            [equipment_post_id, plan.type]
        );
        if (existing.rows.length > 0) throw Object.assign(new Error(`This listing already has a ${plan.type} promotion that is Pending or Active.`), { statusCode: 400 });

        const result = await db.query(
            `INSERT INTO promotions (seller_id, equipment_post_id, plan_id, type, status, payment_reference)
             VALUES ($1, $2, $3, $4, 'Pending', $5) RETURNING *`,
            [sellerId, equipment_post_id, plan_id, plan.type, `MOCK-${Date.now()}`]
        );

        return { promotion: result.rows[0], plan };
    }

    /**
     * Get promotions belonging to a seller (with performance metrics)
     */
    async getMyPromotions(sellerId) {
        const isGlobal = await promotionPlanService.isGloballyEnabled();
        if (!isGlobal) throw Object.assign(new Error('Paid promotions are currently disabled globally by the administrator.'), { statusCode: 403 });

        const isAllowed = await promotionPlanService.isUserAllowed(sellerId);
        if (!isAllowed) throw Object.assign(new Error('You do not have permission to use paid promotions.'), { statusCode: 403 });

        const result = await db.query(
            `SELECT p.*, pp.name as plan_name, pp.price as plan_price, pp.duration_days,
                    ep.title as equipment_title, ep.category as equipment_category,
                    (SELECT image_url FROM equipment_images WHERE equipment_post_id = ep.id AND media_type = 'image' ORDER BY display_order ASC LIMIT 1) as equipment_image,
                    hb.id as banner_id,
                    COALESCE(hb.views_count, p.views_count, 0) as banner_views,
                    COALESCE(hb.clicks_count, p.clicks_count, 0) as banner_clicks,
                    COALESCE(em.view_count, 0) as product_views,
                    COALESCE(em.click_count, 0) as product_clicks,
                    COALESCE(em.inquiry_count, 0) as product_inquiries
             FROM promotions p
             JOIN promotion_plans pp ON p.plan_id = pp.id
             JOIN equipment_posts ep ON p.equipment_post_id = ep.id
             LEFT JOIN hero_banners hb ON (hb.promotion_id = p.id OR (hb.equipment_post_id = p.equipment_post_id AND p.type = 'carousel'))
             LEFT JOIN engagement_metrics em ON em.equipment_post_id = p.equipment_post_id
             WHERE p.seller_id = $1
             ORDER BY p.created_at DESC`,
            [sellerId]
        );

        return result.rows;
    }
}

module.exports = new PromotionRequestService();
