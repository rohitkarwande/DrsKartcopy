const { sendTransactionalEmail } = require('../../config/email');
const { buildEmailHtml } = require('./emailBaseService');

/**
 * Sends a security alert email to a user when a login is detected from an unrecognized IP.
 */
const emailNewLoginAlert = async (userEmail, ipAddress, userAgent) => {
    if (!userEmail) return;
    
    const subject = 'Security Alert: New Login Detected — Dr\'s Kart';
    const html = buildEmailHtml(
        subject,
        `
        <p class="text">We detected a new login to your Dr's Kart account from an IP address you haven't used before.</p>
        <div class="highlight-box">
            <p><strong>IP Address:</strong> ${ipAddress}</p>
            <p><strong>Device/Browser:</strong> ${userAgent || 'Unknown'}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        </div>
        <p class="text">If this was you, you can safely ignore this email.</p>
        <p class="text" style="color: #ef4444; font-weight: bold;">If you did not authorize this login, please contact support immediately.</p>
        `
    );

    await sendTransactionalEmail(userEmail, subject, subject, html)
        .catch(err => console.error(`Failed to send new login alert to ${userEmail}:`, err));
};

module.exports = {
    emailNewLoginAlert
};
