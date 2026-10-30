const crypto = require('crypto');
const db = require('../../config/db');
const cache = require('../../config/cache');
const { sendOTP: sendPhoneOTP } = require('../../config/twilio');
const { sendEmailOTP } = require('../../config/email');
const { sanitizePhone, isEmail } = require('./authUtils');

const hashSha256 = (val) => crypto.createHash('sha256').update(String(val)).digest('hex');
const getContactKey = (userId, identifier) => hashSha256(`contact-otp:${userId}:${identifier}`);

class UserContactService {
    /**
     * Normalizes and validates contact identifier based on type
     */
    normalizeIdentifier(identifier, type) {
        if (!identifier || typeof identifier !== 'string') {
            const err = new Error(`Please provide a valid ${type || 'contact'}`);
            err.statusCode = 400;
            throw err;
        }

        if (type === 'email') {
            const normalized = identifier.trim().toLowerCase();
            if (!isEmail(normalized)) {
                const err = new Error('Please enter a valid email address');
                err.statusCode = 400;
                throw err;
            }
            return normalized;
        } else if (type === 'phone') {
            const normalized = sanitizePhone(identifier);
            if (!normalized || normalized.length < 8) {
                const err = new Error('Please enter a valid phone number (e.g. +91 9876543210)');
                err.statusCode = 400;
                throw err;
            }
            return normalized;
        } else {
            const err = new Error('Invalid contact type. Must be email or phone.');
            err.statusCode = 400;
            throw err;
        }
    }

    /**
     * Checks if contact is already linked to another account (enforcing 1 Email <-> 1 Phone)
     */
    async assertContactAvailable(normalizedIdentifier, type, userId) {
        if (type === 'phone') {
            const withoutPlus = normalizedIdentifier.startsWith('+') ? normalizedIdentifier.slice(1) : normalizedIdentifier;
            const withoutPrefix = normalizedIdentifier.replace(/^\+\d{1,4}/, '');
            const existing = await db.query(
                'SELECT id, email, phone FROM users WHERE (phone = $1 OR phone = $2 OR phone = $3) AND id != $4',
                [normalizedIdentifier, withoutPlus, withoutPrefix, userId]
            );
            if (existing.rows.length > 0) {
                const err = new Error('This phone number is already connected to another account. One phone number can only be connected to one email.');
                err.statusCode = 400;
                throw err;
            }
        } else if (type === 'email') {
            const existing = await db.query(
                'SELECT id, email, phone FROM users WHERE LOWER(email) = LOWER($1) AND id != $2',
                [normalizedIdentifier, userId]
            );
            if (existing.rows.length > 0) {
                const err = new Error('This email address is already connected to another account. One email can only be connected to one phone number.');
                err.statusCode = 400;
                throw err;
            }
        }
    }

    /**
     * Dispatch OTP to verify and add secondary contact method
     */
    async addContact({ userId, identifier, type }) {
        if (!userId) {
            const err = new Error('User ID is required');
            err.statusCode = 401;
            throw err;
        }

        const normalized = this.normalizeIdentifier(identifier, type);

        // Fetch current user
        const currentUserRes = await db.query('SELECT id, email, phone FROM users WHERE id = $1', [userId]);
        if (!currentUserRes.rows.length) {
            const err = new Error('User not found');
            err.statusCode = 404;
            throw err;
        }
        const currentUser = currentUserRes.rows[0];

        // Ensure user is not re-adding what they already have
        if (type === 'phone' && currentUser.phone && sanitizePhone(currentUser.phone) === normalized) {
            const err = new Error('This phone number is already attached to your account.');
            err.statusCode = 400;
            throw err;
        }
        if (type === 'email' && currentUser.email && currentUser.email.toLowerCase() === normalized) {
            const err = new Error('This email address is already attached to your account.');
            err.statusCode = 400;
            throw err;
        }

        // Strictly check that this contact is not already taken by any other user
        await this.assertContactAvailable(normalized, type, userId);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const key = getContactKey(userId, normalized);
        await cache.setEx(key, 300, hashSha256(otp));

        if (type === 'email') {
            try {
                await sendEmailOTP(normalized, otp);
            } catch (mailErr) {
                console.error(`⚠️ Email OTP delivery failed for ${normalized}:`, mailErr.message);
                console.log(`🔑 FALLBACK OTP for ${normalized}: ${otp}`);
            }
        } else {
            try {
                await sendPhoneOTP(normalized, otp);
            } catch (phoneErr) {
                console.error(`⚠️ SMS OTP delivery failed for ${normalized}:`, phoneErr.message);
                console.log(`🔑 FALLBACK OTP for ${normalized}: ${otp}`);
            }
        }

        return { 
            message: `OTP sent to ${normalized}`,
            target: normalized,
            type 
        };
    }

    /**
     * Verify OTP and bind new contact method to user
     */
    async verifyContact({ userId, identifier, type, otp }) {
        if (!userId) {
            const err = new Error('User ID is required');
            err.statusCode = 401;
            throw err;
        }

        const normalized = this.normalizeIdentifier(identifier, type);
        const key = getContactKey(userId, normalized);
        const storedHashedOtp = await cache.get(key);

        if (!storedHashedOtp || storedHashedOtp !== hashSha256(otp)) {
            const err = new Error('Invalid or expired OTP');
            err.statusCode = 400;
            throw err;
        }

        // Re-check uniqueness before final commit to database
        await this.assertContactAvailable(normalized, type, userId);

        await cache.del(key);
        await db.query(
            `UPDATE users SET ${type} = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2`, 
            [normalized, userId]
        );

        // Auto mark verified if both email and phone are present
        await db.query(
            `UPDATE users SET is_verified = TRUE WHERE id = $1 AND email IS NOT NULL AND phone IS NOT NULL`,
            [userId]
        );

        const verifiedAt = new Date().toISOString();
        console.log(`✅ [CONTACT VERIFIED] User ID: ${userId} verified ${type} (${normalized}) at ${verifiedAt}.`);

        return { 
            message: `${type === 'email' ? 'Email' : 'Phone'} updated and verified successfully`,
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
