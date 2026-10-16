/**
 * DKart Services Barrel Export
 * Grouped by domain/category
 */

module.exports = {
  // --- AUTH ---
  tokenService: require('./auth/tokenService').tokenService,
  otpService: require('./auth/otpService').otpService,
  authSecurityService: require('./auth/authSecurityService').authSecurityService,
  emailSignupService: require('./auth/emailSignupService').emailSignupService,
  emailLoginService: require('./auth/emailLoginService').emailLoginService,
  phoneSignupService: require('./auth/phoneSignupService').phoneSignupService,
  phoneLoginService: require('./auth/phoneLoginService').phoneLoginService,
  googleAuthService: require('./auth/googleAuthService').googleAuthService,
  googleSignupService: require('./auth/googleSignupService').googleSignupService,
  googleLoginService: require('./auth/googleLoginService').googleLoginService,
  userProfileService: require('./auth/userProfileService').userProfileService,
  userKycService: require('./auth/userKycService').userKycService,
  userContactService: require('./auth/userContactService').userContactService,
  userDashboardService: require('./auth/userDashboardService').userDashboardService,

  // --- EQUIPMENT ---
  equipmentService: require('./equipment/equipmentService'),
  equipmentCreateService: require('./equipment/equipmentCreateService'),
  equipmentUpdateService: require('./equipment/equipmentUpdateService'),
  equipmentStatusService: require('./equipment/equipmentStatusService'),
  equipmentSearchService: require('./equipment/equipmentSearchService'),
  equipmentDetailService: require('./equipment/equipmentDetailService'),
  equipmentMetricsService: require('./equipment/equipmentMetricsService'),
  equipmentBulkService: require('./equipment/equipmentBulkService'),
  vendorService: require('./equipment/vendorService'),

  // --- COMMUNICATION ---
  inquiryService: require('./communication/inquiryService'),
  dealService: require('./communication/dealService'),
  chatService: require('./communication/chatService'),
  sellerService: require('./communication/sellerService'),

  // --- NOTIFICATIONS ---
  userNotificationService: require('./notifications/userNotificationService'),
  emailBaseService: require('./notifications/emailBaseService'),
  authNotificationService: require('./notifications/authNotificationService'),
  inquiryNotificationService: require('./notifications/inquiryNotificationService'),
  chatNotificationService: require('./notifications/chatNotificationService'),

  // --- MARKETING ---
  bannerService: require('./marketing/bannerService'),
  bannerQueryService: require('./marketing/bannerQueryService'),
  bannerAnalyticsService: require('./marketing/bannerAnalyticsService'),
  promotionService: require('./marketing/promotionService'),
  promotionPlanService: require('./marketing/promotionPlanService'),
  promotionRequestService: require('./marketing/promotionRequestService'),

  // --- PLATFORM / GOVERNANCE ---
  auditService: require('./platform/auditService'),
  featureFlagService: require('./platform/featureFlagService'),
  reportService: require('./platform/reportService'),

  // --- SUPPORT ---
  ticketService: require('./support/ticketService'),
  serviceRequestService: require('./support/serviceRequestService'),
  legalService: require('./support/legalService'),
  contactService: require('./support/contactService')
};
