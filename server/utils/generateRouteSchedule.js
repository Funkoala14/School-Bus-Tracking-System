import axios from 'axios';
import Schedule from '../models/Schedule.js';
import config from '../config/config.js';

const DIRECTIONS_API_URL = 'https://maps.googleapis.com/maps/api/directions/json';

export const createRouteSchedule = async (routeId, stops, direction) => {
    try {
        // Define waypoints (all stops except the start and end)
        const waypoints = stops.slice(1, stops.length - 1).map(
            (stop) => `${stop.address.coordinates.lat},${stop.address.coordinates.long}`
        );

        // Determine the base time based on direction
        const isInbound = direction === 'inbound';
        const startTime = isInbound
            ? new Date(SCHOOL_START_TIME.getTime() - 30 * 60 * 1000) // 30 minutes before school start
            : new Date(SCHOOL_END_TIME.getTime() + 30 * 60 * 1000);  // 30 minutes after school end

        // Set up API request parameters
        const params = {
            origin: `${stops[0].address.coordinates.lat},${stops[0].address.coordinates.long}`,
            destination: `${stops[stops.length - 1].address.coordinates.lat},${stops[stops.length - 1].address.coordinates.long}`,
            waypoints: waypoints.join('|'),
            departure_time: Math.floor(startTime.getTime() / 1000),
            key: config.GOOGLE_MAPS_API_KEY,
        };

        // Fetch schedule from Google Directions API
        const response = await axios.get(DIRECTIONS_API_URL, { params });
        if (response.data.status !== 'OK') throw new Error('Error fetching directions.');

        const legTimes = response.data.routes[0].legs.map((leg, index) => ({
            stopId: stops[index]._id,
            arrivalTime: new Date(startTime.getTime() + leg.duration.value * 1000), // Calculated arrival time
        }));

        // Save the schedule to the database
        const newSchedule = await Schedule.create({ routeId, schedule: legTimes, direction });

        return newSchedule;
    } catch (error) {
        console.error('Error creating route schedule:', error);
        throw new Error('Could not create route schedule');
    }
};