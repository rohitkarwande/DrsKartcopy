const promotionService = require('../services/marketing/promotionService');

const sendError = (res, message, status = 400) => res.status(status).json({ error: message });

// ─── PUBLIC ────────────────────────────────────────────────────────────────────

// GET /api/promotions/plans — list all active promotion plans
const getPlans = async (req, res) => {
    try {
        const plans = await promotionService.getPlans();
        res.json({ plans });
    } catch (err) {
        console.error('getPlans error:', err.message);
        sendError(res, err.message || 'Failed to fetch promotion plans', err.statusCode || 500);
    }
};

// ─── SELLER ────────────────────────────────────────────────────────────────────

// POST /api/promotions/request — seller submits a promotion request
const requestPromotion = async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { equipment_post_id, plan_id } = req.body;

        const { promotion, plan } = await promotionService.requestPromotion({
            sellerId,
            equipment_post_id,
            plan_id
        });

        res.status(201).json({
            message: `Promotion request submitted successfully! Our team will activate your "${plan.name}" within 24 hours.`,
            promotion
        });
    } catch (err) {
        console.error('requestPromotion error:', err.message);
        sendError(res, err.message || 'Failed to submit promotion request', err.statusCode || 500);
    }
};

// GET /api/promotions/mine — seller sees their own promotions
const getMyPromotions = async (req, res) => {
    try {
        const promotions = await promotionService.getMyPromotions(req.user.id);
        res.json({ promotions });
    } catch (err) {
        console.error('getMyPromotions error:', err.message);
        sendError(res, err.message || 'Failed to fetch your promotions', err.statusCode || 500);
    }
};

module.exports = {
    getPlans,
    requestPromotion,
    getMyPromotions
};
