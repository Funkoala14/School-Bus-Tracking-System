import School from '../models/School.js';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import * as argon2 from 'argon2';

export const getVerifyToken = async (req, res) => {
    const { role, userid } = req.user || {};
    if (userid) {
        const user = await User.findById(userid).populate('favorites').lean().exec();
        res.status(200).json({ message: 'success', data: { ...req.user, favorites: user.favorites }, code: 200 });
    }
};

export const postCreateUser = async (req, res) => {
    const { userName, password, email, schoolCode, phone } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { userName }] })
            .lean()
            .exec();
        const school = await School.findOne({ code: schoolCode }).lean().exec();

        if (existingUser) {
            return res.status(409).json({ message: 'userName or Email already exists', code: 409 });
        }

        const hashedPassword = await argon2.hash(password);
        const user = await User.create({
            userName,
            email,
            password: hashedPassword,
            school: school._id,
            phone,
        });

        const token = generateToken({
            id: user._id,
            userName,
            email,
            role,
            schoolCode,
            phone,
        });
        // set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000, // 1h
            sameSite: 'strict',
        });

        res.status(201).json({
            message: 'User created successfully',
            code: 201,
        });
    } catch (error) {
        res.status(500).json({ message: error.message, code: 500 });
    }
};

export const postUserLogin = async (req, res) => {
    const { userName, password, email } = req.body;
    try {
        let filter = {};
        userName && (filter.userName = userName);
        email && (filter.email = userName);
        const user = await User.findOne(filter).select('-__v').lean().exec();
        if (!user) {
            return res.status(401).json({ message: 'User not exist', code: 401 });
        }
        const ifPasswordCorrect = await argon2.verify(user.password, password);

        if (!ifPasswordCorrect) {
            return res.status(401).json({ message: 'Password not correct', code: 401 });
        }
        // generate JWT token
        const token = generateToken({
            id: user._id,
            userName,
            email,
            role,
            schoolCode,
            phone,
        });
        // set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 3600000,
            sameSite: 'strict',
        });
        res.status(200).json({
            message: 'success',
            code: 200,
            data: { userId: user._id, email, userName },
        });
    } catch (error) {
        res.status(500).json({ message: error.message, code: 500 });
    }
};

export const getUserLogout = (req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully', code: 200 });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message, code: 500 });
    }
};

// Get different role list
export const getUserList = async (req, res) => {
    const { schoolCode } = req.user;
    try {
        const school = await School.findOne({ code: schoolCode }).exec();
        const user = await User.find({ role: 'User', school: school._id }).select('-__v').lean().exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found', code: 404 });
        }

        res.status(200).json({ message: 'success', code: 200, data: user });
    } catch (error) {
        res.status(500).json({ message: error.message, code: 500 });
    }
};
export const getDriverList = async (req, res) => {
    const { schoolCode } = req.user;
    try {
        const school = await School.findOne({ code: schoolCode }).exec();
        const user = await User.find({ role: 'Driver', school: school._id })
            .select('-__v')
            .populate('assignedBus school')
            .lean()
            .exec();
        if (!user) {
            return res.status(404).json({ message: 'Driver not found', code: 404 });
        }

        res.status(200).json({ message: 'success', code: 200, data: user });
    } catch (error) {
        res.status(500).json({ message: error.message, code: 500 });
    }
};
export const getParentList = async (req, res) => {
    const { schoolCode } = req.user;

    try {
        const school = await School.findOne({ code: schoolCode }).exec();
        const user = await User.find({ role: 'Parent', school: school._id })
            .select('-__v')
            .populate('address children')
            .lean()
            .exec();
        if (!user) {
            return res.status(404).json({ message: 'Parent not found', code: 404 });
        }

        res.status(200).json({ message: 'success', code: 200, data: user });
    } catch (error) {
        res.status(500).json({ message: error.message, code: 500 });
    }
};
export const getStudentList = async (_req, res) => {
    const { schoolCode } = req.user;

    try {
        const school = await School.findOne({ code: schoolCode }).exec();
        const user = await User.find({ role: 'Student', school: school._id })
            .select('-__v')
            .populate('parent address route stop children')
            .lean()
            .exec();
        if (!user) {
            return res.status(404).json({ message: 'Student not found', code: 404 });
        }

        res.status(200).json({ message: 'success', code: 200, data: user });
    } catch (error) {
        res.status(500).json({ message: error.message, code: 500 });
    }
};
