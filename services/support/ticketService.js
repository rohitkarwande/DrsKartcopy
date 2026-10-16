const db = require('../../config/db');

/**
 * TicketService
 * Handles user support ticket creation and retrieval
 */
class TicketService {
    async createTicket({ userId, subject, description, category, priority = 'Medium' }) {
        if (!subject || !description || !category) {
            const err = new Error('Subject, description, and category are required');
            err.statusCode = 400;
            throw err;
        }

        const result = await db.query(
            `INSERT INTO support_tickets (user_id, subject, description, category, priority)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [userId, subject.trim(), description.trim(), category.trim(), priority || 'Medium']
        );
        return result.rows[0];
    }

    async getMyTickets(userId) {
        const result = await db.query(
            "SELECT * FROM support_tickets WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );
        return result.rows;
    }
}

module.exports = new TicketService();
