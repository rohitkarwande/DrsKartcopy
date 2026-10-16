const bannerService = require('../services/marketing/bannerService');

// 1. Get active banners for public landing page
const getActiveBanners = async (req, res) => {
    try {
        const banners = await bannerService.getActiveBanners();
        res.json({ banners });
    } catch (error) {
        console.error('Error fetching active banners:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Failed to fetch hero banners' });
    }
};

// 2. Track banner impression/view (Public)
const trackBannerView = async (req, res) => {
    try {
        const banner = await bannerService.trackBannerView(req.params.id);
        res.json({ success: true, views_count: banner.views_count });
    } catch (error) {
        console.error('Error tracking banner view:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Failed to track banner view' });
    }
};

// 3. Track banner click (Public)
const trackBannerClick = async (req, res) => {
    try {
        const banner = await bannerService.trackBannerClick(req.params.id);
        res.json({ success: true, clicks_count: banner.clicks_count });
    } catch (error) {
        console.error('Error tracking banner click:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Failed to track banner click' });
    }
};

module.exports = {
    getActiveBanners,
    trackBannerView,
    trackBannerClick
};
