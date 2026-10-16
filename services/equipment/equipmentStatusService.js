const db = require('../../config/db');
const { STATUSES } = require('./equipmentConstants');

class EquipmentStatusService {
    /**
     * Soft delete (archive) equipment post
     */
    async deleteEquipment({ id, sellerId, isAdmin }) {
        const postResult = await db.query('SELECT * FROM equipment_posts WHERE id = $1', [id]);
        if (postResult.rows.length === 0) {
            const err = new Error('Equipment post not found');
            err.statusCode = 404;
            throw err;
        }
        if (postResult.rows[0].seller_id !== sellerId && !isAdmin) {
            const err = new Error('Unauthorized to delete this post');
            err.statusCode = 403;
            throw err;
        }

        await db.query(`UPDATE equipment_posts SET status = 'Archived', updated_at = CURRENT_TIMESTAMP WHERE id = $1`, [id]);
        return { message: 'Equipment post deleted (archived) successfully' };
    }

    /**
     * Update equipment lifecycle status
     */
    async updateStatus({ id, status, sellerId, isAdmin }) {
        if (!status || !STATUSES.includes(status)) {
            const err = new Error('Invalid status value');
            err.statusCode = 400;
            throw err;
        }

        const postResult = await db.query('SELECT * FROM equipment_posts WHERE id = $1', [id]);
        if (postResult.rows.length === 0) {
            const err = new Error('Equipment post not found');
            err.statusCode = 404;
            throw err;
        }
        if (postResult.rows[0].seller_id !== sellerId && !isAdmin) {
            const err = new Error('Unauthorized to change status of this post');
            err.statusCode = 403;
            throw err;
        }

        const updated = await db.query(
            `UPDATE equipment_posts SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
            [status, id]
        );
        return { message: 'Status updated successfully', post: updated.rows[0] };
    }
}

module.exports = new EquipmentStatusService();
