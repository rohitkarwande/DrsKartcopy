const ticketService = require('../services/support/ticketService');

// 1. Create Ticket (User)
const createTicket = async (req, res) => {
    try {
        const ticket = await ticketService.createTicket({
            userId: req.user.id,
            ...req.body
        });
        res.status(201).json({ message: 'Support ticket raised successfully', ticket });
    } catch (error) {
        console.error('Error creating support ticket:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server error raising support ticket' });
    }
};

// 2. Get My Tickets (User)
const getMyTickets = async (req, res) => {
    try {
        const tickets = await ticketService.getMyTickets(req.user.id);
        res.json({ tickets });
    } catch (error) {
        console.error('Error fetching user tickets:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server error fetching support tickets' });
    }
};

module.exports = {
    createTicket,
    getMyTickets
};
