import jwt from 'jsonwebtoken';
import validator from 'validator';
import config from '../config/config.js';

export const jwtValidation = (req, res, next) => {
    const token = req.cookies.token;

    if (!token || validator.isEmpty(token)) {
        return res.status(401).json({ message: 'No token provided', code: 401 });
    }

    try {
        // verify token
        const decodedToken = jwt.verify(token, config.JWTSecret);
        console.log(decodedToken);

        // get user info from token
        req.user = {
            userId: decodedToken.id,
            userName: decodedToken.userName,
            role: decodedToken.role,
            email: decodedToken.email,
            schoolCode: decodedToken.schoolCode,
            phone: decodedToken.phone,
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired', code: 401 });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token', code: 401 });
        } else {
            return res.status(500).json({ message: 'Server error', code: 500 });
        }
    }
};

export const checkPermission = (requireRole) => (req, res, next) => {
    if (!req.user.userId) {
        return res.status(401).json({ message: 'Unauthorized user', code: 401 });
    }

    const userRole = req.user.role;

    if (userRole !== requireRole) {
        return res.status(403).json({ message: 'No permission to access', code: 403 });
    }

    next();
};

export const getTokenInfo = (req, res, next) => {
    const { token } = req.cookies;

    if (token && !validator.isEmpty(token)) {
        try {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            req.user = {
                userId: decodedToken.id,
                userName: decodedToken.userName,
                role: decodedToken.role,
                email: decodedToken.email,
                schoolCode: decodedToken.schoolCode,
                phone: decodedToken.phone,
            };
        } catch (error) {
            // Token is invalid or expired, but do not block the request
        }
    }

    next();
};

