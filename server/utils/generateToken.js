import jwt from 'jsonwebtoken';
import config from '../config/config.js';

const { JWT_SECRET } = config;

const generateToken = (data) => {
    const token = jwt.sign({ ...data }, JWT_SECRET, {
        expiresIn: '24h',
    });
    return token;
};

export default generateToken;
