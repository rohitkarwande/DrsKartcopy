const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

function generateBase(email, phone, id) {
    if (email) {
        const prefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        return prefix.slice(0, 20) || `user_${id}`;
    }
    if (phone) {
        const digits = phone.replace(/[^0-9]/g, '');
        return `user_${digits.slice(-4) || id}`;
    }
    return `user_${id}`;
}

(async () => {
    const client = await pool.connect();
    try {
        console.log('Running username migration...');
        
        await client.query(`
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;
        `);

        await client.query(`
            ALTER TABLE user_profiles 
            ADD COLUMN IF NOT EXISTS username VARCHAR(100);
        `);

        // Find users without a username
        const usersWithoutUsername = await client.query(
            'SELECT id, email, phone FROM users WHERE username IS NULL'
        );

        console.log(`Found ${usersWithoutUsername.rows.length} users needing default usernames.`);

        for (const user of usersWithoutUsername.rows) {
            let base = generateBase(user.email, user.phone, user.id);
            let username = `${base}_${Math.floor(1000 + Math.random() * 9000)}`;

            // Ensure uniqueness
            let isUnique = false;
            let attempts = 0;
            while (!isUnique && attempts < 10) {
                const existing = await client.query('SELECT id FROM users WHERE username = $1', [username]);
                if (existing.rows.length === 0) {
                    isUnique = true;
                } else {
                    username = `${base}_${Math.floor(1000 + Math.random() * 9000)}`;
                    attempts++;
                }
            }

            await client.query('UPDATE users SET username = $1 WHERE id = $2', [username, user.id]);
            await client.query('UPDATE user_profiles SET username = $1 WHERE user_id = $2', [username, user.id]);
            console.log(`Assigned default username '${username}' to user ID ${user.id}`);
        }

        console.log('✅ Username migration completed successfully!');
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        client.release();
        await pool.end();
    }
})();
