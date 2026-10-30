const db = require('../../config/db');

async function migrateConditionNew() {
    try {
        console.log('--- Migrating equipment_posts condition check constraint ---');

        // Drop existing constraint if exists
        await db.query(`
            ALTER TABLE equipment_posts 
            DROP CONSTRAINT IF EXISTS equipment_posts_condition_check;
        `);
        console.log('Dropped existing equipment_posts_condition_check constraint.');

        // Add updated constraint including 'New'
        await db.query(`
            ALTER TABLE equipment_posts 
            ADD CONSTRAINT equipment_posts_condition_check 
            CHECK (condition IN ('New', 'Used', 'Refurbished', 'Spare'));
        `);
        console.log("Added updated equipment_posts_condition_check constraint with 'New', 'Used', 'Refurbished', 'Spare'.");

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
        throw error;
    } finally {
        process.exit(0);
    }
}

migrateConditionNew();
