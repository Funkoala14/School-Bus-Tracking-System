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
        console.log(req.body);
        
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
        const addressError = addressValidation(req.body);
        if (addressError) {
            return res.status(400).json(addressError);
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Missing required info!', code: 400 });
    }
};

const ERROR_MESSAGES = {
    missingStopId: 'Missing stop id',
    missingStopName: 'Missing stop name',
    missingAddress: 'Missing address',
    missingStreet: 'Missing street info',
    missingCity: 'Missing city info',
    missingState: 'Missing state info',
    missingZipcode: 'Missing zipcode info',
    missingCoordinates: 'Missing coordinates info',
    missingRequiredInfo: 'Missing required info!',
};

const createErrorResponse = (message) => ({
    message,
    code: 400,
});

const stopValidation = (stop, type = 'new') => {
    const { stopId = '', _id = '', address, stopName } = stop;
    if (type !== 'new') {
        if ((!stopId && !_id) || (validator.isEmpty(stopId) && validator.isEmpty(_id)))
            return createErrorResponse(ERROR_MESSAGES.missingStopId);
    }
    if (!stopName || validator.isEmpty(stopName)) return createErrorResponse(ERROR_MESSAGES.missingStopName);
    if (!address) return createErrorResponse(ERROR_MESSAGES.missingAddress);

    const addressError = addressValidation(address);
    if (addressError) return addressError;

    return null; // No errors
};

const addressValidation = (address) => {
    console.log(address);
    
    const { street, city, state, zipcode, coordinates } = address;
    if (!street || validator.isEmpty(street)) return createErrorResponse(ERROR_MESSAGES.missingStreet);
    if (!city || validator.isEmpty(city)) return createErrorResponse(ERROR_MESSAGES.missingCity);
    if (!state || validator.isEmpty(state)) return createErrorResponse(ERROR_MESSAGES.missingState);
    if (!zipcode || validator.isEmpty(zipcode)) return createErrorResponse(ERROR_MESSAGES.missingZipcode);
    if (!coordinates || !coordinates.lat || !coordinates.lng || validator.isEmpty(coordinates.lat) || validator.isEmpty(coordinates.lng)) {
        return createErrorResponse(ERROR_MESSAGES.missingCoordinates);
    }
    return null;
};

export const addStopValidation = (req, res, next) => {
    try {
        const { routeId } = req.body;
        if(!routeId) return res.status(400).json({ message: 'Missing route id', code: 400 });
        
        const validationError = stopValidation(req.body, 'new');
        if (validationError) {
            return res.status(400).json(validationError);
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Missing required info!', code: 400 });
    }
};

export const stopsValidation = (req, res, next) => {
    const { list } = req.body;

    if (!list || !Array.isArray(list) || list.length === 0) {
        return res.status(400).json({ message: 'List of stops is required and must be an array', code: 400 });
    }

    try {
        for (const stop of list) {
            const validationError = stopValidation(stop, "update");
            if (validationError) {
                return res.status(400).json(validationError);
            }
        }
        next();
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: 'Missing required info!', code: 400 });
    }
};