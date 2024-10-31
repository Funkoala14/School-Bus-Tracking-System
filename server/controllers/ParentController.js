import Address from '../models/Address.js';
import Parent from '../models/Parent.js';
import Student from '../models/Student.js';

export const postAddStudent = async (req, res) => {
    const { userId } = req.user;
    try {
        const { studentId, lastName } = req.body;
        const student = await Student.findOne({ studentId }).exec();
        if (!student) {
            return res.status(404).json({ message: 'Student not found', code: 404 });
        }
        if (student.lastName !== lastName) {
            return res.status(400).json({ message: "Student's last name doesn't match." });
        }
        const parent = await Parent.findById(userId).lean().exec();

        if (parent.children.some((child) => child.equals(student._id))) {
            return res.status(400).json({ message: 'Student is already added to this parent.' });
        }

        const updatedParent = await Parent.findOneAndUpdate(
            { _id: userId }, // Find the parent by userId
            { $addToSet: { children: student._id } }, // Use $addToSet to avoid duplicates
            { new: true } // Return the updated document
        )
            .select('userName children')
            .populate('children')
            .lean()
            .exec();

        student.parent = parent._id;
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
    const { userId } = req.user;
    try {
        const { studentId } = req.body;
        if (!studentId) return res.status(404).json({ message: 'Missing student id', code: 404 });
        const parent = await Parent.findByIdAndUpdate(userId, { $pull: { children: studentId } }, { new: true });
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
        const parent = await Parent.findByIdAndUpdate(userId, { $set: { address: address._id } }, { new: true, lean: true })
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
            data: {...parent, address},
        });
    } catch (error) {}
};

export const getRouteDetail = async (req, res) => {
    const { userId } = req.user;
    try {
        const parent = await Parent.findById(userId).populate('children').lean().exec();
        return res.status(200).json({
            message: 'success',
            data: parent?.children || [],
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};
