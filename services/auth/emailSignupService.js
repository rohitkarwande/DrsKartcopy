const db = require('../../config/db');
const { sendEmailOTP } = require('../../config/email');
const { isEmail, generateUniqueUsername } = require('./authUtils');
const { otpService } = require('./otpService');

class EmailSignupService {
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
     * Email Signup: Sends OTP to register a new user
     */
    async sendSignupOtp(rawEmail) {
        const email = this.validateAndNormalizeEmail(rawEmail);

        const existingUser = await this.getUserByEmail(email);
        if (existingUser) {
            const err = new Error('User already registered, please login.');
            err.statusCode = 400;
            throw err;
        }

        const defaultUsername = await generateUniqueUsername(db, { email });

        const insertResult = await db.query(
            'INSERT INTO users (email, username) VALUES ($1, $2) RETURNING id',
            [email, defaultUsername]
        );
        const userId = insertResult.rows[0].id;

        const otp = otpService.generateOtp();
        await otpService.storeOtp(userId, otp, 300);
        console.log(`[EMAIL SIGNUP OTP DEBUG] Generated OTP for ${email} (User ID: ${userId}): ${otp}`);

        await this.dispatchEmailOtp(email, otp);

        return {
            message: 'OTP sent to your email',
            userId,
            type: 'email',
            action: 'register'
        };
    }

    /**
     * Verifies OTP specifically for Email Signup
     */
    async verifySignupOtp({ rawUserId, otp, ipAddress, userAgent, io }) {
        return await otpService.verifyOtpCode({
            rawUserId,
            otp,
            ipAddress,
            userAgent,
            io,
            expectedAction: 'register'
        });
    }
}

module.exports = {
    EmailSignupService,
    emailSignupService: new EmailSignupService()
};
