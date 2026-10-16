const jwt = require('jsonwebtoken');
const { getUserById } = require('./authUtils');
require('dotenv').config();

class TokenService {
    /**
     * Signs a JWT token with standard payload
     */
    generateToken(payload, expiresIn = '24h') {
        return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
    }

    /**
     * Verifies a JWT token signature
     */
    verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }

    /**
     * Core authentication pipeline used by middleware
     */
    async authenticateFromHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const err = new Error('No token provided');
            err.statusCode = 401;
            throw err;
        }

        const token = authHeader.split(' ')[1];
        let decoded;
        try {
            decoded = this.verifyToken(token);
        } catch (error) {
            const err = new Error('Invalid or expired token');
            err.statusCode = 401;
            throw err;
        }

        const user = await getUserById(decoded.id);
        if (!user) {
            const err = new Error('User not found');
            err.statusCode = 401;
            throw err;
        }

        if (user.status === 'Suspended') {
            const err = new Error('Account suspended. Please contact support.');
            err.statusCode = 403;
            throw err;
        }

        return {
            ...decoded,
            ...user
        };
    }
}

module.exports = {
    TokenService,
    tokenService: new TokenService()
};
