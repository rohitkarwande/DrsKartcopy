const express = require('express');
const router = express.Router();
const legalController = require('../controllers/legalController');
const authMiddleware = require('../middlewares/auth');

// User legal query routes
router.post('/', authMiddleware, legalController.submitLegalQuery);
router.get('/my-queries', authMiddleware, legalController.getMyLegalQueries);

module.exports = router;
