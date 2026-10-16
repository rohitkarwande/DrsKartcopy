const db = require('../../config/db');

class UserProfileService {
    /**
     * Get user profile details
     */
    async getProfile(userId) {
        const result = await db.query(
            `SELECT u.id, u.email, u.phone, u.is_verified, u.created_at, u.role, u.paid_promotions_enabled,
                    p.first_name, p.last_name, p.company_name, p.avatar_url, p.bio, p.age, p.profession, p.location
             FROM users u
             LEFT JOIN user_profiles p ON u.id = p.user_id
             WHERE u.id = $1`,
            [userId]
        );
        return result.rows[0];
    }

    /**
     * Update user profile
     */
    async updateProfile(userId, data) {
        const { first_name, last_name, company_name, avatar_url, bio, age, profession, location } = data;

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
            [userId, first_name, last_name, company_name, avatar_url, bio, age, profession, location]
        );

        return result.rows[0];
    }
}

module.exports = {
    UserProfileService,
    userProfileService: new UserProfileService()
};
