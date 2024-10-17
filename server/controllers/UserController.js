import School from '../models/School.js';
import User from '../models/User.js';

// Get different role list
export const getUserList = async (req, res) => {
    const { schoolCode } = req.user;
    console.log(schoolCode);
    
    try {
        const school = await School.findOne({ code: schoolCode }).exec();
        console.log(school);
        
        const user = await User.find({ school: school._id }).select('-__v').lean().exec();
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
export const getStudentList = async (req, res) => {
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
