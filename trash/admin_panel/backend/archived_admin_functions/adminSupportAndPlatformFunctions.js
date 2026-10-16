/**
 * Archived Admin Functions from Support, Platform, and Communication
 * Moved to trash because admin panel was decommissioned.
 */

const db = require('../../../../config/db');
const { sendNotification } = require('../../../../services/notifications/userNotificationService');

// --- 1. SUPPORT TICKETS ADMIN ---
const getAllTickets = async (status = null) => {
    let query = `
        SELECT t.*, u.email as user_email, u.phone as user_phone, u.role as user_role
        FROM support_tickets t
        JOIN users u ON t.user_id = u.id
    `;
    const params = [];
    if (status) {
        query += " WHERE t.status = $1";
        params.push(status);
    }
    query += " ORDER BY t.created_at DESC";
    const result = await db.query(query, params);
    return result.rows;
};

const updateTicketStatus = async (id, { status, priority }) => {
    const allowedStatuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
    const allowedPriorities = ['Low', 'Medium', 'High'];
    if (status && !allowedStatuses.includes(status)) throw Object.assign(new Error('Invalid status'), { statusCode: 400 });
    if (priority && !allowedPriorities.includes(priority)) throw Object.assign(new Error('Invalid priority'), { statusCode: 400 });

    let query = "UPDATE support_tickets SET updated_at = CURRENT_TIMESTAMP";
    const params = [];
    let index = 1;
    if (status) { query += `, status = $${index++}`; params.push(status); }
    if (priority) { query += `, priority = $${index++}`; params.push(priority); }
    query += ` WHERE id = $${index} RETURNING *`;
    params.push(id);

    const result = await db.query(query, params);
    if (result.rows.length === 0) throw Object.assign(new Error('Support ticket not found'), { statusCode: 404 });
    return result.rows[0];
};

// --- 2. SERVICE REQUESTS ADMIN ---
const getAllServiceRequests = async () => {
    const result = await db.query("SELECT * FROM service_requests ORDER BY created_at DESC");
    return result.rows;
};

const updateServiceRequestStatus = async (id, { status, assigned_to }) => {
    if (!['Pending', 'In Progress', 'Completed', 'Rejected'].includes(status)) {
        throw Object.assign(new Error('Invalid status'), { statusCode: 400 });
    }
    const result = await db.query(
        "UPDATE service_requests SET status = $1, assigned_to = COALESCE($2, assigned_to), updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *",
        [status, assigned_to, id]
    );
    if (result.rows.length === 0) throw Object.assign(new Error('Service request not found'), { statusCode: 404 });
    return result.rows[0];
};

// --- 3. LEGAL CONSULTATIONS ADMIN ---
const getAllLegalQueries = async () => {
    const result = await db.query("SELECT * FROM legal_consultations ORDER BY created_at DESC");
    return result.rows;
};

const updateLegalQueryStatus = async (id, status) => {
    if (!['New', 'Reviewing', 'Resolved'].includes(status)) throw Object.assign(new Error('Invalid status'), { statusCode: 400 });
    const result = await db.query(
        "UPDATE legal_consultations SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
        [status, id]
    );
    if (result.rows.length === 0) throw Object.assign(new Error('Legal query not found'), { statusCode: 404 });
    const query = result.rows[0];
    await sendNotification(query.user_id, 'Legal Query Update', `The status of your legal query "${query.subject}" has been updated to ${status}.`, query.id.toString());
    return query;
};

// --- 4. INQUIRY ADMIN FUNNEL STATS ---
const getAdminFunnelStats = async (period = 30) => {
    const p = parseInt(period, 10) || 30;
    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - p);

    const result = await db.query(`
        SELECT 
            COUNT(*) as total_inquiries,
            COUNT(*) FILTER (WHERE status = 'Pending') as pending,
            COUNT(*) FILTER (WHERE status = 'In Progress') as in_progress,
            COUNT(*) FILTER (WHERE status IN ('Deal Locked', 'Closed_Won', 'Deal Closed')) as deal_locked,
            COUNT(*) FILTER (WHERE status IN ('Closed', 'Closed_Lost')) as closed
        FROM inquiries
        WHERE created_at >= $1
    `, [sinceDate]);
    return result.rows[0];
};

// --- 5. FEATURE FLAGS ADMIN ---
const updateFeatureFlag = async (key, is_enabled) => {
    const result = await db.query(
        "UPDATE feature_flags SET is_enabled = $1, updated_at = CURRENT_TIMESTAMP WHERE key = $2 RETURNING *",
        [Boolean(is_enabled), key]
    );
    if (result.rows.length === 0) throw Object.assign(new Error('Feature flag not found'), { statusCode: 404 });
    return result.rows[0];
};

// --- 6. AUDIT VIEWER ADMIN ---
const getAuditLogs = async ({ limit = 50, offset = 0, action = null, entityType = null } = {}) => {
    let query = `SELECT al.*, u.email as user_email, u.role as user_role FROM audit_logs al LEFT JOIN users u ON al.user_id = u.id`;
    const params = [];
    const conditions = [];
    if (action) { conditions.push(`al.action = $${params.length + 1}`); params.push(action); }
    if (entityType) { conditions.push(`al.entity_type = $${params.length + 1}`); params.push(entityType); }
    if (conditions.length > 0) query += ` WHERE ` + conditions.join(' AND ');
    query += ` ORDER BY al.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);
    const result = await db.query(query, params);
    return result.rows;
};

module.exports = {
    getAllTickets,
    updateTicketStatus,
    getAllServiceRequests,
    updateServiceRequestStatus,
    getAllLegalQueries,
    updateLegalQueryStatus,
    getAdminFunnelStats,
    updateFeatureFlag,
    getAuditLogs
};
