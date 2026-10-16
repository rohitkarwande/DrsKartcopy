const { tokenService } = require('../services/auth/tokenService');

const authMiddleware = async (req, res, next) => {
    try {
        const user = await tokenService.authenticateFromHeader(req.headers.authorization);
        req.user = user;
        next();
    } catch (error) {
        return res.status(error.statusCode || 401).json({ error: error.message || 'Authentication failed' });
    }
};

module.exports = authMiddleware;

