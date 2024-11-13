import validator from 'validator';
import Route from '../models/Route.js';
import { createRouteSchedule } from '../utils/generateRouteSchedule.js';

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
