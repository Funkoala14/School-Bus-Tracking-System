import Parent from '../models/Parent.js';
import Student from '../models/Student.js';

export const postAddStudent = async (req, res) => {
    const { userId } = req.user;
    try {
        const { studentId, lastName } = req.body;
        const student = await Student.findOne({ studentId }).lean().exec();
        if (!student) {
            return res.status(404).json({ message: 'Student not found', code: 404 });
        }
        if (student.lastName !== lastName) {
            return res.status(400).json({ message: "Student's last name doesn't match." });
        }
        const parent = await Parent.findById(userId).lean().exec();
        
        if (parent.children.some(child => child.equals(student._id))) {
            return res.status(400).json({ message: 'Student is already added to this parent.' });
        }

        const updatedParent = await Parent.findOneAndUpdate(
            { _id: userId }, // Find the parent by userId
            { $addToSet: { children: student._id } }, // Use $addToSet to avoid duplicates
            { new: true } // Return the updated document
        )
            .select('userName children').populate('children')
            .lean()
            .exec();

        return res.status(200).json({
            message: 'Student added to parent successfully',
            data: updatedParent,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};
