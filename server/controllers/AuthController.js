import Driver from '../models/Driver.js';
import Parent from '../models/Parent.js';
import School from '../models/School.js';
import User from '../models/User.js';

export const getVerifyToken = async (req, res) => {
    const { role, userId } = req.user || {};
    if (userId) {
        const user = await User.findById(userId).populate('school').lean().exec();
        return res.status(200).json({ message: 'success', data: { ...req.user, school: user.school }, code: 200 });
    }
};
import generateToken from '../utils/generateToken.js';
import * as argon2 from 'argon2';

export const postCreateUser = async (req, res) => {
    const { userName, password, email, schoolCode, phone, firstName, lastName, role } = req.body;

    try {
        const existingUser = await User.findOne({ $or: [{ email }, { userName }] })
            .lean()
            .exec();
        const school = await School.findOne({ code: schoolCode }).lean().exec();

        if (existingUser) {
            return res.status(409).json({ message: 'userName or Email already exists', code: 409 });
        }

        if (!school) {
            return res.status(404).json({ message: 'school not found', code: 404 });
        }

        const hashedPassword = await argon2.hash(password);
        let user;
        switch (role) {
            case 'Parent':
                user = await Parent.create({
                    userName,
                    email,
                    password: hashedPassword,
                    school: school._id,
                    phone,
                    firstName,
                    lastName,
                    role,
                });
                await school.updateOne({ $push: { parents: user._id } });
                break;
            case 'Driver':
                user = await Driver.create({
                    userName,
                    email,
                    password: hashedPassword,
                    school: school._id,
                    phone,
                    firstName,
                    lastName,
                    role,
                });
                await school.updateOne({ $push: { drivers: user._id } });
                break;
        }

        user = user.toObject();
        delete user.password;
        delete user.__v;

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

        return res.status(201).json({
            message: 'User created successfully',
            code: 201,
            data: { ...user, userId: user._id },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const postUserLogin = async (req, res) => {
    const { userName, password, email } = req.body;
    try {
        let filter = {};
        userName && (filter.userName = userName);
        email && (filter.email = userName);
        const user = await User.findOne(filter).populate('school').select('-__v').lean().exec();
        if (!user) {
            return res.status(401).json({ message: 'User not exist', code: 401 });
        }
        const ifPasswordCorrect = await argon2.verify(user.password, password);

        if (!ifPasswordCorrect) {
            return res.status(401).json({ message: 'Password not correct', code: 401 });
        }
        const { role, school, phone } = user;

        // generate JWT token
        const token = generateToken({
            id: user._id,
            userName,
            email,
            role,
            schoolCode: school.code,
            phone,
        });
        console.log(token);

        // set token in cookie
        res.cookie('token', token, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            sameSite: 'None',
        });
        return res.status(200).json({
            message: 'success',
            code: 200,
            data: { userId: user._id, email, userName, role },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const getUserLogout = (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logged out successfully', code: 200 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};
