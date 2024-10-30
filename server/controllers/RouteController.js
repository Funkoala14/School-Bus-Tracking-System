import mongoose, { isObjectIdOrHexString, Types } from 'mongoose';
import Bus from '../models/Bus.js';
import Route from '../models/Route.js';
import School from '../models/School.js';

export const postAddRoute = async (req, res) => {
    const { schoolCode } = req.user;
    try {
        const { name } = req.body;
        const school = await School.findOne({ code: schoolCode }).lean().exec();
        // check if this route name already exsit in current school
        const exisgingRoutes = await Route.findOne({ name, school: school._id }).lean().exec();
        if (exisgingRoutes) {
            return res.status(400).json({ message: 'Route name is already exist.' });
        }

        const newRoute = await new Route({ ...req.body, school: school._id });

        await School.findOneAndUpdate(
            { code: schoolCode },
            { $addToSet: { routes: newRoute._id } }, // Use $addToSet to avoid duplicates
            { new: true, lean: true } // Return the updated document
        );
        await newRoute.save();

        const routes = await Route.find({ school: school._id }).select('-__v').lean().exec();

        return res.status(200).json({
            message: 'Route added successfully',
            code: 200,
            data: {
                list: routes,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const deleteRoute = async (req, res) => {
    const { schoolCode } = req.user;
    try {
        const { routeId } = req.body;
        if (!routeId) return res.status(400).json({ message: 'Missing route id', code: 400 });
        const deleteRoute = await Route.findOneAndDelete({ _id: routeId }).lean().exec();
        if (!deleteRoute) {
            return res.status(404).json({ message: 'Route not found', code: 404 });
        }
        const school = await School.findOne({ code: schoolCode });
        const routes = await Route.find({ school: school._id }).select('-__v').lean().exec();
        school.routes = routes;
        await school.save();

        return res.status(200).json({
            message: 'Route deleted successfully',
            code: 200,
            data: {
                list: routes,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const postAssignBus = async (req, res) => {
    try {
        const { routeId, busId } = req.body;

        const bus = await Bus.findByIdAndUpdate(busId, { $addToSet: { assignedRoutes: routeId } }, { new: true, lean: true });
        if (!bus) return res.status(404).json({ message: 'Bus not found', code: 400 });

        const updatedRoute = await Route.findByIdAndUpdate(routeId, { assignedBus: bus._id }, { new: true, lean: true })
            .select('-__v -school')
            .populate('stops')
            .populate({
                path: 'assignedBus',
                select: '-__v -school -assignedRoutes',
                populate: { path: 'assignedDriver', select: '-password -__v -school -username -assignedBus' },
            });
        if (!updatedRoute) return res.status(404).json({ message: 'Route not found', code: 400 });

        return res.status(200).json({
            message: 'Route bus assigned successfully',
            code: 200,
            data: updatedRoute,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const postRemoveBus = async (req, res) => {
    try {
        const { routeId, busId } = req.body;

        const bus = await Bus.findByIdAndUpdate(busId, { $pull: { assignedRoutes: routeId } }, { new: true, lean: true });
        if (!bus) return res.status(404).json({ message: 'Bus not found', code: 400 });
        const updatedRoute = await Route.findByIdAndUpdate(routeId, { $unset: { assignedBus: null } }, { new: true, lean: true })
            .select('-__v -school')
            .populate('stops')
            .populate({
                path: 'assignedBus',
                select: '-__v -school -assignedRoutes',
                populate: { path: 'assignedDriver', select: '-password -__v -school -username -assignedBus' },
            });
        if (!updatedRoute) return res.status(404).json({ message: 'Route not found', code: 400 });

        return res.status(200).json({
            message: 'Route bus assigned successfully',
            code: 200,
            data: updatedRoute,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const getAllRoutes = async (req, res) => {
    const { schoolCode } = req.user;
    try {
        const school = await School.findOne({ code: schoolCode }).populate({
            path: 'routes',
            select: '-__v -school',
            populate: 'stops',
            populate: {
                path: 'assignedBus',
                select: '-__v -school -assignedRoutes',
                populate: { path: 'assignedDriver', select: '-password -__v -school -assignedBus -userName' },
            },
        });

        return res.status(200).json({
            message: 'success',
            code: 200,
            data: {
                list: school.routes,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};
