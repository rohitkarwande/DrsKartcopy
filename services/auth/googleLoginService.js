const db = require('../../config/db');
const { tokenService } = require('./tokenService');
const { getUserWithProfile } = require('./authUtils');

class GoogleLoginService {
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
     * Google Login: Authenticates an existing user via Google SSO
     */
    async login({ email }) {
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

        await db.query("UPDATE users SET is_verified = TRUE, status = 'Active' WHERE id = $1", [user.id]);

        const token = tokenService.generateToken(
            { id: user.id, email: user.email, phone: user.phone, role: user.role },
            '24h'
        );

        const fullProfile = await getUserWithProfile(user.id);

        return {
            message: 'Google login successful',
            token,
            user: fullProfile
        };
    }
}

module.exports = {
    GoogleLoginService,
    googleLoginService: new GoogleLoginService()
};
