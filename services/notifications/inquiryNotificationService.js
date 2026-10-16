const { emailUser } = require('./emailBaseService');

/**
 * Notifies the seller when an inquiry is submitted on equipment.
 */
const emailNewInquiry = (sellerUserId, buyerEmail, equipmentTitle) => {
    emailUser(sellerUserId, `New Inquiry on Your Listing: ${equipmentTitle}`, `
        <span class="badge">💬 New Inquiry</span>
        <p class="text">Someone is interested in your equipment listing!</p>
        <div class="highlight-box">
            <p><strong>Equipment:</strong> ${equipmentTitle}</p>
            <p><strong>Buyer Contact:</strong> ${buyerEmail || 'N/A'}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        </div>
        <p class="text">Log in to your Dr's Kart dashboard to respond to this inquiry and start chatting.</p>
    `);
};

/**
 * Notifies buyer and seller when a deal has been locked for equipment.
 */
const emailDealLocked = (sellerUserId, buyerUserId, equipmentTitle, equipmentId) => {
    // Email buyer
    emailUser(buyerUserId, `🔒 Deal Locked: ${equipmentTitle}`, `
        <span class="badge">🔒 Deal Locked</span>
        <p class="text">Great news! The seller has locked the deal on the following equipment.</p>
        <div class="highlight-box">
            <p><strong>Equipment:</strong> ${equipmentTitle}</p>
            <p><strong>Equipment ID:</strong> #${equipmentId}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        </div>
        <p class="text">Please coordinate with the seller via Dr's Kart chat to finalize the transaction.</p>
    `);

    // Email seller
    emailUser(sellerUserId, `Deal Locked Confirmation: ${equipmentTitle}`, `
        <span class="badge">🔒 Deal Locked</span>
        <p class="text">You have successfully locked the deal on your equipment listing.</p>
        <div class="highlight-box">
            <p><strong>Equipment:</strong> ${equipmentTitle}</p>
            <p><strong>Equipment ID:</strong> #${equipmentId}</p>
        </div>
    `);
};

module.exports = {
    emailNewInquiry,
    emailDealLocked
};
