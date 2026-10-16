const express = require('express');
const router = express.Router();
const serviceRequestController = require('../controllers/serviceRequestController');
const authMiddleware = require('../middlewares/auth');

// User service request routes
router.post('/', authMiddleware, serviceRequestController.createServiceRequest);
router.get('/my-requests', authMiddleware, serviceRequestController.getMyServiceRequests);

module.exports = router;
