import User from '../models/User';

export const getVerifyToken = async (req, res) => {
    const { role, userId } = req.user || {};
    if (userId) {
        const user = await User.findById(userId).populate('school').lean().exec();
        res.status(200).json({ message: 'success', data: { ...req.user, school: user.school }, code: 200 });
    }
};
import generateToken from '../utils/generateToken.js';
import * as argon2 from 'argon2';

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
