const db = require('../../config/db');

/**
 * PromotionPlanService
 * Handles promotion feature flag checks, user eligibility, and plan retrieval
 */
class PromotionPlanService {
    /**
     * Check if paid promotions are globally enabled
     */
    async isGloballyEnabled() {
        const flagRes = await db.query("SELECT is_enabled FROM feature_flags WHERE key = 'enable_paid_promotions'");
        return flagRes.rows.length > 0 ? flagRes.rows[0].is_enabled : false;
    }

    /**
     * Check if user is permitted to use paid promotions
     */
    async isUserAllowed(userId) {
        const userRes = await db.query("SELECT paid_promotions_enabled, role FROM users WHERE id = $1", [userId]);
        if (userRes.rows.length === 0) return false;
        const user = userRes.rows[0];
        return user.role === 'admin' || user.paid_promotions_enabled === true;
    }

    /**
     * Fetch active promotion plans
     */
    async getPlans() {
        const isEnabled = await this.isGloballyEnabled();
        if (!isEnabled) {
            const err = new Error('Paid promotions are currently disabled globally by the administrator.');
            err.statusCode = 403;
            throw err;
        }

        const result = await db.query(
            `SELECT id, name, type, price, duration_days, description
             FROM promotion_plans
             WHERE is_active = true
             ORDER BY type ASC, price ASC`
        );
        return result.rows;
    }
}

module.exports = new PromotionPlanService();
