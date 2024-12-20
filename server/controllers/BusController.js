import Bus from "../models/Bus.js";
import Driver from "../models/Driver.js";
import Route from '../models/Route.js';
import School from '../models/School.js';

export const postAddBus = async (req, res) => {
    const { schoolCode } = req.user;
    try {
        const { plate, capacity } = req.body;
        console.log(req.body);
        const existingBus = await Bus.findOne({ plate });
        if (existingBus) {
            return res.status(400).json({ message: 'Bus plate is already exist.' });
        }

        const newBus = await new Bus({ plate, capacity });
        const school = await School.findOneAndUpdate(
            { code: schoolCode },
            { $addToSet: { buses: newBus._id } }, // Use $addToSet to avoid duplicates
            { new: true, lean: true } // Return the updated document
        );
        newBus.school = school._id;
        if (req.body?.assignedRoutes) {
            newBus.assignedRoutes = req.body.assignedRoutes;
            req.body.assignedRoutes.map(async (route) => await Route.findByIdAndUpdate(route, { $set: { assignedBus: newBus._id } }));
        }

        await newBus.save();

        const buses = await Bus.find({ school: school._id })
            .select('-__v')
            .populate([
                { path: 'assignedRoutes', select: '-__v -assignedBus' },
                { path: 'assignedDriver', select: '-password -__v -school -assignedBus -userName' },
            ])
            .lean()
            .exec();
        const paginatedBuses = buses.slice(0, 10);

        return res.status(200).json({
            message: 'Bus added successfully',
            code: 200,
            data: buses,
            // data: {
            //     list: paginatedBuses,
            //     totalBuses: buses.length,
            //     currentPage: 1,
            //     totalPages: Math.ceil(buses.length / 10),
            // },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const deleteBus = async (req, res) => {
    const { schoolCode } = req.user;
    try {
        const { busId } = req.query;
        
        if (!busId) return res.status(400).json({ message: 'Missing bus id', code: 400 });
        const deletedBus = await Bus.findByIdAndDelete(busId).lean().exec();
        if (!deletedBus) {
            return res.status(404).json({ message: 'Bus not found', code: 404 });
        }

        const updatedSchool = await School.findOneAndUpdate({ code: schoolCode }, { $pull: { buses: busId } }, { new: true, lean: true });

        const buses = await Bus.find({ school: updatedSchool._id })
            .select('-__v')
            .populate([
                { path: 'assignedRoutes', select: '-__v -assignedBus' },
                { path: 'assignedDriver', select: '-password -__v -school -assignedBus -userName' },
            ])
            .lean()
            .exec();

        const paginatedBuses = buses.slice(0, 10);
        return res.status(200).json({
            message: 'Bus deleted successfully',
            code: 200,
            data: buses,
            // data: {
            //     list: paginatedBuses,
            //     totalBuses: buses.length,
            //     currentPage: 1,
            //     totalPages: Math.ceil(buses.length / 10),
            // },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const postAssignBusDriver = async (req, res) => {
    try {
        const { busId, driverId } = req.body;
        // const driver = await Driver.findOne({ license: driverLicense }).exec();
        const driver = await Driver.findByIdAndUpdate(driverId, { assignedBus: busId }, { new: true, lean: true });
        if (!driver) {
            return res.status(404).json({ message: 'Driver not found', code: 404 });
        }
        const bus = await Bus.findByIdAndUpdate(busId, { assignedDriver: driverId }, { new: true, lean: true }).select('-__v').populate({
            path: 'assignedDriver',
            select: '-password -__v -school -assignedBus -userName',
        });
        if (!bus) {
            return res.status(404).json({ message: 'Bus not found', code: 404 });
        }

        return res.status(200).json({ message: 'Bus assigned successfully', code: 200, data: bus });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const getAllBuses = async (req, res) => {
    const { schoolCode } = req.user;
    try {
        const school = await School.findOne({ code: schoolCode }).populate({
            path: 'buses',
            select: '-__v',
            populate: [
                { path: 'assignedRoutes', select: '-__v -assignedBus' },
                { path: 'assignedDriver', select: '-password -__v -school -assignedBus -userName' },
            ],
        });

        return res.status(200).json({
            message: 'success',
            code: 200,
            data: {
                list: school.buses,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const postUpdateBus = async (req, res) => {
    const { busId, assignedDriver, capacity, plate, assignedRoutes } = req.body;
    try {
        const updatedBus = await Bus.findByIdAndUpdate(busId, { assignedDriver, capacity, plate, assignedRoutes }, { new: true }).populate([
            { path: 'assignedRoutes', select: '-__v -assignedBus' },
            { path: 'assignedDriver', select: '-password -__v -school -assignedBus -userName' },
        ]);
        if (assignedDriver) {
            await Driver.findByIdAndUpdate(assignedDriver, { $set: { assignedBus: updatedBus._id } });
        }
        if (assignedRoutes) {
            assignedRoutes.map(async (route) => await Route.findByIdAndUpdate(route, { $set: { assignedBus: updatedBus._id } }));
        }
        return res.status(200).json({
            message: 'Bus info updated successfully',
            code: 200,
            data: updatedBus,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};