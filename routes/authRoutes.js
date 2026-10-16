const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// ==========================================
// UNIFIED / BACKWARD-COMPATIBLE ROUTES
// ==========================================
router.post('/send-otp', authController.sendOtp);
router.post('/verify-otp', authController.verifyOtp);
router.post('/google', authController.googleLogin);
router.post('/logout', authController.logout);
router.post('/register', authController.sendOtp); // Register calls sendOtp (client should pass action: 'register')

// ==========================================
// DEDICATED EMAIL AUTHENTICATION ROUTES
// ==========================================
router.post('/email/signup', authController.emailSignup);
router.post('/email/login', authController.emailLogin);
router.post('/email/verify-signup', authController.emailVerifySignup);
router.post('/email/verify-login', authController.emailVerifyLogin);

// ==========================================
// DEDICATED PHONE OTP AUTHENTICATION ROUTES
// ==========================================
router.post('/phone/signup', authController.phoneSignup);
router.post('/phone/login', authController.phoneLogin);
router.post('/phone/verify-signup', authController.phoneVerifySignup);
router.post('/phone/verify-login', authController.phoneVerifyLogin);

// ==========================================
// DEDICATED GOOGLE AUTHENTICATION ROUTES
// ==========================================
router.post('/google/signup', authController.googleSignup);
router.post('/google/login', authController.googleLoginDedicated);

module.exports = router;
