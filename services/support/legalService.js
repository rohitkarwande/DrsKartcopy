const db = require('../../config/db');

/**
 * LegalService
 * Handles user legal consultation query submissions and tracking
 */
class LegalService {
    async submitQuery(userId, { subject, description, contact_phone }) {
        if (!subject || !description) {
            const err = new Error('Subject and description are required');
            err.statusCode = 400;
            throw err;
        }

        const result = await db.query(
            "INSERT INTO legal_consultations (user_id, subject, description, contact_phone) VALUES ($1, $2, $3, $4) RETURNING *",
            [userId, subject.trim(), description.trim(), contact_phone || null]
        );
        return result.rows[0];
    }

    async getMyQueries(userId) {
        const result = await db.query(
            "SELECT * FROM legal_consultations WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );
        return result.rows;
    }
}

module.exports = new LegalService();
