const crypto = require('crypto');
const db = require('../../config/db');
const cache = require('../../config/cache');
const { getUserWithProfile, generateUniqueUsername } = require('./authUtils');
const { tokenService } = require('./tokenService');
const { authSecurityService } = require('./authSecurityService');

// Hash values with SHA-256 for secure DB storage
const hashSha256 = (val) => crypto.createHash('sha256').update(String(val)).digest('hex');

// Generate SHA-256 cache key derived from user ID
const getOtpKey = (userId) => hashSha256(`otp:user:${userId}`);

class OtpService {
    /**
     * Generates a 6-digit numeric OTP string
     */
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Stores SHA-256 hashed OTP in cache_store under a SHA-256 hashed key
     */
    async storeOtp(userId, otp, ttlSeconds = 300) {
        const hashedKey = getOtpKey(userId);
        const hashedOtp = hashSha256(otp);
        await cache.setEx(hashedKey, ttlSeconds, hashedOtp);
    }

    /**
     * Retrieves cached hashed OTP for a user
     */
    async getCachedOtp(userId) {
        const hashedKey = getOtpKey(userId);
        return await cache.get(hashedKey);
    }

    /**
     * Deletes cached OTP immediately from cache_store
     */
    async clearOtp(userId) {
        const hashedKey = getOtpKey(userId);
        await cache.del(hashedKey);
    }

    /**
     * Common verification pipeline for OTP-based authentication
     */
    async verifyOtpCode({ rawUserId, otp, ipAddress, userAgent, io, expectedAction }) {
        const userId = Number.isInteger(rawUserId) ? rawUserId : parseInt(rawUserId, 10);
        if (!userId || !otp) {
            const err = new Error('User ID and OTP are required');
            err.statusCode = 400;
            throw err;
        }

        // 1. Check IP Blacklist
        await authSecurityService.checkIpBlacklist(ipAddress);

        // 2. Validate cached OTP using SHA-256 comparison
        const storedHashedOtp = await this.getCachedOtp(userId);
        const enteredHashedOtp = hashSha256(otp);
        if (!storedHashedOtp || storedHashedOtp !== enteredHashedOtp) {
            const err = new Error('Invalid or expired OTP');
            err.statusCode = 401;
            throw err;
        }

        // 3. Delete OTP immediately from cache_store
        await this.clearOtp(userId);

        const verifiedAt = new Date().toISOString();
        console.log(`✅ [OTP VERIFIED] User ID: ${userId} verified at ${verifiedAt}. Cache entry deleted immediately.`);

        // 4. Record verification event in audit_logs
        await db.query(
            `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, changes, ip_address, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [
                userId,
                'OTP_VERIFIED',
                'users',
                String(userId),
                JSON.stringify({ status: 'verified', verified_at: verifiedAt }),
                ipAddress || 'unknown'
            ]
        ).catch(err => console.error('Failed to record OTP verification to audit_logs:', err.message));

        // 5. Check if user was already verified before we update
        const previousState = await db.query('SELECT is_verified, username FROM users WHERE id = $1', [userId]);
        const wasVerified = previousState.rows[0]?.is_verified;
        let currentUsername = previousState.rows[0]?.username;

        if (!currentUsername) {
            currentUsername = await generateUniqueUsername(db, { id: userId });
            await db.query('UPDATE users SET username = $1 WHERE id = $2', [currentUsername, userId]);
            await db.query('UPDATE user_profiles SET username = $1 WHERE user_id = $2', [currentUsername, userId]);
        }

        // 6. Mark user as verified
        await db.query('UPDATE users SET is_verified = TRUE WHERE id = $1', [userId]);

        // 7. Fetch user profile
        const user = await getUserWithProfile(userId);
        if (!user) {
            const err = new Error('Server error during OTP verification');
            err.statusCode = 500;
            throw err;
        }

        // 8. IP Tracking & Alerts
        const { isNewIp } = await authSecurityService.recordLoginHistory(userId, ipAddress, userAgent);
        if (isNewIp && wasVerified && user.email) {
            authSecurityService.sendNewLoginAlert({ email: user.email, ipAddress, userAgent });
        }

        // 10. Generate JWT
        const token = tokenService.generateToken(
            { id: user.id, email: user.email, phone: user.phone, role: user.role },
            '24h'
        );

        const message = (!wasVerified || expectedAction === 'register')
            ? 'Registration successful'
            : 'Login successful';

        return {
            message,
            status: 'verified',
            verified: true,
            verifiedAt,
            token,
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                username: user.username || currentUsername,
                role: user.role,
                profession: user.profession,
                location: user.location,
                first_name: user.first_name,
                last_name: user.last_name
            }
        };
    }
}

module.exports = {
    OtpService,
    otpService: new OtpService()
};

