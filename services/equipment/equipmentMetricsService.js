const db = require('../../config/db');

class EquipmentMetricsService {
    /**
     * Get view, save, and inquiry metrics for a post
     */
    async getEngagementMetrics(id) {
        const result = await db.query(
            'SELECT view_count, save_count, inquiry_count FROM engagement_metrics WHERE equipment_post_id = $1',
            [id]
        );
        return result.rows[0] || { view_count: 0, save_count: 0, inquiry_count: 0 };
    }

    /**
     * Record click event on equipment post
     */
    async trackEquipmentClick({ id, userId }) {
        const postCheck = await db.query('SELECT id FROM equipment_posts WHERE id = $1', [id]);
        if (postCheck.rows.length === 0) {
            const err = new Error('Equipment post not found');
            err.statusCode = 404;
            throw err;
        }

        await db.query(
            `INSERT INTO engagement_metrics (equipment_post_id, click_count)
             VALUES ($1, 1)
             ON CONFLICT (equipment_post_id)
             DO UPDATE SET click_count = COALESCE(engagement_metrics.click_count, 0) + 1, updated_at = CURRENT_TIMESTAMP`,
            [id]
        );

        await db.query(
            `INSERT INTO analytics_events (user_id, event_type, equipment_post_id) VALUES ($1, 'click', $2)`,
            [userId || null, id]
        );

        return { success: true, message: 'Click recorded' };
    }
}

module.exports = new EquipmentMetricsService();
