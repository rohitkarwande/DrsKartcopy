/**
 * Archived Admin Marketing Functions (Banners and Promotions admin logic)
 * Moved to trash because admin panel was decommissioned.
 */

const db = require('../../../../config/db');
const fs = require('fs');
const path = require('path');

const unlinkOldImage = (imageUrl) => {
    if (imageUrl && imageUrl.startsWith('/uploads/')) {
        const fullPath = path.join(__dirname, '../../../../public', imageUrl);
        if (fs.existsSync(fullPath)) {
            try { fs.unlinkSync(fullPath); } catch (e) { /* ignore */ }
        }
    }
};

// --- 1. BANNER ADMIN FUNCTIONS ---
const getAllBanners = async () => {
    const result = await db.query(
        `SELECT id, title, subtitle, badge_text, image_url, link_url, button_text, display_order, is_active, 
                COALESCE(views_count, 0) as views_count, COALESCE(clicks_count, 0) as clicks_count,
                seller_id, equipment_post_id, promotion_id, created_at, updated_at 
         FROM hero_banners ORDER BY display_order ASC, id ASC`
    );
    return result.rows;
};

const createBanner = async ({ title, subtitle = '', badge_text = 'Featured Equipment', image_url, link_url = '/search', button_text = 'Explore Now', display_order = 0, is_active = true, seller_id = null, equipment_post_id = null }) => {
    if (!title || !image_url) throw Object.assign(new Error('Title and image are required'), { statusCode: 400 });
    const order = parseInt(display_order, 10);
    const active = is_active === undefined || is_active === 'true' || is_active === true;
    let resolvedEquipmentId = equipment_post_id, resolvedSellerId = seller_id;

    if (!resolvedEquipmentId && link_url) {
        const match = link_url.match(/\/equipment\/([a-f0-9\-]{36})/i);
        if (match && match[1]) {
            resolvedEquipmentId = match[1];
            const eqCheck = await db.query('SELECT seller_id FROM equipment_posts WHERE id = $1', [resolvedEquipmentId]);
            if (eqCheck.rows.length > 0) resolvedSellerId = eqCheck.rows[0].seller_id;
        }
    }

    const result = await db.query(
        `INSERT INTO hero_banners (title, subtitle, badge_text, image_url, link_url, button_text, display_order, is_active, seller_id, equipment_post_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
        [title.trim(), subtitle ? subtitle.trim() : '', badge_text ? badge_text.trim() : 'Featured Equipment',
         image_url.trim(), link_url ? link_url.trim() : '/search', button_text ? button_text.trim() : 'Explore Now',
         isNaN(order) ? 0 : order, active, resolvedSellerId, resolvedEquipmentId]
    );
    return result.rows[0];
};

const updateBanner = async (id, fields) => {
    const existing = await db.query('SELECT * FROM hero_banners WHERE id = $1', [id]);
    if (existing.rows.length === 0) throw Object.assign(new Error('Banner not found'), { statusCode: 404 });
    const oldBanner = existing.rows[0];
    let finalImageUrl = oldBanner.image_url;

    if (fields.file) {
        finalImageUrl = `/uploads/${fields.file.filename}`;
        unlinkOldImage(oldBanner.image_url);
    } else if (fields.image_url && fields.image_url.trim()) {
        finalImageUrl = fields.image_url.trim();
    }

    const newTitle = fields.title !== undefined ? fields.title.trim() : oldBanner.title;
    const newSubtitle = fields.subtitle !== undefined ? fields.subtitle.trim() : oldBanner.subtitle;
    const newBadge = fields.badge_text !== undefined ? fields.badge_text.trim() : oldBanner.badge_text;
    const newLink = fields.link_url !== undefined ? fields.link_url.trim() : oldBanner.link_url;
    const newButton = fields.button_text !== undefined ? fields.button_text.trim() : oldBanner.button_text;
    const newOrder = fields.display_order !== undefined ? parseInt(fields.display_order, 10) : oldBanner.display_order;
    const newActive = fields.is_active !== undefined ? (fields.is_active === 'true' || fields.is_active === true) : oldBanner.is_active;

    const result = await db.query(
        `UPDATE hero_banners SET title = $1, subtitle = $2, badge_text = $3, image_url = $4, link_url = $5, 
         button_text = $6, display_order = $7, is_active = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *`,
        [newTitle, newSubtitle, newBadge, finalImageUrl, newLink, newButton, isNaN(newOrder) ? 0 : newOrder, newActive, id]
    );
    return result.rows[0];
};

const deleteBanner = async (id) => {
    const existing = await db.query('SELECT * FROM hero_banners WHERE id = $1', [id]);
    if (existing.rows.length === 0) throw Object.assign(new Error('Banner not found'), { statusCode: 404 });
    unlinkOldImage(existing.rows[0].image_url);
    await db.query('DELETE FROM hero_banners WHERE id = $1', [id]);
    return true;
};

const reorderBanners = async (bannerIds) => {
    if (!Array.isArray(bannerIds)) throw Object.assign(new Error('bannerIds must be an array'), { statusCode: 400 });
    for (let i = 0; i < bannerIds.length; i++) {
        await db.query('UPDATE hero_banners SET display_order = $1 WHERE id = $2', [i + 1, bannerIds[i]]);
    }
    return true;
};

// --- 2. PROMOTIONS ADMIN FUNCTIONS ---
const adminListPromotions = async (status = null) => {
    let query = `
        SELECT p.*, pp.name as plan_name, pp.price as plan_price, pp.duration_days,
               ep.title as equipment_title, ep.category as equipment_category,
               u.email as seller_email, up.company_name as seller_company
        FROM promotions p
        JOIN promotion_plans pp ON p.plan_id = pp.id
        JOIN equipment_posts ep ON p.equipment_post_id = ep.id
        JOIN users u ON p.seller_id = u.id
        LEFT JOIN user_profiles up ON p.seller_id = up.user_id
    `;
    const params = [];
    if (status) {
        query += ` WHERE p.status = $1`;
        params.push(status);
    }
    query += ` ORDER BY p.created_at DESC`;
    const result = await db.query(query, params);
    return result.rows;
};

const adminUpdatePromotionStatus = async (id, { status, admin_note = null }) => {
    if (!['Active', 'Rejected'].includes(status)) throw Object.assign(new Error('Status must be "Active" or "Rejected"'), { statusCode: 400 });
    const promoCheck = await db.query(
        `SELECT p.*, pp.duration_days, pp.type as plan_type FROM promotions p JOIN promotion_plans pp ON p.plan_id = pp.id WHERE p.id = $1`,
        [id]
    );
    if (promoCheck.rows.length === 0) throw Object.assign(new Error('Promotion not found'), { statusCode: 404 });
    const promo = promoCheck.rows[0];

    let startsAt = null, expiresAt = null;
    if (status === 'Active') {
        startsAt = new Date();
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + promo.duration_days);
    }

    await db.query(
        `UPDATE promotions SET status = $1, starts_at = $2, expires_at = $3, admin_note = $4, updated_at = CURRENT_TIMESTAMP WHERE id = $5`,
        [status, startsAt, expiresAt, admin_note || null, id]
    );

    return { id, status };
};

module.exports = {
    getAllBanners,
    createBanner,
    updateBanner,
    deleteBanner,
    reorderBanners,
    adminListPromotions,
    adminUpdatePromotionStatus
};
