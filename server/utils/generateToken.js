import jwt from 'jsonwebtoken';

const { JWTSecret } = process.env;

const generateToken = (data) => {
    const token = jwt.sign({ ...data }, JWTSecret, {
        expiresIn: '24h',
    });
    return token;
};

export default generateToken;
