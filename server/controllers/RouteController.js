import mongoose, { isObjectIdOrHexString, startSession, Types } from 'mongoose';
import Bus from '../models/Bus.js';
import Route from '../models/Route.js';
import School from '../models/School.js';
import Address from '../models/Address.js';
import Stop from '../models/Stop.js';
import validator from 'validator';

export const postAddRoute = async (req, res) => {
    const { schoolCode } = req.user;
    try {
        const { name, direction } = req.body;
        const school = await School.findOne({ code: schoolCode }).lean().exec();
        // check if this route name already exsit in current school
        const exisgingRoutes = await Route.findOne({ name, school: school._id }).lean().exec();
        if (exisgingRoutes) {
            return res.status(400).json({ message: 'Route name is already exist.' });
        }

        const newRoute = await new Route({ ...req.body, school: school._id });
        const schoolStop = await Stop.create({
            stopName: `${school.name} (School)`,
            address: school.address,
            route: newRoute._id,
            order: 0,
            direction,
        });
        newRoute.stops = [schoolStop._id];

        await School.findOneAndUpdate(
            { code: schoolCode },
            { $addToSet: { routes: newRoute._id } }, // Use $addToSet to avoid duplicates
            { new: true, lean: true } // Return the updated document
        );
        await newRoute.save();

        const routes = await Route.find({ school: school._id }).select('-__v').populate('stops').lean().exec();

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

        // Delete all stops associated with the route
        await Stop.deleteMany({ route: routeId }).exec();

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
                populate: { path: 'assignedDriver', select: '-password -__v -school -userName -assignedBus' },
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
                populate: { path: 'assignedDriver', select: '-password -__v -school -userName -assignedBus' },
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
            populate: [
                {
                    path: 'stops',
                    populate: 'address',
                    options: {
                        sort: { order: 1 }, // Sort stops by order
                    },
                },
                {
                    path: 'assignedBus',
                    select: '-__v -school -assignedRoutes',
                    populate: { path: 'assignedDriver', select: '-password -__v -school -assignedBus -userName' },
                },
            ],
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

export const postAddStop = async (req, res) => {
    try {
        const { routeId, address, stopName } = req.body;
        const route = await Route.findById(routeId).populate({
            path: 'stops',
            populate: { path: 'address' },
        });
        if (!route) return res.status(404).json({ message: 'Route not found' });
        const newAddress = await Address.create(address);
        const order = route.direction === 'outbound' ? route.stops.length : route.stops.length - 1;

        const newStop = await Stop.create({
            stopName,
            address: newAddress._id,
            route: route._id,
            order,
            direction: route.direction,
        });

        // Insert the new stop in the correct position based on route direction
        if (route.direction === 'outbound') {
            route.stops.push(newStop); // Add before the last stop (school)
        } else {
            const lastStop = route.stops.at(-1);

            route.stops.splice(route.stops.length - 1, 0, newStop); // Add after all stops for inbound (school is last)
            const newLstStop = await Stop.findByIdAndUpdate(lastStop._id, { $set: { order: route.stops.length - 1 } }, { new: true });
            console.log('last', route.stops.length, newLstStop);
        }

        await route.save();

        const populatedRoute = await Route.findById(route._id).populate({
            path: 'stops',
            populate: { path: 'address' },
        });

        return res.status(200).json({
            message: 'Stop added successfully',
            code: 200,
            data: {
                list: populatedRoute.stops,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    }
};

export const postUpdateStop = async (req, res) => {
    const session = await startSession();
    session.startTransaction();

    try {
        const { list } = req.body;
        let updatedStops = [];
        const stopUpdates = list.map(async (stopData, i) => {
            const { _id, stopName, address } = stopData;
            if (address) {
                const updatedAddress = await Address.findByIdAndUpdate(address._id, address, { new: true, session });

                if (!updatedAddress) {
                    throw new Error(`Address with id ${address._id} not found`);
                }
            }

            const updatedStop = await Stop.findByIdAndUpdate(_id, { stopName, order: i + 1 }, { new: true, session }).populate('address');

            if (!updatedStop) {
                throw new Error(`Stop with id ${_id} not found`);
            }
            updatedStops.push(updatedStop);
        });

        await Promise.all(stopUpdates);

        await session.commitTransaction();

        return res.status(200).json({ message: 'Stops updated successfully', code: 200, data: updatedStops });
    } catch (error) {
        await session.abortTransaction();
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    } finally {
        session.endSession();
    }
};

export const deleteStop = async (req, res) => {
    const session = await startSession();
    session.startTransaction();

    try {
        const { stopId, routeId } = req.body;
        if (!routeId || validator.isEmpty(routeId)) return res.status(400).json({ message: 'Missing route id', code: 400 });
        if (!stopId || validator.isEmpty(stopId)) return res.status(400).json({ message: 'Missing stop id', code: 400 });

        const deleteStop = await Stop.findByIdAndDelete(stopId, { new: true });
        if (!deleteStop) return res.status(404).json({ message: `Stop with id ${stopId} not found`, code: 404 });
        const route  = await Route.findByIdAndUpdate(routeId, { $pull: { stops: stopId } }, { new: true }).populate({
            path: 'stops',
            populate: 'address',
            options: {
                sort: { order: 1 }, // Sort stops by order
            },
        });

        // Reorder stops
        const stopUpdates = route.stops.map(async (stop, index) => {
            stop.order = index; // Set order from 0 to n
            return await stop.save({ session });
        });

        await Promise.all(stopUpdates);
        await session.commitTransaction();

        return res.status(200).json({ message: 'Stops deleted successfully', code: 200, data: route.stops });
    } catch (error) {
        await session.abortTransaction();
        console.error(error);
        return res.status(500).json({ message: 'Internal server error', code: 500 });
    } finally {
        session.endSession();
    }
};
