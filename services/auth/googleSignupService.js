const db = require('../../config/db');
const { tokenService } = require('./tokenService');
const { authSecurityService } = require('./authSecurityService');
const { getUserWithProfile, generateUniqueUsername } = require('./authUtils');

class GoogleSignupService {
    /**
     * Splits a full name string into first and last name
     */
    splitName(name) {
        if (!name) return { firstName: '', lastName: '' };
        const trimmed = name.trim();
        const spaceIndex = trimmed.indexOf(' ');
        if (spaceIndex === -1) {
            return { firstName: trimmed, lastName: '' };
        }
        return {
            firstName: trimmed.substring(0, spaceIndex),
            lastName: trimmed.substring(spaceIndex + 1).trim()
        };
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
     * Google Signup: Registers a new user via Google SSO
     */
    async signup({ email, name, io }) {
        const existingUser = await this.getUserByEmail(email);
        if (existingUser) {
            const err = new Error('User already registered, please login.');
            err.statusCode = 400;
            throw err;
        }

        const defaultUsername = await generateUniqueUsername(db, { email, name });

        const insertResult = await db.query(
            "INSERT INTO users (email, username, role, is_verified, status) VALUES ($1, $2, 'user', TRUE, 'Active') RETURNING id, email, phone, username, role, is_verified",
            [email, defaultUsername]
        );
        const user = insertResult.rows[0];

        if (name) {
            const { firstName, lastName } = this.splitName(name);
            await db.query(
                'INSERT INTO user_profiles (user_id, username, first_name, last_name) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO UPDATE SET username = EXCLUDED.username',
                [user.id, defaultUsername, firstName, lastName]
            );
        } else {
            await db.query(
                'INSERT INTO user_profiles (user_id, username) VALUES ($1, $2) ON CONFLICT (user_id) DO UPDATE SET username = EXCLUDED.username',
                [user.id, defaultUsername]
            );
        }

        authSecurityService.notifyNewRegistration({ user, io });

        const token = tokenService.generateToken(
            { id: user.id, email: user.email, phone: user.phone, role: user.role },
            '24h'
        );

        const fullProfile = await getUserWithProfile(user.id);

        return {
            message: 'Google signup successful',
            token,
            user: fullProfile
        };
    }
}

module.exports = {
    GoogleSignupService,
    googleSignupService: new GoogleSignupService()
};
