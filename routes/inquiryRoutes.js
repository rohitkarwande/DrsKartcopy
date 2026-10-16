const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/auth');
const inquiryController = require('../controllers/inquiryController');

router.post('/', authMiddleware, inquiryController.createInquiry);
router.get('/seller', authMiddleware, inquiryController.getSellerInquiries);
router.get('/buyer', authMiddleware, inquiryController.getBuyerInquiries);
router.patch('/:id/status', authMiddleware, inquiryController.updateInquiryStatus);
router.get('/:id', authMiddleware, inquiryController.getInquiryById);

module.exports = router;