const db = require('../../config/db');
const { CATEGORIES, CONDITIONS } = require('./equipmentConstants');

class EquipmentUpdateService {
    /**
     * Update equipment post details, images, and media
     */
    async updateEquipment({ id, sellerId, isAdmin, data, files }) {
        const { title, description, category, brand, model, manufacturingYear, condition, price, city, state, country, deletedImages } = data;

        const postResult = await db.query('SELECT * FROM equipment_posts WHERE id = $1', [id]);
        if (postResult.rows.length === 0) {
            const err = new Error('Equipment post not found');
            err.statusCode = 404;
            throw err;
        }
        if (postResult.rows[0].seller_id !== sellerId && !isAdmin) {
            const err = new Error('Unauthorized to update this post');
            err.statusCode = 403;
            throw err;
        }

        if (title && (title.length < 5 || title.length > 150)) throw Object.assign(new Error('Title must be between 5 and 150 characters'), { statusCode: 400 });
        if (description && description.length > 3000) throw Object.assign(new Error('Description max 3000 characters'), { statusCode: 400 });
        if (category && !CATEGORIES.includes(category)) throw Object.assign(new Error('Invalid category'), { statusCode: 400 });
        if (condition && !CONDITIONS.includes(condition)) throw Object.assign(new Error('Invalid condition'), { statusCode: 400 });
        if (price !== undefined && price < 0) throw Object.assign(new Error('Price cannot be negative'), { statusCode: 400 });
        if (manufacturingYear && manufacturingYear > new Date().getFullYear()) throw Object.assign(new Error('Manufacturing year cannot exceed current year'), { statusCode: 400 });

        const updateQuery = `
            UPDATE equipment_posts SET
                title = COALESCE($1, title), description = COALESCE($2, description), category = COALESCE($3, category),
                brand = COALESCE($4, brand), model = COALESCE($5, model), manufacturing_year = COALESCE($6, manufacturing_year),
                condition = COALESCE($7, condition), price = COALESCE($8, price), city = COALESCE($9, city),
                state = COALESCE($10, state), country = COALESCE($11, country), updated_at = CURRENT_TIMESTAMP
            WHERE id = $12 RETURNING *;
        `;
        const values = [title, description, category, brand, model, manufacturingYear, condition, price, city, state, country, id];
        const updatedPostResult = await db.query(updateQuery, values);

        if (deletedImages) {
            const imgIds = Array.isArray(deletedImages) ? deletedImages : [deletedImages];
            await db.query(`DELETE FROM equipment_images WHERE id = ANY($1::int[]) AND equipment_post_id = $2`, [imgIds, id]);
        }

        if (files && files.length > 0) {
            const currentImgCountRes = await db.query('SELECT COUNT(*) FROM equipment_images WHERE equipment_post_id = $1', [id]);
            const currentCount = parseInt(currentImgCountRes.rows[0].count, 10);
            if (currentCount + files.length > 10) throw Object.assign(new Error('Adding these images would exceed the 10 image limit'), { statusCode: 400 });

            const imagePromises = files.map((file, index) => {
                const isVideo = file.mimetype.startsWith('video/');
                const imageUrl = isVideo ? `/uploads/videos/${file.filename}` : `/uploads/${file.filename}`;
                return db.query(
                    `INSERT INTO equipment_images (equipment_post_id, image_url, display_order, media_type) VALUES ($1, $2, $3, $4) RETURNING *`,
                    [id, imageUrl, currentCount + index, isVideo ? 'video' : 'image']
                );
            });
            await Promise.all(imagePromises);
        }

        const remainingImages = await db.query('SELECT * FROM equipment_images WHERE equipment_post_id = $1 ORDER BY display_order', [id]);
        return { message: 'Equipment post updated successfully', post: updatedPostResult.rows[0], images: remainingImages.rows };
    }

    /**
     * Update equipment post stock and reserved inventory quantities
     */
    async updateInventory({ id, sellerId, stock_quantity, reserved_quantity }) {
        const result = await db.query(
            "UPDATE equipment_posts SET stock_quantity = COALESCE($1, stock_quantity), reserved_quantity = COALESCE($2, reserved_quantity), updated_at = CURRENT_TIMESTAMP WHERE id = $3 AND seller_id = $4 RETURNING *",
            [stock_quantity, reserved_quantity, id, sellerId]
        );
        if (result.rows.length === 0) {
            const err = new Error('Equipment post not found or unauthorized');
            err.statusCode = 404;
            throw err;
        }
        return result.rows[0];
    }
}

module.exports = new EquipmentUpdateService();
