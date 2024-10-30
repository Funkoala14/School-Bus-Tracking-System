import User from "../models/User.js";


export const getUserProfile = async (req, res) => {
    const { userId, role } = req.user;
    try {
        let populateStr = '';
        if (role === 'Driver') {
            populateStr = [
                { path: 'school', select: '_id code name address contactInfo' },
                { path: 'assignedBus', select: '-__v -school -assignedRoutes' },
            ];
        } else {
            populateStr = 'school address children';
            populateStr = [
                { path: 'school', select: '_id code name address contactInfo' },
                { path: 'address', select: '-__v' },
                { path: 'children', select: '-__v -school' },
            ];
        }
        const user = await User.findById(userId).select('-password -__v').populate(populateStr).lean().exec();

        if (!user) {
            return res.status(404).json({ message: 'Driver not found', code: 404 });
        }
        return res.status(200).json({ message: 'success', code: 200, data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};
