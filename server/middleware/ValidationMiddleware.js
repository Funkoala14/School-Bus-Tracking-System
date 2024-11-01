import e from 'express';
import validator from 'validator';

export const createUserValidation = (req, res, next) => {
    try {
        const { userName, password, email, schoolCode, phone, firstName, lastName, role } = req.body;
        if (!userName || validator.isEmpty(userName)) {
            return res.status(400).json({ message: 'Missing or empty field: userName', code: 400 });
        }
        if (!password || validator.isEmpty(password)) {
            return res.status(400).json({ message: 'Missing or empty field: password', code: 400 });
        }
        if (!email || validator.isEmpty(email)) {
            return res.status(400).json({ message: 'Missing or empty field: email', code: 400 });
        }
        if (!schoolCode || validator.isEmpty(schoolCode)) {
            return res.status(400).json({ message: 'Missing or empty field: schoolCode', code: 400 });
        }
        if (!phone || validator.isEmpty(phone)) {
            return res.status(400).json({ message: 'Missing or empty field: phone', code: 400 });
        }
        if (!firstName || validator.isEmpty(firstName)) {
            return res.status(400).json({ message: 'Missing or empty field: firstName', code: 400 });
        }
        if (!lastName || validator.isEmpty(lastName)) {
            return res.status(400).json({ message: 'Missing or empty field: lastName', code: 400 });
        }
        if (!role || validator.isEmpty(role)) {
            return res.status(400).json({ message: 'Missing or empty field: role', code: 400 });
        }

        if (!validator.matches(userName, /^[a-zA-Z0-9_.-]+$/)) {
            return res
                .status(400)
                .json({ message: 'Username can only contain letters, numbers, underscores (_), dots (.), and hyphens (-).' });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // if (!validator.isStrongPassword(password)) {
        //     return res.status(400).json({ message: 'Password is too weak!' });
        // }
        next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Missing required info!', code: 400 });
    }
};

export const loginValidation = (req, res, next) => {
    try {
        const { userName, password, email } = req.body;
        if (
            (!userName && !email) ||
            !password ||
            (validator.isEmpty(userName) && validator.isEmpty(email)) ||
            validator.isEmpty(password)
        ) {
            return res.status(400).json({ message: 'Missing required fields', code: 400 });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Missing required info!', code: 400 });
    }
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

export const parentAddStudentValidation = (req, res, next) => {
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

export const assignDriverValidation = (req, res, next) => {
    try {
        const { busId, driverId } = req.body;
        if (!busId || validator.isEmpty(busId)) return res.status(400).json({ message: 'Missing bus id', code: 400 });
        if (!driverId || validator.isEmpty(driverId)) return res.status(400).json({ message: 'Missing driver id', code: 400 });
        next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Missing required info!', code: 400 });
    }
};

export const addRouteValidation = (req, res, next) => {
    try {
        const { name, direction } = req.body;
        if (!name) return res.status(400).json({ message: 'Missing route name', code: 400 });
        if (!direction) return res.status(400).json({ message: 'Missing route direction', code: 400 });
        next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Missing required info!', code: 400 });
    }
};

export const assignBusValidation = (req, res, next) => {
    try {
        const { routeId, busId } = req.body;
        if (!routeId || validator.isEmpty(routeId)) return res.status(400).json({ message: 'Missing route id', code: 400 });
        if (!busId || validator.isEmpty(busId)) return res.status(400).json({ message: 'Missing bus id', code: 400 });
        next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Missing required info!', code: 400 });
    }
};

export const setAddressValidation = (req, res, next) => {
    try {
        const { street, city, state, zipcode, coordinates } = req.body;
        if (!street || validator.isEmpty(street)) return res.status(400).json({ message: 'Missing street info', code: 400 });
        if (!city || validator.isEmpty(city)) return res.status(400).json({ message: 'Missing city info', code: 400 });
        if (!state || validator.isEmpty(state)) return res.status(400).json({ message: 'Missing state info', code: 400 });
        if (!zipcode || validator.isEmpty(zipcode)) return res.status(400).json({ message: 'Missing zipcode info', code: 400 });
        if (!coordinates || !coordinates.lat || !coordinates.long || validator.isEmpty(coordinates.lat) || validator.isEmpty(coordinates.long))
            return res.status(400).json({ message: 'Missing coordinates info', code: 400 });
        next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Missing required info!', code: 400 });
    }
};

export const addStopValidation = (req, res, next) => {
    try {
        const { routeId, address, routeName } = req.body;
        if (!routeId || validator.isEmpty(routeId)) return res.status(400).json({ message: 'Missing route id', code: 400 });
        if (!routeName || validator.isEmpty(routeName)) return res.status(400).json({ message: 'Missing route name', code: 400 });
        if (!address) return res.status(400).json({ message: 'Missing address', code: 400 });
        const { street, city, state, zipcode, coordinates } = address;
        if (!street || validator.isEmpty(street)) return res.status(400).json({ message: 'Missing street info', code: 400 });
        if (!city || validator.isEmpty(city)) return res.status(400).json({ message: 'Missing city info', code: 400 });
        if (!state || validator.isEmpty(state)) return res.status(400).json({ message: 'Missing state info', code: 400 });
        if (!zipcode || validator.isEmpty(zipcode)) return res.status(400).json({ message: 'Missing zipcode info', code: 400 });
        if (
            !coordinates ||
            !coordinates.lat ||
            !coordinates.long ||
            validator.isEmpty(coordinates.lat) ||
            validator.isEmpty(coordinates.long)
        )
            return res.status(400).json({ message: 'Missing coordinates info', code: 400 });
        next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Missing required info!', code: 400 });
    }
};