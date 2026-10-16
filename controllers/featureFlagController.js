const featureFlagService = require('../services/platform/featureFlagService');

// 1. Get all feature flags (public)
const getFeatureFlags = async (req, res) => {
    try {
        const data = await featureFlagService.getFeatureFlags();
        res.json(data);
    } catch (error) {
        console.error('Error fetching feature flags:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Failed to fetch feature flags' });
    }
};

// 2. Get specific flag status
const getFeatureFlag = async (req, res) => {
    try {
        const flag = await featureFlagService.getFeatureFlag(req.params.key);
        res.json({ flag });
    } catch (error) {
        console.error('Error fetching feature flag:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Failed to fetch feature flag' });
    }
};

module.exports = {
    getFeatureFlags,
    getFeatureFlag
};
