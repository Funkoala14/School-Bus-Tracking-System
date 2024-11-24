import Driver from '../models/Driver.js';

export const getDriverInfo = async (req, res) => {
    const { userId } = req.user;
    try {
        const driver = await Driver.findById(userId).populate({ path: 'assignedBus', populate: 'assignedRoutes' });
        return res.status(200).json({
            message: 'success',
            code: 200,
            data: driver,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const postUpdateDriverProfile = async (req, res) => {
    const { userId } = req.user;
    try {
        const updatedDriver = await Driver.findByIdAndUpdate(userId, req.body, { new: true, runValidators: true }).populate({
            path: 'assignedBus',
            populate: 'assignedRoutes',
        });
        return res.status(200).json({
            message: 'success',
            code: 200,
            data: updatedDriver,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};
