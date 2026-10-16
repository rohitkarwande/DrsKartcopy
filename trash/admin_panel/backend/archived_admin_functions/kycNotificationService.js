/**
 * Archived KYC Admin Notification Service
 * Moved to trash because admin panel was decommissioned.
 */

const { emailAdmins } = require('./adminEmailNotificationService');

const emailKycSubmission = (userId, userEmail) => {
    emailAdmins('KYC_SUBMITTED', 'New KYC Submission', `
        <span class="badge">📋 KYC Submitted</span>
        <p class="text">A user has submitted a KYC application for seller verification.</p>
        <div class="highlight-box">
            <p><strong>User:</strong> ${userEmail || `User #${userId}`}</p>
            <p><strong>User ID:</strong> #${userId}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        </div>
        <p class="text">Review and approve/reject this KYC in the Admin Panel.</p>
    `);
};

module.exports = {
    emailKycSubmission
};
