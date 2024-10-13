import validator from 'validator';

export const createUserValidation = (req, res, next) => {
    const { username, password, email, schoolCode, phone } = req.body;
    console.log('createUserValidation: ', req.body);
    if (
        !username ||
        !password ||
        !email ||
        !schoolCode ||
        !phone ||
        validator.isEmpty(username) ||
        validator.isEmpty(password) ||
        validator.isEmpty(email) ||
        validator.isEmpty(schoolCode) ||
        validator.isEmpty(phone)
    ) {
        return res.status(400).json({ message: 'Missing required fields', code: 400 });
    }

    if (!validator.isAlphanumeric(username)) {
        return res.status(400).json({ message: 'Username must be alphanumeric!' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!validator.isStrongPassword(password)) {
        return res.status(400).json({ message: 'Password is too weak!' });
    }
    next();
};

export const loginValidation = (req, res, next) => {
    const { username, password, email } = req.body;
    if (
        (!username && !email) ||
        !password ||
        (validator.isEmpty(username) && validator.isEmpty(email)) ||
        validator.isEmpty(password)
    ) {
        return res.status(400).json({ message: 'Missing required fields', code: 400 });
    }

    if (!validator.isAlphanumeric(username)) {
        return res.status(400).json({ message: 'Username must be alphanumeric!' });
    }
    next();
};
