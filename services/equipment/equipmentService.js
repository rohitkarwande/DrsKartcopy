const equipmentCreateService = require('./equipmentCreateService');
const equipmentUpdateService = require('./equipmentUpdateService');
const equipmentStatusService = require('./equipmentStatusService');
const equipmentSearchService = require('./equipmentSearchService');
const equipmentDetailService = require('./equipmentDetailService');
const equipmentMetricsService = require('./equipmentMetricsService');
const equipmentBulkService = require('./equipmentBulkService');
const { CATEGORIES, CONDITIONS, STATUSES } = require('./equipmentConstants');

/**
 * EquipmentService facade aggregating specialized domain services
 */
class EquipmentService {
    createEquipment(params) {
        return equipmentCreateService.createEquipment(params);
    }

    updateEquipment(params) {
        return equipmentUpdateService.updateEquipment(params);
    }

    updateInventory(params) {
        return equipmentUpdateService.updateInventory(params);
    }

    deleteEquipment(params) {
        return equipmentStatusService.deleteEquipment(params);
    }

    getSingleEquipment(params) {
        return equipmentDetailService.getSingleEquipment(params);
    }

    listEquipment(params, userId) {
        return equipmentSearchService.listEquipment(params, userId);
    }

    getMyEquipment(params) {
        return equipmentDetailService.getMyEquipment(params);
    }

    updateStatus(params) {
        return equipmentStatusService.updateStatus(params);
    }

    getSimilarListings(id) {
        return equipmentDetailService.getSimilarListings(id);
    }

    getPopularTags() {
        return equipmentSearchService.getPopularTags();
    }

    getEngagementMetrics(id) {
        return equipmentMetricsService.getEngagementMetrics(id);
    }

    bulkUploadEquipment(params) {
        return equipmentBulkService.bulkUploadEquipment(params);
    }

    trackEquipmentClick(params) {
        return equipmentMetricsService.trackEquipmentClick(params);
    }
}

module.exports = new EquipmentService();
module.exports.CATEGORIES = CATEGORIES;
module.exports.CONDITIONS = CONDITIONS;
module.exports.STATUSES = STATUSES;
