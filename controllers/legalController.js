const legalService = require('../services/support/legalService');

// 1. Submit Legal Query
const submitLegalQuery = async (req, res) => {
    try {
        const query = await legalService.submitQuery(req.user.id, req.body);
        res.status(201).json({ message: 'Legal query submitted', query });
    } catch (error) {
        console.error('Error submitting legal query:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server Error submitting legal query' });
    }
};

// 2. User Tracking (Get my queries)
const getMyLegalQueries = async (req, res) => {
    try {
        const queries = await legalService.getMyQueries(req.user.id);
        res.json(queries);
    } catch (error) {
        console.error('Error fetching legal queries:', error);
        res.status(error.statusCode || 500).json({ error: error.message || 'Server Error fetching legal queries' });
    }
};

module.exports = {
    submitLegalQuery,
    getMyLegalQueries
};
