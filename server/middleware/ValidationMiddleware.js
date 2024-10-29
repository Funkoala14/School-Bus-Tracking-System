import validator from 'validator';

export const createUserValidation = (req, res, next) => {
    const { userName, password, email, schoolCode, phone, firstName, lastName, role } = req.body;
    console.log('createUserValidation: ', req.body);
    if (
        !userName ||
        !password ||
        !email ||
        !schoolCode ||
        !phone ||
        !firstName ||
        !lastName ||
        !role ||
        validator.isEmpty(userName) ||
        validator.isEmpty(password) ||
        validator.isEmpty(email) ||
        validator.isEmpty(schoolCode) ||
        validator.isEmpty(phone) ||
        validator.isEmpty(firstName) ||
        validator.isEmpty(lastName) ||
        validator.isEmpty(role)
    ) {
        return res.status(400).json({ message: 'Missing required fields', code: 400 });
    }

    if (!validator.isAlphanumeric(userName)) {
        return res.status(400).json({ message: 'Username must be alphanumeric!' });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    // if (!validator.isStrongPassword(password)) {
    //     return res.status(400).json({ message: 'Password is too weak!' });
    // }
    next();
};

export const loginValidation = (req, res, next) => {
    const { userName, password, email } = req.body;
    if ((!userName && !email) || !password || (validator.isEmpty(userName) && validator.isEmpty(email)) || validator.isEmpty(password)) {
        return res.status(400).json({ message: 'Missing required fields', code: 400 });
    }

    next();
};

export const addBusValidation = (req, res, next) => {
    try {
        console.log(req.body);
        const { plate, capacity } = req.body;
        if (!plate || validator.isEmpty(plate)) return res.status(400).json({ message: 'Missing plate', code: 400 });
        if (!capacity) return res.status(400).json({ message: 'Missing capacity', code: 400 });
        
        next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Missing required info!', code: 400 });
    }
};

export const adminAddStudentValidation = (req, res, next) => {
    try {
        const { student } = req.body;
        if (!student) return res.status(400).json({ message: 'Missing student', code: 400 });
        const { studentId, firstName, lastName } = student;
        if (!studentId || validator.isEmpty(studentId)) return res.status(400).json({ message: 'Missing studentId', code: 400 });
        if (!firstName || validator.isEmpty(firstName)) return res.status(400).json({ message: 'Missing firstName', code: 400 });
        if (!lastName || validator.isEmpty(lastName)) return res.status(400).json({ message: 'Missing lastName', code: 400 });
        next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Missing required info!', code: 400 });
    }
};

export const parentAddStudent = (req, res, next) => {
    try {
        const { studentId, lastName } = req.body;
        if (!studentId || validator.isEmpty(studentId)) return res.status(400).json({ message: 'Missing studentId', code: 400 });
        if (!lastName || validator.isEmpty(lastName)) return res.status(400).json({ message: 'Missing lastName', code: 400 });
        next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Missing required info!', code: 400 });
    }
};
