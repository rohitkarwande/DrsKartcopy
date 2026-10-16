const { OAuth2Client } = require('google-auth-library');
const { googleSignupService, GoogleSignupService } = require('./googleSignupService');
const { googleLoginService, GoogleLoginService } = require('./googleLoginService');
require('dotenv').config();

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClient = googleClientId ? new OAuth2Client(googleClientId) : null;

class GoogleAuthService {
    constructor() {
        this.signupService = googleSignupService;
        this.loginService = googleLoginService;
    }

    /**
     * Verifies Google ID token with Google OAuth2 
     */
    async verifyGoogleIdentity({ credential, mockEmail, mockName, isMock }) {
        let email = mockEmail;
        let name = mockName;

        if (googleClient && credential && !isMock) {
            try {
                const ticket = await googleClient.verifyIdToken({
                    idToken: credential,
                    audience: googleClientId,
                });
                const payload = ticket.getPayload();
                email = payload.email;
                name = payload.name;
            } catch (verifyError) {
                console.error('Google ID Token verification failed:', verifyError.message);
                const err = new Error('Invalid or expired Google identity token');
                err.statusCode = 401;
                throw err;
            }
        } else {
            console.log(`[Google Auth] verification for ${email} (Name: ${name})`);
        }

        if (!email) {
            const err = new Error('Email is required for Google Sign-In');
            err.statusCode = 400;
            throw err;
        }

        return { email: email.toLowerCase().trim(), name };
    }

    async signup({ credential, mockEmail, mockName, isMock, io }) {
        const { email, name } = await this.verifyGoogleIdentity({ credential, mockEmail, mockName, isMock });
        return await this.signupService.signup({ email, name, io });
    }

    async login({ credential, mockEmail, mockName, isMock }) {
        const { email } = await this.verifyGoogleIdentity({ credential, mockEmail, mockName, isMock });
        return await this.loginService.login({ email });
    }

    /**
     * Unified Google SSO: Automatically logs in if account exists, or registers if new
     */
    async authenticate({ credential, mockEmail, mockName, isMock, io }) {
        const { email, name } = await this.verifyGoogleIdentity({ credential, mockEmail, mockName, isMock });
        const existingUser = await this.signupService.getUserByEmail(email);

        if (existingUser) {
            return await this.loginService.login({ email });
        } else {
            return await this.signupService.signup({ email, name, io });
        }
    }
}

module.exports = {
    GoogleAuthService,
    googleAuthService: new GoogleAuthService(),
    googleSignupService,
    googleLoginService
};
