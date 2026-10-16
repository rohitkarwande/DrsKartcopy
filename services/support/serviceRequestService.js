const db = require('../../config/db');

/**
 * ServiceRequestService
 * Handles user equipment servicing and maintenance requests
 */
class ServiceRequestService {
    async createRequest(userId, { equipment_type, issue_description, contact_name, contact_phone, city }) {
        if (!issue_description) {
            const err = new Error('Issue description is required');
            err.statusCode = 400;
            throw err;
        }

        const result = await db.query(
            "INSERT INTO service_requests (user_id, equipment_type, issue_description, contact_name, contact_phone, city) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
            [userId, equipment_type, issue_description.trim(), contact_name, contact_phone, city]
        );
        return result.rows[0];
    }

    async getMyRequests(userId) {
        const result = await db.query(
            "SELECT * FROM service_requests WHERE user_id = $1 ORDER BY created_at DESC",
            [userId]
        );
        return result.rows;
    }
}

module.exports = new ServiceRequestService();
