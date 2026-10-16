const db = require('../../config/db');
const { emailNewInquiry, emailDealLocked } = require('../notifications/inquiryNotificationService');

const VALID_STATUSES = ['Pending', 'In Progress', 'Deal Locked', 'Closed', 'Closed_Lost', 'Contacted', 'Closed_Won', 'Deal Closed'];

class InquiryService {
    /**
     * Create a buyer inquiry for equipment
     */
    async createInquiry(buyerId, buyerContact, equipmentPostId) {
        if (!equipmentPostId) {
            const err = new Error('equipment_post_id is required');
            err.statusCode = 400;
            throw err;
        }

        const equipment = await db.query(`SELECT * FROM equipment_posts WHERE id = $1`, [equipmentPostId]);
        if (equipment.rows.length === 0) {
            const err = new Error('Equipment not found');
            err.statusCode = 404;
            throw err;
        }

        const sellerId = equipment.rows[0].seller_id;

        const inquiry = await db.query(
            `INSERT INTO inquiries (buyer_id, seller_id, equipment_post_id, status)
             VALUES ($1, $2, $3, 'Pending')
             RETURNING *`,
            [buyerId, sellerId, equipmentPostId]
        );

        // Update engagement metrics
        await db.query(
            `INSERT INTO engagement_metrics (equipment_post_id, inquiry_count)
             VALUES ($1, 1)
             ON CONFLICT (equipment_post_id)
             DO UPDATE SET inquiry_count = engagement_metrics.inquiry_count + 1, updated_at = CURRENT_TIMESTAMP`,
            [equipmentPostId]
        );

        // Track analytics event
        await db.query(
            `INSERT INTO analytics_events (user_id, event_type, equipment_post_id) VALUES ($1, 'inquiry', $2)`,
            [buyerId, equipmentPostId]
        );

        // Send email alert to seller
        emailNewInquiry(sellerId, buyerContact, equipment.rows[0].title);

        return inquiry.rows[0];
    }

    /**
     * Fetch seller inquiries
     */
    async getSellerInquiries(sellerId) {
        const result = await db.query(
            `SELECT i.*, 
                    ep.title as equipment_name,
                    u.email as buyer_email,
                    u.phone as buyer_phone,
                    p.first_name as buyer_first_name,
                    p.last_name as buyer_last_name
             FROM inquiries i
             LEFT JOIN equipment_posts ep ON i.equipment_post_id = ep.id
             LEFT JOIN users u ON i.buyer_id = u.id
             LEFT JOIN user_profiles p ON u.id = p.user_id
             WHERE i.seller_id = $1
             ORDER BY i.created_at DESC`,
            [sellerId]
        );
        return result.rows;
    }

    /**
     * Fetch buyer inquiries
     */
    async getBuyerInquiries(buyerId) {
        const result = await db.query(
            `SELECT i.*,
                    ep.title as equipment_name,
                    ep.price,
                    u.email as seller_email,
                    u.phone as seller_phone
             FROM inquiries i
             LEFT JOIN equipment_posts ep ON i.equipment_post_id = ep.id
             LEFT JOIN users u ON i.seller_id = u.id
             WHERE i.buyer_id = $1
             ORDER BY i.created_at DESC`,
            [buyerId]
        );
        return result.rows;
    }

    /**
     * Fetch single inquiry by ID
     */
    async getInquiryById(id, userId) {
        const result = await db.query(
            `SELECT i.*, ep.title as equipment_name, ep.price
             FROM inquiries i
             LEFT JOIN equipment_posts ep ON i.equipment_post_id = ep.id
             WHERE i.id = $1 AND (i.buyer_id = $2 OR i.seller_id = $2)`,
            [id, userId]
        );

        if (result.rows.length === 0) {
            const err = new Error('Inquiry not found');
            err.statusCode = 404;
            throw err;
        }
        return result.rows[0];
    }

    /**
     * Update inquiry status and trigger deal locking side-effects
     */
    async updateInquiryStatus(id, userId, status, io = null) {
        if (!VALID_STATUSES.includes(status)) {
            const err = new Error(`Invalid status. Valid statuses: ${VALID_STATUSES.join(', ')}`);
            err.statusCode = 400;
            throw err;
        }

        const inquiry = await db.query(
            `SELECT * FROM inquiries WHERE id = $1 AND (buyer_id = $2 OR seller_id = $2)`,
            [id, userId]
        );
        if (inquiry.rows.length === 0) {
            const err = new Error('Inquiry not found or access denied');
            err.statusCode = 404;
            throw err;
        }

        const isSeller = inquiry.rows[0].seller_id === userId;
        if ((status === 'Deal Locked' || status === 'Closed') && !isSeller) {
            const err = new Error('Only the seller can lock or close a deal');
            err.statusCode = 403;
            throw err;
        }

        let extraFields = '';
        if (status === 'Deal Locked') {
            extraFields = ', locked_at = CURRENT_TIMESTAMP';
        } else if (status === 'Closed' || status === 'Deal Closed') {
            extraFields = ', closed_at = CURRENT_TIMESTAMP';
        }

        const result = await db.query(
            `UPDATE inquiries
             SET status = $1${extraFields}
             WHERE id = $2
             RETURNING *`,
            [status, id]
        );

        const updatedInquiry = result.rows[0];

        // Analytics event for deal close
        if (['Closed', 'Deal Closed', 'Deal Locked'].includes(status)) {
            await db.query(
                `INSERT INTO analytics_events (user_id, event_type, equipment_post_id) VALUES ($1, 'deal', $2)`,
                [userId, updatedInquiry.equipment_post_id]
            );
        }

        // If seller locks deal, mark equipment as Sold
        if (status === 'Deal Locked' || status === 'Closed') {
            await db.query(
                `UPDATE equipment_posts SET status = 'Sold', updated_at = CURRENT_TIMESTAMP WHERE id = $1`,
                [updatedInquiry.equipment_post_id]
            );


            // Email parties
            const equipmentTitleRes = await db.query('SELECT title FROM equipment_posts WHERE id = $1', [updatedInquiry.equipment_post_id]);
            const equipmentTitle = equipmentTitleRes.rows[0]?.title || 'Equipment';
            emailDealLocked(updatedInquiry.seller_id, updatedInquiry.buyer_id, equipmentTitle, updatedInquiry.equipment_post_id);
        }

        // Real-time socket message
        if (status === 'Deal Locked' && io) {
            io.to(`user_${updatedInquiry.buyer_id}`).emit('deal_locked', {
                inquiry_id: id,
                message: '🔒 The seller has locked the deal on this equipment. Congratulations!',
            });
        }

        return updatedInquiry;
    }
}

module.exports = new InquiryService();
