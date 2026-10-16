const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Public route to submit inquiry
router.post('/', contactController.submitContactMessage);

module.exports = router;
