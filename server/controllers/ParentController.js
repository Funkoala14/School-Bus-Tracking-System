import { addressValidation } from '../middleware/ValidationMiddleware.js';
import Address from '../models/Address.js';
import Parent from '../models/Parent.js';
import Student from '../models/Student.js';

export const postAddStudent = async (req, res) => {
    const { userId } = req.user;
    try {
        const { studentId, lastName } = req.body;
        const student = await Student.findOne({ studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found', code: 404 });
        }
        if (student.lastName !== lastName) {
            return res.status(400).json({ message: "Student's last name doesn't match." });
        }
        if (student.parent) {
            return res.status(400).json({ message: 'Student is already under other parent account.' });
        }

        const parent = await Parent.findById(userId).lean();

        if (parent?.children && parent.children.some((child) => child.equals(student._id))) {
            return res.status(400).json({ message: 'Student is already added to this parent.' });
        }

        const updatedParent = await Parent.findByIdAndUpdate(
            userId, // Find the parent by userId
            { $addToSet: { children: student._id } }, // Use $addToSet to avoid duplicates
            { new: true } // Return the updated document
        )
            .select('userName children')
            .populate('children');

        student.parent = updatedParent._id;

        await student.save();

        return res.status(200).json({
            message: 'Student added to parent successfully',
            data: updatedParent,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const postAdminAddStudentForParent = async (req, res) => {
    try {
        const { studentId, lastName, parentId } = req.body;
        const student = await Student.findOne({ studentId });
        if (!student) {
            return res.status(404).json({ message: 'Student not found', code: 404 });
        }
        if (student.lastName !== lastName) {
            return res.status(400).json({ message: "Student's last name doesn't match." });
        }
        if (student.parent) {
            return res.status(400).json({ message: 'Student is already under other parent account.' });
        }

        const parent = await Parent.findById(parentId);

        if (parent?.children && parent.children.some((child) => child.equals(student._id))) {
            return res.status(400).json({ message: 'Student is already added to this parent.' });
        }

        const updatedParent = await Parent.findByIdAndUpdate(
            parentId,
            { $addToSet: { children: student._id } }, // Use $addToSet to avoid duplicates
            { new: true } // Return the updated document
        )
            .select('userName children')
            .populate('children');

        student.parent = updatedParent._id;

        await student.save();

        return res.status(200).json({
            message: 'Student added to parent successfully',
            data: updatedParent,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};
export const postRemoveStudent = async (req, res) => {
    const { userId, role } = req.user;
    try {
        let parentId = '';
        if (role !== 'Parent') {
            if (!req.body?.parentId) {
                return res.status(404).json({ message: 'Missing parent id', code: 404 });
            }
            parentId = req.body.parentId;
        } else {
            parentId = userId;
        }
        const { studentId } = req.body;
        if (!studentId) return res.status(404).json({ message: 'Missing student id', code: 404 });
        const parent = await Parent.findByIdAndUpdate(
            parentId,
            { $pull: { children: studentId } },
            { new: true }
        ).select('-password -__v');
        if (!parent) return res.status(404).json({ message: 'Parent not found', code: 404 });
        const student = await Student.findByIdAndUpdate(studentId, { $unset: { parent: null } });
        if (!student) return res.status(404).json({ message: 'Student not found', code: 404 });
        return res.status(200).json({
            message: 'Student removed successfully',
            data: parent,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const postSetAddress = async (req, res) => {
    const { userId } = req.user;
    try {
        const address = await new Address({ ...req.body });
        const parent = await Parent.findByIdAndUpdate(
            userId,
            { $set: { address: address._id } },
            { new: true, lean: true }
        )
            .select('-__v -password')
            .populate('children')
            .exec();

        const { children } = parent;
        if (children.length > 0) {
            children.map(async (child) => {
                await Student.findByIdAndUpdate(child._id, { $set: { address: address._id } });
            });
        }
        await address.save();

        return res.status(200).json({
            message: 'success',
            data: { ...parent, address },
        });
    } catch (error) {}
};

export const getChildrenDetail = async (req, res) => {
    const { userId } = req.user;
    try {
        const parent = await Parent.findById(userId)
            .populate({
                path: 'children',
                select: '-parent -address -__v',
                populate: [
                    { path: 'school', select: '-__v' },
                    { path: 'stop', select: '-__v', populate: 'address' },
                    {
                        path: 'route',
                        select: '-school -stop -__v',
                        populate: [
                            { path: 'assignedBus', populate: {path:'assignedDriver', select: "-password"} },
                            { path: 'stops', populate: 'address' },
                            { path: 'schedule', populate: 'stopTimes.stop' },
                        ],
                    },
                ],
            })
            .lean()
            .exec();
        return res.status(200).json({
            message: 'success',
            data: parent?.children || [],
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const getParentProfile = async (req, res) => {
    const { userId } = req.user;
    try {
        const parent = await Parent.findById(userId).select('-children -password -__v').populate('address');
        return res.status(200).json({
            message: 'success',
            data: parent,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

// update parent's profile
export const postUpdateParentProfile = async (req, res) => {
    const { id } = req.body;
    try {
        const parent = await Parent.findById(id).populate('children');
        if (!parent) {
            return res.status(404).json({ message: 'Parent not found', code: 404 });
        }
        if (req.body.address) {
            console.log(req.body.address);
            const addressError = addressValidation(req.body.address);
            if (addressError) return addressError;
            if (parent.address) {
                await Address.findByIdAndUpdate(parent.address, req.body.address, { new: true, runValidators: true });
            } else {
                const newAddress = await Address.create(req.body.address);
                await Parent.findByIdAndUpdate(id, { $set: { address: newAddress._id } });
                if (Array.isArray(parent.children) && parent.children.length) {
                    parent.children.map(async (child) => await Student.findByIdAndUpdate(child._id, { $set: { address: newAddress._id } }));
                }
            }
        }
        const { address: _, ...parentUpdateData } = req.body;
        const updatedParent = await Parent.findByIdAndUpdate(id, parentUpdateData, { new: true, runValidators: true })
            .select('-password -__v')
            .populate('address children');
        return res.status(200).json({
            message: 'success',
            data: updatedParent,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};
