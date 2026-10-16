const { sanitizeIdentifier } = require('../services/auth/authUtils');
const { emailSignupService } = require('../services/auth/emailSignupService');
const { emailLoginService } = require('../services/auth/emailLoginService');
const { phoneSignupService } = require('../services/auth/phoneSignupService');
const { phoneLoginService } = require('../services/auth/phoneLoginService');
const { googleAuthService } = require('../services/auth/googleAuthService');
const { googleSignupService } = require('../services/auth/googleSignupService');
const { googleLoginService } = require('../services/auth/googleLoginService');
const { otpService } = require('../services/auth/otpService');

/**
 * Extracts normalized IP address and user-agent from request
 */
const getClientMeta = (req) => {
    let rawIp = req.headers['x-forwarded-for'] || req.ip || req.connection?.remoteAddress || 'Unknown';
    if (rawIp === '::1' || rawIp === '::ffff:127.0.0.1') rawIp = '127.0.0.1 (Localhost)';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    return { ipAddress: rawIp, userAgent };
};

// ==========================================
// UNIFIED / BACKWARD-COMPATIBLE HANDLERS
// ==========================================

const sendOtp = async (req, res) => {
    try {
        const { identifier, action } = req.body;
        const sanitized = sanitizeIdentifier(identifier);
        if (!sanitized) {
            return res.status(400).json({ error: 'Please provide a valid email or phone number' });
        }

        const { identifier: idf, type } = sanitized;
        let result;

        if (type === 'email') {
            if (action === 'register') {
                result = await emailSignupService.sendSignupOtp(idf);
            } else if (action === 'login') {
                result = await emailLoginService.sendLoginOtp(idf);
            } else {
                const existing = await emailSignupService.getUserByEmail(idf);
                result = existing
                    ? await emailLoginService.sendLoginOtp(idf)
                    : await emailSignupService.sendSignupOtp(idf);
            }
        } else {
            if (action === 'register') {
                result = await phoneSignupService.sendSignupOtp(idf);
            } else if (action === 'login') {
                result = await phoneLoginService.sendLoginOtp(idf);
            } else {
                const existing = await phoneSignupService.getUserByPhone(idf);
                result = existing
                    ? await phoneLoginService.sendLoginOtp(idf)
                    : await phoneSignupService.sendSignupOtp(idf);
            }
        }

        res.json(result);
    } catch (error) {
        console.error('Error in sendOtp:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server error while sending OTP' });
    }
};

const verifyOtp = async (req, res) => {
    try {
        const rawUserId = req.body.userId;
        const otp = req.body.otp;
        const { ipAddress, userAgent } = getClientMeta(req);

        const result = await otpService.verifyOtpCode({
            rawUserId,
            otp,
            ipAddress,
            userAgent,
            io: req.io
        });

        res.json({
            message: result.message || 'Login successful',
            status: result.status || 'verified',
            verified: true,
            verifiedAt: result.verifiedAt,
            token: result.token,
            user: result.user
        });
    } catch (error) {
        console.error('Error in verifyOtp:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server error during OTP verification' });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { credential, email, name, isMock } = req.body;
        const result = await googleAuthService.authenticate({
            credential,
            mockEmail: email,
            mockName: name,
            isMock,
            io: req.io
        });
        res.json(result);
    } catch (error) {
        console.error('Error in googleLogin:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server error during Google Sign-In' });
    }
};

const logout = async (req, res) => {
    res.json({ message: 'Logout successful' });
};

// ==========================================
// DEDICATED EMAIL AUTHENTICATION HANDLERS
// ==========================================

const emailSignup = async (req, res) => {
    try {
        const email = req.body.email || req.body.identifier;
        const result = await emailSignupService.sendSignupOtp(email);
        res.json(result);
    } catch (error) {
        console.error('Error in emailSignup:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server error during email registration' });
    }
};

const emailLogin = async (req, res) => {
    try {
        const email = req.body.email || req.body.identifier;
        const result = await emailLoginService.sendLoginOtp(email);
        res.json(result);
    } catch (error) {
        console.error('Error in emailLogin:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server error during email login' });
    }
};

const emailVerifySignup = async (req, res) => {
    try {
        const rawUserId = req.body.userId;
        const otp = req.body.otp;
        const { ipAddress, userAgent } = getClientMeta(req);

        const result = await emailSignupService.verifySignupOtp({
            rawUserId,
            otp,
            ipAddress,
            userAgent,
            io: req.io
        });

        res.json(result);
    } catch (error) {
        console.error('Error in emailVerifySignup:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server error during email signup verification' });
    }
};

const emailVerifyLogin = async (req, res) => {
    try {
        const rawUserId = req.body.userId;
        const otp = req.body.otp;
        const { ipAddress, userAgent } = getClientMeta(req);

        const result = await emailLoginService.verifyLoginOtp({
            rawUserId,
            otp,
            ipAddress,
            userAgent,
            io: req.io
        });

        res.json(result);
    } catch (error) {
        console.error('Error in emailVerifyLogin:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server error during email login verification' });
    }
};

// ==========================================
// DEDICATED PHONE AUTHENTICATION HANDLERS
// ==========================================

const phoneSignup = async (req, res) => {
    try {
        const phone = req.body.phone || req.body.identifier;
        const result = await phoneSignupService.sendSignupOtp(phone);
        res.json(result);
    } catch (error) {
        console.error('Error in phoneSignup:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server error during phone registration' });
    }
};

const phoneLogin = async (req, res) => {
    try {
        const phone = req.body.phone || req.body.identifier;
        const result = await phoneLoginService.sendLoginOtp(phone);
        res.json(result);
    } catch (error) {
        console.error('Error in phoneLogin:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server error during phone login' });
    }
};

const phoneVerifySignup = async (req, res) => {
    try {
        const rawUserId = req.body.userId;
        const otp = req.body.otp;
        const { ipAddress, userAgent } = getClientMeta(req);

        const result = await phoneSignupService.verifySignupOtp({
            rawUserId,
            otp,
            ipAddress,
            userAgent,
            io: req.io
        });

        res.json(result);
    } catch (error) {
        console.error('Error in phoneVerifySignup:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server error during phone signup verification' });
    }
};

const phoneVerifyLogin = async (req, res) => {
    try {
        const rawUserId = req.body.userId;
        const otp = req.body.otp;
        const { ipAddress, userAgent } = getClientMeta(req);

        const result = await phoneLoginService.verifyLoginOtp({
            rawUserId,
            otp,
            ipAddress,
            userAgent,
            io: req.io
        });

        res.json(result);
    } catch (error) {
        console.error('Error in phoneVerifyLogin:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server error during phone login verification' });
    }
};

// ==========================================
// DEDICATED GOOGLE AUTHENTICATION HANDLERS
// ==========================================

const googleSignup = async (req, res) => {
    try {
        const { credential, email, name, isMock } = req.body;
        const result = await googleSignupService.signup({
            credential,
            email,
            name,
            isMock,
            io: req.io
        });
        res.json(result);
    } catch (error) {
        console.error('Error in googleSignup:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server error during Google registration' });
    }
};

const googleLoginDedicated = async (req, res) => {
    try {
        const { credential, email, name, isMock } = req.body;
        const result = await googleLoginService.login({
            credential,
            email,
            name,
            isMock
        });
        res.json(result);
    } catch (error) {
        console.error('Error in googleLoginDedicated:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server error during Google login' });
    }
};

module.exports = {
    // Legacy / Unified
    sendOtp,
    verifyOtp,
    googleLogin,
    logout,

    // Email
    emailSignup,
    emailLogin,
    emailVerifySignup,
    emailVerifyLogin,

    // Phone
    phoneSignup,
    phoneLogin,
    phoneVerifySignup,
    phoneVerifyLogin,

    // Google
    googleSignup,
    googleLoginDedicated
};
