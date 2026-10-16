const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');
const authMiddleware = require('../middlewares/auth');

// Public
router.get('/plans', promotionController.getPlans);

// Seller — authenticated
router.post('/request', authMiddleware, promotionController.requestPromotion);
router.get('/mine', authMiddleware, promotionController.getMyPromotions);

module.exports = router;
