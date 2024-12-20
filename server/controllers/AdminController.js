import validator from 'validator';
import Bus from '../models/Bus.js';
import Driver from '../models/Driver.js';
import School from '../models/School.js';
import Stop from '../models/Stop.js';
import Student from '../models/Student.js';
import User from '../models/User.js';
import Parent from '../models/Parent.js';
import Address from '../models/Address.js';

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
        const school = await School.findOne({ code: schoolCode })
            .populate({ path: 'drivers', select: '-password -school -__v' })
            .lean()
            .exec();

        return res.status(200).json({ message: 'success', code: 200, data: { list: school.drivers } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const getParentList = async (req, res) => {
    const { schoolCode } = req.user;

    try {
        const school = await School.findOne({ code: schoolCode })
            .populate([
                {
                    path: 'parents',
                    select: '-password -school -__v',
                    populate: [{ path: 'children' }, { path: 'address' }],
                },
            ])
            .lean()
            .exec();

        return res.status(200).json({ message: 'success', code: 200, data: { list: school.parents } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const getStudentList = async (req, res) => {
    const { schoolCode } = req.user;

    try {
        const school = await School.findOne({ code: schoolCode })
            .populate({
                path: 'students',
                select: '-school -__v',
                populate: [
                    { path: 'address', select: '-school -__v' },
                    { path: 'stop', select: '-__v' },
                    { path: 'route', select: '-school -__v' },
                    { path: 'parent', select: '-school -__v' },
                ],
            })
            .lean()
            .exec();

        return res.status(200).json({ message: 'success', code: 200, data: { list: school.students } });
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
        const paginatedStudents = await Student.find({ school: school._id }).populate([
            { path: 'address', select: '-school -__v' },
            { path: 'stop', select: '-__v' },
            { path: 'route', select: '-school -__v' },
            { path: 'parent', select: '-school -__v' },
        ]);
        // .skip((page - 1) * limit)
        // .limit(limit)
        // .lean()
        // .exec();

        // Return the response
        return res.status(200).json({
            message: 'Student added successfully',
            code: 200,
            data: paginatedStudents,
            // data: {
            //     students: paginatedStudents,
            //     totalStudents,
            //     currentPage: page,
            //     totalPages: Math.ceil(totalStudents / limit),
            // },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const postEditStudentInfo = async (req, res) => {};

export const postAssignStopToStudent = async (req, res) => {
    try {
        const { studentId, stopId } = req.body;
        if (!studentId || validator.isEmpty(studentId))
            return res.status(400).json({ message: 'Missing student id', code: 400 });
        if (!stopId || validator.isEmpty(stopId))
            return res.status(400).json({ message: 'Missing stop id', code: 400 });

        const stop = await Stop.findById(stopId);
        const student = await Student.findByIdAndUpdate(studentId, {
            $set: { stop: stop._id }, // Update stop
            $addToSet: { route: stop.route }, // Add route to the array (avoids duplicates)
        });

        return res.status(200).json({ message: 'Stops assigned successfully', code: 200 });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const postRemoveStudent = async (req, res) => {
    const { studentId } = req.body;
    if (!studentId) return res.status(404).json({ message: 'Missing student id', code: 404 });
    try {
        const student = await Student.findByIdAndDelete(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found', code: 404 });
        if (student.parent) {
            await Parent.findByIdAndUpdate(student.parent, { $pull: { children: studentId } });
        }
        return res.status(200).json({
            message: 'Student deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};
export const postRemoveParent = async (req, res) => {
    const { parentId } = req.body;
    if (!parentId) return res.status(404).json({ message: 'Missing parent id', code: 404 });
    try {
        const parent = await Parent.findByIdAndDelete(parentId);
        if (!parent) return res.status(404).json({ message: 'Parent not found, id might be wrong', code: 404 });
        if (parent.children && parent.children.length > 0) {
            if (parent.address) {
                await Address.findByIdAndDelete(parent.address);
            }
            await Promise.all(
                parent.children.map(
                    (childId) => Student.findByIdAndUpdate(childId, { $unset: { parent: null, address: null } }) // Unset the parent field
                )
            );
        }

        return res.status(200).json({
            message: 'Parent deleted successfully',
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const postUpdateStudentInfo = async (req, res) => {
    try {
        const { firstName, lastName, studentId, id, routes = [], stop = null } = req.body;
        const updatedStudent = await Student.findByIdAndUpdate(
            id,
            { studentId, firstName, lastName, route: routes, stop },
            { new: true }
        ).populate([
            { path: 'address', select: '-school -__v' },
            { path: 'stop', select: '-__v' },
            { path: 'route', select: '-school -__v' },
            { path: 'parent', select: '-school -__v' },
        ]);
        return res.status(200).json({ message: 'Student info updated successfully', code: 200, data: updatedStudent });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};
