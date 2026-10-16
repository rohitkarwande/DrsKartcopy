const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const authMiddleware = require('../middlewares/auth');

// User routes
router.post('/', authMiddleware, ticketController.createTicket);
router.get('/mine', authMiddleware, ticketController.getMyTickets);

module.exports = router;
