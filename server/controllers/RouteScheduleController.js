import validator from 'validator';
import Route from '../models/Route.js';
import Bus from '../models/Bus.js';
import { createRouteSchedule, getRemainingStops, updateLiveRoute } from '../utils/generateRouteSchedule.js';

export const generateRouteSchedule = async (req, res) => {
    const { routeId } = req.body;
    if (!routeId || validator.isEmpty(routeId)) return res.status(400).json({ message: 'Missing route id', code: 400 });
    try {
        const route = await Route.findById(routeId).populate([
            {
                path: 'stops',
                populate: 'address',
            },
        ]);
        const { stops, direction } = route;
        const schedule = await createRouteSchedule(routeId, stops, direction);
        res.status(200).json({ message: 'Schedule created successfully', data: schedule });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateLiveTimeRoute = async (data) => {
    const { driverId, direction, lat, lng, socket } = data;
    try {
        const bus = await Bus.findOne({ assignedDriver: driverId }).populate('school');
        console.log(bus, 'bus');

        const route = await Route.findOne({ assignedBus: bus._id, direction });
        console.log(route, 'route');
        
        const remainingStops = await getRemainingStops({ lat, lng }, route.stops);
        console.log(remainingStops, 'remainingStops');
        
        updateLiveRoute({ lat, lng }, remainingStops, socket);
    } catch (error) {
        console.error(`Error updating location for driver ${driverId}:`, error);
    }
};
