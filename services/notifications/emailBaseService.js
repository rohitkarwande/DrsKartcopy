const { sendTransactionalEmail } = require('../../config/email');
const db = require('../../config/db');

/**
 * Builds a branded HTML email wrapper around body content.
 */
const buildEmailHtml = (title, bodyHtml) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { background: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #334155; }
    .wrapper { max-width: 600px; margin: 32px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 30px rgba(9, 92, 153, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #095C99 0%, #032c4a 100%); padding: 30px 36px; text-align: left; position: relative; }
    .header-logo { color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.2; }
    .header-logo span { color: #48BAC0; }
    .header-subtitle { color: #94a3b8; font-size: 12px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; }
    .body { padding: 36px 36px 28px 36px; }
    .title { font-size: 20px; font-weight: 700; color: #0f172a; margin-bottom: 16px; letter-spacing: -0.3px; }
    .text { font-size: 15px; color: #475569; line-height: 1.65; margin-bottom: 14px; }
    .highlight-box { background: #f0f9ff; border: 1px solid #e0f2fe; border-left: 4px solid #095C99; border-radius: 10px; padding: 18px 20px; margin: 20px 0; }
    .highlight-box p { font-size: 14px; color: #1e293b; line-height: 1.6; margin-bottom: 6px; }
    .highlight-box p:last-child { margin-bottom: 0; }
    .highlight-box strong { color: #095C99; }
    .footer { background: #f8fafc; border-top: 1px solid #f1f5f9; padding: 24px 36px; text-align: center; }
    .footer p { font-size: 12px; color: #94a3b8; line-height: 1.5; }
    .badge { display: inline-block; background: #e0f2fe; color: #032c4a; font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 999px; margin-bottom: 16px; border: 1px solid #bae6fd; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <div class="header-logo">Dr's <span>Kart</span></div>
      <div class="header-subtitle">Medical Equipment Marketplace</div>
    </div>
    <div class="body">
      <div class="title">${title}</div>
      ${bodyHtml}
    </div>
    <div class="footer">
      <p>You are receiving this email because you are registered on Dr's Kart.<br/>&copy; ${new Date().getFullYear()} Dr's Kart. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Send an email to a specific user by their userId.
 */
const emailUser = async (userId, subject, bodyHtml) => {
    try {
        const result = await db.query("SELECT email FROM users WHERE id = $1 AND email IS NOT NULL", [userId]);
        if (result.rows.length === 0 || !result.rows[0].email) return;
        const html = buildEmailHtml(subject, bodyHtml);
        sendTransactionalEmail(result.rows[0].email, subject, subject, html)
            .catch(err => console.error(`Failed to email user ${userId}:`, err));
    } catch (err) {
        console.error('emailUser error:', err);
    }
};

module.exports = {
    buildEmailHtml,
    emailUser
};
