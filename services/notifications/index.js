const emailBaseService = require('./emailBaseService');
const authNotificationService = require('./authNotificationService');
const inquiryNotificationService = require('./inquiryNotificationService');
const chatNotificationService = require('./chatNotificationService');
const userNotificationService = require('./userNotificationService');

module.exports = {
    // Dedicated Domain Notification Services
    emailBaseService,
    authNotificationService,
    inquiryNotificationService,
    chatNotificationService,
    userNotificationService,

    // Core utilities & helper methods
    ...emailBaseService,
    ...authNotificationService,
    ...inquiryNotificationService,
    ...chatNotificationService,
    ...userNotificationService
};
