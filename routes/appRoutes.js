const express = require('express');

// Individual Route Modules
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const equipmentRoutes = require('./equipmentRoutes');
const inquiryRoutes = require('./inquiryRoutes');
const chatRoutes = require('./chatRoutes');
const sellerRoutes = require('./sellerRoutes');
const reportRoutes = require('./reportRoutes');
const dealRoutes = require('./dealRoutes');
const vendorRoutes = require('./vendorRoutes');
const serviceRequestRoutes = require('./serviceRequestRoutes');
const legalRoutes = require('./legalRoutes');
const bannerRoutes = require('./bannerRoutes');
const featureFlagRoutes = require('./featureFlagRoutes');
const promotionRoutes = require('./promotionRoutes');
const ticketRoutes = require('./ticketRoutes');
const contactRoutes = require('./contactRoutes');
const healthRoutes = require('./healthRoutes');

/**
 * AppRoutes
 * Centralized router management for all DKart application routes
 */
class AppRoutes {
    /**
     * Initializes and registers all application routes on the Express app
     * @param {import('express').Application} app
     */
    static init(app) {
        const apiRouter = express.Router();

        // 1. Authentication & User Management
        apiRouter.use('/auth', authRoutes);
        apiRouter.use('/user', userRoutes);

        // 2. Core Marketplace, Equipment & Communication
        apiRouter.use('/equipment', equipmentRoutes);
        apiRouter.use('/inquiries', inquiryRoutes);
        apiRouter.use('/chat', chatRoutes);
        apiRouter.use('/sellers', sellerRoutes);
        apiRouter.use('/vendor', vendorRoutes);
        apiRouter.use('/deals', dealRoutes);

        // 3. Marketing
        apiRouter.use('/banners', bannerRoutes);
        apiRouter.use('/promotions', promotionRoutes);

        // 4. Support, Services, Legal & Flags
        apiRouter.use('/reports', reportRoutes);
        apiRouter.use('/service-requests', serviceRequestRoutes);
        apiRouter.use('/legal', legalRoutes);
        apiRouter.use('/tickets', ticketRoutes);
        apiRouter.use('/contact', contactRoutes);
        apiRouter.use('/feature-flags', featureFlagRoutes);

        // Mount API router under /api
        app.use('/api', apiRouter);

        // 5. System Health Check
        app.use('/health', healthRoutes);
    }
}

const registerAppRoutes = (app) => AppRoutes.init(app);
registerAppRoutes.init = AppRoutes.init;
registerAppRoutes.AppRoutes = AppRoutes;

module.exports = registerAppRoutes;
