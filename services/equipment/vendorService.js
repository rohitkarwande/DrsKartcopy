const db = require('../../config/db');

/**
 * VendorService
 * Manages vendor-specific dashboard metrics and multi-branch locations
 */
class VendorService {
    /**
     * Get vendor dashboard overview metrics
     */
    async getDashboardMetrics(vendorId) {
        const totalListings = await db.query("SELECT COUNT(*) FROM equipment_posts WHERE seller_id = $1", [vendorId]);
        const activeListings = await db.query("SELECT COUNT(*) FROM equipment_posts WHERE seller_id = $1 AND status = 'Active'", [vendorId]);
        const closedDeals = await db.query("SELECT COUNT(*) FROM inquiries WHERE seller_id = $1 AND status = 'Deal Closed'", [vendorId]);
        const inquiryCount = await db.query("SELECT COUNT(*) FROM inquiries WHERE seller_id = $1", [vendorId]);

        return {
            total_listings: parseInt(totalListings.rows[0].count, 10),
            active_listings: parseInt(activeListings.rows[0].count, 10),
            closed_deals: parseInt(closedDeals.rows[0].count, 10),
            inquiry_count: parseInt(inquiryCount.rows[0].count, 10)
        };
    }

    /**
     * Get all branch locations for a vendor
     */
    async getLocations(vendorId) {
        const result = await db.query("SELECT * FROM vendor_locations WHERE vendor_id = $1 ORDER BY is_primary DESC, id ASC", [vendorId]);
        return result.rows;
    }

    /**
     * Add a new branch location for a vendor
     */
    async addLocation({ vendorId, data }) {
        const { branch_name, address, city, state, country, is_primary } = data;
        if (!branch_name) {
            const err = new Error('Branch name is required');
            err.statusCode = 400;
            throw err;
        }

        const result = await db.query(
            "INSERT INTO vendor_locations (vendor_id, branch_name, address, city, state, country, is_primary) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
            [vendorId, branch_name, address, city, state, country, is_primary || false]
        );
        return result.rows[0];
    }

    /**
     * Update an existing branch location
     */
    async updateLocation({ id, vendorId, data }) {
        const { branch_name, address, city, state, country, is_primary } = data;
        const result = await db.query(
            "UPDATE vendor_locations SET branch_name = COALESCE($1, branch_name), address = COALESCE($2, address), city = COALESCE($3, city), state = COALESCE($4, state), country = COALESCE($5, country), is_primary = COALESCE($6, is_primary) WHERE id = $7 AND vendor_id = $8 RETURNING *",
            [branch_name, address, city, state, country, is_primary, id, vendorId]
        );
        if (result.rows.length === 0) {
            const err = new Error('Location not found or unauthorized');
            err.statusCode = 404;
            throw err;
        }
        return result.rows[0];
    }

    /**
     * Delete a branch location
     */
    async deleteLocation({ id, vendorId }) {
        const result = await db.query("DELETE FROM vendor_locations WHERE id = $1 AND vendor_id = $2 RETURNING *", [id, vendorId]);
        if (result.rows.length === 0) {
            const err = new Error('Location not found or unauthorized');
            err.statusCode = 404;
            throw err;
        }
        return { message: 'Location deleted' };
    }
}

module.exports = new VendorService();
