import Bus from '../models/Bus.js';
import Driver from '../models/Driver.js';
import School from '../models/School.js';
import Student from '../models/Student.js';
import User from '../models/User.js';

// Get different role list
export const getUserList = async (req, res) => {
    const { schoolCode } = req.user;
    console.log(schoolCode);

    try {
        const school = await School.findOne({ code: schoolCode }).lean().exec();
        console.log(school);

        const user = await User.find({ school: school._id }).select('-__v').lean().exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found', code: 404 });
        }

        return res.status(200).json({ message: 'success', code: 200, data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const getDriverList = async (req, res) => {
    const { schoolCode } = req.user;
    try {
        const school = await School.findOne({ code: schoolCode }).lean().exec();
        const user = await User.find({ role: 'Driver', school: school._id }).select('-__v').populate('assignedBus school').lean().exec();
        if (!user) {
            return res.status(404).json({ message: 'Driver not found', code: 404 });
        }

        return res.status(200).json({ message: 'success', code: 200, data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const getParentList = async (req, res) => {
    const { schoolCode } = req.user;

    try {
        const school = await School.findOne({ code: schoolCode }).lean().exec();
        const user = await User.find({ role: 'Parent', school: school._id }).select('-__v').populate('address children').lean().exec();
        if (!user) {
            return res.status(404).json({ message: 'Parent not found', code: 404 });
        }

        return res.status(200).json({ message: 'success', code: 200, data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const getStudentList = async (req, res) => {
    const { schoolCode } = req.user;

    try {
        const school = await School.findOne({ code: schoolCode }).lean().exec();
        const user = await User.find({ role: 'Student', school: school._id })
            .select('-__v')
            .populate('parent address route stop children')
            .lean()
            .exec();
        if (!user) {
            return res.status(404).json({ message: 'Student not found', code: 404 });
        }

        return res.status(200).json({ message: 'success', code: 200, data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const postSchoolAddStudent = async (req, res) => {
    const { schoolCode } = req.user;
    try {
        const { student, page = 1, limit = 10 } = req.body;

        if (!student.studentId) {
            return res.status(400).json({ message: 'Student must have a valid studentId.' });
        }

        // Check if school exists
        const school = await School.findOne({ code: schoolCode });
        if (!school) {
            return res.status(404).json({ message: 'School not found', code: 404 });
        }

        const existingStudent = await Student.findOne({ studentId: student.studentId }).lean().exec();
        if (existingStudent) {
            return res.status(400).json({ message: 'Student ID is already taken.' });
        }

        // Add the new student to the Student collection
        const newStudent = new Student({
            studentId: student.studentId.trim(), // Ensuring no spaces
            firstName: student.firstName,
            lastName: student.lastName,
            school: school._id,
        });
        await newStudent.save();

        // Update the School document with the new student ID
        school.students = [...(school.students || []), newStudent._id];
        await school.save();

        // Fetch paginated students associated with the school
        const totalStudents = await Student.countDocuments({ school: school._id });
        const paginatedStudents = await Student.find({ school: school._id })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean()
            .exec();

        // Return the response
        return res.status(200).json({
            message: 'Student added successfully',
            code: 200,
            data: {
                students: paginatedStudents,
                totalStudents,
                currentPage: page,
                totalPages: Math.ceil(totalStudents / limit),
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};
