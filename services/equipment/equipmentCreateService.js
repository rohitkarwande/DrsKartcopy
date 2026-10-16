const db = require('../../config/db');
const { CATEGORIES, CONDITIONS } = require('./equipmentConstants');

class EquipmentCreateService {
    /**
     * Create equipment post with validation, images, and notification
     */
    async createEquipment({ sellerId, data, files, io, userContact, userId }) {
        const { title, description, category, brand, model, manufacturingYear, condition, price, city, state, country } = data;

        if (!title || title.length < 5 || title.length > 150) {
            const err = new Error('Title must be between 5 and 150 characters');
            err.statusCode = 400;
            throw err;
        }
        if (description && description.length > 3000) {
            const err = new Error('Description max 3000 characters');
            err.statusCode = 400;
            throw err;
        }
        if (!category || !CATEGORIES.includes(category)) {
            const err = new Error('Invalid category');
            err.statusCode = 400;
            throw err;
        }
        if (!brand || !model || !city) {
            const err = new Error('Brand, model, and city are required');
            err.statusCode = 400;
            throw err;
        }
        if (!condition || !CONDITIONS.includes(condition)) {
            const err = new Error('Invalid condition');
            err.statusCode = 400;
            throw err;
        }
        if (price !== undefined && price < 0) {
            const err = new Error('Price cannot be negative');
            err.statusCode = 400;
            throw err;
        }
        if (manufacturingYear && manufacturingYear > new Date().getFullYear()) {
            const err = new Error('Manufacturing year cannot exceed current year');
            err.statusCode = 400;
            throw err;
        }

        const initialStatus = (!files || files.length === 0 || price === 0 || price > 100000000) ? 'Draft' : 'Active';

        const insertQuery = `
            INSERT INTO equipment_posts (
                seller_id, title, description, category, brand, model, 
                manufacturing_year, condition, price, city, state, country, status
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
            RETURNING *;
        `;
        const values = [sellerId, title, description, category, brand, model, manufacturingYear || null, condition, price || null, city, state || null, country || null, initialStatus];
        const result = await db.query(insertQuery, values);
        const post = result.rows[0];

        let images = [];
        if (files && files.length > 0) {
            if (files.length > 10) {
                const err = new Error('Maximum 10 images allowed');
                err.statusCode = 400;
                throw err;
            }

            const imagePromises = files.map((file, index) => {
                const isVideo = file.mimetype.startsWith('video/');
                const imageUrl = isVideo ? `/uploads/videos/${file.filename}` : `/uploads/${file.filename}`;
                return db.query(
                    `INSERT INTO equipment_images (equipment_post_id, image_url, display_order, media_type) VALUES ($1, $2, $3, $4) RETURNING *`,
                    [post.id, imageUrl, index, isVideo ? 'video' : 'image']
                );
            });
            const imgResults = await Promise.all(imagePromises);
            images = imgResults.map(r => r.rows[0]);
        }

        return { message: 'Equipment post created successfully', post, images };
    }
}

module.exports = new EquipmentCreateService();
