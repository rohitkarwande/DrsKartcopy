const db = require('../../config/db');
const { sendEmailOTP } = require('../../config/email');
const { isEmail } = require('./authUtils');
const { otpService } = require('./otpService');

class EmailLoginService {
    /**
     * Validates and normalizes an email address
     */
    validateAndNormalizeEmail(rawEmail) {
        if (!rawEmail || typeof rawEmail !== 'string') {
            const err = new Error('Please provide a valid email address');
            err.statusCode = 400;
            throw err;
        }

        const email = rawEmail.trim().toLowerCase();
        if (!isEmail(email)) {
            const err = new Error('Please provide a valid email address');
            err.statusCode = 400;
            throw err;
        }

        return email;
    }

    /**
     * Finds user by email in database
     */
    async getUserByEmail(email) {
        const result = await db.query(
            'SELECT id, email, phone, role, is_verified, status FROM users WHERE LOWER(email) = $1',
            [email]
        );
        return result.rows[0] || null;
    }

    /**
     * Dispatches OTP via email with fallback log
     */
    async dispatchEmailOtp(email, otp) {
        try {
            await sendEmailOTP(email, otp);
            console.log(`✅ OTP sent to email: ${email}`);
        } catch (emailError) {
            console.error(`⚠️ Failed to deliver OTP email to ${email}:`, emailError.message);
            console.log(`🔑 FALLBACK OTP for ${email}: ${otp} (valid 5 min)`);
        }
    }

    /**
     * Email Login: Sends OTP to authenticate an existing user
     */
    async sendLoginOtp(rawEmail) {
        const email = this.validateAndNormalizeEmail(rawEmail);

        const user = await this.getUserByEmail(email);
        if (!user) {
            const err = new Error('User not registered, please register first.');
            err.statusCode = 400;
            throw err;
        }

        if (user.status === 'Suspended') {
            const err = new Error('Account suspended. Please contact support.');
            err.statusCode = 403;
            throw err;
        }

        const userId = user.id;

        const otp = otpService.generateOtp();
        await otpService.storeOtp(userId, otp, 300);
        console.log(`[EMAIL LOGIN OTP DEBUG] Generated OTP for ${email} (User ID: ${userId}): ${otp}`);

        await this.dispatchEmailOtp(email, otp);

        return {
            message: 'OTP sent to your email',
            userId,
            type: 'email',
            action: 'login'
        };
    }

    /**
     * Verifies OTP specifically for Email Login
     */
    async verifyLoginOtp({ rawUserId, otp, ipAddress, userAgent, io }) {
        return await otpService.verifyOtpCode({
            rawUserId,
            otp,
            ipAddress,
            userAgent,
            io,
            expectedAction: 'login'
        });
    }
}

module.exports = {
    EmailLoginService,
    emailLoginService: new EmailLoginService()
};
