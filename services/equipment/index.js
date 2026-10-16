const equipmentService = require('./equipmentService');
const equipmentCreateService = require('./equipmentCreateService');
const equipmentUpdateService = require('./equipmentUpdateService');
const equipmentStatusService = require('./equipmentStatusService');
const equipmentSearchService = require('./equipmentSearchService');
const equipmentDetailService = require('./equipmentDetailService');
const equipmentMetricsService = require('./equipmentMetricsService');
const equipmentBulkService = require('./equipmentBulkService');
const vendorService = require('./vendorService');
const { CATEGORIES, CONDITIONS, STATUSES } = require('./equipmentConstants');

module.exports = {
    equipmentService,
    equipmentCreateService,
    equipmentUpdateService,
    equipmentStatusService,
    equipmentSearchService,
    equipmentDetailService,
    equipmentMetricsService,
    equipmentBulkService,
    vendorService,
    CATEGORIES,
    CONDITIONS,
    STATUSES
};
