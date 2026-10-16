const serviceRequestService = require('../services/support/serviceRequestService');

// 1. Create Service Request
const createServiceRequest = async (req, res) => {
    try {
        const request = await serviceRequestService.createRequest(req.user.id, req.body);
        res.status(201).json({ message: 'Service request created', request });
    } catch (error) {
        console.error('Error creating service request:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server Error creating service request' });
    }
};

// 2. User Tracking (Get my requests)
const getMyServiceRequests = async (req, res) => {
    try {
        const requests = await serviceRequestService.getMyRequests(req.user.id);
        res.json(requests);
    } catch (error) {
        console.error('Error fetching service requests:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server Error fetching service requests' });
    }
};

module.exports = {
    createServiceRequest,
    getMyServiceRequests
};
