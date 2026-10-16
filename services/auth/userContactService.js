const crypto = require('crypto');
const db = require('../../config/db');
const cache = require('../../config/cache');
const { sendOTP: sendPhoneOTP } = require('../../config/twilio');
const { sendEmailOTP } = require('../../config/email');

const hashSha256 = (val) => crypto.createHash('sha256').update(String(val)).digest('hex');
const getContactKey = (userId, identifier) => hashSha256(`contact-otp:${userId}:${identifier}`);

class UserContactService {
    /**
     * Dispatch OTP to verify and add secondary contact method
     */
    async addContact({ userId, identifier, type }) {
        if (!identifier || !type) {
            const err = new Error('identifier and type required');
            err.statusCode = 400;
            throw err;
        }

        const existing = await db.query(`SELECT id FROM users WHERE ${type} = $1`, [identifier]);
        if (existing.rows.length > 0) {
            const err = new Error('This contact is already registered to another account.');
            err.statusCode = 400;
            throw err;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const key = getContactKey(userId, identifier);
        await cache.setEx(key, 300, hashSha256(otp));

        if (type === 'email') await sendEmailOTP(identifier, otp);
        else await sendPhoneOTP(identifier, otp);

        return { message: `OTP sent to ${identifier}` };
    }

    /**
     * Verify OTP and bind new contact method to user
     */
    async verifyContact({ userId, identifier, type, otp }) {
        const key = getContactKey(userId, identifier);
        const storedHashedOtp = await cache.get(key);
        if (!storedHashedOtp || storedHashedOtp !== hashSha256(otp)) {
            const err = new Error('Invalid or expired OTP');
            err.statusCode = 400;
            throw err;
        }

        await cache.del(key);
        await db.query(`UPDATE users SET ${type} = $1 WHERE id = $2`, [identifier, userId]);

        const verifiedAt = new Date().toISOString();
        console.log(`✅ [CONTACT OTP VERIFIED] User ID: ${userId} verified ${type} (${identifier}) at ${verifiedAt}. Cache entry deleted.`);

        return { 
            message: `${type} updated and verified successfully`,
            status: 'verified',
            verified: true,
            verifiedAt 
        };
    }
}

module.exports = {
    UserContactService,
    userContactService: new UserContactService()
};

