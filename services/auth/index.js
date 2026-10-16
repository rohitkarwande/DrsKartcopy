// Core Base & Security
const { TokenService, tokenService } = require('./tokenService');
const { OtpService, otpService } = require('./otpService');
const { AuthSecurityService, authSecurityService } = require('./authSecurityService');
const authUtils = require('./authUtils');
const { maskEmail, maskPhone } = authUtils;

// Email Auth (Dedicated Signup & Login)
const { EmailSignupService, emailSignupService } = require('./emailSignupService');
const { EmailLoginService, emailLoginService } = require('./emailLoginService');

// Phone Auth (Dedicated Signup & Login)
const { PhoneSignupService, phoneSignupService } = require('./phoneSignupService');
const { PhoneLoginService, phoneLoginService } = require('./phoneLoginService');

// Google Auth
const { GoogleSignupService, googleSignupService } = require('./googleSignupService');
const { GoogleLoginService, googleLoginService } = require('./googleLoginService');
const { GoogleAuthService, googleAuthService } = require('./googleAuthService');

// User Domain (Dedicated Services)
const { UserProfileService, userProfileService } = require('./userProfileService');
const { UserKycService, userKycService } = require('./userKycService');
const { UserContactService, userContactService } = require('./userContactService');
const { UserDashboardService, userDashboardService } = require('./userDashboardService');

module.exports = {
    // Core Services
    tokenService,
    otpService,
    authSecurityService,

    // Dedicated Email Services
    emailSignupService,
    emailLoginService,

    // Dedicated Phone Services
    phoneSignupService,
    phoneLoginService,

    // Google Services
    googleAuthService,
    googleSignupService,
    googleLoginService,

    // User Domain Services
    userProfileService,
    userKycService,
    userContactService,
    userDashboardService,

    // Classes
    TokenService,
    OtpService,
    AuthSecurityService,
    EmailSignupService,
    EmailLoginService,
    PhoneSignupService,
    PhoneLoginService,
    GoogleAuthService,
    GoogleSignupService,
    GoogleLoginService,
    UserProfileService,
    UserKycService,
    UserContactService,
    UserDashboardService,

    // Helpers
    maskEmail,
    maskPhone,
    authUtils
};
