const db = require('../../config/db');

class UserProfileService {
    /**
     * Get user profile details
     */
    async getProfile(userId) {
        const result = await db.query(
            `SELECT u.id, u.email, u.phone, u.username, u.is_verified, u.created_at, u.role, u.paid_promotions_enabled,
                    p.first_name, p.last_name, p.company_name, p.avatar_url, p.bio, p.age, p.profession, p.location
             FROM users u
             LEFT JOIN user_profiles p ON u.id = p.user_id
             WHERE u.id = $1`,
            [userId]
        );
        let user = result.rows[0];
        if (user && !user.username) {
            const { generateUniqueUsername } = require('./authUtils');
            const defaultUsername = await generateUniqueUsername(db, { id: userId, email: user.email, phone: user.phone });
            await db.query('UPDATE users SET username = $1 WHERE id = $2', [defaultUsername, userId]);
            await db.query('UPDATE user_profiles SET username = $1 WHERE user_id = $2', [defaultUsername, userId]);
            user.username = defaultUsername;
        }
        return user;
    }

    /**
     * Update user profile
     */
    async updateProfile(userId, data) {
        const { first_name, last_name, company_name, avatar_url, bio, age, profession, location } = data;

        // If updating personal details, all fields are compulsory
        if (first_name !== undefined || last_name !== undefined || company_name !== undefined || bio !== undefined) {
            if (
                !first_name?.trim() ||
                !last_name?.trim() ||
                !company_name?.trim() ||
                !bio?.trim() ||
                !age ||
                !profession?.trim() ||
                !location?.trim()
            ) {
                const err = new Error('All personal details are compulsory. Please fill in first name, last name, age, profession, location, company name, and bio.');
                err.statusCode = 400;
                throw err;
            }
        }

        const result = await db.query(
            `INSERT INTO user_profiles (user_id, first_name, last_name, company_name, avatar_url, bio, age, profession, location)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
             ON CONFLICT (user_id) DO UPDATE 
             SET first_name = EXCLUDED.first_name,
                 last_name = EXCLUDED.last_name,
                 company_name = EXCLUDED.company_name,
                 avatar_url = EXCLUDED.avatar_url,
                 bio = EXCLUDED.bio,
                 age = EXCLUDED.age,
                 profession = EXCLUDED.profession,
                 location = EXCLUDED.location,
                 updated_at = CURRENT_TIMESTAMP
             RETURNING *`,
            [
                userId, 
                first_name ? first_name.trim() : null, 
                last_name ? last_name.trim() : null, 
                company_name ? company_name.trim() : null, 
                avatar_url || null, 
                bio ? bio.trim() : null, 
                age ? parseInt(age, 10) : null, 
                profession ? profession.trim() : null, 
                location ? location.trim() : null
            ]
        );

        return result.rows[0];
    }
}

module.exports = {
    UserProfileService,
    userProfileService: new UserProfileService()
};
