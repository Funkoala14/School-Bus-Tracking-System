import Route from "../models/Route.js";
import { createRouteSchedule } from "../utils/generateRouteSchedule.js";

export const generateRouteSchedule = async (req, res) => {
    const { routeId } = req.body;

    try {
        const route = await Route.findById(routeId).populate('stops');
        const { stops, direction } = route;
        const schedule = await createRouteSchedule(routeId, stops, direction);
        res.status(200).json({ message: 'Schedule created successfully', data: schedule });
    } catch (error) {
        res.status(500).json({ message: 'Error generating schedule', error: error.message });
    }
};
