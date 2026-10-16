const db = require('../../config/db');

class EquipmentSearchService {
    /**
     * List equipment with filters, text search, pagination, and sorting
     */
    async listEquipment(params, userId) {
        const { category, condition, city, brand, minPrice, maxPrice, search, sort, page = 1, limit = 10 } = params;

        let queryStr = `SELECT ep.*, u.email as seller_email, 
            (SELECT json_agg(json_build_object('id', ei.id, 'image_url', ei.image_url, 'media_type', ei.media_type)) FROM equipment_images ei WHERE ei.equipment_post_id = ep.id) as images,
            CASE WHEN promo.id IS NOT NULL THEN true ELSE false END as is_sponsored
            FROM equipment_posts ep
            JOIN users u ON ep.seller_id = u.id
            LEFT JOIN promotions promo ON promo.equipment_post_id = ep.id AND promo.type = 'sponsored' AND promo.status = 'Active' AND promo.expires_at > NOW()
            WHERE ep.status IN ('Active', 'Sold')`;
        const queryParams = [];
        let paramIndex = 1;

        if (category) { queryStr += ` AND ep.category = $${paramIndex++}`; queryParams.push(category); }
        if (condition) { queryStr += ` AND ep.condition = $${paramIndex++}`; queryParams.push(condition); }
        if (city) { queryStr += ` AND ep.city ILIKE $${paramIndex++}`; queryParams.push(`%${city}%`); }
        if (brand) { queryStr += ` AND ep.brand ILIKE $${paramIndex++}`; queryParams.push(`%${brand}%`); }
        if (minPrice) { queryStr += ` AND ep.price >= $${paramIndex++}`; queryParams.push(minPrice); }
        if (maxPrice) { queryStr += ` AND ep.price <= $${paramIndex++}`; queryParams.push(maxPrice); }

        let isSearchActive = false;
        if (search) {
            isSearchActive = true;
            await db.query(`INSERT INTO search_analytics (user_id, search_query) VALUES ($1, $2)`, [userId || null, search]);

            const tags = search.split(/\s+/).filter(t => t.length > 2);
            for (const tag of tags) {
                await db.query(
                    `INSERT INTO popular_tags (tag, search_count) VALUES ($1, 1)
                     ON CONFLICT (tag) DO UPDATE SET search_count = popular_tags.search_count + 1, last_searched_at = CURRENT_TIMESTAMP`,
                    [tag.toLowerCase()]
                );
            }

            const searchTerms = search.trim().replace(/[^a-zA-Z0-9\s]/g, '').split(/\s+/).filter(t => t.length > 0);
            queryStr += ` AND ep.search_vector @@ to_tsquery('english', $${paramIndex++})`;
            queryParams.push(searchTerms.map(term => `${term}:*`).join(' & '));
        }

        const sponsoredSort = `CASE WHEN promo.id IS NOT NULL THEN 0 ELSE 1 END ASC`;
        if (sort === 'oldest') queryStr += ` ORDER BY ${sponsoredSort}, ep.created_at ASC`;
        else if (sort === 'price low to high') queryStr += ` ORDER BY ${sponsoredSort}, ep.price ASC NULLS LAST`;
        else if (sort === 'price high to low') queryStr += ` ORDER BY ${sponsoredSort}, ep.price DESC NULLS LAST`;
        else {
            queryStr += isSearchActive
                ? ` ORDER BY ${sponsoredSort}, ts_rank(ep.search_vector, to_tsquery('english', $${paramIndex - 1})) DESC, ep.created_at DESC`
                : ` ORDER BY ${sponsoredSort}, ep.created_at DESC`;
        }

        const offset = (page - 1) * limit;
        const countQuery = `SELECT COUNT(*) FROM (${queryStr.split(' ORDER BY ')[0]}) as filtered_count`;
        const countResult = await db.query(countQuery, queryParams);
        const total = parseInt(countResult.rows[0].count, 10);

        queryStr += ` LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
        queryParams.push(limit, offset);
        const result = await db.query(queryStr, queryParams);

        return {
            data: result.rows,
            pagination: { total, page: parseInt(page, 10), pages: Math.ceil(total / limit) }
        };
    }

    /**
     * Get top searched tags
     */
    async getPopularTags() {
        const result = await db.query('SELECT tag, search_count FROM popular_tags ORDER BY search_count DESC LIMIT 20');
        return result.rows;
    }
}

module.exports = new EquipmentSearchService();
