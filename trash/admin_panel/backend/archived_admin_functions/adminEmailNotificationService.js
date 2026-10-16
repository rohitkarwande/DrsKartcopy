/**
 * Archived Admin Email Dispatcher
 * Moved to trash because admin panel was decommissioned.
 */

const db = require('../../../../config/db');
const { sendTransactionalEmail } = require('../../../../config/email');

const emailAdmins = async (type, subject, bodyHtml) => {
    try {
        const adminsResult = await db.query("SELECT email FROM users WHERE role = 'admin' AND email IS NOT NULL");
        if (adminsResult.rows.length === 0) return;

        const adminEmails = adminsResult.rows.map(r => r.email).filter(Boolean);
        for (const email of adminEmails) {
            sendTransactionalEmail(email, `[Dr's Kart Admin] ${subject}`, subject, bodyHtml)
                .catch(err => console.error(`Failed to email admin ${email}:`, err));
        }
    } catch (err) {
        console.error('emailAdmins error:', err);
    }
};

module.exports = {
    emailAdmins
};
