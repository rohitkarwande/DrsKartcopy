const { userProfileService } = require('../services/auth/userProfileService');
const { userKycService } = require('../services/auth/userKycService');
const { userDashboardService } = require('../services/auth/userDashboardService');
const { userContactService } = require('../services/auth/userContactService');
const db = require('../config/db');

const getProfile = async (req, res) => {
    try {
        const profile = await userProfileService.getProfile(req.user.id);
        res.json(profile);
    } catch (error) {
        console.error('Error in getProfile:', error);
        res.status(500).json({ error: 'Error fetching profile' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const updatedProfile = await userProfileService.updateProfile(req.user.id, req.body);
        res.json({ message: 'Profile updated', profile: updatedProfile });
    } catch (error) {
        console.error('Error in updateProfile:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Error updating profile' });
    }
};

const submitKyc = async (req, res) => {
    try {
        const kyc = await userKycService.submitKyc({
            userId: req.user.id,
            data: req.body,
            file: req.file,
            io: req.io,
            userContact: req.user.email || req.user.phone
        });
        res.json({ message: 'KYC submitted successfully. Pending admin review.', kyc });
    } catch (error) {
        console.error('Error in submitKyc:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Error submitting KYC' });
    }
};

const getKycStatus = async (req, res) => {
    try {
        const status = await userKycService.getKycStatus(req.user.id);
        res.json(status);
    } catch (error) {
        console.error('Error in getKycStatus:', error);
        res.status(500).json({ error: 'Error fetching KYC status' });
    }
};

// Role upgrade & KYC approval for seller status
const becomeSeller = async (req, res) => {
    try {
        const userId = req.user.id;
        // Update user role to seller
        await db.query("UPDATE users SET role = 'seller' WHERE id = $1", [userId]);
        // Update or insert kyc document status to Approved
        await db.query(
            `INSERT INTO kyc_documents (user_id, document_type, document_url, status, reviewed_at)
             VALUES ($1, 'GST_Certificate', 'Auto-Approved', 'Approved', CURRENT_TIMESTAMP)
             ON CONFLICT (user_id) DO UPDATE SET status = 'Approved', reviewed_at = CURRENT_TIMESTAMP`,
            [userId]
        );
        const updatedProfile = await userProfileService.getProfile(userId);
        return res.json({
            message: 'User successfully approved as seller',
            user: updatedProfile,
        });
    } catch (error) {
        console.error('Error in becomeSeller:', error);
        return res.status(500).json({ error: error.message || 'Failed to upgrade to seller' });
    }
};

const getDashboard = async (req, res) => {
    try {
        const dashboard = await userDashboardService.getDashboard(req.user.id);
        res.json(dashboard);
    } catch (error) {
        console.error('Error in getDashboard:', error);
        res.status(500).json({ error: 'Error fetching dashboard' });
    }
};

const addContact = async (req, res) => {
    try {
        const { identifier, type } = req.body;
        const result = await userContactService.addContact({
            userId: req.user.id,
            identifier,
            type
        });
        res.json(result);
    } catch (error) {
        console.error('Error in addContact:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Error sending OTP' });
    }
};

const verifyContact = async (req, res) => {
    try {
        const { identifier, type, otp } = req.body;
        const result = await userContactService.verifyContact({
            userId: req.user.id,
            identifier,
            type,
            otp
        });
        res.json(result);
    } catch (error) {
        console.error('Error in verifyContact:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Error verifying OTP' });
    }
};

const getWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query(
            `SELECT ep.*, 
             (SELECT json_agg(json_build_object('id', ei.id, 'image_url', ei.image_url, 'media_type', ei.media_type)) 
              FROM equipment_images ei WHERE ei.equipment_post_id = ep.id) as images
             FROM bookmarks b
             JOIN equipment_posts ep ON ep.id = b.equipment_post_id
             WHERE b.user_id = $1 AND ep.status != 'Archived'
             ORDER BY b.created_at DESC`,
            [userId]
        );
        res.json({ wishlist: result.rows, data: result.rows });
    } catch (error) {
        console.error('Error in getWishlist:', error);
        res.status(500).json({ error: 'Error fetching wishlist' });
    }
};

const getWishlistIds = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await db.query(
            `SELECT equipment_post_id FROM bookmarks WHERE user_id = $1`,
            [userId]
        );
        const ids = result.rows.map(r => r.equipment_post_id);
        res.json({ ids });
    } catch (error) {
        console.error('Error in getWishlistIds:', error);
        res.status(500).json({ error: 'Error fetching wishlist ids' });
    }
};

const toggleWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { equipmentId } = req.params;
        const existing = await db.query(
            `SELECT id FROM bookmarks WHERE user_id = $1 AND equipment_post_id = $2`,
            [userId, equipmentId]
        );
        if (existing.rows.length > 0) {
            await db.query(`DELETE FROM bookmarks WHERE id = $1`, [existing.rows[0].id]);
            return res.json({ message: 'Removed from wishlist', isWishlisted: false });
        } else {
            await db.query(
                `INSERT INTO bookmarks (user_id, equipment_post_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
                [userId, equipmentId]
            );
            return res.json({ message: 'Added to wishlist', isWishlisted: true });
        }
    } catch (error) {
        console.error('Error in toggleWishlist:', error);
        res.status(500).json({ error: 'Error updating wishlist' });
    }
};

const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user.id;
        const { equipmentId } = req.params;
        await db.query(
            `DELETE FROM bookmarks WHERE user_id = $1 AND equipment_post_id = $2`,
            [userId, equipmentId]
        );
        res.json({ message: 'Removed from wishlist', isWishlisted: false });
    } catch (error) {
        console.error('Error in removeFromWishlist:', error);
        res.status(500).json({ error: 'Error removing from wishlist' });
    }
};

module.exports = {
    getProfile,
    updateProfile,
    submitKyc,
    getKycStatus,
    becomeSeller,
    getDashboard,
    addContact,
    verifyContact,
    getWishlist,
    getWishlistIds,
    toggleWishlist,
    removeFromWishlist
};
