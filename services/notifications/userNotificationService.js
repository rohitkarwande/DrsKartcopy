const db = require('../../config/db');
const { sendTransactionalEmail } = require('../../config/email');

/**
 * Creates an in-app notification record and optionally dispatches transactional email.
 */
const sendNotification = async (userId, type, message, referenceId = null) => {
    try {
        await db.query(
            "INSERT INTO notifications (user_id, type, message, reference_id) VALUES ($1, $2, $3, $4)",
            [userId, type, message, referenceId]
        );
        
        // Retrieve user email to send transactional email
        const userResult = await db.query("SELECT email FROM users WHERE id = $1", [userId]);
        if (userResult.rows.length > 0 && userResult.rows[0].email) {
            if (sendTransactionalEmail) {
                await sendTransactionalEmail(userResult.rows[0].email, type, message);
            }
        }
    } catch (error) {
        console.error('Error sending user notification:', error);
    }
};

/**
 * Get all notifications for a user ordered by newest first
 */
const getUserNotifications = async (userId) => {
    const result = await db.query(
        "SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC",
        [userId]
    );
    return result.rows;
};

/**
 * Mark a specific notification as read for a user
 */
const markNotificationRead = async ({ notificationId, userId }) => {
    const result = await db.query(
        "UPDATE notifications SET is_read = TRUE WHERE id = $1 AND user_id = $2 RETURNING *",
        [notificationId, userId]
    );
    return result.rows[0];
};

module.exports = {
    sendNotification,
    sendUserNotification: sendNotification,
    getUserNotifications,
    markNotificationRead
};
