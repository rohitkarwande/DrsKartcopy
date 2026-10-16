const db = require('../../config/db');

class AuthSecurityService {
    /**
     * Checks if IP is blacklisted in database
     */
    async checkIpBlacklist(ipAddress) {
        const blacklistCheck = await db.query(
            'SELECT reason FROM ip_blacklist WHERE ip_address = $1',
            [ipAddress]
        );
        if (blacklistCheck.rows.length > 0) {
            const err = new Error('Access denied from this IP address.');
            err.statusCode = 403;
            throw err;
        }
    }

    /**
     * Records a login entry in login_history and checks if IP is new
     */
    async recordLoginHistory(userId, ipAddress, userAgent) {
        const ipCheck = await db.query(
            'SELECT id FROM login_history WHERE user_id = $1 AND ip_address = $2 LIMIT 1',
            [userId, ipAddress]
        );
        const isNewIp = ipCheck.rows.length === 0;

        await db.query(
            'INSERT INTO login_history (user_id, ip_address, user_agent) VALUES ($1, $2, $3)',
            [userId, ipAddress, userAgent]
        );

        return { isNewIp };
    }

    /**
     * Dispatches new IP login alert email if applicable
     */
    sendNewLoginAlert({ email, ipAddress, userAgent }) {
        if (!email) return;
        try {
            const { emailNewLoginAlert } = require('../notifications/authNotificationService');
            emailNewLoginAlert(email, ipAddress, userAgent).catch(err =>
                console.error('Failed to send login alert:', err)
            );
        } catch (emailErr) {
            console.error('Failed to trigger login alert email:', emailErr.message);
        }
    }
}

module.exports = {
    AuthSecurityService,
    authSecurityService: new AuthSecurityService()
};
