import axios from 'axios';
import Schedule from '../models/Schedule.js';
import config from '../config/config.js';
import { format } from 'date-fns';
import Route from '../models/Route.js';

const DIRECTIONS_API_URL = 'https://maps.googleapis.com/maps/api/directions/json';

const SCHOOL_START_TIME = new Date('2024-11-04T08:30:00'); // Example start time
const SCHOOL_END_TIME = new Date('2024-11-04T15:30:00'); // Example end time

export const createRouteSchedule = async (routeId, stops, direction) => {
    try {
        // Define waypoints (all stops except the start and end)
        const waypoints = stops
            .slice(1, stops.length - 1)
            .map((stop) => `${stop.address.coordinates.lat},${stop.address.coordinates.long}`);

        // Determine the base time based on direction
        const isInbound = direction === 'inbound';
        const time = isInbound
            ? new Date(SCHOOL_START_TIME.getTime() - 60 * 60 * 1000) // 30 minutes before school start
            : new Date(SCHOOL_END_TIME.getTime() + 30 * 60 * 1000); // 30 minutes after school end
        const timeInSeconds = Math.floor(time.getTime() / 1000);

        // Set up API request parameters
        const params = {
            origin: `${stops[0].address.coordinates.lat},${stops[0].address.coordinates.long}`,
            destination: `${stops[stops.length - 1].address.coordinates.lat},${stops[stops.length - 1].address.coordinates.long}`,
            waypoints: waypoints.join('|'),
            traffic_model: 'best_guess',
            departure_time: timeInSeconds,
            key: config.GOOGLE_MAPS_API_KEY,
        };

        console.log(params);

        // Fetch schedule from Google Directions API
        const response = await axios.get(DIRECTIONS_API_URL, { params });

        if (response.statusText !== 'OK') throw new Error('Error fetching directions.');

        // Check for an empty routes array
        if (!response.data.routes || response.data.routes.length === 0) {
            throw new Error('No routes found for the given parameters.');
        }

        const legs = response.data.routes[0].legs;
        const legTimes = [];
        let currentArrivalTime;
        // Handle outbound and inbound directions separately
        if (!isInbound) {
            // Outbound case

            currentArrivalTime = new Date(time.getTime()); // Start with the base time

            // start stop is school
            legTimes.push({
                stop: stops[0]._id,
                arrivalTime: format(currentArrivalTime, 'hh:mm a'),
            });

            for (let i = 0; i < legs.length; i++) {
                const legDuration = legs[i].duration.value * 1000; // Duration in milliseconds
                const stopDuration = 300 * 1000; // Assuming a 5-minute stop (300 seconds) at each stop

                // Calculate arrival time for this stop
                currentArrivalTime = new Date(currentArrivalTime.getTime() + legDuration);
                const formattedTime = format(currentArrivalTime, 'hh:mm a');

                legTimes.push({
                    stop: stops[i + 1]._id,
                    arrivalTime: formattedTime, // Store as string in desired format
                });

                // Add stop duration for next leg calculation
                currentArrivalTime = new Date(currentArrivalTime.getTime() + stopDuration);
            }
        } else {
            // Inbound case
            // Set the initial arrival time to be 15 minutes before school starts
            currentArrivalTime = new Date(SCHOOL_START_TIME.getTime() - 15 * 60 * 1000); // 15 minutes before school start

            // last stop is school
            legTimes.push({
                stop: stops[stops.length - 1]._id,
                arrivalTime: format(currentArrivalTime, 'hh:mm a'),
            });

            for (let i = legs.length - 1; i >= 0; i--) {
                const legDuration = legs[i].duration.value * 1000; // Duration in milliseconds
                const stopDuration = 300 * 1000; // Assuming a 5-minute stop (300 seconds) at each stop

                // Calculate the arrival time for this stop
                currentArrivalTime = new Date(currentArrivalTime.getTime() - legDuration);

                const formattedTime = format(currentArrivalTime, 'hh:mm a');

                legTimes.unshift({
                    stop: stops[i]._id,
                    arrivalTime: formattedTime, // Store as string in desired format
                });

                // Add stop duration for next leg calculation (going backwards)
                currentArrivalTime = new Date(currentArrivalTime.getTime() - stopDuration);
            }

            // Ensure the first stop's arrival time is indeed 15 minutes before the school start time
            if (new Date(legTimes[0].arrivalTime) > SCHOOL_START_TIME) {
                throw new Error('Calculated arrival time exceeds the allowed schedule before school starts.');
            }
        }

        // Save the schedule to the database
        const newSchedule = await Schedule.create({
            route: routeId,
            stopTimes: legTimes,
            startTime: isInbound ? legTimes[0].arrivalTime : '16:00 PM',
        });
        const route = await Route.findById(routeId);
        if (route.schedule) await Schedule.findByIdAndDelete(route.schedule);
        await Route.findByIdAndUpdate(routeId, { $set: { schedule: newSchedule._id } });
        return newSchedule;
    } catch (error) {
        console.error('Error creating route schedule:', error);
        throw new Error(error.message);
    }
};