const bannerQueryService = require('./bannerQueryService');
const bannerAnalyticsService = require('./bannerAnalyticsService');

/**
 * BannerService Facade
 * Aggregates public homepage carousel queries and click/view analytics
 */
class BannerService {
    getActiveBanners() {
        return bannerQueryService.getActiveBanners();
    }

    trackBannerView(id) {
        return bannerAnalyticsService.trackBannerView(id);
    }

    trackBannerClick(id) {
        return bannerAnalyticsService.trackBannerClick(id);
    }
}

module.exports = new BannerService();
