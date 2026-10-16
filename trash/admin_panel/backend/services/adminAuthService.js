const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const cache = require('../../config/cache');
const { sendOTP: sendPhoneOTP } = require('../../config/twilio');
const { sendEmailOTP } = require('../../config/email');
const { isEmail, maskEmail, maskPhone } = require('../../../../services/auth/authUtils');
const { otpService } = require('../../../../services/auth/otpService');
require('dotenv').config();

class AdminAuthService {
    /**
     * Request Dual OTP for Admin 2FA
     */
    async requestDualOtp(identifier) {
        if (!identifier || typeof identifier !== 'string') {
            const err = new Error('Please provide an administrator email or phone number.');
            err.statusCode = 400;
            throw err;
        }

        const idf = identifier.trim();
        const type = isEmail(idf) ? 'email' : 'phone';
        let query, params;

        if (type === 'email') {
            query = 'SELECT id, email, phone, role, status FROM users WHERE LOWER(email) = LOWER($1)';
            params = [idf];
        } else {
            let phone = idf;
            if (!phone.startsWith('+')) phone = '+91' + phone;
            query = 'SELECT id, email, phone, role, status FROM users WHERE phone = $1 OR phone = $2';
            params = [phone, idf];
        }

        const result = await db.query(query, params);
        if (result.rows.length === 0) {
            const err = new Error('No administrator account found with this identifier.');
            err.statusCode = 404;
            throw err;
        }

        const user = result.rows[0];

        if (user.role !== 'admin') {
            const err = new Error('Access denied. Account does not have administrator privileges.');
            err.statusCode = 403;
            throw err;
        }

        if (user.status !== 'Active') {
            const err = new Error('Admin account is currently suspended or inactive.');
            err.statusCode = 403;
            throw err;
        }

        if (!user.email || !user.phone) {
            const err = new Error(`Admin account (${user.email || user.phone}) must have BOTH an email and mobile number registered for 2-Factor Authentication.`);
            err.statusCode = 400;
            err.missingContact = !user.email ? 'email' : 'phone';
            throw err;
        }

        // Generate distinct 6-digit OTPs
        const emailOtp = otpService.generateOtp();
        let mobileOtp = otpService.generateOtp();
        while (mobileOtp === emailOtp) {
            mobileOtp = otpService.generateOtp();
        }

        // Save OTPs in cache for 5 minutes (300 seconds)
        await cache.setEx(`admin_email_otp:${user.id}`, 300, emailOtp);
        await cache.setEx(`admin_mobile_otp:${user.id}`, 300, mobileOtp);

        console.log(`\n======================================================`);
        console.log(`🔐 [ADMIN 2FA SECURITY GATEWAY]`);
        console.log(`Admin User ID: ${user.id} | Email: ${user.email} | Mobile: ${user.phone}`);
        console.log(`✉️  EMAIL OTP:  ${emailOtp} (valid 5 min)`);
        console.log(`📱 MOBILE OTP: ${mobileOtp} (valid 5 min)`);
        console.log(`======================================================\n`);

        let emailDelivered = false;
        try {
            await sendEmailOTP(user.email, emailOtp);
            emailDelivered = true;
            console.log(`✅ Admin 2FA Email OTP sent to ${user.email}`);
        } catch (emailErr) {
            console.error(`⚠️ Failed to deliver Admin 2FA Email to ${user.email}:`, emailErr.message);
        }

        let phoneDelivered = false;
        try {
            await sendPhoneOTP(user.phone, mobileOtp);
            phoneDelivered = true;
            console.log(`✅ Admin 2FA Mobile OTP sent to ${user.phone}`);
        } catch (phoneErr) {
            console.error(`⚠️ Failed to deliver Admin 2FA SMS to ${user.phone}:`, phoneErr.message);
        }

        return {
            message: 'Dual verification codes sent to your registered email and mobile number.',
            userId: user.id,
            maskedEmail: maskEmail(user.email),
            maskedPhone: maskPhone(user.phone),
            emailDelivered,
            phoneDelivered
        };
    }

    /**
     * Verifies Admin Dual OTP and returns elevated Admin token
     */
    async verifyDualOtp({ rawUserId, emailOtp, mobileOtp, ipAddress, userAgent }) {
        const userId = Number.isInteger(rawUserId) ? rawUserId : parseInt(rawUserId, 10);

        if (!userId || !emailOtp || !mobileOtp) {
            const err = new Error('User ID, Email OTP, and Mobile OTP are all required.');
            err.statusCode = 400;
            throw err;
        }

        const cachedEmailOtp = await cache.get(`admin_email_otp:${userId}`);
        const cachedMobileOtp = await cache.get(`admin_mobile_otp:${userId}`);

        if (!cachedEmailOtp || !cachedMobileOtp) {
            const err = new Error('Verification codes have expired. Please request new codes.');
            err.statusCode = 401;
            throw err;
        }

        const cleanEmailOtp = String(emailOtp).trim();
        const cleanMobileOtp = String(mobileOtp).trim();

        const isEmailMatch = cachedEmailOtp === cleanEmailOtp;
        const isMobileMatch = cachedMobileOtp === cleanMobileOtp;

        if (!isEmailMatch && !isMobileMatch) {
            const err = new Error('Both Email and Mobile verification codes are incorrect.');
            err.statusCode = 401;
            throw err;
        }
        if (!isEmailMatch) {
            const err = new Error('Email verification code is incorrect.');
            err.statusCode = 401;
            throw err;
        }
        if (!isMobileMatch) {
            const err = new Error('Mobile verification code is incorrect.');
            err.statusCode = 401;
            throw err;
        }

        // Clear cache
        await cache.del(`admin_email_otp:${userId}`);
        await cache.del(`admin_mobile_otp:${userId}`);

        // Fetch admin user
        const result = await db.query(
            `SELECT u.id, u.email, u.phone, u.role, u.status, p.first_name, p.last_name
             FROM users u
             LEFT JOIN user_profiles p ON u.id = p.user_id
             WHERE u.id = $1 AND u.role = 'admin'`,
            [userId]
        );

        if (result.rows.length === 0) {
            const err = new Error('Admin account not found or role has been modified.');
            err.statusCode = 404;
            throw err;
        }

        const user = result.rows[0];

        // Track IP in login history
        await db.query(
            'INSERT INTO login_history (user_id, ip_address, user_agent) VALUES ($1, $2, $3)',
            [user.id, ipAddress, `[ADMIN 2FA SECURE] ${userAgent}`]
        );

        // Issue elevated Admin JWT with admin2Fa: true
        const adminToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
                phone: user.phone,
                role: user.role,
                admin2Fa: true
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return {
            message: 'Admin 2FA dual verification successful. Access granted.',
            token: adminToken,
            user: {
                id: user.id,
                email: user.email,
                phone: user.phone,
                role: user.role,
                first_name: user.first_name,
                last_name: user.last_name
            }
        };
    }
}

module.exports = {
    AdminAuthService,
    adminAuthService: new AdminAuthService()
};
