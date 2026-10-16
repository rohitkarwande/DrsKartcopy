const { emailUser } = require('./emailBaseService');

/**
 * Sends an email notification to recipient when an offline/unread chat message arrives.
 */
const emailNewMessage = (recipientUserId, senderName, messagePreview, equipmentTitle) => {
    emailUser(recipientUserId, `New message from ${senderName} — Dr's Kart`, `
        <span class="badge">✉️ New Message</span>
        <p class="text">You have received a new message on Dr's Kart.</p>
        <div class="highlight-box">
            <p><strong>From:</strong> ${senderName}</p>
            <p><strong>Regarding:</strong> ${equipmentTitle || 'Equipment inquiry'}</p>
            <p><strong>Message preview:</strong><br/><em>"${String(messagePreview).substring(0, 120)}${messagePreview.length > 120 ? '...' : ''}"</em></p>
        </div>
        <p class="text">Log in to Dr's Kart to read the full message and reply.</p>
    `);
};

module.exports = {
    emailNewMessage
};
