/**
 * Archived Equipment Listing Admin Notification Service
 * Moved to trash because admin panel was decommissioned.
 */

const { emailAdmins } = require('./adminEmailNotificationService');

const emailNewEquipmentListing = (sellerEmail, sellerId, equipmentTitle, equipmentId) => {
    emailAdmins('NEW_LISTING', 'New Equipment Listed', `
        <span class="badge">📦 New Listing</span>
        <p class="text">A new equipment item has been listed on the platform.</p>
        <div class="highlight-box">
            <p><strong>Equipment:</strong> ${equipmentTitle}</p>
            <p><strong>Equipment ID:</strong> #${equipmentId}</p>
            <p><strong>Seller:</strong> ${sellerEmail || `User #${sellerId}`}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        </div>
        <p class="text">Review this listing in the Admin Panel.</p>
    `);
};

module.exports = {
    emailNewEquipmentListing
};
