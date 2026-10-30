const db = require('../../config/db');
const { sendOTP: sendPhoneOTP } = require('../../config/twilio');
const { sanitizePhone, generateUniqueUsername } = require('./authUtils');
const { otpService } = require('./otpService');

class PhoneSignupService {
    /**
     * Validates and standardizes a phone number
     */
    validateAndNormalizePhone(rawPhone) {
        if (!rawPhone || typeof rawPhone !== 'string') {
            const err = new Error('Please provide a valid phone number');
            err.statusCode = 400;
            throw err;
        }

        const phone = sanitizePhone(rawPhone);
        if (!phone || phone.length < 8) {
            const err = new Error('Please provide a valid phone number');
            err.statusCode = 400;
            throw err;
        }

        return phone;
    }

    /**
     * Finds user by phone number in database
     */
    async getUserByPhone(phone) {
        const withoutPlus = phone.startsWith('+') ? phone.slice(1) : phone;
        const withoutPrefix = phone.replace(/^\+\d{1,4}/, '');
        const result = await db.query(
            'SELECT id, email, phone, role, is_verified, status FROM users WHERE phone = $1 OR phone = $2 OR phone = $3',
            [phone, withoutPlus, withoutPrefix]
        );
        return result.rows[0] || null;
    }

    /**
     * Dispatches OTP via SMS using Twilio
     */
    async dispatchPhoneOtp(phone, otp) {
        try {
            await sendPhoneOTP(phone, otp);
            console.log(`✅ OTP sent to phone: ${phone}`);
        } catch (phoneError) {
            console.error(`⚠️ Failed to deliver OTP SMS to ${phone}:`, phoneError.message);
            console.log(`🔑 FALLBACK OTP for ${phone}: ${otp} (valid 5 min)`);
        }
    }

    /**
     * Phone Signup: Sends OTP to register a new phone number
     */
    async sendSignupOtp(rawPhone) {
        const phone = this.validateAndNormalizePhone(rawPhone);

        const existingUser = await this.getUserByPhone(phone);
        if (existingUser) {
            const err = new Error('User already registered, please login.');
            err.statusCode = 400;
            throw err;
        }

        const defaultUsername = await generateUniqueUsername(db, { phone });

        const insertResult = await db.query(
            'INSERT INTO users (phone, username) VALUES ($1, $2) RETURNING id',
            [phone, defaultUsername]
        );
        const userId = insertResult.rows[0].id;

        const otp = otpService.generateOtp();
        await otpService.storeOtp(userId, otp, 300);
        console.log(`[PHONE SIGNUP OTP DEBUG] Generated OTP for ${phone} (User ID: ${userId}): ${otp}`);

        await this.dispatchPhoneOtp(phone, otp);

        return {
            message: 'OTP sent to your phone',
            userId,
            type: 'phone',
            action: 'register'
        };
    }

    /**
     * Verifies OTP specifically for Phone Signup
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
    PhoneSignupService,
    phoneSignupService: new PhoneSignupService()
};
