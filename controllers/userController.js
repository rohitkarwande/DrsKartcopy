const { userProfileService } = require('../services/auth/userProfileService');
const { userKycService } = require('../services/auth/userKycService');
const { userDashboardService } = require('../services/auth/userDashboardService');
const { userContactService } = require('../services/auth/userContactService');

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
        res.status(500).json({ error: 'Error updating profile' });
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

// Locked: role upgrade is admin-only via /api/admin/kyc/:userId/approve
const becomeSeller = async (req, res) => {
    return res.status(403).json({
        error: 'Role upgrade requires admin approval. Please submit a KYC application and wait for review.',
    });
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

module.exports = {
    getProfile,
    updateProfile,
    submitKyc,
    getKycStatus,
    becomeSeller,
    getDashboard,
    addContact,
    verifyContact
};
