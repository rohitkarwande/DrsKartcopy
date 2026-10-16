const db = require('../../config/db');

class AuditService {
    /**
     * Records an audit entry in the audit_logs table
     */
    async logAction({ userId = null, action, entityType = null, entityId = null, ipAddress = null, changes = null }) {
        if (!action) return;

        try {
            await db.query(
                `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, ip_address, changes)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    userId,
                    action,
                    entityType,
                    entityId ? String(entityId) : null,
                    ipAddress,
                    changes ? JSON.stringify(changes) : null
                ]
            );
        } catch (error) {
            // Non-blocking error handling
            console.error('AuditService Error:', error.message);
        }
    }
}

module.exports = new AuditService();
