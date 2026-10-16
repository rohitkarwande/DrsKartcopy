const promotionPlanService = require('./promotionPlanService');
const promotionRequestService = require('./promotionRequestService');

/**
 * PromotionService Facade
 * Aggregates plan access and seller promotion requests
 */
class PromotionService {
    isGloballyEnabled() {
        return promotionPlanService.isGloballyEnabled();
    }

    isUserAllowed(userId) {
        return promotionPlanService.isUserAllowed(userId);
    }

    getPlans() {
        return promotionPlanService.getPlans();
    }

    requestPromotion(params) {
        return promotionRequestService.requestPromotion(params);
    }

    getMyPromotions(sellerId) {
        return promotionRequestService.getMyPromotions(sellerId);
    }
}

module.exports = new PromotionService();
